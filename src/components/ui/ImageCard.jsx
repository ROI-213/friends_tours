import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const ImageCard = ({
  image,
  title,
  subtitle,
  badge,
  aspectRatio = '4/3', // '16/9', '4/3', '1/1', '3/4'
  actionText = 'Explore',
  onClick,
  className = '',
  style = {},
  children,
}) => {
  return (
    <div
      className={`image-card ${className}`}
      onClick={onClick}
      style={{ aspectRatio, cursor: onClick ? 'pointer' : 'default', ...style }}
    >
      <img src={image} alt={title || 'Travel Destination'} className="image-card-media" loading="lazy" />
      <div className="image-card-scrim" />

      {badge && (
        <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 3 }}>
          <span className="badge badge-glass">{badge}</span>
        </div>
      )}

      <div className="image-card-content">
        {subtitle && <p className="body-xs text-white" style={{ opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{subtitle}</p>}
        {title && <h3 className="heading-card-overlay">{title}</h3>}
        
        {children}

        {actionText && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: '0.8125rem', fontWeight: 600, color: '#EBF2FF' }}>
            <span>{actionText}</span>
            <ArrowUpRight size={15} />
          </div>
        )}
      </div>
    </div>
  );
};
