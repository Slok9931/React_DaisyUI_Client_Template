import React, { useEffect, useMemo } from 'react'
import { InfinityTable, Button, Badge, Typography, Tooltip, ColumnConfig, FilterConfig } from '@/components'
import { FormModal, ConfirmModal, BulkActionModal, useModals } from '@/features'
import { usePermissionsStore } from '@/store'
import { getIconComponent } from '@/utils'
import type { Permission, CreatePermissionRequest } from '@/types'

export const PermissionsView: React.FC = () => {
    const {
        permissions,
        categories,
        loading,
        error,
        currentPage,
        pageSize,
        totalPermissions,
        filters,
        selectedPermissionIds,
        fetchPermissions,
        fetchCategories,
        fetchTotalPermissions,
        createPermission,
        updatePermission,
        deletePermission,
        bulkDeletePermissions,
        setCurrentPage,
        setPageSize,
        setFilters,
        clearFilters,
        setSelectedPermissionIds,
        clearError,
    } = usePermissionsStore()
    
    const {
        modals,
        editingItem: editingPermission,
        deletingItem: deletingPermission,
        openModal,
        closeModal,
    } = useModals()

    // Calculate skip value for API
    const skip = useMemo(() => (currentPage - 1) * pageSize, [currentPage, pageSize])

    // Fetch data on mount and when dependencies change
    useEffect(() => {
        
        const fetchData = async () => {
            // Fetch categories (only needed once)
            await fetchCategories()
            
            // Fetch total count first
            await fetchTotalPermissions()
            
            // Then fetch paginated data
            await fetchPermissions({
                skip,
                limit: pageSize,
                ...filters
            })
        }
        
        fetchData()
    }, [currentPage, pageSize, filters.search, filters.category]) // Only depend on actual filter values

    // Table columns configuration
    const columns: ColumnConfig<Permission>[] = [
        {
            key: 'id',
            header: 'ID',
            width: '80px',
            sortable: true,
        },
        {
            key: 'name',
            header: 'Permission Name',
            sortable: true,
            customRender: (value, row) => (
                <div className="flex items-center gap-3">
                    <div>
                        <Typography variant="body2" className="font-medium">
                            {row.name}
                        </Typography>
                        <Typography variant="caption" className="text-base-content/60">
                            {row.description}
                        </Typography>
                    </div>
                </div>
            ),
        },
        {
            key: 'category',
            header: 'Category',
            sortable: true,
            customRender: (value, row) => (
                <Badge
                    variant="warning"
                    size="sm"
                    className="capitalize"
                >
                    {row.category}
                </Badge>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            align: 'center',
            width: '120px',
            customRender: (value, row) => (
                <div className="flex items-center justify-center gap-1">
                    <Tooltip tip="Edit permission">
                        <Button
                            size="xs"
                            variant="ghost"
                            onClick={() => openModal('edit', row)}
                        >
                            {getIconComponent('Edit', 16)}
                        </Button>
                    </Tooltip>
                    <Tooltip tip="Delete permission">
                        <Button
                            size="xs"
                            variant="ghost"
                            onClick={() => openModal('delete', row)}
                            className="text-error hover:bg-error/10"
                        >
                            {getIconComponent('Trash2', 16)}
                        </Button>
                    </Tooltip>
                </div>
            ),
        },
    ]

    // Filter configuration with dynamic categories
    const filterConfigs: FilterConfig[] = [
        {
            type: 'search',
            key: 'search',
            label: 'Search Permissions',
            placeholder: 'Search by name or description...',
            value: filters.search,
            onChange: (value) => setFilters({ search: value }),
        },
        {
            type: 'select',
            key: 'category',
            label: 'Category',
            placeholder: 'All Categories',
            options: categories.map(category => ({
                value: category,
                label: category.charAt(0).toUpperCase() + category.slice(1)
            })),
            value: filters.category || '',
            onChange: (value) => setFilters({ category: value || undefined }),
        },
    ]

    // Form fields for create/edit permission
    const getPermissionFormFields = () => [
        {
            type: 'input' as const,
            name: 'name',
            label: 'Permission Name',
            placeholder: 'e.g., user:read',
            required: true
        },
        {
            type: 'input' as const,
            name: 'description',
            label: 'Description',
            placeholder: 'e.g., Read user resources',
            required: true
        },
        {
            type: 'input' as const,
            name: 'category',
            label: 'Category',
            placeholder: 'e.g., user, module',
            required: true,
            disabled: modals.edit,
        },
    ]

    // Event handlers
    const handleCreateSubmit = async (data: any) => {
        const permissionData: CreatePermissionRequest = {
            name: data.name,
            description: data.description,
            category: data.category,
        }
        await createPermission(permissionData)
        closeModal('create')
    }

    const handleEditSubmit = async (data: any) => {
        if (!editingPermission) return
        await updatePermission(editingPermission.id, {
            name: data.name,
            description: data.description,
            category: data.category,
        })
        closeModal('edit')
    }

    const handleDeleteConfirm = async () => {
        if (!deletingPermission) return
        await deletePermission(deletingPermission.id)
        closeModal('delete')
    }

    const handleBulkDeleteConfirm = async () => {
        if (selectedPermissionIds.length === 0) return
        const ids = selectedPermissionIds.map(id => parseInt(id))
        await bulkDeletePermissions(ids)
        setSelectedPermissionIds([])
        closeModal('bulkDelete')
    }

    // Custom handlers for pagination to ensure proper data fetching
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handlePageSizeChange = (size: number) => {
        setPageSize(size)
    }

    // Calculate total pages
    const totalPages = useMemo(() => {
        const pages = Math.max(1, Math.ceil(totalPermissions / pageSize))
        return pages
    }, [totalPermissions, pageSize])

    return (
        <div className="p-6">
            {/* Error Alert */}
            {error && (
                <div className="alert alert-error mb-4">
                    <div className="flex items-center gap-2">
                        {getIconComponent('AlertCircle', 20)}
                        <span>{error}</span>
                        <Button size="xs" variant="ghost" onClick={clearError}>
                            {getIconComponent('X', 16)}
                        </Button>
                    </div>
                </div>
            )}

            {/* Permissions Table */}
            <InfinityTable
                data={permissions}
                columns={columns}
                loading={loading}
                title="Permissions Management"
                subtitle="Manage system permissions and access controls"
                filters={filterConfigs}
                selectable={true}
                selectedRows={selectedPermissionIds}
                onRowSelect={setSelectedPermissionIds}
                rowIdKey="id"
                pagination={{
                    currentPage,
                    totalPages,
                    pageSize,
                    totalItems: totalPermissions,
                    onPageChange: handlePageChange,
                    showPageSize: true,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    onPageSizeChange: handlePageSizeChange,
                }}
                headerActions={
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="gap-2"
                        >
                            {getIconComponent('RefreshCw', 16)}
                            Reset Filters
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => openModal('create')}
                            className="gap-2"
                        >
                            {getIconComponent('Plus', 16)}
                            Add Permission
                        </Button>
                    </div>
                }
                bulkActions={[
                    {
                        label: 'Delete Selected',
                        icon: getIconComponent('Trash2', 16),
                        onClick: () => openModal('bulkDelete'),
                        variant: 'error',
                    },
                ]}
                zebra={true}
                hoverable={true}
                bordered={true}
            />

            {/* Create Permission Modal */}
            <FormModal
                isOpen={modals.create}
                onClose={() => closeModal('create')}
                title="Create New Permission"
                fields={getPermissionFormFields()}
                onSubmit={handleCreateSubmit}
                submitText="Create Permission"
                loading={loading}
            />

            {/* Edit Permission Modal */}
            <FormModal
                isOpen={modals.edit}
                onClose={() => closeModal('edit')}
                title="Edit Permission"
                fields={getPermissionFormFields()}
                onSubmit={handleEditSubmit}
                submitText="Update Permission"
                initialValues={editingPermission ? {
                    name: editingPermission.name,
                    description: editingPermission.description,
                    category: editingPermission.category,
                } : {}}
                loading={loading}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={modals.delete}
                onClose={() => closeModal('delete')}
                title="Confirm Delete"
                message={`Are you sure you want to delete the permission "${deletingPermission?.name}"?`}
                confirmText="Delete Permission"
                onConfirm={handleDeleteConfirm}
                variant="error"
                icon={getIconComponent('Trash2', 24)}
            />

            {/* Bulk Delete Modal */}
            <BulkActionModal
                isOpen={modals.bulkDelete}
                onClose={() => closeModal('bulkDelete')}
                title="Bulk Delete Permissions"
                count={selectedPermissionIds.length}
                action="Delete"
                onConfirm={handleBulkDeleteConfirm}
                variant="error"
            />
        </div>
    )
}