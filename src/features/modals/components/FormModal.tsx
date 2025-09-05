import React from 'react'
import { InfinityForm } from '@/components'
import { getIconComponent } from '@/utils'
import { BaseModal } from './BaseModal'
import { FormModalProps } from '../types'

export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  title,
  fields,
  onSubmit,
  initialValues,
  submitText = 'Save',
  cancelText = 'Cancel',
  columns = 1,
  loading = false,
  ...props
}) => {
  const handleSubmit = async (data: any) => {
    try {
      await onSubmit(data)
      onClose()
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Form submission error:', error)
    }
  }

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title} {...props}>
      <InfinityForm
        fields={fields}
        columns={columns as 1 | 2 | 3 | 4}
        onSubmit={handleSubmit}
        initialValues={initialValues}
        actions={[
          {
            type: 'button',
            label: cancelText,
            variant: 'ghost',
            onClick: onClose,
            disabled: loading,
          },
          {
            type: 'submit',
            label: submitText,
            variant: 'primary',
            loading: loading,
            icon: getIconComponent('Save', 16),
          },
        ]}
      />
    </BaseModal>
  )
}