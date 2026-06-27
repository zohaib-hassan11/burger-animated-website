'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useFBX } from '@react-three/drei';
import { Box3, Vector3 } from 'three';
import { useScrollAnimation } from '@/lib/useScrollAnimation';

/*
  REALISTIC BURGER — DRAG TO ROTATE & MOVE (RESPONSIVE)
  -----------------------------------------------------
  Desktop  → burger sits to the left, leaving the right side for text
  Mobile   → burger sits centred so it's framed on a narrow viewport

  Drag:
    • Left mouse drag  → rotate (yaw + pitch)
    • Right / Shift drag → translate (desktop only)
    • Touch horizontal → rotate ; touch vertical → page scroll
*/

const MODEL = '/models/burger-realistic/source/Burger.fbx';
const TARGET_SIZE = 2.4;
const ROTATE_SENSITIVITY = 0.008;
const PITCH_LIMIT = Math.PI / 3;

export default function Burger({ basePositionX = -1.4 }) {
  const groupRef = useRef();
  const fbx = useFBX(MODEL);
  const scroll = useScrollAnimation();
  const { camera, gl } = useThree();

  // Accumulated user-drag rotation
  const userRotY = useRef(0);
  const userRotX = useRef(0);

  // Accumulated user-drag translation (offset added to base position)
  const dragOffsetX = useRef(0);
  const dragOffsetY = useRef(0);

  // Auto-fit + polish the FBX
  const model = useMemo(() => {
    const clone = fbx.clone(true);
    const bbox = new Box3().setFromObject(clone);
    const size = new Vector3();
    const center = new Vector3();
    bbox.getSize(size);
    bbox.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const fit = TARGET_SIZE / maxDim;
    clone.scale.setScalar(fit);
    clone.position.x = -center.x * fit;
    clone.position.y = -bbox.min.y * fit;
    clone.position.z = -center.z * fit;

    clone.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.material) {
        child.material.envMapIntensity = 1.3;
        child.material.needsUpdate = true;
      }
    });
    return clone;
  }, [fbx]);

  useEffect(() => {
    const el = gl.domElement;
    const wrapper = el.parentElement;

    const screenToWorld = (clientX, clientY) => {
      const rect = el.getBoundingClientRect();
      const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((clientY - rect.top) / rect.height) * 2 + 1;
      const v = new Vector3(ndcX, ndcY, 0.5).unproject(camera);
      const dir = v.sub(camera.position).normalize();
      const distance = (0 - camera.position.z) / dir.z;
      return camera.position.clone().add(dir.multiplyScalar(distance));
    };

    const onContextMenu = (e) => e.preventDefault();
    el.addEventListener('contextmenu', onContextMenu);

    const onPointerDown = (e) => {
      if (!groupRef.current) return;
      // Pan only with right click or shift — disabled for touch (mouse only)
      const panMode = (e.button === 2 || e.shiftKey) && e.pointerType !== 'touch';
      if (wrapper) wrapper.classList.add('dragging');

      let lastX = e.clientX;
      let lastY = e.clientY;
      let panStartX = 0;
      let panStartY = 0;
      let initialOffsetX = dragOffsetX.current;
      let initialOffsetY = dragOffsetY.current;

      if (panMode) {
        const wp = screenToWorld(e.clientX, e.clientY);
        panStartX = wp.x;
        panStartY = wp.y;
      }

      const onMove = (ev) => {
        if (!groupRef.current) return;
        if (panMode) {
          const w = screenToWorld(ev.clientX, ev.clientY);
          dragOffsetX.current = initialOffsetX + (w.x - panStartX);
          dragOffsetY.current = initialOffsetY + (w.y - panStartY);
        } else {
          const dx = ev.clientX - lastX;
          const dy = ev.clientY - lastY;
          lastX = ev.clientX;
          lastY = ev.clientY;
          userRotY.current += dx * ROTATE_SENSITIVITY;
          userRotX.current += dy * ROTATE_SENSITIVITY;
          userRotX.current = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, userRotX.current));
        }
      };
      const onEnd = () => {
        if (wrapper) wrapper.classList.remove('dragging');
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onEnd);
        window.removeEventListener('pointercancel', onEnd);
      };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onEnd);
      window.addEventListener('pointercancel', onEnd);
    };
    el.addEventListener('pointerdown', onPointerDown);

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('contextmenu', onContextMenu);
    };
  }, [camera, gl]);

  useFrame(() => {
    const t = scroll.current;
    if (!groupRef.current) return;

    // Position = responsive base + user pan offset
    groupRef.current.position.x = basePositionX + dragOffsetX.current;
    groupRef.current.position.y = 0 + dragOffsetY.current;

    // Rotation = user drag + scroll-driven turntable
    groupRef.current.rotation.y = userRotY.current + t * Math.PI * 1.2;
    groupRef.current.rotation.x = userRotX.current + Math.sin(t * Math.PI * 2) * 0.04;
  });

  return (
    <group ref={groupRef}>
      <primitive object={model} />
    </group>
  );
}

useFBX.preload(MODEL);
