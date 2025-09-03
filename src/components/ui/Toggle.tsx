import React from 'react';

type ToggleSize = 'xs' | 'sm' | 'md' | 'lg';
type ToggleVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'info' | 'error' | 'neutral';

interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  size?: ToggleSize;
  variant?: ToggleVariant;
}

export const Toggle: React.FC<ToggleProps> = ({
  label,
  size = 'md',
  variant = 'primary',
  className = '',
  ...props
}) => {
  const toggleClasses = [
    'toggle',
    `toggle-${variant}`,
    `toggle-${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="form-control">
      <label className="label cursor-pointer">
        {label && <span className="label-text">{label}</span>}
        <input type="checkbox" className={toggleClasses} {...props} />
      </label>
    </div>
  );
};