"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BookOpen,
  Bot,
  GalleryVerticalEnd,
  Link,
  SquareTerminal
} from "lucide-react"
import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import Image from "next/image"

// This is sample data.
const data = {
  user: {
    name: "admin",
    email: "m@example.com",
  },
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
          <Image
            src="logo/symbolet.svg"
            alt="Symbolet"
            className="hidden h-32 w-32 lg:block"
            width={300}
            height={300}
          />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
