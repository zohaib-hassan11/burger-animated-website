'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScrollAnimation } from '@/lib/useScrollAnimation';

/*
  PLACEHOLDER DEVICE
  ------------------
  This file fakes a "device" using simple boxes so you can see the
  scroll-driven exploded view animation working BEFORE you have a real
  3D model from your client.

  When you receive the real .glb file:
    1. Place it at  public/models/device.glb
    2. Replace this file's contents with the commented-out code at the bottom
    3. Map the model's mesh names to the same animation slots used below
*/

export default function Device() {
  const groupRef = useRef();
  const backCoverRef = useRef();
  const batteryRef = useRef();
  const boardRef = useRef();
  const screenRef = useRef();
  const frameRef = useRef();

  const scroll = useScrollAnimation();

  useFrame(() => {
    const t = scroll.current; // 0 → 1 over full page scroll
    if (!groupRef.current) return;

    // Subtle continuous rotation of the whole device
    groupRef.current.rotation.y = t * Math.PI * 0.8;
    groupRef.current.rotation.x = Math.sin(t * Math.PI) * 0.15;

    // EXPLODED VIEW — each part moves at its own scroll range
    // Range helper: how far through a [start, end] window are we (0..1)?
    const range = (s, e) => Math.min(Math.max((t - s) / (e - s), 0), 1);

    if (backCoverRef.current) {
      backCoverRef.current.position.z = -0.3 - range(0.05, 0.3) * 1.8;
    }
    if (batteryRef.current) {
      batteryRef.current.position.z = -0.15 - range(0.2, 0.45) * 1.2;
      batteryRef.current.position.y = range(0.2, 0.45) * 0.6;
    }
    if (boardRef.current) {
      boardRef.current.position.z = 0 + range(0.35, 0.6) * 0.8;
      boardRef.current.position.y = -range(0.35, 0.6) * 0.7;
    }
    if (screenRef.current) {
      screenRef.current.position.z = 0.15 + range(0.55, 0.8) * 1.5;
    }
    if (frameRef.current) {
      frameRef.current.rotation.z = range(0.75, 1) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer frame */}
      <mesh ref={frameRef} position={[0, 0, 0]}>
        <boxGeometry args={[1.6, 2.6, 0.05]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Screen */}
      <mesh ref={screenRef} position={[0, 0, 0.15]}>
        <boxGeometry args={[1.4, 2.4, 0.05]} />
        <meshStandardMaterial
          color="#1e293b"
          emissive="#6ee7b7"
          emissiveIntensity={0.2}
          metalness={0.5}
          roughness={0.1}
        />
      </mesh>

      {/* Logic board */}
      <mesh ref={boardRef} position={[0, 0, 0]}>
        <boxGeometry args={[1.4, 2.2, 0.06]} />
        <meshStandardMaterial color="#16a34a" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Battery */}
      <mesh ref={batteryRef} position={[0, 0, -0.15]}>
        <boxGeometry args={[1.3, 1.8, 0.15]} />
        <meshStandardMaterial color="#737373" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Back cover */}
      <mesh ref={backCoverRef} position={[0, 0, -0.3]}>
        <boxGeometry args={[1.6, 2.6, 0.06]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

/*
  =========================================================================
  WHEN YOU GET THE REAL 3D MODEL — replace everything above with this:
  =========================================================================

  import { useGLTF } from '@react-three/drei';

  export default function Device() {
    const groupRef = useRef();
    const { nodes, materials } = useGLTF('/models/device.glb');
    const scroll = useScrollAnimation();

    useFrame(() => {
      const t = scroll.current;
      if (!groupRef.current) return;
      groupRef.current.rotation.y = t * Math.PI * 0.8;

      // Drive each part by its mesh name from the .glb file
      const range = (s, e) => Math.min(Math.max((t - s) / (e - s), 0), 1);
      // Example — replace mesh names to match your model:
      // nodes.BackCover.position.z = -0.3 - range(0.05, 0.3) * 1.8;
      // nodes.Battery.position.z   = -0.15 - range(0.2, 0.45) * 1.2;
      // nodes.Screen.position.z    =  0.15 + range(0.55, 0.8) * 1.5;
    });

    return (
      <group ref={groupRef} dispose={null}>
        <primitive object={nodes.Scene} />
      </group>
    );
  }

  useGLTF.preload('/models/device.glb');
*/
