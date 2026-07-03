import React, { useEffect, useRef } from 'react';
import usePrefersReducedMotion from './usePrefersReducedMotion.js';

const TRAIL_POINTS = 16;

export default function CursorLightTrail() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const rootRef = useRef(null);
  const targetRef = useRef({ x: -120, y: -120, active: false, hot: false, velocity: 0 });
  const pointsRef = useRef(
    Array.from({ length: TRAIL_POINTS }, () => ({
      x: -120,
      y: -120,
    })),
  );

  useEffect(() => {
    if (
      prefersReducedMotion ||
      typeof window === 'undefined' ||
      !window.matchMedia('(pointer: fine)').matches
    ) {
      return undefined;
    }

    const root = rootRef.current;
    const dots = Array.from(root?.children ?? []);
    let rafId = 0;
    let lastPointer = { x: -120, y: -120, time: performance.now() };

    if (!root || dots.length === 0) {
      return undefined;
    }

    const updatePointer = (event) => {
      const interactiveTarget = event.target?.closest?.('a, button, [role="button"], input, textarea, select');
      const now = performance.now();
      const dx = event.clientX - lastPointer.x;
      const dy = event.clientY - lastPointer.y;
      const dt = Math.max(now - lastPointer.time, 16);
      const velocity = Math.min(Math.hypot(dx, dy) / dt, 2.4);

      targetRef.current = {
        x: event.clientX,
        y: event.clientY,
        active: true,
        hot: Boolean(interactiveTarget),
        velocity,
      };
      lastPointer = { x: event.clientX, y: event.clientY, time: now };
    };

    const leavePointer = () => {
      targetRef.current.active = false;
      targetRef.current.hot = false;
      targetRef.current.velocity = 0;
      root.dataset.active = 'false';
      root.dataset.hot = 'false';
      root.dataset.fast = 'false';
    };

    const animate = () => {
      const points = pointsRef.current;
      const target = targetRef.current;

      points.forEach((point, index) => {
        const leader = index === 0 ? target : points[index - 1];
        const ease = index === 0 ? 0.34 : 0.22;
        point.x += (leader.x - point.x) * ease;
        point.y += (leader.y - point.y) * ease;

        const dot = dots[index];
        if (dot) {
          dot.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate3d(-50%, -50%, 0)`;
        }
      });

      root.dataset.active = target.active ? 'true' : 'false';
      root.dataset.hot = target.hot ? 'true' : 'false';
      root.dataset.fast = target.velocity > 0.58 ? 'true' : 'false';
      root.style.setProperty('--cursor-speed', target.velocity.toFixed(2));
      target.velocity *= 0.92;
      rafId = window.requestAnimationFrame(animate);
    };

    window.addEventListener('pointermove', updatePointer, { passive: true });
    window.addEventListener('pointerleave', leavePointer);
    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('pointermove', updatePointer);
      window.removeEventListener('pointerleave', leavePointer);
      window.cancelAnimationFrame(rafId);
    };
  }, [prefersReducedMotion]);

  return (
    <div className="cursor-light-trail" ref={rootRef} aria-hidden="true">
      {Array.from({ length: TRAIL_POINTS }, (_, index) => (
        <span key={index} style={{ '--trail-index': index }} />
      ))}
    </div>
  );
}
