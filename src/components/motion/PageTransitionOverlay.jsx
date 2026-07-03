import React from 'react';
import ScrambleText from './ScrambleText.jsx';

const transitionCaptions = {
  top: 'WAKE / Z-CORE',
  about: 'PROFILE / INDEX',
  projects: 'WORKS / PARTIAL SPACE',
  videos: 'VIDEO / SIGNAL RAIL',
  strengths: 'METHOD / SYSTEM',
  contact: 'SIGNAL / CONTACT',
};

export default function PageTransitionOverlay({ phase = 'idle', label = 'ZHANG HAOYU', signal = 0, view = 'top' }) {
  const isActive = phase !== 'idle';
  const caption = transitionCaptions[view] ?? `ENTERING / ${label}`;

  return (
    <div
      className={`page-transition-overlay ${isActive ? 'is-active' : ''} is-${phase}`}
      data-view={view}
      aria-hidden="true"
    >
      <div className="page-transition-panel">
        <span className="page-transition-noise" />
        <span className="page-transition-vector" />
        <span className="page-transition-rule" />
        <strong>
          <ScrambleText text={label} trigger={signal} />
        </strong>
        <small>{caption}</small>
      </div>
    </div>
  );
}
