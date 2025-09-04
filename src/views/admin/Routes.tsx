import React, { useEffect, useMemo } from 'react'
import { InfinityTable, Button, Badge, Typography, Tooltip, Toggle, ColumnConfig, FilterConfig } from '@/components'
import { FormModal, ConfirmModal, BulkActionModal, useModals } from '@/features'
import { useRoutesStore, useModulesStore } from '@/store'
import { getIconComponent } from '@/utils'
import type { Route, CreateRouteRequest, Module } from '@/types'

// Child Routes Table Component
const ChildRoutesTable: React.FC<{
  parentRoute: Route
  moduleId: number
}> = ({ parentRoute, moduleId }) => {
  const {
    getChildRoutesByParent,
    fetchChildRoutes,
    updateRoute,
    loading,
  } = useRoutesStore()

  const {
    openModal,
  } = useModals()

  const childRoutes = useMemo(() => {
    return getChildRoutesByParent(parentRoute.id)
  }, [getChildRoutesByParent, parentRoute.id])

  useEffect(() => {
    fetchChildRoutes(parentRoute.id)
  }, [fetchChildRoutes, parentRoute.id])

  const childColumns: ColumnConfig<Route>[] = [
    {
      key: 'icon',
      header: 'Icon',
      width: '60px',
      customRender: (value, row) => (
        <div className="flex items-center justify-center">
          {getIconComponent(row.icon, 18)}
        </div>
      ),
    },
    {
      key: 'label',
      header: 'Route',
      customRender: (value, row) => (
        <div className="space-y-1">
          <Typography variant="body2" className="font-medium">
            {row.label}
          </Typography>
          <Typography variant="caption" className="text-base-content/60 font-mono">
            {row.route}
          </Typography>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      width: '80px',
      align: 'center',
      customRender: (value, row) => (
        <Badge variant="secondary" size="sm">
          {row.priority}
        </Badge>
      ),
    },
    {
      key: 'is_sidebar',
      header: 'Sidebar',
      width: '80px',
      customRender: (value, row) => (
        <Toggle
          variant={row.is_sidebar ? 'primary' : 'error'}
          checked={row.is_sidebar}
          size="sm"
          aria-label={row.is_sidebar ? 'In Sidebar' : 'Not in Sidebar'}
          onChange={() => updateRoute(row.id, { is_sidebar: !row.is_sidebar })}
        />
      ),
    },
    {
      key: 'is_active',
      header: 'Status',
      width: '80px',
      customRender: (value, row) => (
        <Toggle
          variant={row.is_active ? 'primary' : 'error'}
          checked={row.is_active}
          size="sm"
          aria-label={row.is_active ? 'Active' : 'Inactive'}
          onChange={() => updateRoute(row.id, { is_active: !row.is_active })}
        />
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'center',
      width: '140px',
      customRender: (value, row) => (
        <div className="flex items-center justify-center gap-1">
          <Tooltip tip="Create child route">
            <Button
              size="xs"
              variant="ghost"
              onClick={() => openModal('createChild', { parentRoute: row, moduleId })}
              className="text-primary hover:bg-primary/10"
            >
              {getIconComponent('Plus', 14)}
            </Button>
          </Tooltip>
          <Tooltip tip="Edit route">
            <Button
              size="xs"
              variant="ghost"
              onClick={() => openModal('edit', row)}
            >
              {getIconComponent('Edit', 14)}
            </Button>
          </Tooltip>
          <Tooltip tip="Delete route">
            <Button
              size="xs"
              variant="ghost"
              onClick={() => openModal('delete', row)}
              className="text-error hover:bg-error/10"
            >
              {getIconComponent('Trash2', 14)}
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ]

  return (
    <div className="bg-base-200/50 rounded-lg p-4">
      <InfinityTable
        data={childRoutes}
        columns={childColumns}
        loading={loading}
        title={`${parentRoute.label} - Child Routes`}
        subtitle={`${childRoutes.length} child routes`}
        zebra={false}
        hoverable={true}
        bordered={false}
        headerActions={
          <Typography variant="caption" className="text-base-content/60">
            Nested routes under {parentRoute.label}
          </Typography>
        }
      />
    </div>
  )
}

// Main Routes View Component
export const RoutesView: React.FC = () => {
  const {
    selectedRouteIds,
    moduleFilters,
    loading,
    error,
    fetchAllRoutes,
    getParentRoutes,
    createRoute,
    updateRoute,
    deleteRoute,
    bulkDeleteRoutes,
    setModuleFilters,
    clearModuleFilters,
    setSelectedRouteIds,
    setExpandedRows,
    clearError,
  } = useRoutesStore()

  const {
    modules,
    fetchModules,
  } = useModulesStore()

  const {
    modals,
    data: modalData,
    editingItem: editingRoute,
    deletingItem: deletingRoute,
    openModal,
    closeModal,
  } = useModals()

  useEffect(() => {
    fetchModules()
    fetchAllRoutes()
  }, [fetchModules, fetchAllRoutes])

  // Get active modules only
  const activeModules = useMemo(() => {
    return modules.filter(module => module.is_active)
  }, [modules])

  // Generate columns for parent routes
  const getParentRouteColumns = (moduleId: number): ColumnConfig<Route>[] => [
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
      key: 'label',
      header: 'Route',
      customRender: (value, row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Typography variant="body2" className="font-medium">
              {row.label}
            </Typography>
            {row.children_count > 0 && (
              <Badge variant="info" size="xs">
                {row.children_count} children
              </Badge>
            )}
          </div>
          <Typography variant="caption" className="text-base-content/60 font-mono">
            {row.route}
          </Typography>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      width: '80px',
      align: 'center',
      sortable: true,
      customRender: (value, row) => (
        <Badge variant="secondary" size="sm">
          {row.priority}
        </Badge>
      ),
    },
    {
      key: 'is_sidebar',
      header: 'Sidebar',
      width: '80px',
      customRender: (value, row) => (
        <Toggle
          variant={row.is_sidebar ? 'primary' : 'error'}
          checked={row.is_sidebar}
          aria-label={row.is_sidebar ? 'In Sidebar' : 'Not in Sidebar'}
          onChange={() => updateRoute(row.id, { is_sidebar: !row.is_sidebar })}
        />
      ),
    },
    {
      key: 'is_active',
      header: 'Status',
      width: '80px',
      customRender: (value, row) => (
        <Toggle
          variant={row.is_active ? 'primary' : 'error'}
          checked={row.is_active}
          aria-label={row.is_active ? 'Active' : 'Inactive'}
          onChange={() => updateRoute(row.id, { is_active: !row.is_active })}
        />
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'center',
      width: '140px',
      customRender: (value, row) => (
        <div className="flex items-center justify-center gap-1">
          <Tooltip tip="Create child route">
            <Button
              size="xs"
              variant="ghost"
              onClick={() => openModal('createChild', { parentRoute: row, moduleId })}
              className="text-primary hover:bg-primary/10"
            >
              {getIconComponent('Plus', 16)}
            </Button>
          </Tooltip>
          <Tooltip tip="Edit route">
            <Button
              size="xs"
              variant="ghost"
              onClick={() => openModal('edit', row)}
            >
              {getIconComponent('Edit', 16)}
            </Button>
          </Tooltip>
          <Tooltip tip="Delete route">
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

  // Filter configuration for each module
  const getModuleFilterConfigs = (moduleId: number): FilterConfig[] => {
    const filters = moduleFilters[moduleId] || { search: '' }
    
    return [
      {
        type: 'search',
        key: 'search',
        label: 'Search Routes',
        placeholder: 'Search by label or route path...',
        value: filters.search,
        onChange: (value) => setModuleFilters(moduleId, { search: value }),
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
        onChange: (value) => setModuleFilters(moduleId, {
          is_active: value === '' ? undefined : value === 'true'
        }),
      },
      {
        type: 'select',
        key: 'is_sidebar',
        label: 'Sidebar',
        placeholder: 'All Routes',
        options: [
          { value: 'true', label: 'In Sidebar' },
          { value: 'false', label: 'Not in Sidebar' },
        ],
        value: filters.is_sidebar?.toString(),
        onChange: (value) => setModuleFilters(moduleId, {
          is_sidebar: value === '' ? undefined : value === 'true'
        }),
      },
    ]
  }

  // Get filtered parent routes for a module
  const getFilteredParentRoutes = (moduleId: number) => {
    const parentRoutes = getParentRoutes(moduleId)
    const filters = moduleFilters[moduleId] || { search: '' }

    let filtered = [...parentRoutes]

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(route =>
        route.label.toLowerCase().includes(searchTerm) ||
        route.route.toLowerCase().includes(searchTerm)
      )
    }

    // Apply status filters
    if (filters.is_active !== undefined) {
      filtered = filtered.filter(route => route.is_active === filters.is_active)
    }

    if (filters.is_sidebar !== undefined) {
      filtered = filtered.filter(route => route.is_sidebar === filters.is_sidebar)
    }

    return filtered
  }

  // Form fields for create/edit route
  const getRouteFormFields = (isChild = false) => [
    {
      type: 'select' as const,
      name: 'module_id',
      label: 'Module',
      placeholder: 'Select module',
      required: true,
      options: modules.map(module => ({
        value: module.id.toString(),
        label: module.label
      })),
      disabled: isChild,
    },
    ...(isChild ? [{
      type: 'input' as const,
      name: 'parent_id',
      label: 'Parent Route ID',
      placeholder: 'Parent route ID',
      disabled: true,
    }] : []),
    {
      type: 'input' as const,
      name: 'route',
      label: 'Route Path',
      placeholder: 'e.g., /infinity/administration/users',
      required: true,
    },
    {
      type: 'input' as const,
      name: 'label',
      label: 'Display Label',
      placeholder: 'e.g., Users',
      required: true,
    },
    {
      type: 'iconPicker' as const,
      name: 'icon',
      label: 'Route Icon',
      required: true,
      iconSize: 20,
      showPreview: true,
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
      name: 'is_sidebar',
      label: 'Show in Sidebar',
    },
    {
      type: 'toggle' as const,
      name: 'is_active',
      label: 'Active Status',
    },
  ]

  // Event handlers
  const handleCreateSubmit = async (data: any) => {
    const routeData: CreateRouteRequest = {
      route: data.route,
      label: data.label,
      icon: data.icon,
      module_id: parseInt(data.module_id),
      parent_id: data.parent_id ? parseInt(data.parent_id) : null,
      priority: parseInt(data.priority),
      is_sidebar: data.is_sidebar ?? true,
      is_active: data.is_active ?? true,
    }
    await createRoute(routeData)
  }

  const handleEditSubmit = async (data: any) => {
    if (!editingRoute) return
    await updateRoute(editingRoute.id, {
      route: data.route,
      label: data.label,
      icon: data.icon,
      module_id: parseInt(data.module_id),
      parent_id: data.parent_id ? parseInt(data.parent_id) : null,
      priority: parseInt(data.priority),
      is_sidebar: data.is_sidebar,
      is_active: data.is_active,
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deletingRoute) return
    await deleteRoute(deletingRoute.id)
  }

  const handleBulkDeleteConfirm = async (moduleId: number) => {
    const ids = selectedRouteIds[moduleId] || []
    if (ids.length === 0) return
    const numericIds = ids.map(id => parseInt(id))
    await bulkDeleteRoutes(numericIds)
    setSelectedRouteIds(moduleId, [])
  }

  return (
    <div className="p-6 space-y-8">
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

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h3" className="font-bold">
            Routes Management
          </Typography>
          <Typography variant="body1" className="text-base-content/60">
            Manage system routes and navigation structure across modules
          </Typography>
        </div>
        <Badge variant="info" size="lg">
          {activeModules.length} Active Modules
        </Badge>
      </div>

      {/* Routes Tables by Module */}
      {activeModules.map((module: Module) => {
        const parentRoutes = getFilteredParentRoutes(module.id)
        const moduleSelectedIds = selectedRouteIds[module.id] || []

        return (
          <div key={module.id} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {getIconComponent(module.icon, 24)}
                <Typography variant="h5" className="font-semibold">
                  {module.label}
                </Typography>
              </div>
              <Badge variant="secondary" size="sm">
                {parentRoutes.length} parent routes
              </Badge>
              <Badge variant="info" size="sm">
                Module ID: {module.id}
              </Badge>
            </div>

            <InfinityTable
              data={parentRoutes}
              columns={getParentRouteColumns(module.id)}
              loading={loading}
              title={`${module.label} Routes`}
              subtitle={`Parent routes for ${module.label} module`}
              filters={getModuleFilterConfigs(module.id)}
              selectable={true}
              selectedRows={moduleSelectedIds}
              onRowSelect={(ids) => setSelectedRouteIds(module.id, ids)}
              rowIdKey="id"
              expandable={true}
              expandedContent={(row) => (
                <ChildRoutesTable
                  parentRoute={row}
                  moduleId={module.id}
                />
              )}
              headerActions={
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearModuleFilters(module.id)}
                    className="gap-2"
                  >
                    {getIconComponent('RefreshCw', 16)}
                    Reset Filters
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => openModal('create', { moduleId: module.id })}
                    className="gap-2"
                  >
                    {getIconComponent('Plus', 16)}
                    Add Route
                  </Button>
                </div>
              }
              bulkActions={[
                {
                  label: 'Delete Selected',
                  icon: getIconComponent('Trash2', 16),
                  onClick: () => openModal('bulkDelete', { moduleId: module.id }),
                  variant: 'error',
                },
              ]}
              zebra={true}
              hoverable={true}
              bordered={true}
            />
          </div>
        )
      })}

      {/* No Modules Message */}
      {activeModules.length === 0 && !loading && (
        <div className="text-center py-12">
          <Typography variant="h6" className="text-base-content/60">
            No active modules found
          </Typography>
          <Typography variant="body2" className="text-base-content/40">
            Create some modules first to manage routes
          </Typography>
        </div>
      )}

      {/* Create Route Modal */}
      <FormModal
        isOpen={modals.create}
        onClose={() => closeModal('create')}
        title="Create New Route"
        fields={getRouteFormFields()}
        onSubmit={handleCreateSubmit}
        submitText="Create Route"
        initialValues={{
          module_id: modalData?.moduleId?.toString(),
          is_active: true,
          is_sidebar: true,
          priority: 0,
        }}
        loading={loading}
      />

      {/* Create Child Route Modal */}
      <FormModal
        isOpen={modals.createChild}
        onClose={() => closeModal('createChild')}
        title="Create Child Route"
        fields={getRouteFormFields(true)}
        onSubmit={handleCreateSubmit}
        submitText="Create Child Route"
        initialValues={{
          module_id: modalData?.moduleId?.toString(),
          parent_id: modalData?.parentRoute?.id?.toString(),
          is_active: true,
          is_sidebar: true,
          priority: 0,
        }}
        loading={loading}
      />

      {/* Edit Route Modal */}
      <FormModal
        isOpen={modals.edit}
        onClose={() => closeModal('edit')}
        title="Edit Route"
        fields={getRouteFormFields()}
        onSubmit={handleEditSubmit}
        submitText="Update Route"
        initialValues={editingRoute ? {
          route: editingRoute.route,
          label: editingRoute.label,
          icon: editingRoute.icon,
          module_id: editingRoute.module_id.toString(),
          parent_id: editingRoute.parent_id?.toString() || '',
          priority: editingRoute.priority,
          is_sidebar: editingRoute.is_sidebar,
          is_active: editingRoute.is_active,
        } : {}}
        loading={loading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={modals.delete}
        onClose={() => closeModal('delete')}
        title="Confirm Delete"
        message={`Are you sure you want to delete the route "${deletingRoute?.label}"? This action cannot be undone.`}
        confirmText="Delete Route"
        onConfirm={handleDeleteConfirm}
        variant="error"
        icon={getIconComponent('Trash2', 24)}
      />

      {/* Bulk Delete Modal */}
      <BulkActionModal
        isOpen={modals.bulkDelete}
        onClose={() => closeModal('bulkDelete')}
        title="Bulk Delete Routes"
        count={modalData?.moduleId ? (selectedRouteIds[modalData.moduleId] || []).length : 0}
        action="Delete"
        onConfirm={() => {
          if (modalData?.moduleId) {
            return handleBulkDeleteConfirm(modalData.moduleId)
          }
        }}
        variant="error"
        itemType="routes"
      />
    </div>
  )
}