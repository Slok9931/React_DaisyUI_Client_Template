import React, { useEffect, useMemo, useState } from 'react'
import {
    InfinityTable,
    InfinitySheet,
    Button,
    Badge,
    Typography,
    Tooltip,
    Toggle,
    ColumnConfig,
    FilterConfig
} from '@/components'
import { FormModal, useModals } from '@/features'
import { useRolesStore } from '@/store'
import { getIconComponent } from '@/utils'
import type { Role, CreateRoleRequest, PermissionMatrixItem } from '@/types'

export const RolesView: React.FC = () => {
    const {
        roles,
        selectedRole,
        permissionMatrix,
        loading,
        error,
        currentPage,
        pageSize,
        totalRoles,
        selectedRoleIds,
        sheetOpen,
        fetchRoles,
        fetchRoleById,
        fetchAllPermissions,
        fetchTotalRoles, // Add this
        createRole,
        togglePermission,
        setCurrentPage,
        setPageSize,
        clearFilters,
        setSelectedRoleIds,
        setSheetOpen,
        clearError,
    } = useRolesStore()

    const {
        modals,
        openModal,
        closeModal,
    } = useModals()

    // Permission matrix filters and pagination state
    const [matrixFilters, setMatrixFilters] = useState({
        search: '',
        category: ''
    })
    const [matrixPagination, setMatrixPagination] = useState({
        currentPage: 1,
        pageSize: 10
    })

    // Calculate skip value for API
    const skip = useMemo(() => (currentPage - 1) * pageSize, [currentPage, pageSize])

    // Update the useEffect
    useEffect(() => {
        const fetchData = async () => {
            // Fetch total count first
            await fetchTotalRoles();
            
            // Then fetch paginated data
            await fetchRoles({
                skip,
                limit: pageSize,
            });
            
            // Fetch all permissions
            await fetchAllPermissions();
        };
        
        fetchData();
    }, [currentPage, pageSize]);

    // Main table columns
    const columns: ColumnConfig<Role>[] = [
        {
            key: 'id',
            header: 'ID',
            width: '80px',
            sortable: true,
        },
        {
            key: 'name',
            header: 'Role Name',
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
            key: 'is_system_role',
            header: 'System Role',
            sortable: true,
            customRender: (value, row) => (
                <Badge
                    variant={row.is_system_role ? 'warning' : 'secondary'}
                    size="sm"
                >
                    {row.is_system_role ? 'System' : 'Custom'}
                </Badge>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            width: '120px',
            align: 'center',
            customRender: (value, row) => (
                <div className="flex items-center gap-1">
                    <Tooltip tip="Manage Permissions">
                        <Button
                            size="xs"
                            variant="ghost"
                            onClick={() => handleManagePermissions(row)}
                        >
                            {getIconComponent('SquareArrowOutUpRight', 16)}
                        </Button>
                    </Tooltip>
                </div>
            ),
        },
    ]

    // Permission matrix table columns
    const matrixColumns: ColumnConfig<PermissionMatrixItem>[] = [
        {
            key: 'name',
            header: 'Resource',
            customRender: (value, row) => (
                <div>
                    <Typography variant="body2" className="font-medium capitalize">
                        {row.name}
                    </Typography>
                </div>
            ),
        },
        {
            key: 'read',
            header: 'Read',
            align: 'center',
            width: '100px',
            customRender: (value, row) => {
                const readPermission = findPermissionByAction(row.category, 'read')
                return (
                    <Toggle
                        checked={row.read}
                        onChange={() => handlePermissionToggle(readPermission?.id, row.read)}
                        size="sm"
                        variant={row.read ? 'primary' : 'error'}
                        disabled={!readPermission}
                    />
                )
            },
        },
        {
            key: 'create',
            header: 'Create',
            align: 'center',
            width: '100px',
            customRender: (value, row) => {
                const createPermission = findPermissionByAction(row.category, 'create')
                return (
                    <Toggle
                        checked={row.create}
                        onChange={() => handlePermissionToggle(createPermission?.id, row.create)}
                        size="sm"
                        variant={row.create ? 'primary' : 'error'}
                        disabled={!createPermission}
                    />
                )
            },
        },
        {
            key: 'update',
            header: 'Update',
            align: 'center',
            width: '100px',
            customRender: (value, row) => {
                const updatePermission = findPermissionByAction(row.category, 'update')
                return (
                    <Toggle
                        checked={row.update}
                        onChange={() => handlePermissionToggle(updatePermission?.id, row.update)}
                        size="sm"
                        variant={row.update ? 'primary' : 'error'}
                        disabled={!updatePermission}
                    />
                )
            },
        },
        {
            key: 'delete',
            header: 'Delete',
            align: 'center',
            width: '100px',
            customRender: (value, row) => {
                const deletePermission = findPermissionByAction(row.category, 'delete')
                return (
                    <Toggle
                        checked={row.delete}
                        onChange={() => handlePermissionToggle(deletePermission?.id, row.delete)}
                        size="sm"
                        variant={row.delete ? 'primary' : 'error'}
                        disabled={!deletePermission}
                    />
                )
            },
        },
    ]

    // Helper functions
    const getUniqueCategories = () => {
        return [...new Set(permissionMatrix.map(item => item.category))].sort()
    }

    // Matrix filter configuration
    const matrixFilterConfigs: FilterConfig[] = [
        {
            type: 'search',
            key: 'search',
            label: 'Search Resources',
            placeholder: 'Search by resource name...',
            value: matrixFilters.search,
            onChange: (value) => {
                setMatrixFilters(prev => ({ ...prev, search: value }))
                setMatrixPagination(prev => ({ ...prev, currentPage: 1 }))
            },
        },
        {
            type: 'select',
            key: 'category',
            label: 'Category',
            placeholder: 'All Categories',
            options: getUniqueCategories().map(category => ({
                value: category,
                label: category.charAt(0).toUpperCase() + category.slice(1)
            })),
            value: matrixFilters.category,
            onChange: (value) => {
                setMatrixFilters(prev => ({ ...prev, category: value }))
                setMatrixPagination(prev => ({ ...prev, currentPage: 1 }))
            },
        },
    ]

    // Form fields for create role
    const getRoleFormFields = () => [
        {
            type: 'input' as const,
            name: 'name',
            label: 'Role Name',
            placeholder: 'e.g., Manager',
            required: true,
        },
        {
            type: 'textarea' as const,
            name: 'description',
            label: 'Description',
            placeholder: 'Enter role description',
            required: true,
        },
        {
            type: 'toggle' as const,
            name: 'is_system_role',
            label: 'System Role',
            helperText: 'System roles cannot be deleted',
        },
    ]

    // Helper functions
    const findPermissionByAction = (category: string, action: string) => {
        const { allPermissions } = useRolesStore.getState()
        return allPermissions.find(p =>
            p.category === category && p.name.endsWith(`:${action}`)
        )
    }

    const getFilteredMatrixData = () => {
        let filtered = [...permissionMatrix]

        // Apply search filter
        if (matrixFilters.search) {
            const searchTerm = matrixFilters.search.toLowerCase()
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchTerm) ||
                item.category.toLowerCase().includes(searchTerm)
            )
        }

        // Apply category filter
        if (matrixFilters.category) {
            filtered = filtered.filter(item => item.category === matrixFilters.category)
        }

        return filtered
    }

    const getPaginatedMatrixData = () => {
        const filteredData = getFilteredMatrixData()
        const startIndex = (matrixPagination.currentPage - 1) * matrixPagination.pageSize
        const endIndex = startIndex + matrixPagination.pageSize
        return filteredData.slice(startIndex, endIndex)
    }

    const getMatrixTotalPages = () => {
        const filteredData = getFilteredMatrixData()
        return Math.ceil(filteredData.length / matrixPagination.pageSize)
    }

    const clearMatrixFilters = () => {
        setMatrixFilters({ search: '', category: '' })
        setMatrixPagination(prev => ({ ...prev, currentPage: 1 }))
    }

    // Event handlers
    const handleCreateSubmit = async (data: any) => {
        const roleData: CreateRoleRequest = {
            name: data.name,
            description: data.description,
            is_system_role: data.is_system_role || false,
        }
        await createRole(roleData)
    }

    const handleManagePermissions = async (role: Role) => {
        await fetchRoleById(role.id)
        setSheetOpen(true)
        // Reset matrix filters when opening
        setMatrixFilters({ search: '', category: '' })
        setMatrixPagination({ currentPage: 1, pageSize: 10 })
    }

    const handlePermissionToggle = async (permissionId: number | undefined, hasPermission: boolean) => {
        if (!selectedRole || !permissionId) return
        await togglePermission(selectedRole.id, permissionId, hasPermission)
    }

    const handleMatrixPageChange = (page: number) => {
        setMatrixPagination(prev => ({ ...prev, currentPage: page }))
    }

    const handleMatrixPageSizeChange = (size: number) => {
        setMatrixPagination({ currentPage: 1, pageSize: size })
    }

    // Custom handlers for pagination
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
    };

    // Calculate total pages
    const totalPages = useMemo(() => {
        const pages = Math.max(1, Math.ceil(totalRoles / pageSize));
        return pages;
    }, [totalRoles, pageSize]);

    return (
        <div className="p-6">
            {/* Roles Table */}
            <InfinityTable
                data={roles}
                columns={columns}
                loading={loading}
                title="Roles Management"
                subtitle="Manage system roles and their permissions"
                selectedRows={selectedRoleIds}
                onRowSelect={setSelectedRoleIds}
                rowIdKey="id"
                expandable={true}
                expandedContent={(row) => (
                    <div className="space-y-3">
                        <Typography variant="h6">Role Details</Typography>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Typography variant="caption" className="text-base-content/60">
                                    Role Type
                                </Typography>
                                <Typography variant="body2">
                                    {row.is_system_role ? 'System Role' : 'Custom Role'}
                                </Typography>
                            </div>
                            <div>
                                <Typography variant="caption" className="text-base-content/60">
                                    Total Permissions
                                </Typography>
                                <Typography variant="body2">
                                    {row.permissions?.length || 0}
                                </Typography>
                            </div>
                        </div>

                        <div>
                            <Typography variant="caption" className="text-base-content/60">
                                Assigned Permissions
                            </Typography>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {row.permissions && row.permissions.map((permission) => (
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
                    totalItems: totalRoles,
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
                            Add Role
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

            {/* Permission Management Sheet */}
            <InfinitySheet
                isOpen={sheetOpen}
                onClose={() => setSheetOpen(false)}
                headerTitle={`Manage Permissions - ${selectedRole?.name}`}
                headerSubtitle="Toggle permissions for this role"
                size="xl"
            >
                <div className="p-4">
                    <InfinityTable
                        data={getPaginatedMatrixData()}
                        columns={matrixColumns}
                        loading={loading}
                        title="Permission Matrix"
                        subtitle="Toggle permissions by resource type"
                        filters={matrixFilterConfigs}
                        pagination={{
                            currentPage: matrixPagination.currentPage,
                            totalPages: getMatrixTotalPages(),
                            pageSize: matrixPagination.pageSize,
                            totalItems: getFilteredMatrixData().length,
                            onPageChange: handleMatrixPageChange,
                            showPageSize: true,
                            pageSizeOptions: [5, 10, 20, 50],
                            onPageSizeChange: handleMatrixPageSizeChange,
                        }}
                        headerActions={
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearMatrixFilters}
                                    className="gap-2"
                                >
                                    {getIconComponent('RefreshCw', 16)}
                                    Reset Filters
                                </Button>
                            </div>
                        }
                        zebra={true}
                        hoverable={true}
                        bordered={true}
                    />
                </div>
            </InfinitySheet>

            {/* Create Role Modal */}
            <FormModal
                isOpen={modals.create}
                onClose={() => closeModal('create')}
                title="Create New Role"
                fields={getRoleFormFields()}
                onSubmit={handleCreateSubmit}
                submitText="Create Role"
                loading={loading}
            />
        </div>
    )
}