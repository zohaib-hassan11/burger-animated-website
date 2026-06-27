'use client';

import { useEffect, useRef } from 'react';

/*
  Returns a ref whose `.current` is the scroll progress (0 → 1)
  across the full document. Used inside useFrame so the 3D scene
  reacts to scroll without re-rendering React on every frame.
*/
export function useScrollAnimation() {
  const scroll = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.current = max > 0 ? window.scrollY / max : 0;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return scroll;
}
