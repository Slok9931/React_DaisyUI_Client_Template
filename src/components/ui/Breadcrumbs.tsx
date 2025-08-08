import React from 'react';

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
              <span className={item.current ? 'font-semibold' : ''}>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};