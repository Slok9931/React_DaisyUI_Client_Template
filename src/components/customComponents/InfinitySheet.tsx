import React, { useRef, useState, useEffect } from "react";

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
  sheetTitle?: React.ReactNode;
}

export const InfinitySheet: React.FC<InfinitySheetProps> = ({
  isOpen,
  onClose,
  side = "right",
  width = 400,
  height = 400,
  minWidth = 240,
  maxWidth = 800,
  minHeight = 240,
  maxHeight = 800,
  children,
  className = "",
  showResizeHandle = true,
  sheetTitle,
}) => {
  const [sheetWidth, setSheetWidth] = useState(width);
  const [sheetHeight, setSheetHeight] = useState(height);
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
      }, 3500);
    }

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const startPos = useRef<number>(0);
  const startSize = useRef<number>(side === "left" || side === "right" ? width : height);

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

  // Enhanced backdrop styles
  const backdropClass = `
    fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm
    transition-all duration-300 ease-out
    ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}
  `;

  // Enhanced sheet styles
  const sheetBaseClass = `
    fixed z-[9999] bg-gradient-to-br from-base-100 to-base-200/50 backdrop-blur-xl shadow-2xl border border-base-300/20 flex flex-col transition-all duration-500 ease-out will-change-transform
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

  // Enhanced resize handle styles (DaisyUI diff style)
  const resizeHandleClass = (() => {
    // DaisyUI diff style: dashed border, subtle handle
    const baseClasses =
      "absolute z-10 group transition-all duration-200 bg-transparent";
    switch (side) {
      case "right":
        return `${baseClasses} -left-2 top-0 h-full w-3 cursor-ew-resize border-l-2 border-dashed border-base-300/70 hover:border-primary/60`;
      case "left":
        return `${baseClasses} -right-2 top-0 h-full w-3 cursor-ew-resize border-r-2 border-dashed border-base-300/70 hover:border-primary/60`;
      case "top":
        return `${baseClasses} -bottom-2 left-0 w-full h-3 cursor-ns-resize border-b-2 border-dashed border-base-300/70 hover:border-primary/60`;
      case "bottom":
        return `${baseClasses} -top-2 left-0 w-full h-3 cursor-ns-resize border-t-2 border-dashed border-base-300/70 hover:border-primary/60`;
      default:
        return "";
    }
  })();

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

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
        <div className="flex items-center justify-between p-6 border-b border-base-300/30 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="font-semibold text-lg">
              {sheetTitle || "Infinity Sheet"}
            </div>
          </div>
          
          <button
            className="btn btn-ghost btn-sm btn-circle hover:bg-error/10 hover:text-error transition-all duration-200 group"
            onClick={onClose}
            aria-label="Close Sheet"
          >
            <svg 
              className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-4">
            {children}
          </div>
        </div>
        
        {showResizeHandle && (
          <div
            className={resizeHandleClass}
            onMouseDown={handleResizeMouseDown}
            role="separator"
            aria-orientation={side === "left" || side === "right" ? "vertical" : "horizontal"}
            tabIndex={0}
            aria-label={`Resize ${side} panel`}
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {(side === "left" || side === "right") ? (
                <span className="w-4 h-8 bg-primary rounded-full"></span>
              ) : (
                <span className="h-4 w-8 bg-primary rounded-full"></span>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
};