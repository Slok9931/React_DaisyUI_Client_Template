import React from 'react';
import { BaseModal } from './BaseModal';
import { InfinityForm, Button } from '@/components';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: any[];
  onSubmit: (data: any) => Promise<void>;
  submitText?: string;
  initialValues?: Record<string, any>;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  title,
  fields,
  onSubmit,
  submitText = 'Submit',
  initialValues = {},
  loading = false
}) => {
  const handleSubmit = async (data: any) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      // Error handling is done in the store/component level
      console.error('Form submission error:', error);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <InfinityForm
          fields={fields}
          columns={1}
          onSubmit={handleSubmit}
          initialValues={initialValues}
          loading={loading}
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="ghost"
            disabled={loading}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            disabled={loading}
            loading={loading}
            type="submit"
            form="infinity-form"
          >
            {submitText}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};