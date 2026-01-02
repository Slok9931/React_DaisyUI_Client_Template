import React, { useState, useCallback, useMemo } from 'react'
import { Button, Card, Select, Tooltip } from '@/components'
import { FormModal, ConfirmModal, useModals } from '@/features/modals'
import { getIconComponent } from '@/utils'

// Types
interface CalendarEvent {
    id: string
    title: string
    description?: string
    startDate: Date
    endDate: Date
    allDay: boolean
    color: string
    location?: string
    attendees?: string[]
    category?: string
    reminder?: number // minutes before event
    recurring?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'
}

interface CalendarView {
    type: 'month' | 'week' | 'day' | 'agenda'
    date: Date
}

interface EventFormData {
    title: string
    description: string
    startDate: Date
    endDate: Date
    startTime: string
    endTime: string
    allDay: boolean
    color: string
    location: string
    attendees: string
    category: string
    reminder: number
    recurring: string
}

const EVENT_COLORS = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // yellow
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316', // orange
]

const CATEGORIES = [
    'Work', 'Personal', 'Family', 'Health', 'Travel', 'Study', 'Meeting', 'Other'
]

const REMINDER_OPTIONS = [
    { value: 0, label: 'No reminder' },
    { value: 5, label: '5 minutes before' },
    { value: 15, label: '15 minutes before' },
    { value: 30, label: '30 minutes before' },
    { value: 60, label: '1 hour before' },
    { value: 1440, label: '1 day before' },
]

export const InfinityCalendar: React.FC = () => {
    // State management
    const [view, setView] = useState<CalendarView>({ type: 'month', date: new Date() })
    const [events, setEvents] = useState<CalendarEvent[]>([])
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [filterCategory, setFilterCategory] = useState<string>('all')

    // Use the modal system
    const { modals, openModal, closeModal, editingItem, deletingItem } = useModals()

    // Calendar utilities
    const getDaysInMonth = useCallback((date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }, [])

    const getFirstDayOfMonth = useCallback((date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    }, [])

    const isSameDay = useCallback((date1: Date, date2: Date) => {
        return (
            date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
        )
    }, [])

    const isToday = useCallback((date: Date) => {
        return isSameDay(date, new Date())
    }, [isSameDay])

    const formatTime = useCallback((date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }, [])

    // Event management
    const createEvent = useCallback((eventData: EventFormData) => {
        const event: CalendarEvent = {
            id: Date.now().toString(),
            title: eventData.title,
            description: eventData.description,
            startDate: eventData.allDay
                ? eventData.startDate
                : new Date(`${eventData.startDate.toDateString()} ${eventData.startTime}`),
            endDate: eventData.allDay
                ? eventData.endDate
                : new Date(`${eventData.endDate.toDateString()} ${eventData.endTime}`),
            allDay: eventData.allDay,
            color: eventData.color,
            location: eventData.location,
            attendees: eventData.attendees ? eventData.attendees.split(',').map(a => a.trim()) : [],
            category: eventData.category,
            reminder: eventData.reminder,
            recurring: eventData.recurring as CalendarEvent['recurring'],
        }

        setEvents(prev => [...prev, event])
    }, [])

    const updateEvent = useCallback((eventId: string, eventData: EventFormData) => {
        setEvents(prev => prev.map(event =>
            event.id === eventId
                ? {
                    ...event,
                    title: eventData.title,
                    description: eventData.description,
                    startDate: eventData.allDay
                        ? eventData.startDate
                        : new Date(`${eventData.startDate.toDateString()} ${eventData.startTime}`),
                    endDate: eventData.allDay
                        ? eventData.endDate
                        : new Date(`${eventData.endDate.toDateString()} ${eventData.endTime}`),
                    allDay: eventData.allDay,
                    color: eventData.color,
                    location: eventData.location,
                    attendees: eventData.attendees ? eventData.attendees.split(',').map(a => a.trim()) : [],
                    category: eventData.category,
                    reminder: eventData.reminder,
                    recurring: eventData.recurring as CalendarEvent['recurring'],
                }
                : event
        ))
    }, [])

    const deleteEvent = useCallback((eventId: string) => {
        setEvents(prev => prev.filter(event => event.id !== eventId))
    }, [])

    // Get events for a specific date
    const getEventsForDate = useCallback((date: Date) => {
        return events.filter(event => {
            if (event.allDay) {
                return isSameDay(event.startDate, date) ||
                    (event.startDate <= date && event.endDate >= date)
            }
            return isSameDay(event.startDate, date)
        }).filter(event => {
            if (filterCategory === 'all') return true
            return event.category === filterCategory
        })
    }, [events, filterCategory, isSameDay])

    // Navigation functions
    const navigateMonth = useCallback((direction: 'prev' | 'next') => {
        setView(prev => ({
            ...prev,
            date: new Date(prev.date.getFullYear(), prev.date.getMonth() + (direction === 'next' ? 1 : -1), 1)
        }))
    }, [])

    const navigateToToday = useCallback(() => {
        setView(prev => ({ ...prev, date: new Date() }))
    }, [])

    // Modal handlers
    const openEventModal = useCallback((date?: Date, event?: CalendarEvent) => {
        setSelectedDate(date || null)
        if (event) {
            openModal('edit', event)
        } else {
            openModal('create', { date })
        }
    }, [openModal])

    const getEventInitialValues = useCallback(() => {
        if (editingItem) {
            return {
                title: editingItem.title,
                description: editingItem.description || '',
                startDate: editingItem.startDate,
                endDate: editingItem.endDate,
                startTime: formatTime(editingItem.startDate),
                endTime: formatTime(editingItem.endDate),
                allDay: editingItem.allDay,
                color: editingItem.color,
                location: editingItem.location || '',
                attendees: editingItem.attendees?.join(', ') || '',
                category: editingItem.category || 'Personal',
                reminder: editingItem.reminder || 15,
                recurring: editingItem.recurring || 'none'
            }
        }
        return {
            title: '',
            description: '',
            startDate: selectedDate || new Date(),
            endDate: selectedDate || new Date(),
            startTime: '09:00',
            endTime: '10:00',
            allDay: false,
            color: EVENT_COLORS[0],
            location: '',
            attendees: '',
            category: 'Personal',
            reminder: 15,
            recurring: 'none'
        }
    }, [editingItem, selectedDate, formatTime])

    const handleEventFormSubmit = useCallback((formData: any) => {
        const eventData: EventFormData = {
            title: formData.title,
            description: formData.description,
            startDate: formData.startDate,
            endDate: formData.endDate,
            startTime: formData.startTime,
            endTime: formData.endTime,
            allDay: formData.allDay,
            color: formData.color,
            location: formData.location,
            attendees: formData.attendees,
            category: formData.category,
            reminder: formData.reminder,
            recurring: formData.recurring
        }

        if (editingItem) {
            updateEvent(editingItem.id, eventData)
        } else {
            createEvent(eventData)
        }
    }, [editingItem, updateEvent, createEvent])

    // Calendar grid generation
    const generateCalendarDays = useMemo(() => {
        const year = view.date.getFullYear()
        const month = view.date.getMonth()
        const daysInMonth = getDaysInMonth(view.date)
        const firstDay = getFirstDayOfMonth(view.date)

        const days = []

        // Previous month's trailing days
        const prevMonth = new Date(year, month - 1, 0)
        const prevMonthDays = prevMonth.getDate()

        for (let i = firstDay - 1; i >= 0; i--) {
            const day = prevMonthDays - i
            const date = new Date(year, month - 1, day)
            days.push({
                date,
                day,
                isCurrentMonth: false,
                isPreviousMonth: true,
                events: getEventsForDate(date)
            })
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day)
            days.push({
                date,
                day,
                isCurrentMonth: true,
                isPreviousMonth: false,
                events: getEventsForDate(date)
            })
        }

        // Next month's leading days
        const remainingCells = 42 - days.length // 6 rows * 7 days
        for (let day = 1; day <= remainingCells; day++) {
            const date = new Date(year, month + 1, day)
            days.push({
                date,
                day,
                isCurrentMonth: false,
                isPreviousMonth: false,
                events: getEventsForDate(date)
            })
        }

        return days
    }, [view.date, getDaysInMonth, getFirstDayOfMonth, getEventsForDate])

    // Render functions
    const renderHeader = () => (
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            {/* Navigation and Title */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigateMonth('prev')}
                        className="p-2"
                    >
                        {getIconComponent('ChevronLeft', 20)}
                    </Button>

                    <h2 className="text-2xl font-bold min-w-[200px] text-center">
                        {view.date.toLocaleDateString([], { month: 'long', year: 'numeric' })}
                    </h2>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigateMonth('next')}
                        className="p-2"
                    >
                        {getIconComponent('ChevronRight', 20)}
                    </Button>
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={navigateToToday}
                >
                    Today
                </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center justify-center gap-3 w-full lg:w-auto">
                <Select
                    value={filterCategory}
                    onChange={(value) => setFilterCategory(Array.isArray(value) ? value[0] : value)}
                    options={[
                        { value: 'all', label: 'All Categories' },
                        ...CATEGORIES.map(cat => ({ value: cat, label: cat }))
                    ]}
                    className="w-full"
                />
                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => openEventModal()}
                    className="flex items-center gap-2"
                >
                    {getIconComponent('Plus', 16)}
                    <span className="hidden sm:inline">Add Event</span>
                </Button>
            </div>
        </div>
    )

    const renderCalendarGrid = () => (
        <Card className="overflow-hidden">
            {/* Days of week header */}
            <div className="grid grid-cols-7 bg-base-200">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="p-3 text-center font-medium text-sm">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7">
                {generateCalendarDays.map((dayInfo, index) => (
                    <div
                        key={index}
                        className={`
              min-h-[100px] lg:min-h-[120px] border-r border-b border-base-300 p-2 cursor-pointer
              hover:bg-base-100 transition-colors
              ${!dayInfo.isCurrentMonth ? 'bg-base-50 text-base-content/50' : ''}
              ${isToday(dayInfo.date) ? 'bg-primary/10' : ''}
            `}
                        onClick={() => {
                            setSelectedDate(dayInfo.date)
                            openEventModal(dayInfo.date)
                        }}
                    >
                        <div className={`
              flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium mb-1
              ${isToday(dayInfo.date) ? 'bg-primary text-primary-content' : ''}
            `}>
                            {dayInfo.day}
                        </div>

                        {/* Events for this day */}
                        <div className="space-y-1">
                            {dayInfo.events.slice(0, 3).map((event) => (
                                <Tooltip
                                    key={event.id}
                                    tip={`${event.title}${event.location ? ` at ${event.location}` : ''}`}
                                    position="top"
                                >
                                    <div
                                        className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80"
                                        style={{ backgroundColor: event.color + '20', color: event.color }}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            openEventModal(undefined, event)
                                        }}
                                    >
                                        {!event.allDay && (
                                            <span className="font-medium mr-1">
                                                {formatTime(event.startDate)}
                                            </span>
                                        )}
                                        {event.title}
                                    </div>
                                </Tooltip>
                            ))}
                            {dayInfo.events.length > 3 && (
                                <div className="text-xs text-base-content/60 pl-1">
                                    +{dayInfo.events.length - 3} more
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )

    return (
        <div className="infinity-calendar mx-auto">
            {renderHeader()}

            {view.type === 'month' && renderCalendarGrid()}

            {/* Quick Actions Fab (Mobile) */}
            <div className="fixed bottom-6 right-6 lg:hidden">
                <Button
                    variant="primary"
                    circle
                    size="lg"
                    onClick={() => openEventModal()}
                    className="shadow-lg"
                >
                    {getIconComponent('Plus', 24)}
                </Button>
            </div>

            {/* Event Form Modal */}
            <FormModal
                isOpen={modals.create || modals.edit}
                onClose={() => closeModal(modals.edit ? 'edit' : 'create')}
                title={editingItem ? 'Edit Event' : 'Create Event'}
                fields={[
                    {
                        name: 'title',
                        type: 'input',
                        label: 'Title',
                        placeholder: 'Event title',
                        required: true,
                        gridCols: 6
                    },
                    {
                        name: 'startDate',
                        type: 'datePicker',
                        label: 'Start Date',
                        gridCols: 6
                    },
                    {
                        name: 'endDate',
                        type: 'datePicker',
                        label: 'End Date',
                        gridCols: 6
                    },
                    {
                        name: 'allDay',
                        type: 'toggle',
                        label: 'All day event',
                        gridCols: 6
                    },
                    {
                        name: 'startTime',
                        type: 'timePicker',
                        label: 'Start Time',
                        gridCols: 6,
                        conditional: {
                            dependsOn: 'allDay',
                            value: false,
                            operator: 'equals'
                        }
                    },
                    {
                        name: 'endTime',
                        type: 'timePicker',
                        label: 'End Time',
                        gridCols: 6,
                        conditional: {
                            dependsOn: 'allDay',
                            value: false,
                            operator: 'equals'
                        }
                    },
                    {
                        name: 'color',
                        type: 'colorPicker',
                        label: 'Event Color',
                        gridCols: 6
                    },
                    {
                        name: 'category',
                        type: 'select',
                        label: 'Category',
                        options: CATEGORIES.map(cat => ({ value: cat, label: cat })),
                        gridCols: 6
                    },
                    {
                        name: 'location',
                        type: 'input',
                        label: 'Location',
                        placeholder: 'Add location',
                        gridCols: 6
                    },
                    {
                        name: 'description',
                        type: 'textarea',
                        label: 'Description',
                        placeholder: 'Add description',
                        rows: 3,
                        gridCols: 6
                    },
                    {
                        name: 'attendees',
                        type: 'input',
                        label: 'Attendees',
                        placeholder: 'Enter email addresses separated by commas',
                        gridCols: 6
                    },
                    {
                        name: 'reminder',
                        type: 'select',
                        label: 'Reminder',
                        options: REMINDER_OPTIONS.map(option => ({
                            value: option.value.toString(),
                            label: option.label
                        })),
                        gridCols: 6
                    },
                    {
                        name: 'recurring',
                        type: 'select',
                        label: 'Recurring',
                        options: [
                            { value: 'none', label: 'Does not repeat' },
                            { value: 'daily', label: 'Daily' },
                            { value: 'weekly', label: 'Weekly' },
                            { value: 'monthly', label: 'Monthly' },
                            { value: 'yearly', label: 'Yearly' }
                        ],
                        gridCols: 6
                    }
                ]}
                onSubmit={handleEventFormSubmit}
                initialValues={getEventInitialValues()}
                columns={2}
                submitText={editingItem ? 'Update Event' : 'Create Event'}
            />

            {/* Delete Button for Edit Mode */}
            {editingItem && (modals.edit) && (
                <div className="fixed top-4 right-4 z-50">
                    <Button
                        variant="error"
                        size="sm"
                        outline
                        onClick={() => openModal('delete', editingItem)}
                        className="flex items-center gap-2"
                    >
                        {getIconComponent('Trash2', 16)}
                        Delete
                    </Button>
                </div>
            )}

            {/* Delete Event Confirmation Modal */}
            <ConfirmModal
                isOpen={modals.delete}
                onClose={() => closeModal('delete')}
                title="Delete Event"
                message={`Are you sure you want to delete "${deletingItem?.title}"? This action cannot be undone.`}
                confirmText="Delete Event"
                cancelText="Cancel"
                onConfirm={() => {
                    if (deletingItem) {
                        deleteEvent(deletingItem.id)
                    }
                }}
                variant="error"
                icon={getIconComponent('Trash2', 24)}
            />
        </div>
    )
}
