'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  Vignette,
  BrightnessContrast,
  HueSaturation,
} from '@react-three/postprocessing';
import { ACESFilmicToneMapping } from 'three';
import { Suspense } from 'react';
import Burger from './Burger';
import Loader from './Loader';

/*
  Inner component lives inside the Canvas so it can read viewport size
  via useThree. It picks the right burger X position for desktop vs mobile.
*/
function SceneContent() {
  const { size } = useThree();
  const isMobile = size.width < 768;

  // Mobile → centred, Desktop → pushed left so text fits on the right
  const burgerX = isMobile ? 0 : -1.4;

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.6, 7.5]} fov={isMobile ? 42 : 38} />

      <ambientLight intensity={1.0} color="#fff5e6" />
      <directionalLight
        position={[-3, 6, 5]}
        intensity={2.2}
        color="#fff0d8"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <directionalLight position={[2, 3, 6]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[0, -2, 2]} intensity={0.4} color="#fff5e6" />

      <Environment preset="warehouse" />

      <Burger basePositionX={burgerX} />

      {/* Shadow tracks the burger's responsive X position */}
      <ContactShadows
        position={[burgerX, 0, 0]}
        opacity={0.5}
        scale={4}
        blur={2.4}
        far={2}
      />

      <EffectComposer multisampling={4}>
        <Bloom
          intensity={0.18}
          luminanceThreshold={0.92}
          luminanceSmoothing={0.25}
        />
        <HueSaturation saturation={0.04} />
        <BrightnessContrast brightness={0.04} contrast={0.05} />
        <Vignette eskil={false} offset={0.3} darkness={0.45} />
      </EffectComposer>
    </>
  );
}

export default function Scene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.3,
      }}
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
      <Loader />
    </Canvas>
  );
}
