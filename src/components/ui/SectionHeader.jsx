import React from 'react';

export const SectionHeader = ({
  eyebrow,
  title,
  highlight,
  subtitle,
  align = 'center', // center | left
  light = false,
  className = '',
}) => {
  return (
    <div className={`section-header text-${align} ${className}`}>
      {eyebrow && (
        <div className="eyebrow">
          <span className="eyebrow-pill">{eyebrow}</span>
        </div>
      )}
      
      {title && (
        <h2 className={`heading-section ${light ? 'heading-hero-light' : ''}`}>
          {title}{' '}
          {highlight && <span className="text-gradient">{highlight}</span>}
        </h2>
      )}

      {subtitle && (
        <p className={`section-subtitle ${light ? 'text-white' : ''}`} style={light ? { opacity: 0.9 } : {}}>
          {subtitle}
        </p>
      )}
    </div>
  );
};
