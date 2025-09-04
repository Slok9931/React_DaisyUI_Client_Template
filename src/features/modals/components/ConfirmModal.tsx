import React from 'react';
import { BaseModal } from './BaseModal';
import { Button, Typography } from '@/components';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<void> | void;
  variant?: 'primary' | 'error' | 'warning' | 'success';
  icon?: React.ReactNode;
  loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  variant = 'primary',
  icon,
  loading = false,
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      // Error handling is done at the component level
      console.error('Confirmation error:', error);
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'error':
        return 'btn-error';
      case 'warning':
        return 'btn-warning';
      case 'success':
        return 'btn-success';
      default:
        return 'btn-primary';
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-6">
        {/* Icon and Message */}
        <div className="text-center space-y-4">
          {icon && (
            <div className="flex justify-center">
              <div className={`p-3 rounded-full ${
                variant === 'error' ? 'bg-error/10 text-error' :
                variant === 'warning' ? 'bg-warning/10 text-warning' :
                variant === 'success' ? 'bg-success/10 text-success' :
                'bg-primary/10 text-primary'
              }`}>
                {icon}
              </div>
            </div>
          )}
          <Typography variant="body1" className="text-center">
            {message}
          </Typography>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            className={getVariantClasses()}
            onClick={handleConfirm}
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};