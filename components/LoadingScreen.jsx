'use client';

import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';

/*
  Full-screen loader shown while the 3D burger model downloads.
  Uses Three.js's DefaultLoadingManager via drei's useProgress hook.
  Fades out smoothly once the model is ready.
*/

function BurgerLogo() {
  return (
    <svg width="80" height="80" viewBox="0 0 36 36" aria-hidden="true">
      <defs>
        <linearGradient id="lb" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#fcd34d" />
          <stop offset="55%"  stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
        <linearGradient id="lp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#7c2d12" />
          <stop offset="100%" stopColor="#3f1505" />
        </linearGradient>
      </defs>
      <path d="M 4 13 Q 4 4 18 4 Q 32 4 32 13 Z" fill="url(#lb)" />
      <ellipse cx="11" cy="9"   rx="1.3" ry="0.75" fill="#fff8e0" transform="rotate(-15 11 9)" />
      <ellipse cx="18" cy="6.5" rx="1.3" ry="0.75" fill="#fff8e0" />
      <ellipse cx="25" cy="9"   rx="1.3" ry="0.75" fill="#fff8e0" transform="rotate(15 25 9)" />
      <path d="M 3.5 13 L 32.5 13 L 32.5 17 Q 25 18.2 18 17 Q 11 16 3.5 17.2 Z" fill="#facc15" />
      <rect x="4" y="16.5" width="28" height="6" rx="2.5" fill="url(#lp)" />
      <path d="M 3.5 22.5 Q 6 21 9 22.5 T 15 22.5 T 21 22.5 T 27 22.5 T 32.5 22.5 L 32.5 24 L 3.5 24 Z" fill="#65a30d" />
      <path d="M 4 24 L 32 24 L 32 27 Q 32 31 18 31 Q 4 31 4 27 Z" fill="url(#lb)" />
    </svg>
  );
}

export default function LoadingScreen() {
  const { progress, active } = useProgress();
  const [hide, setHide] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!active && progress >= 100) {
      setFading(true);
      const t = setTimeout(() => setHide(true), 700);
      return () => clearTimeout(t);
    }
  }, [progress, active]);

  if (hide) return null;

  return (
    <div className={`loading-screen ${fading ? 'is-fading' : ''}`}>
      <div className="loading-content">
        <div className="loading-logo">
          <BurgerLogo />
        </div>
        <div className="loading-name">Burger King</div>
        <div className="loading-bar">
          <div className="loading-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="loading-pct">{Math.round(progress)}%</div>
      </div>
    </div>
  );
}
