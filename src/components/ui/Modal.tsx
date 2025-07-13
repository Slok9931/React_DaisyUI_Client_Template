import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  backdrop?: boolean;
  responsive?: boolean;
}

interface ModalBoxProps {
  children: React.ReactNode;
  className?: string;
}

interface ModalActionProps {
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className = '',
  backdrop = true,
  responsive = false,
}) => {
  const classes = [
    'modal',
    isOpen && 'modal-open',
    responsive && 'modal-bottom sm:modal-middle',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className="modal-box relative">
        <button
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
      {backdrop && (
        <div className="modal-backdrop" onClick={onClose}>
          <button>close</button>
        </div>
      )}
    </div>
  );
};

export const ModalBox: React.FC<ModalBoxProps> = ({ children, className = '' }) => (
  <div className={`modal-box ${className}`}>{children}</div>
);

export const ModalAction: React.FC<ModalActionProps> = ({ children, className = '' }) => (
  <div className={`modal-action ${className}`}>{children}</div>
);