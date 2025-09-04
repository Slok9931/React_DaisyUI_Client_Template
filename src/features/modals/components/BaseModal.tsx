import React from 'react';
import { Modal } from '@/components';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  className?: string;
}

export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={className}>
      <div>
        {title && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
        )}
        {children}
      </div>
    </Modal>
  );
};