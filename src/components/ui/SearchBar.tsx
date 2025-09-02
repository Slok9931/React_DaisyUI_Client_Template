import React, { useRef, useEffect } from 'react';
import { Chip } from '@/components';
import { getIconComponent } from '@/utils/utilityFunction';

interface SearchBarProps {
  autoFocus?: boolean;
  onBlur?: () => void;
  mobile?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  placeholder?: string;
  width?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  autoFocus,
  onBlur,
  mobile,
  value = '',
  onChange,
  onClear,
  placeholder = 'Search...',
  width = 'w-64',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Provide a default onChange if none is provided
  const handleChange = onChange || (() => {});

  return (
    <div>
      <form
        className={`
          relative flex items-center transition-all duration-300
          ${mobile ? 'w-56' : width}
        `}
        onBlur={mobile ? onBlur : undefined}
        tabIndex={-1}
        onSubmit={e => e.preventDefault()}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`
            input w-full p-5 pl-3 pr-10 input-sm
            ${mobile ? 'transition-all duration-300' : ''}
          `}
          onBlur={mobile ? onBlur : undefined}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs p-0"
          tabIndex={-1}
        >
          {getIconComponent("Search", 16, "w-4 h-4 text-base-content/70")}
        </button>
      </form>
      {value && (
        <div className="flex items-center gap-2 mt-3">
          <Chip
            variant="primary"
            size="sm"
            onRemove={onClear}
            icon={getIconComponent("Search", 12, "w-3 h-3")}
          >
            "{value}"
          </Chip>
        </div>
      )}
    </div>
  );
};