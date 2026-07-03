import React from 'react';

export default function WorksAmbientLayer({ project, phase = 'ready', motionType = 'archive' }) {
  if (!project) {
    return null;
  }

  return (
    <div
      className="works-ambient-layer"
      data-phase={phase}
      data-motion={motionType}
      style={{ '--project-tone': project.accent }}
      aria-hidden="true"
    >
      <div className="works-ambient-image">
        {project.image ? <img src={project.image} alt="" /> : null}
      </div>
      <div className="works-ambient-field" />
      <div className="works-ambient-label">
        <span>{project.type}</span>
        <strong>{project.year}</strong>
      </div>
    </div>
  );
}
