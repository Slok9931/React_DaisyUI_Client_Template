import React, { useState, useCallback, useMemo } from 'react'
import {
  Card,
  CardBody,
  Button,
  Badge,
  Avatar,
  Dropdown,
  Typography
} from '@/components'
import { FormModal, ConfirmModal, useModals } from '@/features/modals'
import { getIconComponent } from '@/utils'

// Types
export interface KanbanTask {
  id: string
  title: string
  description?: string
  assignee?: {
    name: string
    avatar?: string
    initials?: string
  }
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface KanbanColumn {
  id: string
  title: string
  color?: string
  tasks: KanbanTask[]
  limit?: number
}

export interface KanbanBoard {
  id: string
  title: string
  columns: KanbanColumn[]
}

interface InfinityKanbanProps {
  board: KanbanBoard
  onTaskMove?: (taskId: string, fromColumnId: string, toColumnId: string, newIndex?: number) => void
  onTaskCreate?: (columnId: string, task: Omit<KanbanTask, 'id' | 'createdAt' | 'updatedAt'>) => void
  onTaskUpdate?: (taskId: string, updates: Partial<KanbanTask>) => void
  onTaskDelete?: (taskId: string, columnId: string) => void
  onColumnCreate?: (column: Omit<KanbanColumn, 'id'>) => void
  onColumnUpdate?: (columnId: string, updates: Partial<KanbanColumn>) => void
  onColumnDelete?: (columnId: string) => void
  editable?: boolean
  showMetrics?: boolean
  className?: string
}

const PRIORITY_COLORS = {
  low: 'badge-info',
  medium: 'badge-warning',
  high: 'badge-error',
  urgent: 'badge-error'
}

const PRIORITY_ICONS = {
  low: 'ArrowDown',
  medium: 'Minus',
  high: 'ArrowUp',
  urgent: 'Zap'
}

export const InfinityKanban: React.FC<InfinityKanbanProps> = ({
  board,
  onTaskMove,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
  onColumnCreate,
  onColumnUpdate,
  onColumnDelete,
  editable = true,
  showMetrics = true,
  className = ''
}) => {
  // State management
  const [draggedTask, setDraggedTask] = useState<KanbanTask | null>(null)
  const [draggedFromColumn, setDraggedFromColumn] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const [selectedColumnId, setSelectedColumnId] = useState<string>('')
  
  // Use the modal system
  const { modals, openModal, closeModal, editingItem, deletingItem } = useModals()

  // Computed metrics
  const boardMetrics = useMemo(() => {
    const totalTasks = board.columns.reduce((sum, col) => sum + col.tasks.length, 0)
    const tasksByPriority = board.columns.reduce((acc, col) => {
      col.tasks.forEach(task => {
        acc[task.priority] = (acc[task.priority] || 0) + 1
      })
      return acc
    }, {} as Record<string, number>)
    
    return {
      totalTasks,
      totalColumns: board.columns.length,
      tasksByPriority
    }
  }, [board])

  // Drag and drop handlers
  const handleDragStart = useCallback((task: KanbanTask, columnId: string) => {
    setDraggedTask(task)
    setDraggedFromColumn(columnId)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    setDragOverColumn(columnId)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, toColumnId: string) => {
    e.preventDefault()
    
    if (draggedTask && draggedFromColumn && draggedFromColumn !== toColumnId) {
      onTaskMove?.(draggedTask.id, draggedFromColumn, toColumnId)
    }
    
    setDraggedTask(null)
    setDraggedFromColumn(null)
    setDragOverColumn(null)
  }, [draggedTask, draggedFromColumn, onTaskMove])

  // Modal handlers
  const openTaskModal = useCallback((columnId?: string, task?: KanbanTask) => {
    setSelectedColumnId(columnId || '')
    if (task) {
      openModal('edit', task)
    } else {
      openModal('create', { columnId })
    }
  }, [openModal])

  const openColumnModal = useCallback((column?: KanbanColumn) => {
    if (column) {
      openModal('editColumn', column)
    } else {
      openModal('createColumn')
    }
  }, [openModal])

  const getTaskInitialValues = useCallback(() => {
    if (editingItem) {
      return {
        title: editingItem.title,
        description: editingItem.description || '',
        assigneeName: editingItem.assignee?.name || '',
        priority: editingItem.priority,
        dueDate: editingItem.dueDate || '',
        tags: editingItem.tags?.join(', ') || ''
      }
    }
    return {
      title: '',
      description: '',
      assigneeName: '',
      priority: 'medium',
      dueDate: '',
      tags: ''
    }
  }, [editingItem])

  const getColumnInitialValues = useCallback(() => {
    if (editingItem) {
      return {
        title: editingItem.title,
        color: editingItem.color || '',
        limit: editingItem.limit || ''
      }
    }
    return {
      title: '',
      color: '',
      limit: ''
    }
  }, [editingItem])

  const handleTaskFormSubmit = useCallback((formData: any) => {
    const taskData = {
      title: formData.title,
      description: formData.description,
      assignee: formData.assigneeName ? {
        name: formData.assigneeName,
        initials: formData.assigneeName.charAt(0).toUpperCase()
      } : undefined,
      priority: formData.priority,
      dueDate: formData.dueDate,
      tags: formData.tags ? formData.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) : []
    }

    if (editingItem) {
      onTaskUpdate?.(editingItem.id, taskData)
    } else {
      onTaskCreate?.(selectedColumnId, taskData)
    }
  }, [editingItem, selectedColumnId, onTaskUpdate, onTaskCreate])

  const handleColumnFormSubmit = useCallback((formData: any) => {
    const columnData = {
      title: formData.title,
      color: formData.color || undefined,
      limit: formData.limit ? parseInt(formData.limit) : undefined
    }

    if (editingItem) {
      onColumnUpdate?.(editingItem.id, columnData)
    } else {
      onColumnCreate?.({ ...columnData, tasks: [] })
    }
  }, [editingItem, onColumnUpdate, onColumnCreate])

  const renderTask = useCallback((task: KanbanTask, columnId: string) => (
    <div
      key={task.id}
      className="mb-3 cursor-move hover:shadow-lg transition-shadow duration-200"
      draggable={editable}
      onDragStart={() => handleDragStart(task, columnId)}
    >
      <Card className="h-full">
        <CardBody className="p-3">
          <div className="flex justify-between items-start mb-2">
            <Typography variant="h6" className="text-sm font-medium truncate pr-2">
              {task.title}
            </Typography>
            {editable && (
              <Dropdown
                trigger={
                  <Button size="xs" variant="ghost" square>
                    {getIconComponent('MoreVertical', 14)}
                  </Button>
                }
                items={[
                  {
                    label: 'Edit',
                    onClick: () => openTaskModal(columnId, task),
                    icon: getIconComponent('Edit', 14)
                  },
                  {
                    label: 'Delete',
                    onClick: () => openModal('delete', { ...task, columnId }),
                    icon: getIconComponent('Trash2', 14)
                  }
                ]}
              />
            )}
          </div>

          {task.description && (
            <Typography variant="body2" className="text-xs text-base-content/70 mb-2 line-clamp-2">
              {task.description}
            </Typography>
          )}

          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {task.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} size="xs" variant="ghost">
                  {tag}
                </Badge>
              ))}
              {task.tags.length > 3 && (
                <Badge size="xs" variant="ghost">
                  +{task.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              <Badge 
                size="xs" 
                className={PRIORITY_COLORS[task.priority]}
              >
                {getIconComponent(PRIORITY_ICONS[task.priority], 10)}
                <span className="ml-1 capitalize">{task.priority}</span>
              </Badge>
              
              {task.dueDate && (
                <Typography variant="caption" className="text-xs text-base-content/60">
                  {new Date(task.dueDate).toLocaleDateString()}
                </Typography>
              )}
            </div>

            {task.assignee?.name && (
              <Avatar
                size="xs"
                src={task.assignee.avatar}
                placeholder={task.assignee.initials || task.assignee.name.charAt(0)}
              />
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  ), [editable, handleDragStart, openTaskModal, onTaskDelete])

  const renderColumn = useCallback((column: KanbanColumn) => (
    <div
      key={column.id}
      className={`flex-shrink-0 w-80 bg-base-200 rounded-lg p-4 ${
        dragOverColumn === column.id ? 'ring-2 ring-primary' : ''
      }`}
      onDragOver={(e) => handleDragOver(e, column.id)}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, column.id)}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {column.color && (
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: column.color }}
            />
          )}
          <Typography variant="h6" className="font-semibold">
            {column.title}
          </Typography>
          <Badge size="sm" variant="ghost">
            {column.tasks.length}
            {column.limit && `/${column.limit}`}
          </Badge>
        </div>

        {editable && (
          <Dropdown
            trigger={
              <Button size="sm" variant="ghost" square>
                {getIconComponent('MoreHorizontal', 16)}
              </Button>
            }
            items={[
              {
                label: 'Add Task',
                onClick: () => openTaskModal(column.id),
                icon: getIconComponent('Plus', 14)
              },
              {
                label: 'Edit Column',
                onClick: () => openColumnModal(column),
                icon: getIconComponent('Edit', 14)
              },
              {
                label: '---',
                divider: true
              },
              {
                label: 'Delete Column',
                onClick: () => openModal('deleteColumn', column),
                icon: getIconComponent('Trash2', 14)
              }
            ]}
          />
        )}
      </div>

      {/* Tasks */}
      <div className="min-h-[200px] max-h-[calc(100vh-300px)] overflow-y-auto">
        {column.tasks.map(task => renderTask(task, column.id))}
        
          {editable && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 border-2 border-dashed border-base-300 hover:border-primary"
              onClick={() => openTaskModal(column.id)}
            >
              {getIconComponent('Plus', 16)}
              Add Task
            </Button>
          )}
      </div>
    </div>
  ), [dragOverColumn, handleDragOver, handleDragLeave, handleDrop, renderTask, editable, openTaskModal, openColumnModal, onColumnDelete])

  return (
    <div className={`w-full ${className}`}>
      {/* Board Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Typography variant="h4" className="font-bold mb-2">
              {board.title}
            </Typography>
            
            {showMetrics && (
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="text-base-content/70">
                  {boardMetrics.totalTasks} tasks across {boardMetrics.totalColumns} columns
                </span>
                <div className="flex gap-2">
                  {Object.entries(boardMetrics.tasksByPriority).map(([priority, count]) => (
                    <Badge 
                      key={priority} 
                      size="sm" 
                      className={PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS]}
                    >
                      {priority}: {count}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {editable && (
            <Button
              variant="primary"
              onClick={() => openColumnModal()}
              className="flex-shrink-0"
            >
              {getIconComponent('Plus', 16)}
              Add Column
            </Button>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-4 min-w-max">
          {board.columns.map(renderColumn)}
        </div>
      </div>

      {/* Task Form Modal */}
      <FormModal
        isOpen={modals.create || modals.edit}
        onClose={() => closeModal(modals.edit ? 'edit' : 'create')}
        title={editingItem ? 'Edit Task' : 'Create Task'}
        fields={[
          {
            name: 'title',
            type: 'input',
            label: 'Title',
            placeholder: 'Enter task title',
            required: true,
            gridCols: 6
          },
          {
            name: 'description',
            type: 'textarea',
            label: 'Description',
            placeholder: 'Enter task description',
            rows: 3,
            gridCols: 6
          },
          {
            name: 'priority',
            type: 'select',
            label: 'Priority',
            options: [
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'urgent', label: 'Urgent' }
            ],
            gridCols: 6
          },
          {
            name: 'dueDate',
            type: 'datePicker',
            label: 'Due Date',
            gridCols: 6
          },
          {
            name: 'assigneeName',
            type: 'input',
            label: 'Assignee Name',
            placeholder: 'Enter assignee name',
            gridCols: 6
          },
          {
            name: 'tags',
            type: 'input',
            label: 'Tags',
            placeholder: 'Enter tags separated by commas',
            helperText: 'Separate multiple tags with commas',
            gridCols: 6
          }
        ]}
        onSubmit={handleTaskFormSubmit}
        initialValues={getTaskInitialValues()}
        columns={2}
        submitText={editingItem ? 'Update Task' : 'Create Task'}
      />

      {/* Column Form Modal */}
      <FormModal
        isOpen={modals.createColumn || modals.editColumn}
        onClose={() => closeModal(modals.editColumn ? 'editColumn' : 'createColumn')}
        title={editingItem && (modals.editColumn) ? 'Edit Column' : 'Create Column'}
        fields={[
          {
            name: 'title',
            type: 'input',
            label: 'Title',
            placeholder: 'Enter column title',
            required: true,
            gridCols: 6
          },
          {
            name: 'color',
            type: 'colorPicker',
            label: 'Color',
            gridCols: 6
          },
          {
            name: 'limit',
            type: 'input',
            inputType: 'number',
            label: 'Task Limit',
            placeholder: 'No limit',
            helperText: 'Maximum number of tasks in this column',
            gridCols: 6
          }
        ]}
        onSubmit={handleColumnFormSubmit}
        initialValues={getColumnInitialValues()}
        columns={2}
        submitText={editingItem && modals.editColumn ? 'Update Column' : 'Create Column'}
      />

      {/* Delete Task Confirmation Modal */}
      <ConfirmModal
        isOpen={modals.delete}
        onClose={() => closeModal('delete')}
        title="Delete Task"
        message={`Are you sure you want to delete "${deletingItem?.title}"? This action cannot be undone.`}
        confirmText="Delete Task"
        cancelText="Cancel"
        onConfirm={() => {
          if (deletingItem) {
            onTaskDelete?.(deletingItem.id, deletingItem.columnId)
          }
        }}
        variant="error"
        icon={getIconComponent('Trash2', 24)}
      />

      {/* Delete Column Confirmation Modal */}
      <ConfirmModal
        isOpen={modals.deleteColumn}
        onClose={() => closeModal('deleteColumn')}
        title="Delete Column"
        message={`Are you sure you want to delete the "${deletingItem?.title}" column? All tasks in this column will be lost. This action cannot be undone.`}
        confirmText="Delete Column"
        cancelText="Cancel"
        onConfirm={() => {
          if (deletingItem) {
            onColumnDelete?.(deletingItem.id)
          }
        }}
        variant="error"
        icon={getIconComponent('Trash2', 24)}
      />
    </div>
  )
}

export default InfinityKanban