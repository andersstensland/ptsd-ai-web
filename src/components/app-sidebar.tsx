"use client"

import {
  BookOpen,
  Bot,
  SquareTerminal
} from "lucide-react"
import * as React from "react"

import { NavMain } from "@/components/nav-main"
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
      title: "Chat",
      url: "chat",
      icon: Bot,
      isActive: true,
      items: [
        {
          title: "AI Assistant",
          url: "chat",
        },
      ],
    },
    {
      title: "Dashboard",
      url: "",
      icon: SquareTerminal,
      isActive: false,
      items: [
        {
          title: "Knowledge",
          url: "knowledge",
        },
        {
          title: "Settings",
          url: "settings",
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
          url: "/introduction#",
        },
        {
          title: "Get Started",
          url: "/get-started",
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
        <div className="flex items-center justify-center w-full p-2">
          <Image
            src="/logo/symbolet.svg"
            alt="PTSD AI Assistant"
            className="h-12 w-12 md:h-20 md:w-20 lg:h-32 lg:w-32"
            width={128}
            height={128}
            priority
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
