import React from 'react';

type RangeSize = 'xs' | 'sm' | 'md' | 'lg';
type RangeVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'info' | 'error';

interface RangeProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  size?: RangeSize;
  variant?: RangeVariant;
  showValue?: boolean;
  showSteps?: boolean;
  steps?: number[];
}

export const Range: React.FC<RangeProps> = ({
  label,
  size = 'md',
  variant = 'primary',
  showValue = false,
  showSteps = false,
  steps,
  min = 0,
  max = 100,
  value,
  className = '',
  ...props
}) => {
  const rangeClasses = [
    'range',
    `range-${variant}`,
    `range-${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
          {showValue && (
            <span className="label-text-alt">{value}</span>
          )}
        </label>
      )}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        className={rangeClasses}
        {...props}
      />
      {showSteps && steps && (
        <div className="w-full flex justify-between text-xs px-2">
          {steps.map((index) => (
            <span key={index}>|</span>
          ))}
        </div>
      )}
    </div>
  );
};