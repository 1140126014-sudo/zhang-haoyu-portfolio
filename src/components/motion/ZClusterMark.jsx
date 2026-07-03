import React, { useEffect, useRef } from 'react';
import usePrefersReducedMotion from './usePrefersReducedMotion.js';

const HERO_VIDEO_SRC = '/assets/optimized/hero-uploaded-background-lite.mp4';
const HERO_POSTER_SRC = '/assets/optimized/hero-uploaded-background-poster.webp';

export default function ZClusterMark({ className = '', interactive = true, label = 'Z mark' }) {
  const rootRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!interactive || prefersReducedMotion || typeof window === 'undefined') {
      return undefined;
    }

    const root = rootRef.current;
    if (!root) {
      return undefined;
    }

    const updateRotation = (event) => {
      const rect = root.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotateY = ((event.clientX - centerX) / rect.width) * 18;
      const rotateX = ((centerY - event.clientY) / rect.height) * 16;
      const shiftX = ((event.clientX - centerX) / rect.width) * 24;
      const shiftY = ((event.clientY - centerY) / rect.height) * 18;

      root.style.setProperty('--z-rotate-x', `${rotateX.toFixed(2)}deg`);
      root.style.setProperty('--z-rotate-y', `${rotateY.toFixed(2)}deg`);
      root.style.setProperty('--z-shift-x', `${shiftX.toFixed(2)}px`);
      root.style.setProperty('--z-shift-y', `${shiftY.toFixed(2)}px`);
    };

    const resetRotation = () => {
      root.style.setProperty('--z-rotate-x', '0deg');
      root.style.setProperty('--z-rotate-y', '0deg');
      root.style.setProperty('--z-shift-x', '0px');
      root.style.setProperty('--z-shift-y', '0px');
    };

    window.addEventListener('pointermove', updateRotation, { passive: true });
    window.addEventListener('pointerleave', resetRotation);

    return () => {
      window.removeEventListener('pointermove', updateRotation);
      window.removeEventListener('pointerleave', resetRotation);
    };
  }, [interactive, prefersReducedMotion]);

  return (
    <div className={`z-cluster-mark z-glass-mark ${className}`} ref={rootRef} aria-label={label} role="img">
      <svg className="z-glass-filter" aria-hidden="true" focusable="false">
        <filter id="z-glass-distortion">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.028" numOctaves="2" seed="8" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="22" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div className="z-glass-depth" aria-hidden="true">
        <span className="z-glass-shadow" />
        <span className="z-glass-edge z-glass-edge-cyan" />
        <span className="z-glass-edge z-glass-edge-red" />
        <span className="z-glass-core">
          <video
            className="z-glass-refraction"
            src={HERO_VIDEO_SRC}
            poster={HERO_POSTER_SRC}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          <span className="z-glass-refract-copy" />
          <span className="z-glass-grain" />
          <span className="z-glass-flare z-glass-flare-a" />
          <span className="z-glass-flare z-glass-flare-b" />
        </span>
      </div>
    </div>
  );
}
