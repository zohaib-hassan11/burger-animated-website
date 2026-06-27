'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useScrollAnimation } from '@/lib/useScrollAnimation';

/*
  STYLIZED CAR — built from primitives so every part is independently
  controlled. Each opening part (hood, doors, trunk) is wrapped in a
  <group> that acts as the HINGE pivot — rotating the group swings
  the part open like a real door.

  When the client sends a real .glb car, you'll swap this whole file
  for a <primitive object={scene} /> + node-based animation. The same
  scroll-stage logic at the bottom still applies.
*/

// helper — normalize scroll (t) into a 0..1 progress for a given window
const range = (t, s, e) => Math.min(Math.max((t - s) / (e - s), 0), 1);

// Animation stages (scroll progress 0 → 1)
const STAGES = {
  hood:   [0.10, 0.28],
  doors:  [0.28, 0.48],
  trunk:  [0.48, 0.66],
  front:  [0.66, 0.82],
  close:  [0.82, 1.00],
};

export default function Car() {
  const groupRef    = useRef();
  const hoodRef     = useRef();
  const doorLRef    = useRef();
  const doorRRef    = useRef();
  const trunkRef    = useRef();
  const wheelRefs   = [useRef(), useRef(), useRef(), useRef()];
  const headlightL  = useRef();
  const headlightR  = useRef();

  // visibility refs for annotations
  const labelHood   = useRef(0);
  const labelDoors  = useRef(0);
  const labelTrunk  = useRef(0);
  const labelFront  = useRef(0);

  const scroll = useScrollAnimation();

  useFrame((state, delta) => {
    const t = scroll.current;
    if (!groupRef.current) return;

    // Overall car turntable rotation
    groupRef.current.rotation.y = t * Math.PI * 1.6;
    groupRef.current.position.y = -0.4 + Math.sin(t * Math.PI * 2) * 0.04;

    // HOOD opens upward (rotates around its back edge)
    const hoodOpen  = range(t, ...STAGES.hood)   * (1 - range(t, ...STAGES.close));
    if (hoodRef.current) hoodRef.current.rotation.x = -hoodOpen * (Math.PI / 2.4);

    // DOORS swing outward
    const doorOpen  = range(t, ...STAGES.doors)  * (1 - range(t, ...STAGES.close));
    if (doorLRef.current) doorLRef.current.rotation.y =  doorOpen * (Math.PI / 2.5);
    if (doorRRef.current) doorRRef.current.rotation.y = -doorOpen * (Math.PI / 2.5);

    // TRUNK opens upward
    const trunkOpen = range(t, ...STAGES.trunk)  * (1 - range(t, ...STAGES.close));
    if (trunkRef.current) trunkRef.current.rotation.x = trunkOpen * (Math.PI / 2.4);

    // Headlights glow during the "front" stage
    const frontIntensity = range(t, ...STAGES.front) * 3;
    if (headlightL.current) headlightL.current.material.emissiveIntensity = 0.3 + frontIntensity;
    if (headlightR.current) headlightR.current.material.emissiveIntensity = 0.3 + frontIntensity;

    // Wheels spin proportional to scroll velocity feel
    const wheelSpeed = 1.5 + t * 4;
    wheelRefs.forEach((w) => {
      if (w.current) w.current.rotation.x += delta * wheelSpeed;
    });

    // Update label opacities (smoothly using lerp)
    const lerp = (a, b, k) => a + (b - a) * k;
    labelHood.current  = lerp(labelHood.current,  hoodOpen  > 0.5 ? 1 : 0, 0.1);
    labelDoors.current = lerp(labelDoors.current, doorOpen  > 0.5 ? 1 : 0, 0.1);
    labelTrunk.current = lerp(labelTrunk.current, trunkOpen > 0.5 ? 1 : 0, 0.1);
    labelFront.current = lerp(labelFront.current, frontIntensity > 1 ? 1 : 0, 0.1);

    setLabelOpacity('label-hood',  labelHood.current);
    setLabelOpacity('label-doors', labelDoors.current);
    setLabelOpacity('label-trunk', labelTrunk.current);
    setLabelOpacity('label-front', labelFront.current);
  });

  return (
    <group ref={groupRef} position={[0, -0.4, 0]} scale={0.9}>
      {/* ────────── CHASSIS / BODY ────────── */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 0.35, 1.8]} />
        <meshStandardMaterial color="#b91c1c" metalness={0.6} roughness={0.35} />
      </mesh>

      {/* Lower body skirt (darker) */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[3.9, 0.2, 1.7]} />
        <meshStandardMaterial color="#1f1f1f" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* CABIN (where the doors live) */}
      <mesh position={[-0.2, 0.95, 0]}>
        <boxGeometry args={[1.6, 0.65, 1.6]} />
        <meshStandardMaterial color="#b91c1c" metalness={0.6} roughness={0.35} />
      </mesh>

      {/* Windshield + windows (dark glass) */}
      <mesh position={[-0.2, 0.95, 0]}>
        <boxGeometry args={[1.55, 0.55, 1.65]} />
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* ────────── HOOD (pivot at rear-of-hood, opens upward) ────────── */}
      <group ref={hoodRef} position={[1, 0.62, 0]}>
        <mesh position={[0.6, 0, 0]} castShadow>
          <boxGeometry args={[1.2, 0.08, 1.6]} />
          <meshStandardMaterial color="#b91c1c" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Annotation anchor — floats above open hood */}
        <Html position={[0.6, 1.2, 0]} center distanceFactor={6} style={{ pointerEvents: 'none' }}>
          <div id="label-hood" className="annotation">
            <span className="dot" />
            <div className="card">
              <strong>V8 Twin-Turbo</strong>
              <p>460 hp · 0–60 in 3.8s</p>
            </div>
          </div>
        </Html>
      </group>

      {/* Engine bay (visible only when hood opens) */}
      <mesh position={[1.6, 0.6, 0]}>
        <boxGeometry args={[1.1, 0.25, 1.4]} />
        <meshStandardMaterial color="#262626" metalness={0.5} roughness={0.6} />
      </mesh>
      <mesh position={[1.6, 0.7, 0]}>
        <boxGeometry args={[0.6, 0.15, 0.8]} />
        <meshStandardMaterial color="#737373" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* ────────── DOORS (pivot at front-of-door, swing outward) ────────── */}
      {/* Left door */}
      <group ref={doorLRef} position={[0.6, 0.7, 0.85]}>
        <mesh position={[-0.6, 0, 0.05]} castShadow>
          <boxGeometry args={[1.2, 0.55, 0.05]} />
          <meshStandardMaterial color="#b91c1c" metalness={0.6} roughness={0.35} />
        </mesh>
        <Html position={[-0.6, 0.8, 0.6]} center distanceFactor={6} style={{ pointerEvents: 'none' }}>
          <div id="label-doors" className="annotation">
            <span className="dot" />
            <div className="card">
              <strong>Nappa Interior</strong>
              <p>Hand-stitched. Heated &amp; cooled.</p>
            </div>
          </div>
        </Html>
      </group>
      {/* Right door */}
      <group ref={doorRRef} position={[0.6, 0.7, -0.85]}>
        <mesh position={[-0.6, 0, -0.05]} castShadow>
          <boxGeometry args={[1.2, 0.55, 0.05]} />
          <meshStandardMaterial color="#b91c1c" metalness={0.6} roughness={0.35} />
        </mesh>
      </group>

      {/* ────────── TRUNK (pivot at front-of-trunk, opens up) ────────── */}
      <group ref={trunkRef} position={[-1.2, 0.62, 0]}>
        <mesh position={[-0.4, 0, 0]} castShadow>
          <boxGeometry args={[0.8, 0.08, 1.6]} />
          <meshStandardMaterial color="#b91c1c" metalness={0.7} roughness={0.3} />
        </mesh>
        <Html position={[-0.4, 1.0, 0]} center distanceFactor={6} style={{ pointerEvents: 'none' }}>
          <div id="label-trunk" className="annotation">
            <span className="dot" />
            <div className="card">
              <strong>550 L Cargo</strong>
              <p>Power tailgate. Hands-free.</p>
            </div>
          </div>
        </Html>
      </group>

      {/* Trunk interior (visible when trunk opens) */}
      <mesh position={[-1.6, 0.55, 0]}>
        <boxGeometry args={[0.7, 0.2, 1.4]} />
        <meshStandardMaterial color="#1f1f1f" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* ────────── HEADLIGHTS (front) ────────── */}
      <mesh ref={headlightL} position={[2.01, 0.5, 0.55]}>
        <boxGeometry args={[0.02, 0.18, 0.4]} />
        <meshStandardMaterial
          color="#fef9c3"
          emissive="#fef9c3"
          emissiveIntensity={0.3}
          metalness={0.1}
          roughness={0.1}
        />
      </mesh>
      <mesh ref={headlightR} position={[2.01, 0.5, -0.55]}>
        <boxGeometry args={[0.02, 0.18, 0.4]} />
        <meshStandardMaterial
          color="#fef9c3"
          emissive="#fef9c3"
          emissiveIntensity={0.3}
          metalness={0.1}
          roughness={0.1}
        />
      </mesh>

      {/* Headlight annotation */}
      <Html position={[2.4, 1.0, 0]} center distanceFactor={6} style={{ pointerEvents: 'none' }}>
        <div id="label-front" className="annotation">
          <span className="dot" />
          <div className="card">
            <strong>LED Matrix</strong>
            <p>Adaptive high-beam. 1,200 m range.</p>
          </div>
        </div>
      </Html>

      {/* Tail lights */}
      <mesh position={[-2.01, 0.5, 0.55]}>
        <boxGeometry args={[0.02, 0.15, 0.35]} />
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[-2.01, 0.5, -0.55]}>
        <boxGeometry args={[0.02, 0.15, 0.35]} />
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.6} />
      </mesh>

      {/* ────────── WHEELS ────────── */}
      {[
        [ 1.3, 0.05,  0.95], // front-right
        [ 1.3, 0.05, -0.95], // front-left
        [-1.3, 0.05,  0.95], // rear-right
        [-1.3, 0.05, -0.95], // rear-left
      ].map((pos, i) => (
        <mesh
          key={i}
          ref={wheelRefs[i]}
          position={pos}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.32, 0.32, 0.22, 32]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.4} roughness={0.7} />
        </mesh>
      ))}

      {/* Wheel rims (smaller, shiny cylinder inside each tire) */}
      {[
        [ 1.3, 0.05,  1.02],
        [ 1.3, 0.05, -1.02],
        [-1.3, 0.05,  1.02],
        [-1.3, 0.05, -1.02],
      ].map((pos, i) => (
        <mesh key={`rim-${i}`} position={pos} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.08, 16]} />
          <meshStandardMaterial color="#a3a3a3" metalness={0.95} roughness={0.15} />
        </mesh>
      ))}

      {/* Ground shadow plane (catches the shadow) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <shadowMaterial opacity={0.35} />
      </mesh>
    </group>
  );
}

// Tiny helper to set CSS opacity from outside React render loop
function setLabelOpacity(id, v) {
  if (typeof document === 'undefined') return;
  const el = document.getElementById(id);
  if (el) el.style.opacity = v;
}
