"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Database,
  MoreHorizontal,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { KnowledgeBase } from "./knowledge-base";
import { MobileHeader } from "@/components/mobile-header";
import { DesktopHeader } from "@/components/desktop-header";

export default function WorkspacePage() {
  const [activeTab, setActiveTab] = useState("knowledge");

  return (
    <div className="flex flex-col min-h-screen">
      <MobileHeader title="Knowledge Dashboard" />
      <DesktopHeader title="Knowledge Dashboard" />
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Knowledge Dashboard</h1>
            <p className="text-muted-foreground">Manage your RAG models and knowledge base</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
            <Link href="workspace/settings" className="flex-1 sm:flex-none">
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList>
            <TabsTrigger value="knowledge" className="flex items-center gap-1">
              <Database className="h-4 w-4" />
              Knowledge Base
            </TabsTrigger>
          </TabsList>

          <TabsContent value="knowledge" className="pt-6">
            <KnowledgeBase />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}