import React from 'react';
import { PublicNavbar } from '@/components';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({
  children,
}) => {
  return (
    <div className="h-screen bg-base-200 overflow-hidden">
      <PublicNavbar />
      <main className="h-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
};