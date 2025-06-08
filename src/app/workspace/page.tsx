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

export default function WorkspacePage() {
  const [activeTab, setActiveTab] = useState("knowledge");

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Knowledge Dashboard</h1>
            <p className="text-muted-foreground">Manage your RAG models and knowledge base</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="workspace/settings">
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                RAG Settings
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Export Knowledge Base</DropdownMenuItem>
                <DropdownMenuItem>Import Documents</DropdownMenuItem>
                <DropdownMenuItem>Clear All</DropdownMenuItem>
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