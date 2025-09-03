import React, { useState } from 'react';

interface CollapseProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  isCollapseArrow?: boolean
}

export const Collapse: React.FC<CollapseProps> = ({
  title,
  children,
  defaultOpen = false,
  className = '',
  isCollapseArrow = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const collapseClasses = [
    'collapse',
    isCollapseArrow? 'collapse-arrow':'',
    'bg-base-200',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={collapseClasses}>
      <input
        type="checkbox"
        checked={isOpen}
        onChange={(e) => setIsOpen(e.target.checked)}
      />
      <div className="collapse-title text-xl font-medium">
        {title}
      </div>
      <div className="collapse-content">
        {children}
      </div>
    </div>
  );
};