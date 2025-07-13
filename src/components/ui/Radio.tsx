import React from 'react';

type RadioSize = 'xs' | 'sm' | 'md' | 'lg';
type RadioVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'info' | 'error';

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  options: RadioOption[];
  name: string;
  value: string;
  onChange?: (value: string) => void;
  size?: RadioSize;
  variant?: RadioVariant;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Radio: React.FC<RadioProps> = ({
  options,
  name,
  value,
  onChange,
  size = 'md',
  variant = 'primary',
  orientation = 'vertical',
  className = '',
  ...props
}) => {
  const radioClasses = [
    'radio',
    `radio-${variant}`,
    `radio-${size}`,
  ].filter(Boolean).join(' ');

  const containerClasses = [
    'form-control',
    orientation === 'horizontal' && 'flex-row gap-4',
    className
  ].filter(Boolean).join(' ');

  const handleChange = (optionValue: string) => {
    onChange?.(optionValue);
  };

  return (
    <div className={containerClasses}>
      {options.map((option) => (
        <label key={option.value} className="label cursor-pointer justify-start gap-2">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => handleChange(option.value)}
            disabled={option.disabled}
            className={radioClasses}
            {...props}
          />
          <span className="label-text">{option.label}</span>
        </label>
      ))}
    </div>
  );
};