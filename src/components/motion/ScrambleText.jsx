import React, { useEffect, useMemo, useRef, useState } from 'react';
import usePrefersReducedMotion from './usePrefersReducedMotion.js';

const SCRAMBLE_CHARS = 'AIGC0123456789ZHXY#%&?/+=<>[]';

function randomChar(index) {
  return SCRAMBLE_CHARS[(Math.random() * SCRAMBLE_CHARS.length + index) | 0] ?? '#';
}

export default function ScrambleText({ text, trigger = 0, className = '' }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const letters = useMemo(() => Array.from(String(text)), [text]);
  const [displayText, setDisplayText] = useState(String(text));
  const [hoverSignal, setHoverSignal] = useState(0);
  const hasMountedRef = useRef(false);
  const previousSignalRef = useRef({ hoverSignal, trigger });

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      previousSignalRef.current = { hoverSignal, trigger };
      setDisplayText(String(text));
      return undefined;
    }

    const shouldScramble =
      previousSignalRef.current.hoverSignal !== hoverSignal ||
      previousSignalRef.current.trigger !== trigger;

    previousSignalRef.current = { hoverSignal, trigger };

    if (!shouldScramble) {
      setDisplayText(String(text));
      return undefined;
    }

    if (prefersReducedMotion) {
      setDisplayText(String(text));
      return undefined;
    }

    let frame = 0;
    let rafId = 0;
    const totalFrames = Math.max(26, Math.min(36, letters.length * 6));

    const tick = () => {
      frame += 1;
      const progress = frame / totalFrames;
      const nextText = letters
        .map((letter, index) => {
          if (letter === ' ') {
            return ' ';
          }

          const revealAt = (index + 1) / Math.max(letters.length, 1);
          return progress >= revealAt ? letter : randomChar(index + frame);
        })
        .join('');

      setDisplayText(nextText);

      if (frame < totalFrames) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        setDisplayText(String(text));
      }
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [hoverSignal, letters, prefersReducedMotion, text, trigger]);

  return (
    <span
      className={`scramble-text ${className}`.trim()}
      onMouseEnter={() => setHoverSignal((current) => current + 1)}
    >
      {displayText}
    </span>
  );
}
