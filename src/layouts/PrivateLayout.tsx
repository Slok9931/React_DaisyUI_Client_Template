import React, { useState, useEffect } from 'react';
import { Palette, Pencil, Type, Eye, User, Maximize, Settings } from 'lucide-react';
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
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);
  const [mobileTabOpen, setMobileTabOpen] = useState(false);

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

  const handleMobileFloatingMenuClick = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    setMobileSettingsOpen(false);
    setTimeout(() => {
      setMobileTabOpen(true);
      addToast({ message: `${tabId.charAt(0).toUpperCase() + tabId.slice(1)} tab opened`, variant: 'info' });
    }, 250);
  };

  const rightSidebarItems = [
    {
      id: 'profile',
      icon: <User className="w-5 h-5" />,
      label: 'Profile',
      onClick: () => {
        if (window.innerWidth >= 1024) {
          // Desktop behavior
          setActiveTab('profile');
          if (rightSidebarCollapsed) {
            setLeftSidebarCollapsed(true);
            setRightSidebarCollapsed(false);
          } else {
            setRightSidebarCollapsed(true);
            setLeftSidebarCollapsed(false);
          }
          addToast({ message: 'Profile tab opened', variant: 'info' });
        } else {
          // Mobile/tablet behavior - use the correct handler
          handleMobileFloatingMenuClick('profile');
        }
      },
      active: activeTab === 'profile' && !rightSidebarCollapsed,
    },
    {
      id: 'themes',
      icon: <Palette className="w-5 h-5" />,
      label: 'Themes',
      onClick: () => {
        if (window.innerWidth >= 1024) {
          setActiveTab('themes');
          if (rightSidebarCollapsed) {
            setLeftSidebarCollapsed(true);
            setRightSidebarCollapsed(false);
          } else {
            setRightSidebarCollapsed(true);
            setLeftSidebarCollapsed(false);
          }
          addToast({ message: 'Themes tab opened', variant: 'info' });
        } else {
          handleMobileFloatingMenuClick('themes');
        }
      },
      active: activeTab === 'themes' && !rightSidebarCollapsed,
    },
    {
      id: 'fonts',
      icon: <Pencil className="w-5 h-5" />,
      label: 'Font Family',
      onClick: () => {
        if (window.innerWidth >= 1024) {
          setActiveTab('fonts');
          if (rightSidebarCollapsed) {
            setLeftSidebarCollapsed(true);
            setRightSidebarCollapsed(false);
          } else {
            setRightSidebarCollapsed(true);
            setLeftSidebarCollapsed(false);
          }
          addToast({ message: 'Font Family tab opened', variant: 'info' });
        } else {
          handleMobileFloatingMenuClick('fonts');
        }
      },
      active: activeTab === 'fonts' && !rightSidebarCollapsed,
    },
    {
      id: 'typography',
      icon: <Type className="w-5 h-5" />,
      label: 'Typography',
      onClick: () => {
        if (window.innerWidth >= 1024) {
          setActiveTab('typography');
          if (rightSidebarCollapsed) {
            setLeftSidebarCollapsed(true);
            setRightSidebarCollapsed(false);
          } else {
            setRightSidebarCollapsed(true);
            setLeftSidebarCollapsed(false);
          }
          addToast({ message: 'Typography tab opened', variant: 'info' });
        } else {
          handleMobileFloatingMenuClick('typography');
        }
      },
      active: activeTab === 'typography' && !rightSidebarCollapsed,
    },
    {
      id: 'preview',
      icon: <Eye className="w-5 h-5" />,
      label: 'Preview',
      onClick: () => {
        if (window.innerWidth >= 1024) {
          setActiveTab('preview');
          if (rightSidebarCollapsed) {
            setLeftSidebarCollapsed(true);
            setRightSidebarCollapsed(false);
          } else {
            setRightSidebarCollapsed(true);
            setLeftSidebarCollapsed(false);
          }
          addToast({ message: 'Preview tab opened', variant: 'info' });
        } else {
          handleMobileFloatingMenuClick('preview');
        }
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
      {mobileSidebarOpen && !mobileSettingsOpen && !mobileTabOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/45 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      {mobileSettingsOpen && !mobileSidebarOpen && !mobileTabOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden pointer-events-none"
          // No onClick here, so it doesn't block clicks!
        />
      )}
      {mobileTabOpen && !mobileSidebarOpen && !mobileSettingsOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileTabOpen(false)}
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
          fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-500 ease-in-out
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar
            items={sidebarItems}
            onClose={() => setMobileSidebarOpen(false)}
            side="left"
            showToggle={false}
          />
        </div>

        {/* Mobile Tab Modal */}
        <div className={`
          fixed inset-x-0 bottom-0 z-50 lg:hidden transition-all duration-500 ease-in-out
          ${mobileTabOpen ? 'translate-y-0' : 'translate-y-full'}
        `}>
          <div className="bg-base-100 rounded-t-3xl shadow-2xl border-t border-base-300 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-base-300 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  {rightSidebarItems.find(item => item.id === activeTab)?.icon}
                </div>
                <Typography variant="h6" className="font-semibold">
                  {rightSidebarItems.find(item => item.id === activeTab)?.label}
                </Typography>
              </div>
              <Tooltip tip="Close" position="left">
                <button
                  onClick={() => setMobileTabOpen(false)}
                  className="btn btn-ghost btn-sm btn-circle transition-transform duration-200 hover:scale-110 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </Tooltip>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {tabContent[activeTab]}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 transition-all duration-500 ease-in-out lg:mr-16">
          {/* Navbar */}
          <div className="flex-shrink-0">
            <PrivateNavbar
              onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              sidebarCollapsed={leftSidebarCollapsed}
            />
          </div>
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-base-100 relative">
            {children}
            
            {/* Mobile Floating Settings Button */}
            <div className="lg:hidden">
              {/* Settings Button */}
              <Tooltip tip={mobileSettingsOpen ? "Close Settings" : "Open Settings"} position="left">
                <button
                  onClick={() => setMobileSettingsOpen(!mobileSettingsOpen)}
                  className={`
                    fixed bottom-6 right-6 z-30 w-14 h-14 bg-primary text-primary-content rounded-full shadow-lg cursor-pointer
                    flex items-center justify-center transition-all duration-500 hover:scale-110
                    ${mobileSettingsOpen ? '' : 'animate-spin'}
                  `}
                >
                  {mobileSettingsOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <Settings className="w-6 h-6" />
                  )}
                </button>
              </Tooltip>

              {/* Floating Menu Icons */}
              {mobileSettingsOpen && (
                <div className="fixed bottom-24 right-[1.75rem] z-30 flex flex-col space-y-3">
                  {rightSidebarItems
                    .filter(item => item.id !== 'fullscreen' && item.id !== 'preview')
                    .map((item, index) => (
                      <div
                        key={item.id}
                        className={`
                          transform transition-all duration-500 ease-out pointer-events-auto
                          ${mobileSettingsOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}
                        `}
                        style={{ transitionDelay: `${index * 100}ms` }}
                      >
                        <Tooltip tip={item.label} position="left">
                          <button
                            onClick={() => handleMobileFloatingMenuClick(item.id as typeof activeTab)}
                            className={`
                              w-12 h-12 rounded-full shadow-lg flex items-center justify-center cursor-pointer
                              transition-all duration-300 hover:scale-110 border border-primary
                              ${(activeTab === item.id && mobileTabOpen) 
                                ? 'bg-primary text-primary-content scale-110' 
                                : 'bg-base-100 text-base-content hover:bg-primary hover:text-primary-content'
                              }
                            `}
                            title={item.label}
                          >
                            {item.icon}
                          </button>
                        </Tooltip>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Desktop Right Sidebar */}
        <div
          className={`
            hidden lg:flex flex-col h-full fixed top-0 right-0 z-30 transition-all duration-500 ease-in-out w-16
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
                        mb-2 p-2 rounded-lg flex items-center justify-center transition-all duration-300 w-10 h-10 cursor-pointer
                        ${(activeTab === item.id && !rightSidebarCollapsed) ? 'bg-primary text-primary-content scale-110' : 'hover:bg-base-200 hover:scale-105'}
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
                        p-2 rounded-lg flex items-center justify-center transition-all duration-300 w-10 h-10 cursor-pointer
                        ${isFullscreen ? 'bg-primary text-primary-content scale-110' : 'hover:bg-base-200 hover:scale-105'}
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
              bg-base-100 border-l border-base-300 shadow-lg h-full transition-all duration-500 ease-in-out
              ${rightSidebarCollapsed ? 'w-0 opacity-0' : 'w-[404px] opacity-100'}
              overflow-hidden flex flex-col absolute top-0 right-16
            `}
          >
            {!rightSidebarCollapsed && (
              <>
                <div className="flex items-center justify-between p-4 border-b border-base-300 h-16 flex-shrink-0">
                  <Typography variant="h5" className="font-semibold">
                    {rightSidebarItems.find(item => item.id === activeTab)?.label}
                  </Typography>
                  <Tooltip tip="Close Sidebar" position="left">
                    <button
                      onClick={handleRightSidebarToggle}
                      className="btn btn-ghost btn-sm btn-circle transition-transform duration-200 hover:scale-110 cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </Tooltip>
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