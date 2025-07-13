import React from 'react';

type FileInputSize = 'xs' | 'sm' | 'md' | 'lg';
type FileInputVariant = 'bordered' | 'ghost' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';

interface FileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: FileInputSize;
  variant?: FileInputVariant;
}

export const FileInput: React.FC<FileInputProps> = ({
  label,
  error,
  helperText,
  size = 'md',
  variant = 'bordered',
  className = '',
  ...props
}) => {
  const fileInputClasses = [
    'file-input',
    `file-input-${variant}`,
    `file-input-${size}`,
    error && 'file-input-error',
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
      <input type="file" className={fileInputClasses} {...props} />
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