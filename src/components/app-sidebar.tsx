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
        {
          title: "Prompt Generator",
          url: "prompts",
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
        <div className="hidden sm:flex items-center justify-center w-full p-2">
          <Image
            src="/logo/horisontal/Kristiania_logo_22_rod.svg"
            alt="PTSD AI Assistant"
            className="h-10 w-24 sm:h-12 sm:w-32 md:h-16 md:w-40 lg:h-20 lg:w-48"
            width={192}
            height={80}
            priority
            style={{ height: "auto", width: "100%", maxWidth: "12rem" }}
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
