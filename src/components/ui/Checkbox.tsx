import React from 'react';

type CheckboxSize = 'xs' | 'sm' | 'md' | 'lg';
type CheckboxVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'info' | 'error';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  size?: CheckboxSize;
  variant?: CheckboxVariant;
  indeterminate?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  size = 'md',
  variant = 'primary',
  indeterminate = false,
  className = '',
  ...props
}) => {
  const checkboxClasses = [
    'checkbox',
    `checkbox-${variant}`,
    `checkbox-${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="form-control">
      <label className="label cursor-pointer">
        <input
          type="checkbox"
          className={checkboxClasses}
          ref={(input) => {
            if (input) input.indeterminate = indeterminate;
          }}
          {...props}
        />
        {label && <span className="label-text ml-2">{label}</span>}
      </label>
    </div>
  );
};