import { getIconComponent } from '@/utils/utilityFunction';
import React from 'react';

type ChipSize = 'xs' | 'sm' | 'md' | 'lg';
type ChipVariant = 'default' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';

interface ChipProps {
  children: React.ReactNode;
  size?: ChipSize;
  variant?: ChipVariant;
  className?: string;
  icon?: React.ReactNode;
  onRemove?: () => void;
  removable?: boolean;
  disabled?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  outlined?: boolean;
  rounded?: boolean;
}

const sizeClasses: Record<ChipSize, string> = {
  xs: 'badge-xs text-xs px-2 py-1',
  sm: 'badge-sm text-sm px-3 py-1',
  md: 'text-sm px-3 py-2',
  lg: 'badge-lg text-base px-4 py-2',
};

const variantClasses: Record<ChipVariant, string> = {
  default: 'badge-neutral',
  primary: 'badge-primary',
  secondary: 'badge-secondary',
  accent: 'badge-accent',
  info: 'badge-info',
  success: 'badge-success',
  warning: 'badge-warning',
  error: 'badge-error',
};

export const Chip: React.FC<ChipProps> = ({
  children,
  size = 'md',
  variant = 'default',
  className = '',
  icon,
  onRemove,
  removable = false,
  disabled = false,
  clickable = false,
  onClick,
  outlined = false,
  rounded = true,
}) => {
  const baseClasses = 'badge inline-flex items-center gap-1 font-medium transition-all duration-200';
  const sizeClass = sizeClasses[size];
  const variantClass = variantClasses[variant];
  const outlineClass = outlined ? 'badge-outline' : '';
  const roundedClass = rounded ? 'rounded-full' : 'rounded-md';
  const clickableClass = clickable || onClick ? 'cursor-pointer hover:opacity-80' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && onRemove) {
      onRemove();
    }
  };

  return (
    <span
      className={`
        ${baseClasses}
        ${sizeClass}
        ${variantClass}
        ${outlineClass}
        ${roundedClass}
        ${clickableClass}
        ${disabledClass}
        ${className}
      `.trim()}
      onClick={handleClick}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      <span>{children}</span>
      {(removable || onRemove) && (
        <button
          onClick={handleRemove}
          className="flex items-center justify-center ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors duration-150"
          disabled={disabled}
          type="button"
        >
          {getIconComponent("X", 12, "w-3 h-3")}
        </button>
      )}
    </span>
  );
};