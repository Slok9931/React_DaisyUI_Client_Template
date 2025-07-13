import React from 'react';
import { PublicNavbar } from '@/components';

interface PublicLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({
  children,
  showNavbar = true,
}) => {
  return (
    <div className="min-h-screen bg-base-200">
      {showNavbar && <PublicNavbar />}
      <main className={showNavbar ? 'pt-16' : ''}>
        {children}
      </main>
    </div>
  );
};