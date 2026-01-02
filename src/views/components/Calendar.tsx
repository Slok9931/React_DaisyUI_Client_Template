import React, { useState } from 'react'
import { InfinityCalendar, CalendarEvent } from '@/components'

// Generate dummy data for calendar events
const generateDummyEvents = (): CalendarEvent[] => {
  const events: CalendarEvent[] = []
  const today = new Date()
  const eventColors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']
  const categories = ['Work', 'Personal', 'Family', 'Health', 'Travel', 'Study', 'Meeting', 'Other']
  
  const eventTemplates = [
    {
      title: 'Team Standup',
      description: 'Daily team sync meeting to discuss progress and blockers',
      category: 'Meeting',
      allDay: false,
      duration: 1, // hours
      location: 'Conference Room A',
      attendees: ['john@company.com', 'jane@company.com', 'mike@company.com'],
      recurring: 'daily'
    },
    {
      title: 'Product Planning',
      description: 'Strategic planning session for Q1 product roadmap',
      category: 'Work',
      allDay: false,
      duration: 3,
      location: 'Main Conference Room',
      attendees: ['product@company.com', 'engineering@company.com'],
      recurring: 'weekly'
    },
    {
      title: 'Client Presentation',
      description: 'Present quarterly results to key clients',
      category: 'Work',
      allDay: false,
      duration: 2,
      location: 'Virtual - Zoom',
      attendees: ['client1@client.com', 'client2@client.com'],
      recurring: 'none'
    },
    {
      title: 'Doctor Appointment',
      description: 'Regular health checkup',
      category: 'Health',
      allDay: false,
      duration: 1,
      location: 'City Medical Center',
      attendees: [],
      recurring: 'none'
    },
    {
      title: 'Family Dinner',
      description: 'Weekend family gathering',
      category: 'Family',
      allDay: false,
      duration: 3,
      location: 'Home',
      attendees: [],
      recurring: 'weekly'
    },
    {
      title: 'Gym Session',
      description: 'Strength training workout',
      category: 'Personal',
      allDay: false,
      duration: 1.5,
      location: 'Fitness Center',
      attendees: [],
      recurring: 'daily'
    },
    {
      title: 'Conference Day 1',
      description: 'Tech conference - attending keynote and workshops',
      category: 'Work',
      allDay: true,
      duration: 24,
      location: 'Convention Center',
      attendees: [],
      recurring: 'none'
    },
    {
      title: 'Weekend Getaway',
      description: 'Short vacation to the mountains',
      category: 'Travel',
      allDay: true,
      duration: 48,
      location: 'Mountain Resort',
      attendees: ['spouse@email.com'],
      recurring: 'none'
    },
    {
      title: 'Online Course',
      description: 'JavaScript Advanced Patterns course',
      category: 'Study',
      allDay: false,
      duration: 2,
      location: 'Online',
      attendees: [],
      recurring: 'weekly'
    },
    {
      title: 'Project Deadline',
      description: 'Final submission for mobile app project',
      category: 'Work',
      allDay: true,
      duration: 24,
      location: 'Office',
      attendees: ['manager@company.com'],
      recurring: 'none'
    }
  ]

  // Create events for the next 30 days
  for (let i = 0; i < 30; i++) {
    const eventDate = new Date(today)
    eventDate.setDate(today.getDate() + i)
    
    // Randomly add 1-3 events per day (some days might have none)
    const eventsPerDay = Math.random() < 0.7 ? Math.floor(Math.random() * 3) + 1 : 0
    
    for (let j = 0; j < eventsPerDay; j++) {
      const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)]
      const eventColor = eventColors[categories.indexOf(template.category) % eventColors.length]
      
      let startDate: Date
      let endDate: Date
      
      if (template.allDay) {
        startDate = new Date(eventDate)
        startDate.setHours(0, 0, 0, 0)
        endDate = new Date(startDate)
        if (template.duration > 24) {
          endDate.setDate(endDate.getDate() + Math.floor(template.duration / 24) - 1)
        }
        endDate.setHours(23, 59, 59, 999)
      } else {
        const startHour = 8 + Math.floor(Math.random() * 10) // 8 AM to 6 PM
        const startMinute = Math.floor(Math.random() * 4) * 15 // 0, 15, 30, 45
        
        startDate = new Date(eventDate)
        startDate.setHours(startHour, startMinute, 0, 0)
        
        endDate = new Date(startDate)
        endDate.setHours(endDate.getHours() + Math.floor(template.duration))
        endDate.setMinutes(endDate.getMinutes() + ((template.duration % 1) * 60))
      }

      const event: CalendarEvent = {
        id: `event-${Date.now()}-${i}-${j}`,
        title: template.title,
        description: template.description,
        startDate,
        endDate,
        allDay: template.allDay,
        color: eventColor,
        location: template.location,
        attendees: template.attendees,
        category: template.category,
        reminder: Math.random() < 0.5 ? 15 : Math.random() < 0.5 ? 30 : 60,
        recurring: template.recurring as CalendarEvent['recurring']
      }

      events.push(event)
    }
  }

  // Add some past events too (last 7 days)
  for (let i = 1; i <= 7; i++) {
    const pastDate = new Date(today)
    pastDate.setDate(today.getDate() - i)
    
    const eventsPerDay = Math.floor(Math.random() * 2) + 1
    
    for (let j = 0; j < eventsPerDay; j++) {
      const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)]
      const eventColor = eventColors[categories.indexOf(template.category) % eventColors.length]
      
      let startDate: Date
      let endDate: Date
      
      if (template.allDay) {
        startDate = new Date(pastDate)
        startDate.setHours(0, 0, 0, 0)
        endDate = new Date(startDate)
        endDate.setHours(23, 59, 59, 999)
      } else {
        const startHour = 8 + Math.floor(Math.random() * 10)
        const startMinute = Math.floor(Math.random() * 4) * 15
        
        startDate = new Date(pastDate)
        startDate.setHours(startHour, startMinute, 0, 0)
        
        endDate = new Date(startDate)
        endDate.setHours(endDate.getHours() + Math.floor(template.duration))
        endDate.setMinutes(endDate.getMinutes() + ((template.duration % 1) * 60))
      }

      const event: CalendarEvent = {
        id: `past-event-${Date.now()}-${i}-${j}`,
        title: template.title,
        description: template.description,
        startDate,
        endDate,
        allDay: template.allDay,
        color: eventColor,
        location: template.location,
        attendees: template.attendees,
        category: template.category,
        reminder: 15,
        recurring: 'none'
      }

      events.push(event)
    }
  }

  return events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
}

const CalendarView: React.FC = () => {
  const [events] = useState<CalendarEvent[]>(generateDummyEvents())

  return (
    <div className="p-6">
      <InfinityCalendar initialEvents={events} />
    </div>
  )
}

export { CalendarView }
