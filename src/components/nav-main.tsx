"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton 
                  tooltip={item.title}
                  className="w-full justify-start px-3 py-2 text-left mobile-touch-target"
                  aria-expanded="false"
                  aria-controls={`nav-section-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  tabIndex={0}
                >
                  {item.icon && (
                    <item.icon 
                      className="h-4 w-4 shrink-0" 
                      aria-hidden="true"
                    />
                  )}
                  <span className="flex-1 truncate">{item.title}</span>
                  <ChevronRight 
                    className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" 
                    aria-hidden="true"
                  />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub 
                  id={`nav-section-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  role="menu"
                  aria-label={`${item.title} submenu`}
                >
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title} role="none">
                      <SidebarMenuSubButton 
                        asChild
                        className="w-full justify-start px-6 py-2 text-sm mobile-touch-target"
                      >
                        <a 
                          href={subItem.url} 
                          className="flex w-full"
                          role="menuitem"
                          tabIndex={0}
                          aria-describedby={`nav-desc-${subItem.title.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <span className="truncate">{subItem.title}</span>
                          <span 
                            id={`nav-desc-${subItem.title.toLowerCase().replace(/\s+/g, '-')}`}
                            className="sr-only"
                          >
                            Navigate to {subItem.title}
                          </span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
