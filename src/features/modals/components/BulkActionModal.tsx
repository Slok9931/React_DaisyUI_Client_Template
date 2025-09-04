import React from 'react';
import { Typography, Button } from '@/components';
import { getIconComponent } from '@/utils';
import { BaseModal } from './BaseModal';
import { BulkActionModalProps } from '../types';

export const BulkActionModal: React.FC<BulkActionModalProps> = ({
  isOpen,
  onClose,
  title,
  count,
  action,
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
          defaultIcon: 'Trash2'
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
      default:
        return {
          iconColor: 'text-error',
          buttonVariant: 'error' as const,
          defaultIcon: 'Trash2'
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
          <div className="flex-1">
            <Typography variant="body1">
              Are you sure you want to {action.toLowerCase()} <strong>{count}</strong> item(s)?
            </Typography>
            <Typography variant="body2" className="text-base-content/60 mt-1">
              This action cannot be undone.
            </Typography>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant={styles.buttonVariant} 
            onClick={handleConfirm}
            className="gap-2"
          >
            {icon || getIconComponent(styles.defaultIcon, 16)}
            {action}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};