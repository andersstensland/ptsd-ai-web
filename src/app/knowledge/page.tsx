"use client";

import { DesktopHeader } from "@/components/desktop-header";
import { MobileHeader } from "@/components/mobile-header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Settings
} from "lucide-react";
import Link from "next/link";
import { KnowledgeBase } from "./knowledge-base";

export default function WorkspacePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MobileHeader title="Knowledge" />
      <DesktopHeader title="Knowledge" />
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Knowledge</h1>
            <p className="text-muted-foreground">Manage your RAG models and knowledge</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
            <Link href="/settings" className="flex-1 sm:flex-none">
              <Button variant="outline" className="gap-2 w-full sm:w-auto mobile-touch-target">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="mobile-touch-target">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="mobile-touch-target">
                  Export Knowledge Base
                </DropdownMenuItem>
                <DropdownMenuItem className="mobile-touch-target">
                  Import Documents
                </DropdownMenuItem>
                <DropdownMenuItem className="mobile-touch-target text-destructive">
                  Clear All
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

         <KnowledgeBase />

      </div>
    </div>
  );
}