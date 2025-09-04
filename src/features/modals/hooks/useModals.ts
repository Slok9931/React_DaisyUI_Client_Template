import { useState } from 'react';

export interface ModalState {
  create: boolean;
  edit: boolean;
  delete: boolean;
  bulkDelete: boolean;
}

export const useModals = () => {
  const [modals, setModals] = useState<ModalState>({
    create: false,
    edit: false,
    delete: false,
    bulkDelete: false,
  });

  const [editingItem, setEditingItem] = useState<any>(null);
  const [deletingItem, setDeletingItem] = useState<any>(null);

  const openModal = (modalType: keyof ModalState, item?: any) => {
    setModals(prev => ({ ...prev, [modalType]: true }));
    
    if (modalType === 'edit' && item) {
      setEditingItem(item);
    }
    
    if (modalType === 'delete' && item) {
      setDeletingItem(item);
    }
  };

  const closeModal = (modalType: keyof ModalState) => {
    setModals(prev => ({ ...prev, [modalType]: false }));
    
    if (modalType === 'edit') {
      setEditingItem(null);
    }
    
    if (modalType === 'delete') {
      setDeletingItem(null);
    }
  };

  const closeAllModals = () => {
    setModals({
      create: false,
      edit: false,
      delete: false,
      bulkDelete: false,
    });
    setEditingItem(null);
    setDeletingItem(null);
  };

  return {
    modals,
    editingItem,
    deletingItem,
    openModal,
    closeModal,
    closeAllModals,
  };
};