import React from 'react';
import { Typography, Button } from '@/components';
import { getIconComponent } from '@/utils';
import { BaseModal } from './BaseModal';
import { ConfirmModalProps } from '../types';

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  variant = 'error',
  icon,
  ...props
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'error':
        return {
          iconColor: 'text-error',
          buttonVariant: 'error' as const,
          defaultIcon: 'AlertTriangle'
        };
      case 'warning':
        return {
          iconColor: 'text-warning',
          buttonVariant: 'warning' as const,
          defaultIcon: 'AlertTriangle'
        };
      case 'info':
        return {
          iconColor: 'text-info',
          buttonVariant: 'info' as const,
          defaultIcon: 'Info'
        };
      case 'success':
        return {
          iconColor: 'text-success',
          buttonVariant: 'success' as const,
          defaultIcon: 'CheckCircle'
        };
      default:
        return {
          iconColor: 'text-error',
          buttonVariant: 'error' as const,
          defaultIcon: 'AlertTriangle'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title} {...props}>
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 ${styles.iconColor}`}>
            {icon || getIconComponent(styles.defaultIcon, 24)}
          </div>
          <Typography variant="body1" className="flex-1">
            {message}
          </Typography>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant={styles.buttonVariant} onClick={handleConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};