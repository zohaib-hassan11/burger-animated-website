'use client';

import { Canvas } from '@react-three/fiber';
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
        {/* Camera lowered so it looks straight at the burger center (vertical alignment with text) */}
        <PerspectiveCamera makeDefault position={[0, 0.6, 7.5]} fov={38} />

        {/* Brighter ambient — kills the muddy darkness */}
        <ambientLight intensity={1.0} color="#fff5e6" />

        {/* Key light — warm, top-front, casts the shadow */}
        <directionalLight
          position={[-3, 6, 5]}
          intensity={2.4}
          color="#fff0d8"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-6}
          shadow-camera-right={6}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
        />

        {/* Fill light — softer, neutral white, from front */}
        <directionalLight position={[2, 3, 6]} intensity={1.2} color="#ffffff" />

        {/* Soft underlight — stops the underside from going to pure black */}
        <directionalLight position={[0, -2, 2]} intensity={0.4} color="#fff5e6" />

        {/* Neutral indoor HDR — realistic studio reflections, no orange cast */}
        <Environment preset="warehouse" />

        <Burger />

        {/* Soft contact shadow under the bun */}
        <ContactShadows
          position={[-1.4, 0.0, 0]}
          opacity={0.5}
          scale={5}
          blur={2.4}
          far={2}
        />

        {/* Subtle post-processing — polish, not cartoon */}
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
      </Suspense>

      <Loader />
    </Canvas>
  );
}
