import { ReactNode } from 'react';

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export interface ConfirmModalProps extends Omit<BaseModalProps, 'children'> {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: 'error' | 'warning' | 'info' | 'success';
  icon?: ReactNode;
}

export interface FormModalProps extends Omit<BaseModalProps, 'children'> {
  fields: any[];
  onSubmit: (data: any) => void;
  initialValues?: Record<string, any>;
  submitText?: string;
  cancelText?: string;
  columns?: number;
  loading?: boolean;
}

export interface BulkActionModalProps extends Omit<BaseModalProps, 'children'> {
  count: number;
  action: string;
  onConfirm: () => void;
  variant?: 'error' | 'warning' | 'info';
  icon?: ReactNode;
}