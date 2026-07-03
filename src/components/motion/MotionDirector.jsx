import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import usePrefersReducedMotion from './usePrefersReducedMotion.js';

gsap.registerPlugin(ScrollTrigger);
gsap.config({ nullTargetWarn: false });

const viewSelectors = {
  top: '#top',
  about: '#about',
  projects: '#projects',
  videos: '#videos',
  strengths: '#strengths',
  contact: '#contact',
};

function compactSelector(root, selector) {
  return Array.from(root.querySelectorAll(selector)).filter(Boolean);
}

function makeTimeline(scope, options = {}) {
  return gsap.timeline({
    defaults: { ease: 'expo.out', duration: 1.05 },
    ...options,
    onStart: () => {
      scope.classList.add('is-motion-directing');
      options.onStart?.();
    },
    onComplete: () => {
      scope.classList.remove('is-motion-directing');
      options.onComplete?.();
    },
    onInterrupt: () => {
      scope.classList.remove('is-motion-directing');
      options.onInterrupt?.();
    },
  });
}

function clearMotionStyles(targets) {
  if (!targets?.length) {
    return;
  }

  gsap.set(targets, {
    clearProps: 'transform,opacity,filter,clipPath,willChange,transformOrigin,visibility',
    '--motion-glow-size': '0px',
    '--motion-glow-aura': 0.18,
    '--motion-signal-opacity': 0,
    '--motion-signal-scale': 0,
    '--motion-signal-x': '-21%',
    '--contact-sweep-opacity': 0,
    '--contact-sweep-x': '-4.5%',
    '--contact-sweep-scale': 0.84,
  });
}

function clearVideoCardShellStyles(cards) {
  if (!cards?.length) {
    return;
  }

  gsap.set(cards, {
    clearProps: 'clipPath,willChange',
  });
}

function killStoredScrollTriggers(scrollTriggersRef) {
  scrollTriggersRef.current.forEach((trigger) => {
    trigger?.kill?.();
  });
  scrollTriggersRef.current = [];
}

function animateHero(scope, isMobile) {
  const root = document;
  const header = root.querySelector('.site-header');
  const titleBlock = scope.querySelector('.hero-title-block');
  const titleLines = compactSelector(scope, '.hero-title-block h1 span');
  const posterWords = compactSelector(scope, '.hero-word');
  const support = compactSelector(scope, '.eyebrow, .hero-lede, .hero-role-list span, .hero-actions a');
  const bgVideo = scope.querySelector('.hero-background video, .hero-background img');
  const glass = scope.querySelector('.hero-glass');
  const tl = makeTimeline(scope);
  const titleTravel = isMobile ? 58 : 118;

  gsap.set([header, titleBlock, bgVideo, glass, ...posterWords, ...titleLines, ...support].filter(Boolean), {
    willChange: 'transform,opacity,filter,clip-path',
  });
  gsap.set(titleBlock, {
    '--motion-signal-opacity': 0,
    '--motion-signal-scale': 0,
    '--motion-signal-x': '-21%',
  });
  gsap.set(header, { y: isMobile ? -18 : -46, autoAlpha: 0, filter: 'blur(10px)' });
  gsap.set(bgVideo, { scale: isMobile ? 1.05 : 1.12, filter: 'brightness(0.42) saturate(0.72) contrast(1.25)' });
  gsap.set(glass, { autoAlpha: 0, scaleX: 0.84, transformOrigin: '50% 50%' });
  gsap.set(posterWords, {
    autoAlpha: 0,
    y: isMobile ? 36 : 80,
    scaleX: 0.72,
    filter: 'blur(18px)',
    transformOrigin: '0% 50%',
  });
  gsap.set(titleLines, {
    autoAlpha: 0,
    y: titleTravel,
    scaleX: 0.58,
    clipPath: 'inset(0 0 100% 0)',
    transformOrigin: '0% 70%',
  });
  gsap.set(support, { autoAlpha: 0, y: isMobile ? 16 : 28, filter: 'blur(8px)' });

  tl.to(bgVideo, { scale: 1.025, filter: 'brightness(0.56) saturate(0.86) contrast(1.12)', duration: 2.35 }, 0)
    .to(header, { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.95 }, 0.08)
    .to(glass, { autoAlpha: 1, scaleX: 1, duration: 1.15 }, 0.18)
    .to(
      posterWords,
      {
        autoAlpha: 0.16,
        y: 0,
        scaleX: 1,
        filter: 'blur(0px)',
        duration: 1.45,
        stagger: 0.13,
      },
      0.24,
    )
    .to(
      titleLines,
      {
        autoAlpha: 1,
        y: 0,
        scaleX: 1,
        clipPath: 'inset(0 0 0% 0)',
        duration: 1.35,
        stagger: 0.16,
      },
      0.52,
    )
    .to(
      titleBlock,
      {
        '--motion-signal-opacity': 1,
        '--motion-signal-scale': 1,
        '--motion-signal-x': '0%',
        duration: 0.7,
        ease: 'power4.out',
      },
      1.02,
    )
    .to(
      titleBlock,
      {
        '--motion-signal-opacity': 0,
        '--motion-signal-scale': 0.12,
        '--motion-signal-x': '21%',
        duration: 0.55,
        ease: 'power4.inOut',
      },
      1.62,
    )
    .to(support, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.92, stagger: 0.075 }, 1.18)
    .set([header, titleBlock, bgVideo, glass, ...posterWords, ...titleLines, ...support].filter(Boolean), {
      clearProps: 'willChange',
    });

  return tl;
}

function animateAbout(scope, isMobile) {
  const title = compactSelector(scope, '.section-heading h2');
  const copy = compactSelector(scope, '.intro-copy p');
  const cards = compactSelector(scope, '.portrait-card, .bio-card, .contact-card, .stat');
  const portrait = compactSelector(scope, '.portrait-card img');
  const tl = makeTimeline(scope);

  gsap.set([...title, ...copy, ...cards, ...portrait], { willChange: 'transform,opacity,filter,clip-path' });
  gsap.set(title, { autoAlpha: 0, y: isMobile ? 40 : 86, scaleY: 1.18, clipPath: 'inset(0 0 100% 0)' });
  gsap.set(copy, { autoAlpha: 0, y: 28, filter: 'blur(9px)' });
  gsap.set(cards, {
    autoAlpha: 0,
    y: isMobile ? 30 : 58,
    x: isMobile ? 0 : -32,
    rotationY: isMobile ? 0 : -6,
    filter: 'blur(12px)',
    '--motion-glow-size': '0px',
    '--motion-glow-aura': 0.18,
  });
  gsap.set(portrait, { scale: 1.1, y: isMobile ? 0 : 24 });

  tl.to(title, { autoAlpha: 1, y: 0, scaleY: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.1 }, 0)
    .to(copy, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.12 }, 0.34)
    .to(
      cards,
      {
        autoAlpha: 1,
        y: 0,
        x: 0,
        rotationY: 0,
        filter: 'blur(0px)',
        '--motion-glow-size': '52px',
        '--motion-glow-aura': 0.36,
        duration: 1.05,
        stagger: 0.09,
      },
      0.55,
    )
    .to(portrait, { scale: 1, y: 0, duration: 1.25 }, 0.62)
    .to(cards, { '--motion-glow-size': '18px', '--motion-glow-aura': 0.24, duration: 0.82 }, 1.45)
    .set([...title, ...copy, ...cards, ...portrait], { clearProps: 'willChange' });

  return tl;
}

function animateProjects(scope, isMobile) {
  const headline = compactSelector(scope, '.works-sidebar-copy h2');
  const sidebarCopy = compactSelector(scope, '.works-sidebar-copy p, .works-kicker');
  const categories = compactSelector(scope, '.works-category-list button');
  const stageHead = compactSelector(scope, '.works-stage-head');
  const cards = compactSelector(scope, '.project-card');
  const media = compactSelector(scope, '.project-media');
  const images = compactSelector(scope, '.project-media img');
  const bodies = compactSelector(scope, '.project-body > *');
  const tl = makeTimeline(scope);

  gsap.set([...headline, ...sidebarCopy, ...categories, ...stageHead, ...cards, ...media, ...images, ...bodies], {
    willChange: 'transform,opacity,filter,clip-path',
  });
  gsap.set(headline, { autoAlpha: 0, y: isMobile ? 42 : 96, scaleX: 0.62, clipPath: 'inset(0 0 100% 0)', transformOrigin: '0% 70%' });
  gsap.set(sidebarCopy, { autoAlpha: 0, y: 20, filter: 'blur(8px)' });
  gsap.set(categories, { autoAlpha: 0, x: isMobile ? 0 : -30, y: isMobile ? 18 : 0, filter: 'blur(8px)' });
  gsap.set(stageHead, { autoAlpha: 0, y: -22, filter: 'blur(8px)' });
  gsap.set(cards, {
    autoAlpha: 0,
    y: isMobile ? 42 : 78,
    scale: 0.972,
    clipPath: 'inset(12% 0 18% 0)',
    filter: 'blur(15px)',
    '--motion-glow-size': '0px',
    '--motion-glow-aura': 0.18,
  });
  gsap.set(media, { clipPath: 'inset(22% 0 22% 0)' });
  gsap.set(images, { scale: 1.08, y: isMobile ? 0 : 18 });
  gsap.set(bodies, { autoAlpha: 0, y: 18 });

  tl.to(headline, { autoAlpha: 1, y: 0, scaleX: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.16 }, 0)
    .to(sidebarCopy, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.82, stagger: 0.08 }, 0.26)
    .to(categories, { autoAlpha: 1, x: 0, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.055 }, 0.42)
    .to(stageHead, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.82 }, 0.56)
    .to(
      cards,
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        clipPath: 'inset(0% 0 0% 0)',
        filter: 'blur(0px)',
        '--motion-glow-size': '44px',
        '--motion-glow-aura': 0.32,
        duration: 1.06,
        stagger: { each: isMobile ? 0.055 : 0.095, from: 'start' },
      },
      0.72,
    )
    .to(media, { clipPath: 'inset(0% 0 0% 0)', duration: 1, stagger: isMobile ? 0.035 : 0.07 }, 0.84)
    .to(images, { scale: 1, y: 0, duration: 1.25, stagger: isMobile ? 0.03 : 0.055 }, 0.9)
    .to(bodies, { autoAlpha: 1, y: 0, duration: 0.66, stagger: 0.018 }, 1.08)
    .to(cards, { '--motion-glow-size': '12px', '--motion-glow-aura': 0.21, duration: 0.86 }, 1.75)
    .set([...headline, ...sidebarCopy, ...categories, ...stageHead, ...cards, ...media, ...images, ...bodies], {
      clearProps: 'willChange',
    });

  return tl;
}

function animateVideos(scope, isMobile) {
  const headline = compactSelector(scope, '.videos-head h2');
  const controls = compactSelector(scope, '.videos-controls');
  const backgroundWord = compactSelector(scope, '.videos-bg-word');
  const cards = compactSelector(scope, '.video-card');
  const covers = compactSelector(scope, '.video-cover');
  const placeholders = compactSelector(scope, '.video-cover-placeholder > *');
  const meta = compactSelector(scope, '.video-card-meta > *');
  const targets = [...headline, ...controls, ...backgroundWord, ...covers, ...placeholders, ...meta];
  let fallbackTimer = 0;
  const settle = () => {
    clearMotionStyles(targets);
    clearVideoCardShellStyles(cards);
    scope.classList.remove('is-motion-directing');
  };
  const tl = makeTimeline(scope, {
    onComplete: () => window.clearTimeout(fallbackTimer),
    onInterrupt: () => window.clearTimeout(fallbackTimer),
  });

  fallbackTimer = window.setTimeout(() => {
    tl.kill();
    settle();
  }, isMobile ? 1450 : 1600);

  gsap.set(targets, {
    willChange: 'transform,opacity,filter,clip-path',
  });
  gsap.set(cards, {
    willChange: 'clip-path',
  });
  gsap.set(headline, {
    autoAlpha: 0,
    y: isMobile ? 40 : 98,
    scaleX: 0.58,
    clipPath: 'inset(0 0 100% 0)',
    transformOrigin: '0% 72%',
  });
  gsap.set(controls, { autoAlpha: 0, y: isMobile ? 12 : -16, filter: 'blur(6px)' });
  gsap.set(backgroundWord, {
    autoAlpha: 0,
    y: isMobile ? 38 : 82,
    scaleX: 0.82,
    filter: 'blur(9px)',
    transformOrigin: '0% 50%',
  });
  gsap.set(cards, {
    clipPath: 'inset(10% 0 18% 0)',
  });
  gsap.set(covers, {
    x: isMobile ? -12 : -24,
    clipPath: 'inset(16% 0 18% 0)',
    filter: 'blur(6px)',
  });
  gsap.set(placeholders, { y: isMobile ? 10 : 16, filter: 'blur(5px)' });
  gsap.set(meta, { x: isMobile ? -8 : -16, y: isMobile ? 10 : 16, filter: 'blur(5px)' });

  tl.to(headline, { autoAlpha: 1, y: 0, scaleX: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.88 }, 0)
    .to(controls, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.54 }, 0.24)
    .to(backgroundWord, { autoAlpha: 1, y: 0, scaleX: 1, filter: 'blur(0px)', duration: 0.82 }, 0.28)
    .to(
      cards,
      {
        clipPath: 'inset(0% 0 0% 0)',
        duration: 0.72,
        stagger: { each: isMobile ? 0.04 : 0.06, from: 'start' },
      },
      0.44,
    )
    .to(
      covers,
      {
        x: 0,
        clipPath: 'inset(0% 0 0% 0)',
        filter: 'blur(0px)',
        duration: 0.66,
        stagger: isMobile ? 0.025 : 0.04,
      },
      0.56,
    )
    .to(placeholders, { y: 0, filter: 'blur(0px)', duration: 0.44, stagger: 0.025 }, 0.72)
    .to(meta, { x: 0, y: 0, filter: 'blur(0px)', duration: 0.44, stagger: 0.012 }, 0.78)
    .set(targets, {
      clearProps: 'transform,opacity,filter,clipPath,willChange,transformOrigin,visibility',
    })
    .set(cards, {
      clearProps: 'clipPath,willChange',
    });

  return tl;
}

function animateStrengths(scope, isMobile) {
  const title = compactSelector(scope, '.section-top h2');
  const intro = compactSelector(scope, '.section-top > p');
  const cards = compactSelector(scope, '.strength-card');
  const cardParts = compactSelector(scope, '.strength-card-top, .strength-card h3, .strength-card p, .strength-evidence span');
  const tl = makeTimeline(scope);

  gsap.set([...title, ...intro, ...cards, ...cardParts], { willChange: 'transform,opacity,filter,clip-path' });
  gsap.set(title, { autoAlpha: 0, y: isMobile ? 38 : 78, rotationX: isMobile ? 0 : 7, scaleX: 0.76, clipPath: 'inset(0 0 100% 0)', transformOrigin: '0% 80%' });
  gsap.set(intro, { autoAlpha: 0, y: 24, filter: 'blur(9px)' });
  gsap.set(cards, {
    autoAlpha: 0,
    y: isMobile ? 34 : 72,
    scale: 0.972,
    filter: 'blur(12px)',
    '--motion-glow-size': '0px',
    '--motion-glow-aura': 0.18,
  });
  gsap.set(cardParts, { autoAlpha: 0, y: 16 });

  tl.to(title, { autoAlpha: 1, y: 0, rotationX: 0, scaleX: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.08 }, 0)
    .to(intro, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.86 }, 0.34)
    .to(
      cards,
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        '--motion-glow-size': '46px',
        '--motion-glow-aura': 0.34,
        duration: 1.04,
        stagger: 0.12,
      },
      0.5,
    )
    .to(cardParts, { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.025 }, 0.74)
    .to(cards, { '--motion-glow-size': '14px', '--motion-glow-aura': 0.22, duration: 0.9 }, 1.42)
    .set([...title, ...intro, ...cards, ...cardParts], { clearProps: 'willChange' });

  return tl;
}

function animateContact(scope, isMobile) {
  const inner = compactSelector(scope, '.contact-inner');
  const title = compactSelector(scope, '.contact-inner h2');
  const copy = compactSelector(scope, '.contact-inner p, .contact-kicker');
  const actions = compactSelector(scope, '.contact-actions a');
  const tl = makeTimeline(scope);

  gsap.set([...inner, ...title, ...copy, ...actions], { willChange: 'transform,opacity,filter,clip-path' });
  gsap.set(inner, {
    '--contact-sweep-opacity': 0,
    '--contact-sweep-x': '-4.5%',
    '--contact-sweep-scale': 0.84,
  });
  gsap.set(title, { autoAlpha: 0, y: isMobile ? 42 : 88, scaleX: 0.7, clipPath: 'inset(0 0 100% 0)', transformOrigin: '0% 80%' });
  gsap.set(copy, { autoAlpha: 0, y: 24, filter: 'blur(8px)' });
  gsap.set(actions, { autoAlpha: 0, y: 22, filter: 'blur(8px)' });

  tl.to(
    inner,
    {
      '--contact-sweep-opacity': 0.92,
      '--contact-sweep-x': '0%',
      '--contact-sweep-scale': 1.02,
      duration: 0.82,
      ease: 'power4.out',
    },
    0,
  )
    .to(title, { autoAlpha: 1, y: 0, scaleX: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.15 }, 0.18)
    .to(copy, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.82, stagger: 0.1 }, 0.58)
    .to(actions, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.82, stagger: 0.12 }, 0.82)
    .to(
      inner,
      {
        '--contact-sweep-opacity': 0.22,
        '--contact-sweep-x': '1.5%',
        '--contact-sweep-scale': 0.92,
        duration: 0.72,
      },
      1.34,
    )
    .set([...inner, ...title, ...copy, ...actions], { clearProps: 'willChange' });

  return tl;
}

function runViewEntrance(activeView, isMobile) {
  const selector = viewSelectors[activeView];
  const scope = selector ? document.querySelector(selector) : null;

  if (!scope) {
    return null;
  }

  const cleanupTargets = compactSelector(
    document,
    '.site-header, .hero-background video, .hero-background img, .hero-glass, .hero-word, .hero-title-block, .hero-title-block h1 span, .eyebrow, .hero-lede, .hero-role-list span, .hero-actions a, .section-heading h2, .intro-copy p, .portrait-card, .bio-card, .contact-card, .stat, .works-sidebar-copy h2, .works-sidebar-copy p, .works-kicker, .works-category-list button, .works-stage-head, .project-card, .project-media, .project-media img, .project-body > *, .videos-head h2, .videos-controls, .videos-bg-word, .video-cover, .video-cover-placeholder > *, .video-card-meta > *, .section-top h2, .section-top > p, .strength-card, .strength-card-top, .strength-card h3, .strength-card p, .strength-evidence span, .contact-inner, .contact-inner h2, .contact-inner p, .contact-kicker, .contact-actions a',
  );
  clearMotionStyles(cleanupTargets);

  if (activeView === 'top') {
    return animateHero(scope, isMobile);
  }

  if (activeView === 'about') {
    return animateAbout(scope, isMobile);
  }

  if (activeView === 'projects') {
    return animateProjects(scope, isMobile);
  }

  if (activeView === 'videos') {
    return animateVideos(scope, isMobile);
  }

  if (activeView === 'strengths') {
    return animateStrengths(scope, isMobile);
  }

  if (activeView === 'contact') {
    return animateContact(scope, isMobile);
  }

  return null;
}

function animateModalInterior(isMobile) {
  const scope = document.querySelector('.work-modal');

  if (!scope) {
    return null;
  }

  const title = compactSelector(scope, '.work-modal-title-block span, .work-modal-title-block h2, .work-modal-title-block p');
  const controls = compactSelector(scope, '.work-modal-controls button');
  const media = compactSelector(scope, '.work-modal-media');
  const mediaImage = compactSelector(scope, '.work-modal-media img');
  const summary = compactSelector(scope, '.work-modal-summary > *');
  const detail = compactSelector(scope, '.work-modal-detail > *');
  const detailImages = compactSelector(scope, '.work-modal-detail img');
  const tl = makeTimeline(scope);

  gsap.set([...title, ...controls, ...media, ...mediaImage, ...summary, ...detail, ...detailImages], {
    willChange: 'transform,opacity,filter,clip-path',
  });
  gsap.set(title, { autoAlpha: 0, y: isMobile ? 20 : 34, clipPath: 'inset(0 0 100% 0)' });
  gsap.set(controls, { autoAlpha: 0, y: -12, filter: 'blur(7px)' });
  gsap.set(media, { autoAlpha: 0, y: isMobile ? 24 : 46, clipPath: 'inset(14% 0 18% 0)', filter: 'blur(11px)' });
  gsap.set(mediaImage, { scale: 1.08, y: isMobile ? 0 : 18 });
  gsap.set(summary, { autoAlpha: 0, y: 26, filter: 'blur(8px)' });
  gsap.set(detail, { autoAlpha: 0, y: 34, filter: 'blur(10px)' });
  gsap.set(detailImages, { scale: 1.04, y: isMobile ? 0 : 18 });

  tl.to(title, { autoAlpha: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.78, stagger: 0.07 }, 0.06)
    .to(controls, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.62, stagger: 0.04 }, 0.16)
    .to(media, { autoAlpha: 1, y: 0, clipPath: 'inset(0% 0 0% 0)', filter: 'blur(0px)', duration: 0.92 }, 0.22)
    .to(mediaImage, { scale: 1, y: 0, duration: 1.12 }, 0.28)
    .to(summary, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.72, stagger: 0.055 }, 0.38)
    .to(detail, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.86, stagger: 0.08 }, 0.62)
    .to(detailImages, { scale: 1, y: 0, duration: 1.05, stagger: 0.04 }, 0.74)
    .set(title, {
      clearProps: 'clipPath,willChange',
    })
    .set([...controls, ...media, ...mediaImage, ...summary, ...detail, ...detailImages], {
      clearProps: 'willChange',
    });

  return tl;
}

export default function MotionDirector({
  activeView,
  transitionPhase,
  isIntroVisible,
  introInstanceKey,
  workFilterPhase,
  workFilterSignal,
  workModalPhase,
  workModalSignal,
  selectedProjectKey,
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const viewTimelineRef = useRef(null);
  const modalTimelineRef = useRef(null);
  const scrollTriggersRef = useRef([]);
  const lastViewRunRef = useRef('');
  const lastModalRunRef = useRef('');
  const lastModalProjectRef = useRef('');

  useLayoutEffect(() => {
    if (prefersReducedMotion || isIntroVisible || transitionPhase === 'leaving') {
      return undefined;
    }

    if (activeView === 'projects' && workFilterPhase === 'partial-out') {
      return undefined;
    }

    const entranceKey = `${activeView}:${introInstanceKey}`;

    if (lastViewRunRef.current === entranceKey) {
      return undefined;
    }

    if (viewTimelineRef.current) {
      viewTimelineRef.current.kill();
      viewTimelineRef.current = null;
    }

    lastViewRunRef.current = entranceKey;

    const isMobile = window.matchMedia('(max-width: 760px)').matches;
    const timeline = runViewEntrance(activeView, isMobile);
    viewTimelineRef.current = timeline;

    return undefined;
  }, [
    activeView,
    introInstanceKey,
    isIntroVisible,
    prefersReducedMotion,
    transitionPhase,
    workFilterPhase,
    workFilterSignal,
  ]);

  useEffect(
    () => () => {
      viewTimelineRef.current?.kill();
    },
    [],
  );

  useEffect(() => {
    killStoredScrollTriggers(scrollTriggersRef);

    if (prefersReducedMotion || isIntroVisible || transitionPhase !== 'idle') {
      return undefined;
    }

    const scope = document.querySelector(viewSelectors[activeView]);
    const isDesktop = window.matchMedia('(min-width: 761px)').matches;

    if (!scope || !isDesktop) {
      return undefined;
    }

    const mediaItems = compactSelector(
      scope,
      '.project-media, .video-cover, .portrait-card, .virtual-human-asset figure, .xiaoniaozhuo-board figure, .brand-kv-figure, .welfare-board, .guitar-tuner-board',
    );

    mediaItems.slice(0, 18).forEach((media) => {
      const image = media.querySelector('img, video');
      const reveal = gsap.fromTo(
        media,
        { clipPath: 'inset(10% 0 14% 0)' },
        {
          clipPath: 'inset(0% 0 0% 0)',
          duration: 1.05,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: media,
            start: 'top 86%',
            once: true,
          },
        },
      );

      if (reveal.scrollTrigger) {
        scrollTriggersRef.current.push(reveal.scrollTrigger);
      }

      if (image) {
        const parallax = gsap.fromTo(
          image,
          { y: -18, scale: 1.035 },
          {
            y: 18,
            scale: 1.035,
            ease: 'none',
            scrollTrigger: {
              trigger: media,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.55,
            },
          },
        );
        if (parallax.scrollTrigger) {
          scrollTriggersRef.current.push(parallax.scrollTrigger);
        }
      }
    });

    ScrollTrigger.refresh();

    return () => {
      killStoredScrollTriggers(scrollTriggersRef);
    };
  }, [activeView, isIntroVisible, prefersReducedMotion, transitionPhase, workFilterSignal, selectedProjectKey]);

  useLayoutEffect(() => {
    if (prefersReducedMotion || !selectedProjectKey || workModalPhase === 'idle' || workModalPhase === 'closing') {
      return undefined;
    }

    const isSwitchingWork = workModalPhase === 'switch-next' || workModalPhase === 'switch-prev';

    if (isSwitchingWork && selectedProjectKey === lastModalProjectRef.current) {
      return undefined;
    }

    const runKey = `${selectedProjectKey}:${workModalSignal}`;

    if (lastModalRunRef.current === runKey) {
      return undefined;
    }

    if (modalTimelineRef.current) {
      modalTimelineRef.current.kill();
      modalTimelineRef.current = null;
    }

    lastModalRunRef.current = runKey;
    lastModalProjectRef.current = selectedProjectKey;

    const isMobile = window.matchMedia('(max-width: 760px)').matches;
    modalTimelineRef.current = animateModalInterior(isMobile);

    return undefined;
  }, [prefersReducedMotion, selectedProjectKey, workModalPhase, workModalSignal]);

  useEffect(
    () => () => {
      modalTimelineRef.current?.kill();
    },
    [],
  );

  return null;
}
