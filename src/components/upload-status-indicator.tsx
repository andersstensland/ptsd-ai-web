"use client";

import React from "react";
import { useUpload } from "@/lib/upload-context";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, CheckCircle, XCircle, Loader2 } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

export function UploadStatusIndicator() {
  const { uploads, hasActiveUploads, clearCompletedUploads } = useUpload();

  if (uploads.length === 0) {
    return null;
  }

  const activeUploads = uploads.filter(upload => upload.status === 'uploading');
  const completedUploads = uploads.filter(upload => upload.status === 'complete');
  const errorUploads = uploads.filter(upload => upload.status === 'error');

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Uploads
        </div>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <div className="space-y-2 px-2">
          {activeUploads.length > 0 && (
            <div className="text-xs text-muted-foreground">
              <div className="flex items-center gap-2 mb-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                {activeUploads.length} uploading...
              </div>
              {activeUploads.map(upload => (
                <div key={upload.id} className="mb-2">
                  <div className="text-xs truncate mb-1">{upload.file.name}</div>
                  <Progress value={upload.progress} className="h-1" />
                </div>
              ))}
            </div>
          )}
          
          {completedUploads.length > 0 && (
            <div className="text-xs text-green-600 dark:text-green-400">
              <CheckCircle className="h-3 w-3 inline mr-1" />
              {completedUploads.length} completed
            </div>
          )}
          
          {errorUploads.length > 0 && (
            <div className="text-xs text-red-600 dark:text-red-400">
              <XCircle className="h-3 w-3 inline mr-1" />
              {errorUploads.length} failed
            </div>
          )}
          
          {!hasActiveUploads && uploads.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-6 text-xs"
              onClick={clearCompletedUploads}
            >
              Clear
            </Button>
          )}
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
