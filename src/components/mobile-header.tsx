"use client"

import * as React from "react"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { NotificationIcon } from "@/components/notification-icon"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useScreenSize } from "@/hooks/use-mobile"

interface MobileHeaderProps {
  title?: string
  className?: string
  children?: React.ReactNode
}

export function MobileHeader({ title, className, children }: MobileHeaderProps) {
  const { isMobile } = useSidebar()
  const { isTouchDevice } = useScreenSize()

  // Show on mobile devices or when sidebar would be collapsed on touch devices
  if (!isMobile && !isTouchDevice) {
    return null
  }

  return (
    <header className={cn(
      "sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4",
      // Show on mobile always, on tablet only when sidebar would be hidden
      "flex md:hidden",
      className
    )}>
      <SidebarTrigger 
        className="h-9 w-9 mobile-touch-target flex items-center justify-center" 
        aria-label="Toggle sidebar navigation"
      />
      
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Image
          src="/logo/Symbolet.svg"
          alt="PTSD AI Assistant Logo"
          className="h-8 w-8 shrink-0"
          width={32}
          height={32}
          priority
        />
        {title && (
          <h1 className="text-lg font-semibold truncate text-foreground">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="mobile-touch-target flex items-center justify-center">
          <NotificationIcon />
        </div>
        {children}
      </div>
    </header>
  )
}
