"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'

export interface NotificationEvent {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationContextType {
  events: NotificationEvent[]
  unreadCount: number
  addNotification: (notification: Omit<NotificationEvent, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<NotificationEvent[]>([])

  // Load notifications from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('notifications')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setEvents(parsed.map((event: any) => ({
          ...event,
          timestamp: new Date(event.timestamp)
        })))
      } catch (error) {
        console.error('Failed to load notifications from localStorage:', error)
      }
    }
  }, [])

  // Save notifications to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(events))
  }, [events])

  const addNotification = useCallback((notification: Omit<NotificationEvent, 'id' | 'timestamp' | 'read'>) => {
    const newEvent: NotificationEvent = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false
    }

    setEvents(prev => [newEvent, ...prev])

    // Also show as toast
    toast[notification.type](notification.title, {
      description: notification.message,
      action: notification.action ? {
        label: notification.action.label,
        onClick: notification.action.onClick
      } : undefined
    })
  }, [])

  const markAsRead = useCallback((id: string) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, read: true } : event
    ))
  }, [])

  const markAllAsRead = useCallback(() => {
    setEvents(prev => prev.map(event => ({ ...event, read: true })))
  }, [])

  const removeNotification = useCallback((id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setEvents([])
  }, [])

  const unreadCount = events.filter(event => !event.read).length

  const value: NotificationContextType = {
    events,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}
