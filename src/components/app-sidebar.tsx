"use client"

import {
  BookOpen,
  Bot,
  SquareTerminal
} from "lucide-react"
import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NotificationIcon } from "@/components/notification-icon"
import { UploadStatusIndicator } from "@/components/upload-status-indicator"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail
} from "@/components/ui/sidebar"
import Image from "next/image"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Workspace",
      url: "",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Workspace",
          url: "workspace",
        },
        {
          title: "Settings",
          url: "workspace/settings",
        },
      ],
    },
    {
      title: "Documentation",
      url: "documentation",
      icon: BookOpen,
      items: [
        {
          title: "Documentation",
          url: "documentation",
        },
        {
          title: "Introduction",
          url: "documentation/introduction#",
        },
        {
          title: "Get Started",
          url: "documentation/get-started",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between w-full">
          <Image
            src="logo/symbolet.svg"
            alt="Symbolet"
            className="hidden h-32 w-32 lg:block"
            width={300}
            height={300}
          />
        </div>
        {/* Mobile notification icon - visible when sidebar is collapsed */}
        <div className="flex justify-center pt-2">
          <NotificationIcon />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
