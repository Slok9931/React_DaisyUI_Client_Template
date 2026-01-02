import React, { useState, useCallback, useMemo } from 'react'
import { Button, Card, ColorPicker, DatePicker, Input, Modal, Select, Textarea, TimePicker, Tooltip } from '@/components'
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
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
    const [isEventModalOpen, setIsEventModalOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterCategory, setFilterCategory] = useState<string>('all')

    // Initial form data
    const initialFormData: EventFormData = {
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
        recurring: 'none',
    }

    const [formData, setFormData] = useState<EventFormData>(initialFormData)

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
        }).filter(event => {
            if (!searchTerm) return true
            return event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description?.toLowerCase().includes(searchTerm.toLowerCase())
        })
    }, [events, filterCategory, searchTerm, isSameDay])

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

    const changeView = useCallback((viewType: CalendarView['type']) => {
        setView(prev => ({ ...prev, type: viewType }))
    }, [])

    // Modal handlers
    const openEventModal = useCallback((date?: Date, event?: CalendarEvent) => {
        if (event) {
            setSelectedEvent(event)
            setIsEditMode(true)
            setFormData({
                title: event.title,
                description: event.description || '',
                startDate: event.startDate,
                endDate: event.endDate,
                startTime: formatTime(event.startDate),
                endTime: formatTime(event.endDate),
                allDay: event.allDay,
                color: event.color,
                location: event.location || '',
                attendees: event.attendees?.join(', ') || '',
                category: event.category || 'Personal',
                reminder: event.reminder || 15,
                recurring: event.recurring || 'none',
            })
        } else {
            setSelectedEvent(null)
            setIsEditMode(false)
            setFormData({
                ...initialFormData,
                startDate: date || selectedDate || new Date(),
                endDate: date || selectedDate || new Date(),
            })
        }
        setIsEventModalOpen(true)
    }, [selectedDate, initialFormData, formatTime])

    const closeEventModal = useCallback(() => {
        setIsEventModalOpen(false)
        setSelectedEvent(null)
        setIsEditMode(false)
        setFormData(initialFormData)
    }, [initialFormData])

    const handleFormSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.title.trim()) return

        if (isEditMode && selectedEvent) {
            updateEvent(selectedEvent.id, formData)
        } else {
            createEvent(formData)
        }
        closeEventModal()
    }, [formData, isEditMode, selectedEvent, updateEvent, createEvent, closeEventModal])

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

    const renderEventModal = () => (
        <Modal
            isOpen={isEventModalOpen}
            onClose={closeEventModal}
            responsive
        >
            <form onSubmit={handleFormSubmit}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold">
                        {isEditMode ? 'Edit Event' : 'Create Event'}
                    </h3>
                    {isEditMode && selectedEvent && (
                        <Button
                            type="button"
                            variant="error"
                            size="sm"
                            outline
                            onClick={() => {
                                deleteEvent(selectedEvent.id)
                                closeEventModal()
                            }}
                            className="flex items-center gap-2"
                        >
                            {getIconComponent('Trash2', 16)}
                            Delete
                        </Button>
                    )}
                </div>

                <div className="space-y-6">
                    {/* Title */}
                    <Input
                        label="Title *"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Event title"
                        required
                    />

                    {/* Date and Time */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <DatePicker
                            label="Start Date"
                            value={formData.startDate}
                            onChange={(date) => date && setFormData(prev => ({ ...prev, startDate: date }))}
                        />
                        <DatePicker
                            label="End Date"
                            value={formData.endDate}
                            onChange={(date) => date && setFormData(prev => ({ ...prev, endDate: date }))}
                        />
                    </div>

                    {/* All Day Toggle */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="allDay"
                            checked={formData.allDay}
                            onChange={(e) => setFormData(prev => ({ ...prev, allDay: e.target.checked }))}
                            className="checkbox checkbox-primary"
                        />
                        <label htmlFor="allDay" className="font-medium">All day event</label>
                    </div>

                    {/* Time pickers (hidden if all day) */}
                    {!formData.allDay && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <TimePicker
                                label="Start Time"
                                value={formData.startTime}
                                onChange={(time) => time && setFormData(prev => ({ ...prev, startTime: time }))}
                                format="12h"
                            />
                            <TimePicker
                                label="End Time"
                                value={formData.endTime}
                                onChange={(time) => time && setFormData(prev => ({ ...prev, endTime: time }))}
                                format="12h"
                            />
                        </div>
                    )}

                    {/* Color and Category */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <ColorPicker
                            label="Event Color"
                            value={formData.color}
                            onChange={(color) => setFormData(prev => ({ ...prev, color: color || EVENT_COLORS[0] }))}
                            showPresets={true}
                            showAlpha={false}
                            presetColors={EVENT_COLORS}
                        />

                        <Select
                            label="Category"
                            value={formData.category}
                            onChange={(value) => setFormData(prev => ({ ...prev, category: Array.isArray(value) ? value[0] : value }))}
                            options={CATEGORIES.map(cat => ({ value: cat, label: cat }))}
                        />
                    </div>

                    {/* Location */}
                    <Input
                        label="Location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Add location"
                    />

                    {/* Description */}
                    <Textarea
                        label="Description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Add description"
                        rows={3}
                    />

                    {/* Attendees */}
                    <Input
                        label="Attendees"
                        value={formData.attendees}
                        onChange={(e) => setFormData(prev => ({ ...prev, attendees: e.target.value }))}
                        placeholder="Enter email addresses separated by commas"
                    />

                    {/* Reminder and Recurring */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Select
                            label="Reminder"
                            value={formData.reminder.toString()}
                            onChange={(value) => setFormData(prev => ({ ...prev, reminder: parseInt(Array.isArray(value) ? value[0] : value) }))}
                            options={REMINDER_OPTIONS.map(option => ({
                                value: option.value.toString(),
                                label: option.label
                            }))}
                        />

                        <Select
                            label="Recurring"
                            value={formData.recurring}
                            onChange={(value) => setFormData(prev => ({ ...prev, recurring: Array.isArray(value) ? value[0] : value }))}
                            options={[
                                { value: 'none', label: 'Does not repeat' },
                                { value: 'daily', label: 'Daily' },
                                { value: 'weekly', label: 'Weekly' },
                                { value: 'monthly', label: 'Monthly' },
                                { value: 'yearly', label: 'Yearly' },
                            ]}
                        />
                    </div>
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-base-300">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={closeEventModal}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={!formData.title.trim()}
                    >
                        {isEditMode ? 'Update Event' : 'Create Event'}
                    </Button>
                </div>
            </form>
        </Modal>
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

            {renderEventModal()}
        </div>
    )
}
