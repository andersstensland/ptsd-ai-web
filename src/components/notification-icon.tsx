"use client"

import { Bell, X, Trash2, CheckCheck } from "lucide-react"
import { useState } from "react"
import { useNotifications } from "@/lib/notification-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export function NotificationIcon() {
  const { events, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)

  const handleNotificationClick = (id: string) => {
    markAsRead(id)
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      default:
        return 'ℹ️'
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative h-8 w-8 p-0 hover:bg-accent"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80 p-0" align="end" sideOffset={8}>
        <div className="flex items-center justify-between p-4 border-b">
          <DropdownMenuLabel className="p-0 text-sm font-semibold">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 text-xs text-muted-foreground">
                {unreadCount} unread
              </span>
            )}
          </DropdownMenuLabel>
          
          {events.length > 0 && (
            <div className="flex gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={markAllAsRead}
                  title="Mark all as read"
                >
                  <CheckCheck className="h-3 w-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={clearAll}
                title="Clear all"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        <ScrollArea className="h-80">
          {events.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            <div className="p-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                    "hover:bg-accent/50",
                    !event.read && "bg-accent/20"
                  )}
                  onClick={() => handleNotificationClick(event.id)}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <span className="text-sm">{getEventIcon(event.type)}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-tight">
                          {event.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {event.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatTimestamp(event.timestamp)}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {!event.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeNotification(event.id)
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {event.action && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 h-7 text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          event.action!.onClick()
                        }}
                      >
                        {event.action.label}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
