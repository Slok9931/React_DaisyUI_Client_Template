import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <div className={`text-sm breadcrumbs ${className}`}>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.href && !item.current ? (
              <Link to={item.href}>{item.label}</Link>
            ) : (
              <span className={item.current ? 'font-semibold' : ''}>{item.label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};