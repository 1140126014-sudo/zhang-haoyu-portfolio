import React, { useEffect, useMemo, useRef, useState } from 'react';
import usePrefersReducedMotion from './usePrefersReducedMotion.js';

const Z_OUTLINE_PATH =
  'M60 76 H940 V270 L302 700 H940 V884 H60 V690 L698 260 H60 Z';

const CIPHER_CHARS = 'ZHANGHAOYU0123456789AIGC/<>[]+-_#';

const cipherLines = [
  { text: 'ZHANG HAOYU / VISUAL SYSTEM', delay: 420 },
  { text: 'AIGC ARCHIVE / CHARACTER IP / MOTION', delay: 760 },
  { text: 'GLASS-Z MATERIAL / READY', delay: 1120 },
];

function makeCipher(text, frame) {
  return Array.from(text)
    .map((letter, index) => {
      if (letter === ' ') {
        return ' ';
      }

      return CIPHER_CHARS[(index * 7 + frame * 5) % CIPHER_CHARS.length];
    })
    .join('');
}

function OpeningCipherLine({ text, delay }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [displayText, setDisplayText] = useState(prefersReducedMotion ? text : makeCipher(text, 0));
  const timeoutRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayText(text);
      return undefined;
    }

    let frame = 0;
    const letters = Array.from(text);
    const totalFrames = 42;

    const tick = () => {
      frame += 1;
      const progress = frame / totalFrames;
      const nextText = letters
        .map((letter, index) => {
          if (letter === ' ') {
            return ' ';
          }

          const revealAt = (index + 1) / Math.max(letters.length, 1);
          return progress >= revealAt ? letter : CIPHER_CHARS[(index * 11 + frame * 3) % CIPHER_CHARS.length];
        })
        .join('');

      setDisplayText(nextText);

      if (frame < totalFrames) {
        rafRef.current = window.requestAnimationFrame(tick);
      } else {
        setDisplayText(text);
      }
    };

    timeoutRef.current = window.setTimeout(() => {
      rafRef.current = window.requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(timeoutRef.current);
      window.cancelAnimationFrame(rafRef.current);
    };
  }, [delay, prefersReducedMotion, text]);

  return (
    <span className="opening-cipher-line" style={{ '--line-delay': `${delay}ms` }}>
      {displayText}
    </span>
  );
}

export default function OpeningGeometry() {
  const verticalLines = useMemo(() => [16, 30, 50, 70, 84], []);
  const horizontalLines = useMemo(() => [12, 30, 50, 70, 88], []);

  return (
    <div className="opening-geometry" aria-hidden="true">
      <svg className="opening-geometry-canvas" viewBox="0 0 1000 960" focusable="false">
        <g className="opening-geometry-grid">
          {verticalLines.map((x) => (
            <line key={`v-${x}`} x1={`${x}%`} y1="0" x2={`${x}%`} y2="960" />
          ))}
          {horizontalLines.map((y) => (
            <line key={`h-${y}`} x1="0" y1={`${y}%`} x2="1000" y2={`${y}%`} />
          ))}
          <circle cx="500" cy="480" r="270" />
          <circle cx="500" cy="480" r="150" />
          <path d="M500 94 L870 720 H130 Z" />
          <path d="M500 112 V848 M120 480 H880" />
        </g>
        <path className="opening-geometry-z-shadow" d={Z_OUTLINE_PATH} pathLength="1" />
        <path className="opening-geometry-z-outline" d={Z_OUTLINE_PATH} pathLength="1" />
        <path className="opening-geometry-z-accent" d={Z_OUTLINE_PATH} pathLength="1" />
      </svg>

      <div className="opening-geometry-code">
        {cipherLines.map((line) => (
          <OpeningCipherLine key={line.text} text={line.text} delay={line.delay} />
        ))}
      </div>

      <div className="opening-geometry-readout">
        <span>REFRACTION</span>
        <span>0.42 / 1.00</span>
      </div>
    </div>
  );
}
