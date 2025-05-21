"use client"

import {
  BookOpen,
  Bot,
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal
} from "lucide-react"
import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "admin",
    email: "m@example.com",
  },
  teams: [
    {
      name: "Høyskolen Kristiania",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "playground",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Settings",
          url: "playground/settings",
        },
      ],
    },
    {
      title: "Models",
      url: "models",
      icon: Bot,
      items: [
        {
          title: "Embeddings",
          url: "models/embeddings",
        },
        {
          title: "Multimodal",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "documentation",
      icon: BookOpen,
      items: [
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
        <Avatar>
          <AvatarImage sizes="md" src="logo/symbolet.svg" alt="Symbolet" />
          <AvatarFallback>HK</AvatarFallback>
        </Avatar>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
