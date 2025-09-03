import React, { useEffect, useState } from 'react'
import { InfinityTable, InfinityForm, Button, Badge, Modal, Typography, Tooltip, ColumnConfig, FilterConfig } from '@/components'
import { useUsersStore } from '@/store'
import { getIconComponent } from '@/utils'
import type { Users, CreateUserRequest, Roles } from '@/types'

export const UsersView: React.FC = () => {
    const {
        users,
        loading,
        error,
        currentPage,
        pageSize,
        totalUsers,
        totalPages,
        filters,
        selectedUserIds,
        fetchUsers,
        createUser,
        updateUser,
        deleteUser,
        bulkDeleteUsers,
        toggleUserStatus,
        setCurrentPage,
        setPageSize,
        setFilters,
        clearFilters,
        setSelectedUserIds,
        clearError,
    } = useUsersStore()

    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingUser, setEditingUser] = useState<Users | null>(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deletingUser, setDeletingUser] = useState<Users | null>(null)

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    // Table columns configuration
    const columns: ColumnConfig<Users>[] = [
        {
            key: 'id',
            header: 'ID',
            width: '80px',
            sortable: true,
            align: 'left',
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
            align: 'left',
        },
        {
            key: 'roles',
            header: 'Roles',
            customRender: (value, row) => (
                <div className="flex flex-wrap gap-1">
                    {row.roles && row.roles.map((role: Roles) => (
                        <Badge
                            key={role.id}
                            variant={role.is_system_role ? 'primary' : 'secondary'}
                            size="sm"
                        >
                            {role.name}
                        </Badge>
                    ))}
                </div>
            ),
            align: 'left',
        },
        {
            key: 'is_active',
            header: 'Status',
            align: 'left',
            sortable: true,
            customRender: (value, row) => (
                <div>
                    <button
                        onClick={() => handleToggleStatus(row)}
                        className="btn btn-ghost btn-xs p-1"
                    >
                        <Badge
                            variant={row.is_active ? 'success' : 'error'}
                            size="sm"
                            className="cursor-pointer"
                        >
                            {row.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                    </button>
                </div>
            ),
        },
        {
            key: 'created_at',
            header: 'Created',
            sortable: true,
            customRender: (value, row) => (
                <Typography variant="body2" className="text-base-content/70">
                    {new Date(row.created_at).toLocaleDateString()}
                </Typography>
            ),
            align: 'left',
        },
        {
            key: 'actions',
            header: 'Actions',
            align: 'left',
            width: '120px',
            customRender: (value, row) => (
                <div className="flex items-center justify-center gap-1">
                    <Tooltip tip="Edit user">
                        <Button
                            size="xs"
                            variant="ghost"
                            onClick={() => handleEdit(row)}
                        >
                            {getIconComponent('Edit', 16)}
                        </Button>
                    </Tooltip>
                    <Tooltip tip="Delete user">
                        <Button
                            size="xs"
                            variant="ghost"
                            onClick={() => handleDelete(row)}
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
            type: 'select',
            key: 'role',
            label: 'Role',
            placeholder: 'All Roles',
            options: [
                { value: 'superadmin', label: 'Super Admin' },
                { value: 'admin', label: 'Admin' },
                { value: 'user', label: 'User' },
            ],
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
            options: [
                { value: '1', label: 'Super Admin' },
                { value: '2', label: 'Admin' },
                { value: '3', label: 'User' },
            ],
        },
    ]

    // Event handlers
    const handleCreate = () => {
        setShowCreateModal(true)
    }

    const handleEdit = (user: Users) => {
        setEditingUser(user)
        setShowEditModal(true)
    }

    const handleDelete = (user: Users) => {
        setDeletingUser(user)
        setShowDeleteModal(true)
    }

    const handleToggleStatus = async (user: Users) => {
        try {
            await toggleUserStatus(user.id, !user.is_active)
        } catch (error) {
            console.error('Failed to toggle user status:', error)
        }
    }

    const handleBulkDelete = async () => {
        if (selectedUserIds.length === 0) return

        const confirmed = window.confirm(
            `Are you sure you want to delete ${selectedUserIds.length} user(s)?`
        )

        if (confirmed) {
            try {
                await bulkDeleteUsers(selectedUserIds.map(id => parseInt(id)))
            } catch (error) {
                console.error('Failed to delete users:', error)
            }
        }
    }

    const handleCreateSubmit = async (data: any) => {
        try {
            const userData: CreateUserRequest = {
                username: data.username,
                email: data.email,
                password: data.password,
                is_active: data.is_active ?? true,
                role_ids: data.role_ids?.map((id: string) => parseInt(id)),
            }

            await createUser(userData)
            setShowCreateModal(false)
        } catch (error) {
            console.error('Failed to create user:', error)
        }
    }

    const handleEditSubmit = async (data: any) => {
        if (!editingUser) return

        try {
            await updateUser(editingUser.id, {
                username: data.username,
                email: data.email,
                is_active: data.is_active,
                role_ids: data.role_ids?.map((id: string) => parseInt(id)),
            })
            setShowEditModal(false)
            setEditingUser(null)
        } catch (error) {
            console.error('Failed to update user:', error)
        }
    }

    const handleDeleteConfirm = async () => {
        if (!deletingUser) return

        try {
            await deleteUser(deletingUser.id)
            setShowDeleteModal(false)
            setDeletingUser(null)
        } catch (error) {
            console.error('Failed to delete user:', error)
        }
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
                icon={getIconComponent('Users', 24, 'text-primary')}
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
                            onClick={handleCreate}
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
                        onClick: handleBulkDelete,
                        variant: 'error',
                    },
                ]}
                zebra={true}
                hoverable={true}
                bordered={true}
            />

            {/* Create User Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            >
                <div className="p-6">
                    <Typography variant="h5" className="mb-4">Create New User</Typography>
                    <InfinityForm
                        fields={getUserFormFields(false)}
                        onSubmit={handleCreateSubmit}
                        actions={[
                            {
                                type: 'button',
                                label: 'Cancel',
                                variant: 'ghost',
                                onClick: () => setShowCreateModal(false),
                            },
                            {
                                type: 'submit',
                                label: 'Create User',
                                variant: 'primary',
                                icon: getIconComponent('Plus', 16),
                            },
                        ]}
                        initialValues={{
                            is_active: true,
                        }}
                    />
                </div>
            </Modal>

            {/* Edit User Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false)
                    setEditingUser(null)
                }}
            >
                <div className="p-6">
                    <Typography variant="h5" className="mb-4">Edit User</Typography>
                    {editingUser && (
                        <InfinityForm
                            fields={getUserFormFields(true)}
                            onSubmit={handleEditSubmit}
                            actions={[
                                {
                                    type: 'button',
                                    label: 'Cancel',
                                    variant: 'ghost',
                                    onClick: () => {
                                        setShowEditModal(false)
                                        setEditingUser(null)
                                    },
                                },
                                {
                                    type: 'submit',
                                    label: 'Update User',
                                    variant: 'primary',
                                    icon: getIconComponent('Save', 16),
                                },
                            ]}
                            initialValues={{
                                username: editingUser.username,
                                email: editingUser.email,
                                is_active: editingUser.is_active,
                                role_ids: editingUser.roles?.map(role => role.id.toString()) || [],
                            }}
                        />
                    )}
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false)
                    setDeletingUser(null)
                }}
            >
                <div className="p-6">
                    <Typography variant="h5" className="mb-4">Confirm Delete</Typography>
                    {deletingUser && (
                        <div className="space-y-4">
                            <Typography variant="body1">
                                Are you sure you want to delete the user <strong>{deletingUser.username}</strong>?
                                This action cannot be undone.
                            </Typography>

                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setShowDeleteModal(false)
                                        setDeletingUser(null)
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="error"
                                    onClick={handleDeleteConfirm}
                                    className="gap-2"
                                >
                                    {getIconComponent('Trash2', 16)}
                                    Delete User
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    )
}