import React, { useEffect } from 'react';
import { useToastStore } from '@/store/ToastProvider';

const Toast: React.FC<{
  message: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  onClose: () => void;
}> = ({ message, variant = 'info', duration = 5000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`alert ${getVariantClass(variant)} shadow-lg animate-slide-in`}>
      <div className="flex items-center justify-between w-full">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost ml-2"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

const getVariantClass = (variant: string) => {
  switch (variant) {
    case 'success': return 'alert-success';
    case 'error': return 'alert-error';
    case 'warning': return 'alert-warning';
    default: return 'alert-info';
  }
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          variant={toast.variant}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};