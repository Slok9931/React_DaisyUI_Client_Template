import React, { useEffect, useMemo } from 'react'
import { InfinityTable, Button, Badge, Typography, Tooltip, ColumnConfig, FilterConfig, Toggle } from '@/components'
import { FormModal, ConfirmModal, BulkActionModal, useModals } from '@/features'
import { useUsersStore, useRolesStore } from '@/store'
import { getIconComponent } from '@/utils'
import type { Users, CreateUserRequest, Role } from '@/types'

export const UsersView: React.FC = () => {
    const {
        users,
        loading,
        error,
        currentPage,
        pageSize,
        totalUsers,
        filters,
        selectedUserIds,
        fetchUsers,
        fetchTotalUsers, // Add this
        createUser,
        updateUser,
        deleteUser,
        bulkDeleteUsers,
        setCurrentPage,
        setPageSize,
        setFilters,
        clearFilters,
        setSelectedUserIds,
        clearError,
    } = useUsersStore()

    // Fetch roles for dropdowns
    const {
        roles,
        fetchRoles,
    } = useRolesStore()

    const {
        modals,
        editingItem: editingUser,
        deletingItem: deletingUser,
        openModal,
        closeModal,
    } = useModals()

    // Calculate skip value for API
    const skip = useMemo(() => (currentPage - 1) * pageSize, [currentPage, pageSize])

    // Update the useEffect to follow permissions pattern
    useEffect(() => {
        const fetchData = async () => {
            // Fetch roles (only needed once on mount)
            if (roles.length === 0) {
                await fetchRoles();
            }
            
            // Fetch total count first
            await fetchTotalUsers();
            
            // Then fetch paginated data
            await fetchUsers({
                skip,
                limit: pageSize,
                ...filters
            });
        };
        
        fetchData();
    }, [currentPage, pageSize, filters.search, filters.is_active, filters.role]);

    // Custom handlers for pagination
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
    };

    // Calculate total pages
    const totalPages = useMemo(() => {
        const pages = Math.max(1, Math.ceil(totalUsers / pageSize));
        return pages;
    }, [totalUsers, pageSize]);

    // Get unique role options for filters and forms
    const getRoleOptions = () => {
        return roles.map(role => ({
            value: role.name.toLowerCase(),
            label: role.name.charAt(0).toUpperCase() + role.name.slice(1)
        }))
    }

    const getRoleFormOptions = () => {
        return roles.map(role => ({
            value: role.id.toString(),
            label: role.name.charAt(0).toUpperCase() + role.name.slice(1)
        }))
    }

    // Table columns configuration
    const columns: ColumnConfig<Users>[] = [
        {
            key: 'id',
            header: 'ID',
            width: '80px',
            sortable: true,
        },
        {
            key: 'username',
            header: 'User',
            sortable: true,
            customRender: (value, row) => (
                <div className="flex items-center gap-3">
                    <div>
                        <Typography variant="body2" className="font-medium">
                            {row.username}
                        </Typography>
                        <Typography variant="caption" className="text-base-content/60">
                            {row.email}
                        </Typography>
                    </div>
                </div>
            ),
        },
        {
            key: 'roles',
            header: 'Roles',
            customRender: (value, row) => (
                <div className="flex flex-wrap gap-1">
                    {row.roles && row.roles.map((role: Role) => (
                        <Badge
                            key={role.id}
                            variant={role.is_system_role ? 'warning' : 'secondary'}
                            size="sm"
                            className='capitalize'
                        >
                            {role.name}
                        </Badge>
                    ))}
                    {(!row.roles || row.roles.length === 0) && (
                        <Badge variant="error" size="sm">
                            No Role
                        </Badge>
                    )}
                </div>
            ),
        },
        {
            key: 'is_active',
            header: 'Status',
            sortable: true,
            customRender: (value, row) => (
                <div>
                    <Toggle
                        variant={row.is_active ? 'primary' : 'error'}
                        checked={row.is_active}
                        aria-label={row.is_active ? 'Active' : 'Inactive'}
                        onChange={() => updateUser(row.id, { is_active: !row.is_active })}
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
                    <Tooltip tip="Edit user">
                        <Button
                            size="xs"
                            variant="ghost"
                            onClick={() => openModal('edit', row)}
                        >
                            {getIconComponent('Edit', 16)}
                        </Button>
                    </Tooltip>
                    <Tooltip tip="Delete user">
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
            label: 'Search Users',
            placeholder: 'Search by username or email...',
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
        {
            type: 'multiSelect',
            key: 'role',
            label: 'Role',
            placeholder: 'All Roles',
            options: getRoleOptions(),
            value: filters.role || '',
            onChange: (value) => setFilters({ role: value || undefined }),
        },
    ]

    // Form fields for create/edit user
    const getUserFormFields = (isEdit = false) => [
        {
            type: 'input' as const,
            name: 'username',
            label: 'Username',
            placeholder: 'Enter username',
            required: true,
            disabled: isEdit,
        },
        {
            type: 'input' as const,
            name: 'email',
            label: 'Email',
            inputType: 'email' as const,
            placeholder: 'Enter email address',
            required: true,
        },
        ...(isEdit ? [] : [{
            type: 'input' as const,
            name: 'password',
            label: 'Password',
            inputType: 'password' as const,
            placeholder: 'Enter password',
            required: true,
        }]),
        {
            type: 'toggle' as const,
            name: 'is_active',
            label: 'Active Status',
            helperText: 'Enable or disable user account',
        },
        {
            type: 'multiSelect' as const,
            name: 'role_ids',
            label: 'Roles',
            placeholder: 'Select roles',
            options: getRoleFormOptions(),
            required: true,
        },
    ]

    // Event handlers
    const handleCreateSubmit = async (data: any) => {
        const userData: CreateUserRequest = {
            username: data.username,
            email: data.email,
            password: data.password,
            is_active: data.is_active ?? true,
            role_ids: data.role_ids?.map((id: string) => parseInt(id)) || [],
        }
        await createUser(userData)
    }

    const handleEditSubmit = async (data: any) => {
        if (!editingUser) return
        await updateUser(editingUser.id, {
            username: data.username,
            email: data.email,
            is_active: data.is_active,
            role_ids: data.role_ids?.map((id: string) => parseInt(id)) || [],
        })
    }

    const handleDeleteConfirm = async () => {
        if (!deletingUser) return
        await deleteUser(deletingUser.id)
    }

    const handleBulkDeleteConfirm = async () => {
        if (selectedUserIds.length === 0) return
        const ids = selectedUserIds.map(id => parseInt(id))
        await bulkDeleteUsers(ids)
        setSelectedUserIds([])
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

            {/* Users Table */}
            <InfinityTable
                data={users}
                columns={columns}
                loading={loading}
                title="Users Management"
                subtitle="Manage system users, roles, and permissions"
                filters={filterConfigs}
                selectable={true}
                selectedRows={selectedUserIds}
                onRowSelect={setSelectedUserIds}
                rowIdKey="id"
                expandable={true}
                expandedContent={(row) => (
                    <div className="space-y-3">
                        <Typography variant="h6">User Details</Typography>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    Last Updated
                                </Typography>
                                <Typography variant="body2">
                                    {row.updated_at ? new Date(row.updated_at).toLocaleString() : 'Never'}
                                </Typography>
                            </div>
                        </div>

                        <div>
                            <Typography variant="caption" className="text-base-content/60">
                                Permissions
                            </Typography>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {row.roles && row.roles.flatMap(role => role.permissions).map((permission) => (
                                    <Badge key={permission.id} variant="primary" size="xs">
                                        {permission.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                pagination={{
                    currentPage,
                    totalPages,
                    pageSize,
                    totalItems: totalUsers,
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
                            Add User
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

            {/* Create User Modal */}
            <FormModal
                isOpen={modals.create}
                onClose={() => closeModal('create')}
                title="Create New User"
                fields={getUserFormFields(false)}
                onSubmit={handleCreateSubmit}
                submitText="Create User"
                initialValues={{ is_active: true }}
                loading={loading}
            />

            {/* Edit User Modal */}
            <FormModal
                isOpen={modals.edit}
                onClose={() => closeModal('edit')}
                title="Edit User"
                fields={getUserFormFields(true)}
                onSubmit={handleEditSubmit}
                submitText="Update User"
                initialValues={editingUser ? {
                    username: editingUser.username,
                    email: editingUser.email,
                    is_active: editingUser.is_active,
                    role_ids: editingUser.roles?.map((role: Role) => role.id.toString()) || [],
                } : {}}
                loading={loading}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={modals.delete}
                onClose={() => closeModal('delete')}
                title="Confirm Delete"
                message={`Are you sure you want to delete the user "${deletingUser?.username}"? This action cannot be undone.`}
                confirmText="Delete User"
                onConfirm={handleDeleteConfirm}
                variant="error"
                icon={getIconComponent('Trash2', 24)}
            />

            {/* Bulk Delete Modal */}
            <BulkActionModal
                isOpen={modals.bulkDelete}
                onClose={() => closeModal('bulkDelete')}
                title="Bulk Delete Users"
                count={selectedUserIds.length}
                action="Delete"
                onConfirm={handleBulkDeleteConfirm}
                variant="error"
            />
        </div>
    )
}