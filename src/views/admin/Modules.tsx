import React, { useEffect } from 'react'
import { InfinityTable, Button, Badge, Typography, Tooltip, Toggle, ColumnConfig, FilterConfig } from '@/components'
import { FormModal, ConfirmModal, BulkActionModal, useModals } from '@/features'
import { useModulesStore } from '@/store'
import { getIconComponent } from '@/utils'
import type { Module, CreateModuleRequest } from '@/types'

export const ModulesView: React.FC = () => {
    const {
        modules,
        loading,
        error,
        currentPage,
        pageSize,
        totalModules,
        totalPages,
        filters,
        selectedModuleIds,
        fetchModules,
        createModule,
        updateModule,
        deleteModule,
        bulkDeleteModules,
        setCurrentPage,
        setPageSize,
        setFilters,
        clearFilters,
        setSelectedModuleIds,
        clearError,
    } = useModulesStore()

    const {
        modals,
        editingItem: editingModule,
        deletingItem: deletingModule,
        openModal,
        closeModal,
    } = useModals()

    useEffect(() => {
        fetchModules()
    }, [fetchModules])

    // Table columns configuration
    const columns: ColumnConfig<Module>[] = [
        {
            key: 'id',
            header: 'ID',
            width: '80px',
            sortable: true,
        },
        {
            key: 'icon',
            header: 'Icon',
            width: '60px',
            customRender: (value, row) => (
                <div className="flex items-center justify-center">
                    {getIconComponent(row.icon, 20)}
                </div>
            ),
        },
        {
            key: 'name',
            header: 'Module',
            sortable: true,
            customRender: (value, row) => (
                <div className="flex items-center gap-3">
                    <div>
                        <Typography variant="body2" className="font-medium capitalize">
                            {row.label}
                        </Typography>
                        <Typography variant="caption" className="text-base-content/60">
                            {row.name}
                        </Typography>
                    </div>
                </div>
            ),
        },
        {
            key: 'route',
            header: 'Route',
            customRender: (value, row) => (
                <div className="font-mono text-sm bg-warning/10 px-2 py-1 rounded">
                    {row.route}
                </div>
            ),
        },
        {
            key: 'is_active',
            header: 'Status',
            sortable: true,
            width: '100px',
            customRender: (value, row) => (
                <div>
                    <Toggle
                        variant={row.is_active ? 'primary' : 'error'}
                        checked={row.is_active}
                        aria-label={row.is_active ? 'Active' : 'Inactive'}
                        onChange={() => updateModule(row.id, { is_active: !row.is_active })}
                    />
                </div>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            align: 'center',
            width: '120px',
            customRender: (value, row) => (
                <div className="flex items-center justify-center gap-1">
                    <Tooltip tip="Edit module">
                        <Button
                            size="xs"
                            variant="ghost"
                            onClick={() => openModal('edit', row)}
                        >
                            {getIconComponent('Edit', 16)}
                        </Button>
                    </Tooltip>
                    <Tooltip tip="Delete module">
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

    // Filter configuration
    const filterConfigs: FilterConfig[] = [
        {
            type: 'search',
            key: 'search',
            label: 'Search Modules',
            placeholder: 'Search by name, label, or route...',
            value: filters.search,
            onChange: (value) => setFilters({ search: value }),
        },
        {
            type: 'select',
            key: 'is_active',
            label: 'Status',
            placeholder: 'All Status',
            options: [
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' },
            ],
            value: filters.is_active?.toString(),
            onChange: (value) => setFilters({
                is_active: value === '' ? undefined : value === 'true'
            }),
        },
    ]

    // Form fields for create/edit module - Updated to use iconPicker
    const getModuleFormFields = () => [
        {
            type: 'input' as const,
            name: 'name',
            label: 'Module Name',
            placeholder: 'e.g., administration',
            required: true,
        },
        {
            type: 'input' as const,
            name: 'label',
            label: 'Display Label',
            placeholder: 'e.g., Administration',
            required: true,
        },
        {
            type: 'iconPicker' as const,
            name: 'icon',
            label: 'Module Icon',
            required: true,
            iconSize: 20,
            showPreview: true,
        },
        {
            type: 'input' as const,
            name: 'route',
            label: 'Route Path',
            placeholder: 'e.g., /infinity/administration',
            required: true,
        },
        {
            type: 'input' as const,
            name: 'priority',
            inputType: 'number' as const,
            label: 'Priority',
            placeholder: '0',
            required: true,
        },
        {
            type: 'toggle' as const,
            name: 'is_active',
            label: 'Active Status',
        },
    ]

    // Event handlers
    const handleCreateSubmit = async (data: any) => {
        const moduleData: CreateModuleRequest = {
            name: data.name,
            label: data.label,
            icon: data.icon,
            route: data.route,
            priority: parseInt(data.priority),
            is_active: data.is_active ?? true,
        }
        await createModule(moduleData)
    }

    const handleEditSubmit = async (data: any) => {
        if (!editingModule) return
        await updateModule(editingModule.id, {
            name: data.name,
            label: data.label,
            icon: data.icon,
            route: data.route,
            priority: parseInt(data.priority),
            is_active: data.is_active,
        })
    }

    const handleDeleteConfirm = async () => {
        if (!deletingModule) return
        await deleteModule(deletingModule.id)
    }

    const handleBulkDeleteConfirm = async () => {
        if (selectedModuleIds.length === 0) return
        const ids = selectedModuleIds.map(id => parseInt(id))
        await bulkDeleteModules(ids)
        setSelectedModuleIds([])
    }

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

            {/* Modules Table */}
            <InfinityTable
                data={modules}
                columns={columns}
                loading={loading}
                title="Modules Management"
                subtitle="Manage system modules and navigation structure"
                filters={filterConfigs}
                selectable={true}
                selectedRows={selectedModuleIds}
                onRowSelect={setSelectedModuleIds}
                rowIdKey="id"
                expandable={true}
                expandedContent={(row) => (
                    <div className="space-y-3">
                        <Typography variant="h6">Module Details</Typography>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Typography variant="caption" className="text-base-content/60">
                                    Priority
                                </Typography>
                                <Typography variant="body2">
                                    {row.priority}
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="caption" className="text-base-content/60">
                                    Status
                                </Typography>
                                <Typography variant="body2">
                                    <Badge 
                                        variant={row.is_active ? 'success' : 'error'} 
                                        size="sm"
                                    >
                                        {row.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="caption" className="text-base-content/60">
                                    Created At
                                </Typography>
                                <Typography variant="body2">
                                    {new Date(row.created_at).toLocaleString()}
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="caption" className="text-base-content/60">
                                    Total Routes
                                </Typography>
                                <Typography variant="body2">
                                    {row.route_count} routes
                                </Typography>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Typography variant="caption" className="text-base-content/60">
                                    Full Route Path
                                </Typography>
                                <div className="font-mono text-sm bg-base-200 py-2 rounded mt-1">
                                    {row.route}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div>
                                    <Typography variant="caption" className="text-base-content/60">
                                        Module Icon
                                    </Typography>
                                    <div className="flex items-center gap-2 mt-1">
                                        {getIconComponent(row.icon, 18)}
                                        <Typography variant="body2" className="font-mono">
                                            {row.icon}
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                pagination={{
                    currentPage,
                    totalPages,
                    pageSize,
                    totalItems: totalModules,
                    onPageChange: setCurrentPage,
                    showPageSize: true,
                    pageSizeOptions: [10, 20, 50, 100],
                    onPageSizeChange: setPageSize,
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
                            Add Module
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

            {/* Create Module Modal */}
            <FormModal
                isOpen={modals.create}
                onClose={() => closeModal('create')}
                title="Create New Module"
                fields={getModuleFormFields()}
                onSubmit={handleCreateSubmit}
                submitText="Create Module"
                initialValues={{ is_active: true, priority: 0 }}
                loading={loading}
            />

            {/* Edit Module Modal */}
            <FormModal
                isOpen={modals.edit}
                onClose={() => closeModal('edit')}
                title="Edit Module"
                fields={getModuleFormFields()}
                onSubmit={handleEditSubmit}
                submitText="Update Module"
                initialValues={editingModule ? {
                    name: editingModule.name,
                    label: editingModule.label,
                    icon: editingModule.icon,
                    route: editingModule.route,
                    priority: editingModule.priority,
                    is_active: editingModule.is_active,
                } : {}}
                loading={loading}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={modals.delete}
                onClose={() => closeModal('delete')}
                title="Confirm Delete"
                message={`Are you sure you want to delete the module "${deletingModule?.label}"? This action cannot be undone.`}
                confirmText="Delete Module"
                onConfirm={handleDeleteConfirm}
                variant="error"
                icon={getIconComponent('Trash2', 24)}
            />

            {/* Bulk Delete Modal */}
            <BulkActionModal
                isOpen={modals.bulkDelete}
                onClose={() => closeModal('bulkDelete')}
                title="Bulk Delete Modules"
                count={selectedModuleIds.length}
                action="Delete"
                onConfirm={handleBulkDeleteConfirm}
                variant="error"
            />
        </div>
    )
}