"use client";

import React, { useState, useEffect } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Trash2, FileText, RefreshCw } from "lucide-react";
import { DocumentUpload } from "./document-upload";
import { useUpload } from "@/lib/upload-context";
import { toast } from "sonner";

interface DocumentSummary {
  title: string;
  chunkCount: number;
  totalChunks: number;
  type: string;
  status: 'complete' | 'partial';
}

export function KnowledgeBase() {
  const [activeTab, setActiveTab] = useState("sources");
  const [searchQuery, setSearchQuery] = useState("");
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const { hasActiveUploads } = useUpload();

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/documents/list');
      const data = await response.json();
      
      if (response.ok) {
        setDocuments(data.documents || []);
      } else {
        toast.error('Failed to load documents');
      }
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Error loading documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteDocument = async (docTitle: string) => {
    try {
      const response = await fetch('/api/documents/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: docTitle }),
      });

      if (response.ok) {
        toast.success('Document deleted successfully');
        loadDocuments(); // Refresh the list
      } else {
        toast.error('Failed to delete document');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Error deleting document');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Content
          <Button
            variant="outline"
            size="sm"
            onClick={loadDocuments}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardTitle>
        <CardDescription>Manage your content sources for RAG</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="sources">Documents ({documents.length})</TabsTrigger>
            <TabsTrigger value="upload" className="relative">
              Upload
              {hasActiveUploads && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sources">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search documents..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                {loading ? (
                  // Show skeleton loaders while loading
                  Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border rounded-md p-3"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Skeleton className="h-5 w-5 rounded" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-3/4 mb-2" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-2 h-2 rounded-full" />
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-8 w-8 rounded" />
                      </div>
                    </div>
                  ))
                ) : filteredDocuments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No documents uploaded yet.</p>
                    <p className="text-sm">Upload documents in the Upload tab to get started with RAG.</p>
                  </div>
                ) : (
                  filteredDocuments.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border rounded-md p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{doc.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {doc.chunkCount} chunks • {doc.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          doc.status === 'complete' ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                        <span className="text-sm text-muted-foreground">
                          {doc.status === 'complete' ? 'Complete' : 'Partial'}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive ml-2"
                          onClick={() => deleteDocument(doc.title)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upload">
            <DocumentUpload />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
