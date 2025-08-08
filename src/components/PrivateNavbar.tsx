import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Breadcrumbs, SearchBar, Typography } from '@/components';
import { AlignCenter, Search } from 'lucide-react';

interface SidebarItem {
  id: string;
  label?: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  children?: SidebarItem[];
  badge?: string | number;
  active?: boolean;
}

interface PrivateNavbarProps {
  onToggleSidebar?: () => void;
  sidebarCollapsed?: boolean;
  className?: string;
  breadcrumbs?: { label: string; href?: string; current?: boolean }[];
  leftSidebarItems?: SidebarItem[];
  leftSidebarActiveTab?: string;
}

function getBreadcrumbsFromPath(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = segments.map((seg, idx) => {
    const label = seg.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return {
      label,
      href: '/' + segments.slice(0, idx + 1).join('/'),
      current: idx === segments.length - 1,
    };
  });
  return breadcrumbs;
}

export const PrivateNavbar: React.FC<PrivateNavbarProps> = ({
  onToggleSidebar,
  className = '',
  breadcrumbs: _breadcrumbs = [],
}) => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const location = useLocation();

  const breadcrumbs = getBreadcrumbsFromPath(location.pathname);

  const pageName = localStorage.getItem('pageName') || ''

  return (
    <div className={`navbar bg-base-100 border-b border-base-300 min-h-16 sticky top-0 z-20 px-6 ${className}`}>
      {/* Navbar Start */}
      <div className="navbar-start gap-1 min-w-0">
        <button
          onClick={onToggleSidebar}
          className={`btn btn-ghost btn-square lg:hidden
            ${mobileSearchOpen ? 'opacity-50' : 'opacity-100'}`}
          aria-label="Toggle sidebar"
        >
          <AlignCenter className="w-5 h-5" />
        </button>
        <div className="flex flex-col">
          <Typography
            variant="h5"
            className="hidden lg:block font-bold text-primary truncate max-w-[8rem] sm:max-w-xs lg:max-w-sm"
          >
            {pageName}
          </Typography>
          <div className="hidden lg:flex items-center min-w-0">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        </div>
      </div>

      <div className="navbar-center">
        {/* Dashboard Name (mobile only, hide if search is open) */}
        <Typography
          variant="h3"
          className={`
            lg:hidden font-bold text-primary transition-all duration-100 font-courgette
            ${mobileSearchOpen ? 'opacity-50' : 'opacity-100 w-auto'}
          `}
        >
          Infinity
        </Typography>
      </div>

      {/* Navbar End */}
      <div className="navbar-end">
        <div className="hidden md:block">
          <SearchBar />
        </div>
        <div className="md:hidden flex items-center">
          {mobileSearchOpen ? (
            <div className="w-full transition-all duration-300">
              <SearchBar
                autoFocus
                onBlur={() => setMobileSearchOpen(false)}
                mobile
              />
            </div>
          ) : (
            <button
              className="btn btn-ghost btn-square"
              onClick={() => setMobileSearchOpen(true)}
              aria-label="Open search"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};