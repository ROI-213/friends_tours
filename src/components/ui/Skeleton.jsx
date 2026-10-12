import React from 'react';

export const Skeleton = ({
  width = '100%',
  height = '20px',
  borderRadius = 'var(--radius-md)',
  className = '',
  style = {},
}) => {
  return (
    <div
      className={`skeleton-pulse ${className}`}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--color-pink-soft)',
        backgroundImage: 'linear-gradient(90deg, rgba(233, 215, 232, 0.4) 0%, rgba(247, 234, 244, 0.9) 50%, rgba(233, 215, 232, 0.4) 100%)',
        backgroundSize: '200% 100%',
        animation: 'skeletonShimmer 1.5s infinite linear',
        ...style,
      }}
    />
  );
};
