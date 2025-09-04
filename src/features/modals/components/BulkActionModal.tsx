import React from 'react';
import { BaseModal } from './BaseModal';
import { Button, Typography, Badge } from '@/components';
import { getIconComponent } from '@/utils';

interface BulkActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  count: number;
  action: string;
  onConfirm: () => Promise<void> | void;
  variant?: 'primary' | 'error' | 'warning' | 'success';
  loading?: boolean;
  itemType?: string;
}

export const BulkActionModal: React.FC<BulkActionModalProps> = ({
  isOpen,
  onClose,
  title,
  count,
  action,
  onConfirm,
  variant = 'primary',
  loading = false,
  itemType = 'items',
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Bulk action error:', error);
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

  const getIcon = () => {
    switch (variant) {
      case 'error':
        return getIconComponent('AlertTriangle', 24);
      case 'warning':
        return getIconComponent('AlertCircle', 24);
      case 'success':
        return getIconComponent('CheckCircle', 24);
      default:
        return getIconComponent('Info', 24);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-6">
        {/* Icon and Message */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className={`p-3 rounded-full ${
              variant === 'error' ? 'bg-error/10 text-error' :
              variant === 'warning' ? 'bg-warning/10 text-warning' :
              variant === 'success' ? 'bg-success/10 text-success' :
              'bg-primary/10 text-primary'
            }`}>
              {getIcon()}
            </div>
          </div>
          
          <div className="space-y-2">
            <Typography variant="body1" className="text-center">
              Are you sure you want to {action.toLowerCase()} 
            </Typography>
            
            <div className="flex items-center justify-center gap-2">
              <Badge 
                variant={variant === 'error' ? 'error' : 'primary'} 
                size="lg"
              >
                {count} {itemType}
              </Badge>
            </div>
            
            <Typography variant="body2" className="text-base-content/60 text-center">
              This action cannot be undone.
            </Typography>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className={getVariantClasses()}
            onClick={handleConfirm}
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Processing...' : `${action} Selected`}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};