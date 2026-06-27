'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useFBX } from '@react-three/drei';
import { Box3, Vector3 } from 'three';
import { useScrollAnimation } from '@/lib/useScrollAnimation';

/*
  REALISTIC BURGER — DRAG TO ROTATE & MOVE
  ----------------------------------------
  • Left mouse drag:  rotate the burger (yaw + pitch)
  • Right mouse drag (or shift + left drag):  move the burger position
  • Cursor: grab on hover, grabbing while dragging
  • Scroll continues to add a slow turntable rotation on top of the
    user's rotation, so the page still feels animated when idle.
*/

const MODEL = '/models/burger-realistic/source/Burger.fbx';
const TARGET_SIZE = 2.4;
const DEFAULT_POSITION = [-1.4, 0, 0];
const ROTATE_SENSITIVITY = 0.008; // radians per pixel of mouse movement
const PITCH_LIMIT = Math.PI / 3;  // 60° — don't let user flip upside-down

export default function Burger() {
  const groupRef = useRef();
  const fbx = useFBX(MODEL);
  const scroll = useScrollAnimation();
  const { camera, gl } = useThree();

  // User-driven rotation, accumulated across drags
  const userRotY = useRef(0);
  const userRotX = useRef(0);

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

    const onContextMenu = (e) => e.preventDefault(); // free right-click for pan
    el.addEventListener('contextmenu', onContextMenu);

    const onPointerDown = (e) => {
      if (!groupRef.current) return;
      const panMode = e.button === 2 || e.shiftKey;
      if (wrapper) wrapper.classList.add('dragging');

      let lastX = e.clientX;
      let lastY = e.clientY;
      let panOffsetX = 0;
      let panOffsetY = 0;

      if (panMode) {
        const wp = screenToWorld(e.clientX, e.clientY);
        panOffsetX = groupRef.current.position.x - wp.x;
        panOffsetY = groupRef.current.position.y - wp.y;
      }

      const onMove = (ev) => {
        if (!groupRef.current) return;
        if (panMode) {
          // Move the burger so the cursor stays on the same point
          const w = screenToWorld(ev.clientX, ev.clientY);
          groupRef.current.position.x = w.x + panOffsetX;
          groupRef.current.position.y = w.y + panOffsetY;
        } else {
          // Rotate — horizontal mouse = yaw, vertical mouse = pitch
          const dx = ev.clientX - lastX;
          const dy = ev.clientY - lastY;
          lastX = ev.clientX;
          lastY = ev.clientY;
          userRotY.current += dx * ROTATE_SENSITIVITY;
          userRotX.current += dy * ROTATE_SENSITIVITY;
          // Clamp pitch so we can't flip upside-down
          userRotX.current = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, userRotX.current));
        }
      };
      const onUp = () => {
        if (wrapper) wrapper.classList.remove('dragging');
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
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
    // Combine user rotation + slow scroll-driven turntable
    groupRef.current.rotation.y = userRotY.current + t * Math.PI * 1.2;
    groupRef.current.rotation.x = userRotX.current + Math.sin(t * Math.PI * 2) * 0.04;
  });

  return (
    <group ref={groupRef} position={DEFAULT_POSITION}>
      <primitive object={model} />
    </group>
  );
}

useFBX.preload(MODEL);
