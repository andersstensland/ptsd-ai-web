"use client"

import { NotificationIcon } from "@/components/notification-icon"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import * as React from "react"

interface DesktopHeaderProps {
  title?: string
  className?: string
  children?: React.ReactNode
}

export function DesktopHeader({ title, className, children }: DesktopHeaderProps) {
  const { isMobile } = useSidebar()

  // Hide on mobile devices - mobile header will be shown instead
  if (isMobile) {
    return null
  }

  return (
    <header className={cn(
      "sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4",
      // Show on desktop only
      "hidden md:flex",
      className
    )}>
      <SidebarTrigger 
        className="h-9 w-9 flex items-center justify-center" 
        aria-label="Toggle sidebar navigation"
      />
      
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {title && (
          <h1 className="text-lg font-semibold truncate text-foreground">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center justify-center">
          <NotificationIcon />
        </div>
        {children}
      </div>
    </header>
  )
}
