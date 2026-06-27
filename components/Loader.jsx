'use client';

import { Html, useProgress } from '@react-three/drei';

export default function Loader() {
  const { progress } = useProgress();

  if (progress >= 100) return null;

  return (
    <Html center>
      <div
        style={{
          color: '#fff',
          fontSize: '0.8rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          opacity: 0.7,
        }}
      >
        Loading {progress.toFixed(0)}%
      </div>
    </Html>
  );
}
