import React from 'react';
import { Link } from 'react-router-dom';

interface MenuItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  children?: MenuItem[];
}

interface MenuProps {
  items: MenuItem[];
  className?: string;
  compact?: boolean;
  horizontal?: boolean;
}

export const Menu: React.FC<MenuProps> = ({
  items,
  className = '',
  compact = false,
  horizontal = false,
}) => {
  return (
    <nav className={`menu ${className} ${horizontal ? 'horizontal' : ''}`}>
      <ul className={`menu-list ${compact ? 'compact' : ''}`}>
        {items.map((item) => (
          <li
            key={item.id}
            className={`menu-item ${item.active ? 'active' : ''} ${
              item.disabled ? 'disabled' : ''
            }`}
          >
            {item.href && !item.disabled ? (
              <Link to={item.href} className="menu-link">
                {item.label}
              </Link>
            ) : (
              <span className="menu-label">{item.label}</span>
            )}
            {item.children && item.children.length > 0 && (
              <Menu items={item.children} compact={compact} horizontal={horizontal} />
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};