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

export interface ModalState {
  create: boolean;
  edit: boolean;
  delete: boolean;
  createChild: boolean;
  bulkDelete: boolean;
  [key: string]: boolean;
}

export interface ModalData {
  moduleId?: number;
  parentRoute?: any;
  [key: string]: any;
}

export interface UseModalsReturn {
  modals: ModalState;
  data: ModalData | null;
  editingItem: any;
  deletingItem: any;
  openModal: (type: string, item?: any) => void;
  closeModal: (type: string) => void;
  closeAllModals: () => void;
}