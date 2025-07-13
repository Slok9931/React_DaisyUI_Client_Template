import React, { useState } from 'react';

type RatingSize = 'xs' | 'sm' | 'md' | 'lg';
type RatingVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'info' | 'error';

interface RatingProps {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: RatingSize;
  variant?: RatingVariant;
  half?: boolean;
  readonly?: boolean;
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  value = 0,
  onChange,
  max = 5,
  size = 'md',
  variant = 'warning',
  half = false,
  readonly = false,
  className = '',
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const ratingClasses = [
    'rating',
    half && 'rating-half',
    `rating-${size}`,
    className
  ].filter(Boolean).join(' ');

  const starClasses = [
    'mask mask-star-2',
    `bg-${variant}`,
  ].join(' ');

  const handleClick = (starValue: number) => {
    if (!readonly && onChange) {
      onChange(starValue);
    }
  };

  const handleMouseEnter = (starValue: number) => {
    if (!readonly) {
      setHoverValue(starValue);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverValue(null);
    }
  };

  const displayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div className={ratingClasses}>
      {half && (
        <input type="radio" name="rating" className="rating-hidden" />
      )}
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1;
        const isSelected = starValue <= displayValue;
        
        if (half) {
          return (
            <React.Fragment key={index}>
              <input
                type="radio"
                name="rating"
                className={`${starClasses} mask-half-1`}
                checked={starValue - 0.5 === value}
                onChange={() => handleClick(starValue - 0.5)}
                onMouseEnter={() => handleMouseEnter(starValue - 0.5)}
                onMouseLeave={handleMouseLeave}
                disabled={readonly}
              />
              <input
                type="radio"
                name="rating"
                className={`${starClasses} mask-half-2`}
                checked={starValue === value}
                onChange={() => handleClick(starValue)}
                onMouseEnter={() => handleMouseEnter(starValue)}
                onMouseLeave={handleMouseLeave}
                disabled={readonly}
              />
            </React.Fragment>
          );
        }

        return (
          <input
            key={index}
            type="radio"
            name="rating"
            className={starClasses}
            checked={isSelected}
            onChange={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
          />
        );
      })}
    </div>
  );
};