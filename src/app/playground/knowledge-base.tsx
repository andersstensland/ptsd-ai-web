"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Trash2, Database, Globe, FileText } from "lucide-react";
import { DocumentUpload } from "./document-upload";

interface Source {
  id: string;
  name: string;
  type: "document" | "website" | "database";
  status: "active" | "processing" | "error";
  documentCount?: number;
  lastUpdated: string;
}

export function KnowledgeBase() {
  const [activeTab, setActiveTab] = useState("sources");
  const [searchQuery, setSearchQuery] = useState("");

  const sources: Source[] = [
    {
      id: "1",
      name: "Company Documentation",
      type: "document",
      status: "active",
      documentCount: 24,
      lastUpdated: "2023-05-15",
    },
    {
      id: "2",
      name: "Product Knowledge Base",
      type: "website",
      status: "active",
      documentCount: 56,
      lastUpdated: "2023-05-10",
    },
    {
      id: "3",
      name: "Customer Support Database",
      type: "database",
      status: "active",
      documentCount: 132,
      lastUpdated: "2023-05-18",
    },
    {
      id: "4",
      name: "Technical Specifications",
      type: "document",
      status: "processing",
      documentCount: 8,
      lastUpdated: "2023-05-20",
    },
  ];

  const filteredSources = sources.filter((source) =>
    source.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSourceIcon = (type: Source["type"]) => {
    switch (type) {
      case "document":
        return <FileText className="h-4 w-4" />;
      case "website":
        return <Globe className="h-4 w-4" />;
      case "database":
        return <Database className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Source["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "processing":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Knowledge Base</CardTitle>
        <CardDescription>Manage your RAG knowledge sources</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="crawl">Web Crawl</TabsTrigger>
          </TabsList>

          <TabsContent value="sources">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search sources..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Source
                </Button>
              </div>

              <div className="border rounded-md divide-y">
                {filteredSources.length > 0 ? (
                  filteredSources.map((source) => (
                    <div
                      key={source.id}
                      className="p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-muted rounded-md p-2">
                          {getSourceIcon(source.type)}
                        </div>
                        <div>
                          <h3 className="font-medium">{source.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{source.documentCount} documents</span>
                            <span>•</span>
                            <span>Updated {source.lastUpdated}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`h-2 w-2 rounded-full ${getStatusColor(
                              source.status
                            )}`}
                          />
                          <span className="text-sm">
                            {source.status === "active"
                              ? "Active"
                              : source.status === "processing"
                              ? "Processing"
                              : "Error"}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">No sources found</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upload">
            <DocumentUpload />
          </TabsContent>

          <TabsContent value="crawl">
            <div className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="website-url">Website URL</Label>
                  <Input id="website-url" placeholder="https://example.com" />
                </div>
                <div>
                  <Label htmlFor="crawl-depth">Crawl Depth</Label>
                  <Select defaultValue="2">
                    <SelectTrigger id="crawl-depth">
                      <SelectValue placeholder="Select crawl depth" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Homepage only</SelectItem>
                      <SelectItem value="2">
                        2 - Homepage + direct links
                      </SelectItem>
                      <SelectItem value="3">3 - Deep crawl</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sitemap" />
                  <label
                    htmlFor="sitemap"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Use sitemap.xml if available
                  </label>
                </div>
              </div>
              <Button className="w-full">Start Crawling</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function Label({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium mb-2 block">
      {children}
    </label>
  );
}

function Checkbox({ id }: { id: string }) {
  return (
    <div className="h-4 w-4 rounded border border-primary flex items-center justify-center">
      <input
        type="checkbox"
        id={id}
        className="opacity-0 absolute h-4 w-4 cursor-pointer"
      />
    </div>
  );
}

function Select({
  children,
  defaultValue,
}: {
  children: React.ReactNode;
  defaultValue?: string;
}) {
  return (
    <div className="relative">
      <select
        defaultValue={defaultValue}
        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        {children}
      </select>
    </div>
  );
}

function SelectTrigger({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) {
  return <div id={id}>{children}</div>;
}

function SelectValue({ placeholder }: { placeholder?: string }) {
  return <span>{placeholder}</span>;
}

function SelectContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

function SelectItem({
  children,
  value,
}: {
  children: React.ReactNode;
  value: string;
}) {
  return <option value={value}>{children}</option>;
}
