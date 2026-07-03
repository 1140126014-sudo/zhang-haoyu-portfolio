import React, { useCallback, useEffect, useRef, useState } from 'react';
import usePrefersReducedMotion from './usePrefersReducedMotion.js';
import OpeningGeometry from './OpeningGeometry.jsx';
import ZClusterMark from './ZClusterMark.jsx';

const HERO_POSTER_SRC = '/assets/optimized/hero-uploaded-background-poster.webp';
const HERO_VIDEO_SRC = '/assets/optimized/hero-uploaded-background-lite.mp4';

export default function IntroLoader({ isVisible, onComplete, exitSignal = 0, ignoreDismissSelector = '' }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isLeaving, setIsLeaving] = useState(false);
  const isLeavingRef = useRef(false);
  const timerRef = useRef(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const completeIntro = useCallback(() => {
    if (isLeavingRef.current) {
      return;
    }

    isLeavingRef.current = true;
    setIsLeaving(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      onCompleteRef.current?.();
    }, prefersReducedMotion ? 80 : 520);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!isVisible) {
      return undefined;
    }

    isLeavingRef.current = false;
    setIsLeaving(false);

    const completeFromInput = (event) => {
      if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') {
        return;
      }

      if (
        event.type === 'pointerdown' &&
        ignoreDismissSelector &&
        event.target?.closest?.(ignoreDismissSelector)
      ) {
        return;
      }

      completeIntro();
    };

    window.addEventListener('pointerdown', completeFromInput, { capture: true });
    window.addEventListener('keydown', completeFromInput);

    return () => {
      window.clearTimeout(timerRef.current);
      window.removeEventListener('pointerdown', completeFromInput, { capture: true });
      window.removeEventListener('keydown', completeFromInput);
    };
  }, [completeIntro, ignoreDismissSelector, isVisible]);

  useEffect(() => {
    if (!isVisible || exitSignal === 0 || isLeavingRef.current) {
      return undefined;
    }

    completeIntro();

    return () => {
      window.clearTimeout(timerRef.current);
    };
  }, [completeIntro, exitSignal, isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <section
      className={`intro-loader ${isLeaving ? 'is-leaving' : ''}`}
      aria-label="Portfolio loading screen"
      onPointerDown={completeIntro}
      onClick={completeIntro}
    >
      <video
        className="intro-loader-video"
        src={HERO_VIDEO_SRC}
        poster={HERO_POSTER_SRC}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div className="intro-loader-scrim" aria-hidden="true" />
      <OpeningGeometry />
      <div className="intro-loader-brand-word" aria-hidden="true">
        ZHANG HAOYU
      </div>
      <div className="intro-loader-content">
        <ZClusterMark className="intro-loader-z is-opening" interactive={!prefersReducedMotion} label="Floating Z glitch mark" />
        <div className="intro-loader-copy">
          <span>VISUAL SYSTEM / AIGC ARCHIVE</span>
          <strong>ZHANG HAOYU</strong>
        </div>
      </div>
    </section>
  );
}
