import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary', // primary | secondary | white | glass | outline | whatsapp
  size = 'md', // sm | md | lg
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  href,
  target,
  rel,
  ...props
}) => {
  const baseClasses = `btn btn-${variant} btn-${size} ${className}`.trim();

  const content = (
    <>
      {loading && <Loader2 size={size === 'sm' ? 14 : 18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />}
      {!loading && Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 15 : 18} />}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 15 : 18} />}
    </>
  );

  if (href) {
    return (
      <a href={href} className={baseClasses} target={target} rel={rel} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={baseClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {content}
    </button>
  );
};
