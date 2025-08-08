import React, { useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  autoFocus?: boolean;
  onBlur?: () => void;
  mobile?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ autoFocus, onBlur, mobile }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <form
      className={`
        relative flex items-center transition-all duration-300
        ${mobile ? 'w-56' : 'w-64'}
      `}
      onBlur={mobile ? onBlur : undefined}
      tabIndex={-1}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Search infinite possibilities..."
        className={`
          input w-full pr-10 input-sm
          ${mobile ? 'transition-all duration-300' : ''}
        `}
        onBlur={mobile ? onBlur : undefined}
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs p-0"
        tabIndex={-1}
      >
        <Search className="w-4 h-4 text-base-content/70" />
      </button>
    </form>
  );
};