import React from 'react';

type TextareaSize = 'xs' | 'sm' | 'md' | 'lg';
type TextareaVariant = 'bordered' | 'ghost' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: TextareaSize;
  variant?: TextareaVariant;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  size = 'md',
  variant = 'bordered',
  className = '',
  ...props
}) => {
  const textareaClasses = [
    'textarea',
    `textarea-${variant}`,
    `textarea-${size}`,
    error && 'textarea-error',
    'w-full',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      <textarea className={textareaClasses} {...props} />
      {(error || helperText) && (
        <label className="label">
          <span className={`label-text-alt ${error ? 'text-error' : ''}`}>
            {error || helperText}
          </span>
        </label>
      )}
    </div>
  );
};