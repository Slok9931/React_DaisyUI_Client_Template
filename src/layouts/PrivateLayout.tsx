import React, { useState, useEffect } from 'react';
import { Palette, Pencil, Type, Eye, User, Maximize } from 'lucide-react';
import {
  ThemeTab,
  FontFamilyTab,
  TypographyTab,
  PreviewTab,
  Tooltip, useToast,
  PrivateNavbar, ProfileTab, Sidebar, Typography
} from '@/components';

interface PrivateLayoutProps {
  children: React.ReactNode;
  sidebarItems?: any[];
}

export const PrivateLayout: React.FC<PrivateLayoutProps> = ({
  children,
  sidebarItems,
}) => {
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState<'themes' | 'fonts' | 'typography' | 'preview' | 'profile'>('themes');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { addToast } = useToast();

  useEffect(() => {
    if (!leftSidebarCollapsed && !rightSidebarCollapsed) {
      setLeftSidebarCollapsed(true);
    }
  }, [leftSidebarCollapsed, rightSidebarCollapsed]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
        addToast({ message: 'Entered fullscreen mode', variant: 'info' });
      }).catch(() => {
        addToast({ message: 'Error attempting to enable fullscreen', variant: 'error' });
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
        addToast({ message: 'Exited fullscreen mode', variant: 'info' });
      }).catch(() => {
        addToast({ message: 'Error attempting to exit fullscreen', variant: 'error' });
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const tabContent: Record<typeof activeTab, React.ReactNode> = {
    profile: <ProfileTab />,
    themes: <ThemeTab />,
    fonts: <FontFamilyTab />,
    typography: <TypographyTab />,
    preview: <PreviewTab />,
  };

  const rightSidebarItems = [
    {
      id: 'profile',
      icon: <User className="w-5 h-5" />,
      label: 'Profile',
      onClick: () => {
        setActiveTab('profile');
        if (rightSidebarCollapsed) {
          setLeftSidebarCollapsed(true);
          setRightSidebarCollapsed(false);
        } else {
          setRightSidebarCollapsed(true);
          setLeftSidebarCollapsed(false);
        }
        addToast({ message: 'Profile tab opened', variant: 'info' });
      },
      active: activeTab === 'profile' && !rightSidebarCollapsed,
    },
    {
      id: 'themes',
      icon: <Palette className="w-5 h-5" />,
      label: 'Themes',
      onClick: () => {
        setActiveTab('themes');
        if (rightSidebarCollapsed) {
          setLeftSidebarCollapsed(true);
          setRightSidebarCollapsed(false);
        } else {
          setRightSidebarCollapsed(true);
          setLeftSidebarCollapsed(false);
        }
        addToast({ message: 'Themes tab opened', variant: 'info' });
      },
      active: activeTab === 'themes' && !rightSidebarCollapsed,
    },
    {
      id: 'fonts',
      icon: <Pencil className="w-5 h-5" />,
      label: 'Font Family',
      onClick: () => {
        setActiveTab('fonts');
        if (rightSidebarCollapsed) {
          setLeftSidebarCollapsed(true);
          setRightSidebarCollapsed(false);
        } else {
          setRightSidebarCollapsed(true);
          setLeftSidebarCollapsed(false);
        }
        addToast({ message: 'Font Family tab opened', variant: 'info' });
      },
      active: activeTab === 'fonts' && !rightSidebarCollapsed,
    },
    {
      id: 'typography',
      icon: <Type className="w-5 h-5" />,
      label: 'Typography',
      onClick: () => {
        setActiveTab('typography');
        if (rightSidebarCollapsed) {
          setLeftSidebarCollapsed(true);
          setRightSidebarCollapsed(false);
        } else {
          setRightSidebarCollapsed(true);
          setLeftSidebarCollapsed(false);
        }
        addToast({ message: 'Typography tab opened', variant: 'info' });
      },
      active: activeTab === 'typography' && !rightSidebarCollapsed,
    },
    {
      id: 'preview',
      icon: <Eye className="w-5 h-5" />,
      label: 'Preview',
      onClick: () => {
        setActiveTab('preview');
        if (rightSidebarCollapsed) {
          setLeftSidebarCollapsed(true);
          setRightSidebarCollapsed(false);
        } else {
          setRightSidebarCollapsed(true);
          setLeftSidebarCollapsed(false);
        }
        addToast({ message: 'Preview tab opened', variant: 'info' });
      },
      active: activeTab === 'preview' && !rightSidebarCollapsed,
    },
    {
      id: 'fullscreen',
      icon: <Maximize className="w-5 h-5" />,
      label: isFullscreen ? 'Exit Fullscreen' : 'Fullscreen',
      onClick: toggleFullscreen,
      active: false,
    },
  ];

  const handleLeftSidebarToggle = () => {
    if (!leftSidebarCollapsed) {
      setLeftSidebarCollapsed(true);
    } else {
      setLeftSidebarCollapsed(false);
      setRightSidebarCollapsed(true);
    }
    addToast({ message: leftSidebarCollapsed ? 'Sidebar opened' : 'Sidebar collapsed', variant: 'info' });
  };

  const handleRightSidebarToggle = () => {
    if (!rightSidebarCollapsed) {
      setRightSidebarCollapsed(true);
      setLeftSidebarCollapsed(false);
    } else {
      setRightSidebarCollapsed(false);
      setLeftSidebarCollapsed(true);
    }
    addToast({ message: rightSidebarCollapsed ? 'Right sidebar opened' : 'Right sidebar collapsed', variant: 'info' });
  };

  const leftSidebarWidth = leftSidebarCollapsed ? 'w-16' : 'w-64';

  return (
    <div className="min-h-screen bg-base-200 z-40">
      {/* Mobile Overlays */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      {!rightSidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setRightSidebarCollapsed(true)}
        />
      )}

      <div className="flex h-screen">
        {/* Left Sidebar */}
        <div className={`hidden lg:block ${leftSidebarWidth} flex-shrink-0 transition-all duration-300 ease-in-out`}>
          <Sidebar
            items={sidebarItems}
            collapsed={leftSidebarCollapsed}
            onToggleCollapse={handleLeftSidebarToggle}
            authLogout={true}
            side="left"
          />
        </div>

        {/* Mobile Left Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar
            items={sidebarItems}
            onClose={() => setMobileSidebarOpen(false)}
            side="left"
            showToggle={false}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out mr-16">
          {/* Navbar */}
          <div className="flex-shrink-0">
            <PrivateNavbar
              onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              sidebarCollapsed={leftSidebarCollapsed}
            />
          </div>
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-base-100">
            {children}
          </main>
        </div>

        {/* Desktop Right Sidebar (flex child, not fixed/absolute) */}
        <div
          className={`
            hidden lg:flex flex-col h-full fixed top-0 right-0 z-30 transition-all duration-300 ease-in-out w-16
          `}
          style={{ pointerEvents: 'auto' }}
        >
          {/* Icon bar - always visible */}
          <div className="w-16 flex-shrink-0 h-full flex flex-col items-center py-4 bg-base-100 border-l border-base-300 shadow-lg">
            <div className="flex flex-col flex-1 items-center">
              {rightSidebarItems
                .filter(item => item.id !== 'fullscreen')
                .map(item => (
                  <Tooltip key={item.id} tip={item.label} position="left">
                    <button
                      className={`
                        mb-2 p-2 rounded-lg flex items-center justify-center transition-colors w-10 h-10 cursor-pointer
                        ${(activeTab === item.id && !rightSidebarCollapsed) ? 'bg-primary text-primary-content' : 'hover:bg-base-200'}
                      `}
                      title={item.label}
                      onClick={item.onClick}
                    >
                      {item.icon}
                    </button>
                  </Tooltip>
                ))}
            </div>
            <div className="mt-auto mb-2">
              {rightSidebarItems
                .filter(item => item.id === 'fullscreen')
                .map(item => (
                  <Tooltip key={item.id} tip={item.label} position="left">
                    <button
                      className={`
                        p-2 rounded-lg flex items-center justify-center transition-colors w-10 h-10 cursor-pointer
                        ${isFullscreen ? 'bg-primary text-primary-content' : 'hover:bg-base-200'}
                      `}
                      title={item.label}
                      onClick={item.onClick}
                    >
                      {item.icon}
                    </button>
                  </Tooltip>
                ))}
            </div>
          </div>
          <div
            className={`
              bg-base-100 border-l border-base-300 shadow-lg h-full transition-all duration-300 ease-in-out
              ${rightSidebarCollapsed ? 'w-0' : 'w-[404px]'}
              overflow-hidden flex flex-col absolute top-0 right-16
            `}
          >
            {!rightSidebarCollapsed && (
              <>
                <div className="flex items-center justify-between p-4 border-b border-base-300 h-16 flex-shrink-0">
                  <Typography variant="h5" className="font-semibold">
                    {rightSidebarItems.find(item => item.id === activeTab)?.label}
                  </Typography>
                  <button
                    onClick={handleRightSidebarToggle}
                    className="btn btn-ghost btn-sm btn-circle transition-transform duration-200 hover:scale-110"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                  {tabContent[activeTab]}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};