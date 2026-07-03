import React from 'react';

function getViewportBox() {
  if (typeof window === 'undefined') {
    return { width: 1180, height: 680, left: 160, top: 90 };
  }

  const width = Math.min(window.innerWidth * 0.82, 1180);
  const height = Math.min(window.innerHeight * 0.68, 720);

  return {
    width,
    height,
    left: (window.innerWidth - width) / 2,
    top: (window.innerHeight - height) / 2,
  };
}

export default function WorkOpenTransition({ transition }) {
  if (!transition?.rect || (!transition?.project && !transition?.title)) {
    return null;
  }

  const { rect, project, imageSrc, label = 'OPENING', title, motionType = 'archive' } = transition;
  const transitionKind = transition.kind ?? (project ? 'work' : 'video');
  const transitionTitle = title ?? project?.title;
  const transitionTone = project?.accent ?? transition.accent ?? '#ff2a14';
  const end = getViewportBox();
  const scaleX = rect.width > 0 ? end.width / rect.width : 1;
  const scaleY = rect.height > 0 ? end.height / rect.height : 1;

  const style = {
    '--project-tone': transitionTone,
    '--start-x': `${rect.left}px`,
    '--start-y': `${rect.top}px`,
    '--start-w': `${rect.width}px`,
    '--start-h': `${rect.height}px`,
    '--open-dx': `${end.left - rect.left}px`,
    '--open-dy': `${end.top - rect.top}px`,
    '--open-scale-x': scaleX,
    '--open-scale-y': scaleY,
  };

  return (
    <div
      className="work-open-transition"
      data-kind={transitionKind}
      data-motion={motionType}
      style={style}
      aria-hidden="true"
    >
      <div className="work-open-transition-card">
        {imageSrc || project?.image ? <img src={imageSrc ?? project.image} alt="" /> : <strong>{project?.archiveCode ?? 'ZH'}</strong>}
      </div>
      <div className="work-open-transition-copy">
        <span>{label}</span>
        <strong>{transitionTitle}</strong>
      </div>
    </div>
  );
}
