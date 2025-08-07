import React, { useRef, useState, useEffect } from "react";
import { Typography } from "@/components";

type SheetSide = "left" | "right" | "top" | "bottom";

interface InfinitySheetProps {
  isOpen: boolean;
  onClose: () => void;
  side?: SheetSide;
  width?: number;
  height?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  children: React.ReactNode;
  className?: string;
  showResizeHandle?: boolean;
  headerIcon?: React.ReactNode;
  headerTitle?: React.ReactNode;
  headerSubtitle?: React.ReactNode;
  headerActions?: React.ReactNode;
  showCloseButton?: boolean;
  headerClassName?: string;
  footer?: React.ReactNode;
  footerClassName?: string;
  contentClassName?: string;
  scrollable?: boolean;
  overlayClosable?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  variant?: "default" | "blur" | "glass";
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export const InfinitySheet: React.FC<InfinitySheetProps> = ({
  isOpen,
  onClose,
  side = "right",
  width = 400,
  height = 400,
  minWidth = 240,
  maxWidth = 1600,
  minHeight = 240,
  maxHeight = 1600,
  children,
  className = "",
  showResizeHandle = true,
  headerIcon,
  headerTitle = "Sheet",
  headerSubtitle,
  headerActions,
  showCloseButton = true,
  headerClassName = "",
  footer,
  footerClassName = "",
  contentClassName = "",
  scrollable = true,
  overlayClosable = true,
  showHeader = true,
  showFooter = !!footer,
  variant = "default",
  size = "lg",
}) => {
  // Size presets
  const sizePresets = {
    sm: { width: 320, height: 320 },
    md: { width: 400, height: 400 },
    lg: { width: 600, height: 600 },
    xl: { width: 800, height: 800 },
    full: { width: window?.innerWidth * 0.9 || 800, height: window?.innerHeight * 0.9 || 600 }
  };

  const initialWidth = sizePresets[size]?.width || width;
  const initialHeight = sizePresets[size]?.height || height;

  const [sheetWidth, setSheetWidth] = useState(initialWidth);
  const [sheetHeight, setSheetHeight] = useState(initialHeight);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const resizing = useRef(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
      animationTimeoutRef.current = setTimeout(() => {
        setShouldRender(false);
      }, 350);
    }

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const startPos = useRef<number>(0);
  const startSize = useRef<number>(side === "left" || side === "right" ? initialWidth : initialHeight);

  const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    resizing.current = true;
    
    if (side === "left" || side === "right") {
      startPos.current = e.clientX;
      startSize.current = sheetWidth;
    } else {
      startPos.current = e.clientY;
      startSize.current = sheetHeight;
    }
    
    document.body.style.cursor = side === "left" || side === "right" ? "ew-resize" : "ns-resize";
    document.body.style.userSelect = "none";
    
    window.addEventListener("mousemove", handleResizeMouseMove);
    window.addEventListener("mouseup", handleResizeMouseUp);
  };

  const handleResizeMouseMove = (e: MouseEvent) => {
    if (!resizing.current) return;
    
    if (side === "right") {
      const delta = startPos.current - e.clientX;
      const newWidth = Math.min(Math.max(startSize.current + delta, minWidth), maxWidth);
      setSheetWidth(newWidth);
    } else if (side === "left") {
      const delta = e.clientX - startPos.current;
      const newWidth = Math.min(Math.max(startSize.current + delta, minWidth), maxWidth);
      setSheetWidth(newWidth);
    } else if (side === "top") {
      const delta = e.clientY - startPos.current;
      const newHeight = Math.min(Math.max(startSize.current + delta, minHeight), maxHeight);
      setSheetHeight(newHeight);
    } else if (side === "bottom") {
      const delta = startPos.current - e.clientY;
      const newHeight = Math.min(Math.max(startSize.current + delta, minHeight), maxHeight);
      setSheetHeight(newHeight);
    }
  };

  const handleResizeMouseUp = () => {
    resizing.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    window.removeEventListener("mousemove", handleResizeMouseMove);
    window.removeEventListener("mouseup", handleResizeMouseUp);
  };

  // Variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case "blur":
        return "bg-base-200/80 backdrop-blur-xl border-base-300/30";
      case "glass":
        return "bg-base-100/20 backdrop-blur-md border-base-content/10 shadow-lg";
      default:
        return "bg-base-200 border-base-300/20";
    }
  };

  // Enhanced backdrop styles
  const backdropClass = `
    fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm
    transition-all duration-300 ease-out
    ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}
  `;

  // Enhanced sheet styles
  const sheetBaseClass = `
    fixed z-[9999] ${getVariantStyles()} shadow-2xl border flex flex-col 
    transition-all duration-500 ease-out will-change-transform
    ${className}
  `;

  const sheetPositionClass = (() => {
    switch (side) {
      case "right":
        return "top-0 right-0 h-full";
      case "left":
        return "top-0 left-0 h-full";
      case "top":
        return "left-0 top-0 w-full";
      case "bottom":
        return "left-0 bottom-0 w-full";
      default:
        return "";
    }
  })();

  const sheetTransformClass = (() => {
    switch (side) {
      case "right":
        return isVisible ? "translate-x-0" : "translate-x-full";
      case "left":
        return isVisible ? "translate-x-0" : "-translate-x-full";
      case "top":
        return isVisible ? "translate-y-0" : "-translate-y-full";
      case "bottom":
        return isVisible ? "translate-y-0" : "translate-y-full";
      default:
        return "";
    }
  })();

  const sheetStyles: React.CSSProperties = (() => {
    switch (side) {
      case "right":
      case "left":
        return {
          width: sheetWidth,
          height: "100vh",
        };
      case "top":
      case "bottom":
        return {
          width: "100vw",
          height: sheetHeight,
        };
      default:
        return {};
    }
  })();

  // Enhanced resize handle styles
  const resizeHandleClass = (() => {
    const baseClasses =
      "absolute z-10 group transition-all duration-200 bg-transparent";
    switch (side) {
      case "right":
        return `${baseClasses} -left-2 top-0 h-full w-4 cursor-ew-resize border-l-2 border-dashed border-base-300/50 hover:border-primary/80`;
      case "left":
        return `${baseClasses} -right-2 top-0 h-full w-4 cursor-ew-resize border-r-2 border-dashed border-base-300/50 hover:border-primary/80`;
      case "top":
        return `${baseClasses} -bottom-2 left-0 w-full h-4 cursor-ns-resize border-b-2 border-dashed border-base-300/50 hover:border-primary/80`;
      case "bottom":
        return `${baseClasses} -top-2 left-0 w-full h-4 cursor-ns-resize border-t-2 border-dashed border-base-300/50 hover:border-primary/80`;
      default:
        return "";
    }
  })();

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (overlayClosable && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  return (
    <>
      <div
        className={backdropClass}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      
      <aside
        className={`${sheetBaseClass} ${sheetPositionClass} ${sheetTransformClass}`}
        style={sheetStyles}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        {/* Header */}
        {showHeader && (
          <div className={`flex items-center justify-between p-4 border-b-2 border-base-100 backdrop-blur-sm shrink-0 ${headerClassName}`}>
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {headerIcon && (
                <div className="flex-shrink-0 w-6 h-6 text-primary">
                  {headerIcon}
                </div>
              )}
              
              <div className="min-w-0 flex-1">
                {headerTitle && (
                  <Typography variant="h5" className="font-semibold text-base-content truncate">
                    {headerTitle}
                  </Typography>
                )}
                {headerSubtitle && (
                  <Typography variant="body2" className="text-base-content/70 truncate">
                    {headerSubtitle}
                  </Typography>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              {headerActions}
              
              {showCloseButton && (
                <button
                  className="btn btn-ghost btn-sm btn-circle hover:btn-error group"
                  onClick={onClose}
                  aria-label="Close Sheet"
                >
                  <svg 
                    className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Content */}
        <div className={`flex-1 min-h-0 ${scrollable ? 'overflow-auto' : 'overflow-hidden'} ${contentClassName}`}>
          <div className="p-6">
            {children}
          </div>
        </div>
        
        {/* Footer */}
        {showFooter && footer && (
          <div className={`border-t border-base-300/50 backdrop-blur-sm shrink-0 p-4 ${footerClassName}`}>
            <Typography variant="body2">{footer}</Typography>
          </div>
        )}
        
        {/* Resize Handle */}
        {showResizeHandle && (
          <div
            className={resizeHandleClass}
            onMouseDown={handleResizeMouseDown}
            role="separator"
            aria-orientation={side === "left" || side === "right" ? "vertical" : "horizontal"}
            tabIndex={0}
            aria-label={`Resize ${side} panel`}
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              {(side === "left" || side === "right") ? (
                <div className="w-1 h-8 bg-primary rounded-full"></div>
              ) : (
                <div className="h-1 w-8 bg-primary rounded-full"></div>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
};