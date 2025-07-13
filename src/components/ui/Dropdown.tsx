import React, { useState, useRef, useEffect } from 'react';

interface DropdownItem {
  label: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  divider?: boolean;
  icon?: React.ReactNode;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  position?: 'left' | 'right' | 'top' | 'bottom';
  hover?: boolean;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  position = 'bottom',
  hover = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const positionClasses = {
    left: 'dropdown-left',
    right: 'dropdown-end',
    top: 'dropdown-top',
    bottom: '',
  };

  const dropdownClasses = [
    'dropdown',
    positionClasses[position],
    hover && 'dropdown-hover',
    className
  ].filter(Boolean).join(' ');

  const handleTriggerClick = () => {
    if (!hover) {
      setIsOpen(!isOpen);
    }
  };

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled) {
      item.onClick?.();
      setIsOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} className={dropdownClasses}>
      <div tabIndex={0} role="button" onClick={handleTriggerClick}>
        {trigger}
      </div>
      {(isOpen || hover) && (
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          {items.map((item, index) => {
            if (item.divider) {
              return <li key={index}><div className="divider my-0"></div></li>;
            }

            return (
              <li key={index}>
                <a
                  className={`flex items-center ${item.disabled ? 'disabled' : ''}`}
                  onClick={() => handleItemClick(item)}
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};