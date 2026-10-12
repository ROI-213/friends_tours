import React from 'react';

export const Badge = ({
  children,
  variant = 'magenta', // magenta | primary | glass | success | warning
  icon: Icon,
  className = '',
  ...props
}) => {
  return (
    <span className={`badge badge-${variant} ${className}`} {...props}>
      {Icon && <Icon size={13} />}
      <span>{children}</span>
    </span>
  );
};
