import React, { useState } from 'react'
import { InfinityKanban, KanbanBoard, KanbanColumn, KanbanTask, Typography } from '@/components'

const initialBoard: KanbanBoard = {
    id: 'demo-board',
    title: 'Project Development Board',
    columns: [
        {
            id: 'backlog',
            title: 'Backlog',
            color: '#6B7280',
            tasks: [
                {
                    id: 'task-1',
                    title: 'User Authentication System',
                    description: 'Implement login, register, and password reset functionality',
                    assignee: {
                        name: 'John Doe',
                        initials: 'JD',
                        avatar: ''
                    },
                    priority: 'high',
                    dueDate: '2024-02-15',
                    tags: ['backend', 'security'],
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2024-01-02T00:00:00Z'
                },
                {
                    id: 'task-2',
                    title: 'Design System Components',
                    description: 'Create reusable UI components for the design system',
                    assignee: {
                        name: 'Jane Smith',
                        initials: 'JS'
                    },
                    priority: 'medium',
                    dueDate: '2024-02-20',
                    tags: ['frontend', 'design'],
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2024-01-01T00:00:00Z'
                }
            ],
            limit: 10
        },
        {
            id: 'in-progress',
            title: 'In Progress',
            color: '#F59E0B',
            tasks: [
                {
                    id: 'task-3',
                    title: 'API Integration',
                    description: 'Integrate with third-party payment API',
                    assignee: {
                        name: 'Mike Johnson',
                        initials: 'MJ'
                    },
                    priority: 'urgent',
                    dueDate: '2024-02-10',
                    tags: ['backend', 'api', 'payment'],
                    createdAt: '2024-01-03T00:00:00Z',
                    updatedAt: '2024-01-05T00:00:00Z'
                }
            ],
            limit: 3
        },
        {
            id: 'review',
            title: 'Code Review',
            color: '#8B5CF6',
            tasks: [
                {
                    id: 'task-4',
                    title: 'Database Migration Scripts',
                    description: 'Review and test database migration scripts',
                    assignee: {
                        name: 'Sarah Wilson',
                        initials: 'SW'
                    },
                    priority: 'medium',
                    dueDate: '2024-02-12',
                    tags: ['database', 'migration'],
                    createdAt: '2024-01-04T00:00:00Z',
                    updatedAt: '2024-01-06T00:00:00Z'
                }
            ],
            limit: 5
        },
        {
            id: 'done',
            title: 'Done',
            color: '#10B981',
            tasks: [
                {
                    id: 'task-5',
                    title: 'Project Setup',
                    description: 'Initialize project structure and dependencies',
                    assignee: {
                        name: 'Alex Brown',
                        initials: 'AB'
                    },
                    priority: 'low',
                    dueDate: '2024-01-15',
                    tags: ['setup', 'config'],
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2024-01-10T00:00:00Z'
                },
                {
                    id: 'task-6',
                    title: 'Environment Configuration',
                    description: 'Set up development, staging, and production environments',
                    assignee: {
                        name: 'Chris Davis',
                        initials: 'CD'
                    },
                    priority: 'medium',
                    dueDate: '2024-01-20',
                    tags: ['devops', 'config'],
                    createdAt: '2024-01-02T00:00:00Z',
                    updatedAt: '2024-01-15T00:00:00Z'
                }
            ]
        }
    ]
}

const KanbanView: React.FC = () => {
    const [board, setBoard] = useState<KanbanBoard>(initialBoard)

    const handleTaskMove = (taskId: string, fromColumnId: string, toColumnId: string) => {
        setBoard(prev => {
            const newBoard = { ...prev }

            // Find task and remove from source column
            let taskToMove: KanbanTask | null = null
            newBoard.columns = newBoard.columns.map(column => {
                if (column.id === fromColumnId) {
                    taskToMove = column.tasks.find(task => task.id === taskId) || null
                    return {
                        ...column,
                        tasks: column.tasks.filter(task => task.id !== taskId)
                    }
                }
                return column
            })

            // Add task to destination column
            if (taskToMove) {
                newBoard.columns = newBoard.columns.map(column => {
                    if (column.id === toColumnId) {
                        return {
                            ...column,
                            tasks: [...column.tasks, { ...taskToMove!, updatedAt: new Date().toISOString() }]
                        }
                    }
                    return column
                })
            }

            return newBoard
        })
    }

    const handleTaskCreate = (columnId: string, taskData: Omit<KanbanTask, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newTask: KanbanTask = {
            ...taskData,
            id: `task-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        setBoard(prev => ({
            ...prev,
            columns: prev.columns.map(column =>
                column.id === columnId
                    ? { ...column, tasks: [...column.tasks, newTask] }
                    : column
            )
        }))
    }

    const handleTaskUpdate = (taskId: string, updates: Partial<KanbanTask>) => {
        setBoard(prev => ({
            ...prev,
            columns: prev.columns.map(column => ({
                ...column,
                tasks: column.tasks.map(task =>
                    task.id === taskId
                        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
                        : task
                )
            }))
        }))
    }

    const handleTaskDelete = (taskId: string, columnId: string) => {
        setBoard(prev => ({
            ...prev,
            columns: prev.columns.map(column =>
                column.id === columnId
                    ? { ...column, tasks: column.tasks.filter(task => task.id !== taskId) }
                    : column
            )
        }))
    }

    const handleColumnCreate = (columnData: Omit<KanbanColumn, 'id'>) => {
        const newColumn: KanbanColumn = {
            ...columnData,
            id: `column-${Date.now()}`
        }

        setBoard(prev => ({
            ...prev,
            columns: [...prev.columns, newColumn]
        }))
    }

    const handleColumnUpdate = (columnId: string, updates: Partial<KanbanColumn>) => {
        setBoard(prev => ({
            ...prev,
            columns: prev.columns.map(column =>
                column.id === columnId
                    ? { ...column, ...updates }
                    : column
            )
        }))
    }

    const handleColumnDelete = (columnId: string) => {
        setBoard(prev => ({
            ...prev,
            columns: prev.columns.filter(column => column.id !== columnId)
        }))
    }

    return (
        <div className="p-6">
            <InfinityKanban
                board={board}
                onTaskMove={handleTaskMove}
                onTaskCreate={handleTaskCreate}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
                onColumnCreate={handleColumnCreate}
                onColumnUpdate={handleColumnUpdate}
                onColumnDelete={handleColumnDelete}
                editable={true}
                showMetrics={true}
            />
        </div>
    )
}

export { KanbanView }
