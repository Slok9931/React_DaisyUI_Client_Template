import React, { useState, useEffect } from 'react';

type ToastVariant = 'info' | 'success' | 'warning' | 'error';
type ToastPosition = 'top-start' | 'top-center' | 'top-end' | 'bottom-start' | 'bottom-center' | 'bottom-end';

interface Toast {
  id: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastProps extends Toast {
  onClose: (id: string) => void;
}

interface ToastContainerProps {
  position?: ToastPosition;
  className?: string;
}

const ToastItem: React.FC<ToastProps> = ({
  id,
  message,
  variant = 'info',
  duration = 5000,
  onClose,
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const alertClasses = [
    'alert',
    `alert-${variant}`,
    'shadow-lg'
  ].join(' ');

  return (
    <div className={alertClasses}>
      <span>{message}</span>
      <button
        className="btn btn-sm btn-circle btn-ghost"
        onClick={() => onClose(id)}
      >
        ✕
      </button>
    </div>
  );
};

export const ToastContainer: React.FC<ToastContainerProps & { toasts: Toast[] }> = ({
  toasts,
  position = 'top-end',
  className = '',
}) => {
  const [toastList, setToastList] = useState<Toast[]>(toasts);

  useEffect(() => {
    setToastList(toasts);
  }, [toasts]);

  const handleClose = (id: string) => {
    setToastList(prev => prev.filter(toast => toast.id !== id));
  };

  const positionClasses = {
    'top-start': 'toast-top toast-start',
    'top-center': 'toast-top toast-center',
    'top-end': 'toast-top toast-end',
    'bottom-start': 'toast-bottom toast-start',
    'bottom-center': 'toast-bottom toast-center',
    'bottom-end': 'toast-bottom toast-end',
  };

  return (
    <div className={`toast ${positionClasses[position]} ${className}`}>
      {toastList.map((toast) => (
        <ToastItem
          key={toast.id}
          {...toast}
          onClose={handleClose}
        />
      ))}
    </div>
  );
};

// Hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return { toasts, addToast, removeToast };
};