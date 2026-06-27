'use client';

import dynamic from 'next/dynamic';
import Sections from '@/components/Sections';
import LoadingScreen from '@/components/LoadingScreen';

const Scene = dynamic(() => import('@/components/Scene'), { ssr: false });

export default function Home() {
  return (
    <main>
      <LoadingScreen />

      {/* Fixed 3D burger canvas */}
      <div className="canvas-wrapper">
        <Scene />
      </div>

      {/* Scrolling text overlay */}
      <div className="scroll-container">
        <Sections />
      </div>

      {/* Bottom hints */}
      <div className="drag-hint">Drag to spin</div>
      <div className="scroll-hint">Scroll ↓</div>
    </main>
  );
}
