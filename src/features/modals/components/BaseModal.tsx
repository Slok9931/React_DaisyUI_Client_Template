import React from 'react';
import { Modal, Typography } from '@/components';
import { BaseModalProps } from '../types';

export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = ''
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={`${className}`}>
        <div className="flex items-center justify-between mb-6">
          <Typography variant="h5" className="font-semibold">
            {title}
          </Typography>
        </div>
        {children}
      </div>
    </Modal>
  );
};