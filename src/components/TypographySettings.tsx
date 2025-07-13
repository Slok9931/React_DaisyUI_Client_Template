import React, { useState } from 'react';
import { TypographyCustomizer } from './TypographyCustomizer';

export const TypographySettings: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-outline btn-sm"
        title="Typography Settings"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
        <span className="hidden sm:inline">Typography</span>
      </button>

      <TypographyCustomizer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};