import React from 'react';

interface DrawerProps {
  children: React.ReactNode;
  sidebarContent: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  side?: 'left' | 'right';
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  children,
  sidebarContent,
  isOpen,
  onClose,
  side = 'left',
  className = '',
}) => {
  const drawerClasses = [
    'drawer',
    side === 'right' && 'drawer-end',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={drawerClasses}>
      <input
        id="drawer-toggle"
        type="checkbox"
        className="drawer-toggle"
        checked={isOpen}
        onChange={onClose}
      />
      <div className="drawer-content flex flex-col">
        {children}
      </div>
      <div className="drawer-side">
        <label htmlFor="drawer-toggle" className="drawer-overlay"></label>
        <aside className="min-h-full w-80 bg-base-200 text-base-content">
          {sidebarContent}
        </aside>
      </div>
    </div>
  );
};