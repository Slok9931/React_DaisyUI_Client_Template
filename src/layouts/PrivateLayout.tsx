import React, { useState } from 'react';
import { PrivateNavbar, Sidebar } from '@/components';

interface PrivateLayoutProps {
  children: React.ReactNode;
  sidebarItems?: any[];
}

export const PrivateLayout: React.FC<PrivateLayoutProps> = ({
  children,
  sidebarItems,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            items={sidebarItems}
            collapsed={sidebarCollapsed}
            onToggleCollapse={toggleSidebar}
          />
        </div>

        {/* Mobile Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar
            items={sidebarItems}
            onToggleCollapse={() => setMobileSidebarOpen(false)}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navbar */}
          <PrivateNavbar
            onToggleSidebar={toggleMobileSidebar}
            sidebarCollapsed={sidebarCollapsed}
          />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};