import React, { useState, useEffect } from 'react'
import { Palette, Pencil, Type, User, Maximize, Settings } from 'lucide-react'
import {
  ThemeTabHeader, ThemeTabContent, ThemeTabFooter,
  FontFamilyTabHeader, FontFamilyTabContent, FontFamilyTabFooter,
  TypographyTabHeader, TypographyTabContent, TypographyTabFooter,
  ProfileTabHeader, ProfileTabContent, ProfileTabFooter,
  Tooltip, Typography,
  PrivateNavbar, Sidebar,
  InfinitySheet
} from '@/components'
import { getIconComponent } from '@/utils'
import { useToastStore } from '@/store';

interface PrivateLayoutProps {
  children: React.ReactNode
  sidebarItems?: any[]
}

export const PrivateLayout: React.FC<PrivateLayoutProps> = ({
  children,
}) => {
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(true)
  const [activeTab, setActiveTab] = useState<'themes' | 'fonts' | 'typography' | 'profile'>('profile')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false)
  const [mobileTabOpen, setMobileTabOpen] = useState(false)

  const { addToast } = useToastStore()

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true)
        addToast({ message: 'Entered fullscreen mode', variant: 'info' })
      }).catch(() => {
        addToast({ message: 'Error attempting to enable fullscreen', variant: 'error' })
      })
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false)
        addToast({ message: 'Exited fullscreen mode', variant: 'info' })
      }).catch(() => {
        addToast({ message: 'Error attempting to exit fullscreen', variant: 'error' })
      })
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const tabHeader: Record<typeof activeTab, React.ReactNode> = {
    profile: <ProfileTabHeader />,
    themes: <ThemeTabHeader />,
    fonts: <FontFamilyTabHeader />,
    typography: <TypographyTabHeader />,
  }

  const tabContent: Record<typeof activeTab, React.ReactNode> = {
    profile: <ProfileTabContent />,
    themes: <ThemeTabContent />,
    fonts: <FontFamilyTabContent />,
    typography: <TypographyTabContent />,
  }

  const tabFooter: Record<typeof activeTab, React.ReactNode> = {
    profile: <ProfileTabFooter />,
    themes: <ThemeTabFooter />,
    fonts: <FontFamilyTabFooter />,
    typography: <TypographyTabFooter />,
  }

  const handleMobileFloatingMenuClick = (tabId: typeof activeTab) => {
    setActiveTab(tabId)
    setMobileSettingsOpen(false)
    setTimeout(() => {
      setMobileTabOpen(true)
      addToast({ message: `${tabId.charAt(0).toUpperCase() + tabId.slice(1)} tab opened`, variant: 'info' })
    }, 250)
  }

  const rightSidebarItems = [
    {
      id: 'profile',
      icon: <User className="w-5 h-5" />,
      label: 'Profile',
      onClick: () => {
        if (window.innerWidth >= 1024) {
          // Desktop behavior
          setActiveTab('profile')
          if (rightSidebarCollapsed) {
            setRightSidebarCollapsed(false)
          } else {
            setRightSidebarCollapsed(true)
          }
          addToast({ message: 'Profile tab opened', variant: 'info' })
        } else {
          // Mobile/tablet behavior - use the correct handler
          handleMobileFloatingMenuClick('profile')
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
          setActiveTab('themes')
          if (rightSidebarCollapsed) {
            setRightSidebarCollapsed(false)
          } else {
            setRightSidebarCollapsed(true)
          }
          addToast({ message: 'Themes tab opened', variant: 'info' })
        } else {
          handleMobileFloatingMenuClick('themes')
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
          setActiveTab('fonts')
          if (rightSidebarCollapsed) {
            setRightSidebarCollapsed(false)
          } else {
            setRightSidebarCollapsed(true)
          }
          addToast({ message: 'Font Family tab opened', variant: 'info' })
        } else {
          handleMobileFloatingMenuClick('fonts')
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
          setActiveTab('typography')
          if (rightSidebarCollapsed) {
            setRightSidebarCollapsed(false)
          } else {
            setRightSidebarCollapsed(true)
          }
          addToast({ message: 'Typography tab opened', variant: 'info' })
        } else {
          handleMobileFloatingMenuClick('typography')
        }
      },
      active: activeTab === 'typography' && !rightSidebarCollapsed,
    },
    {
      id: 'fullscreen',
      icon: <Maximize className="w-5 h-5" />,
      label: isFullscreen ? 'Exit Fullscreen' : 'Fullscreen',
      onClick: toggleFullscreen,
      active: false,
    },
  ]

  const handleLeftSidebarToggle = () => {
    if (!leftSidebarCollapsed) {
      setLeftSidebarCollapsed(true)
    } else {
      setLeftSidebarCollapsed(false)
    }
    addToast({ message: leftSidebarCollapsed ? 'Sidebar opened' : 'Sidebar collapsed', variant: 'info' })
  }

  const leftSidebarWidth = leftSidebarCollapsed ? 'w-16' : 'w-64'

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
            collapsed={leftSidebarCollapsed}
            onToggleCollapse={handleLeftSidebarToggle}
            side="left"
          />
        </div>

        {/* Mobile Left Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-500 ease-in-out
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar
            onClose={() => setMobileSidebarOpen(false)}
            side="left"
            showToggle={false}
          />
        </div>

        {/* Desktop Right Thin Sidebar (icon bar) */}
        <div
          className={`
            hidden lg:flex flex-col h-full fixed top-0 right-0 z-30 transition-all duration-500 ease-in-out w-16
          `}
          style={{ pointerEvents: 'auto' }}
        >
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
            <div className="mt-auto">
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
        </div>

        <InfinitySheet
          isOpen={!rightSidebarCollapsed}
          onClose={() => setRightSidebarCollapsed(true)}
          side="right"
          size="md"
          headerTitle={tabHeader[activeTab]}
          footer={tabFooter[activeTab]}
          showResizeHandle={true}
          className="hidden lg:flex"
        >
          <div className="flex-1 overflow-y-auto p-4">
            {tabContent[activeTab]}
          </div>
        </InfinitySheet>

        <InfinitySheet
          isOpen={mobileTabOpen}
          onClose={() => setMobileTabOpen(false)}
          side="bottom"
          height={400}
          headerTitle={tabHeader[activeTab]}
          footer={tabFooter[activeTab]}
          showResizeHandle={true}
          className="lg:hidden"
        >
          <div className="flex-1 overflow-y-auto p-4">
            {tabContent[activeTab]}
          </div>
        </InfinitySheet>

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

          {/* Footer */}
          <footer className="flex-shrink-0 bg-base-200 border-t border-base-300 px-6 py-[19px]">
            <div className="flex items-center justify-between flex-col md:flex-row space-y-2 md:space-y-0">
              <Typography variant="caption" className="text-base-content/60 text-xs text-center">
                © 2025 Infinity Technologies • All rights reserved • Powered by Innovation
              </Typography>
              <div className="flex space-x-3">
                <a href="#">
                  {getIconComponent("Github", 16,)}
                </a>
                <a href="#">
                  {getIconComponent("Star", 16,)}
                </a>
                <a href="#">
                  {getIconComponent("ExternalLink", 16,)}
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}