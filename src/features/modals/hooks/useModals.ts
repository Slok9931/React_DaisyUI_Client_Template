import { useState, useCallback } from 'react';
import type { ModalState, ModalData, UseModalsReturn } from '../types';

const initialModalState: ModalState = {
  create: false,
  edit: false,
  delete: false,
  createChild: false,
  bulkDelete: false,
};

export const useModals = (): UseModalsReturn => {
  const [modals, setModals] = useState<ModalState>(initialModalState);
  const [data, setData] = useState<ModalData | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deletingItem, setDeletingItem] = useState<any>(null);

  const openModal = useCallback((type: string, item?: any) => {
    setModals(prev => ({ ...prev, [type]: true }));
    
    if (type === 'edit') {
      setEditingItem(item);
    } else if (type === 'delete') {
      setDeletingItem(item);
    } else if (type === 'createChild') {
      setData(item);
    } else if (type === 'create') {
      setData(item);
    } else {
      setData(item || null);
    }
  }, []);

  const closeModal = useCallback((type: string) => {
    setModals(prev => ({ ...prev, [type]: false }));
    
    if (type === 'edit') {
      setEditingItem(null);
    } else if (type === 'delete') {
      setDeletingItem(null);
    } else if (type === 'createChild' || type === 'create') {
      setData(null);
    }
  }, []);

  const closeAllModals = useCallback(() => {
    setModals(initialModalState);
    setData(null);
    setEditingItem(null);
    setDeletingItem(null);
  }, []);

  return {
    modals,
    data,
    editingItem,
    deletingItem,
    openModal,
    closeModal,
    closeAllModals,
  };
};