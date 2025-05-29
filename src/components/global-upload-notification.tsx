"use client";

import React from "react";
import { useUpload } from "@/lib/upload-context";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Upload, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function GlobalUploadNotification() {
  const { uploads, hasActiveUploads, removeUpload } = useUpload();

  const activeUploads = uploads.filter(upload => upload.status === 'uploading');
  const recentCompletedUploads = uploads.filter(upload => 
    upload.status === 'complete' && 
    Date.now() - upload.startTime < 30000 // Show for 30 seconds after completion
  );

  if (!hasActiveUploads && recentCompletedUploads.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {activeUploads.map((upload) => (
        <Card key={upload.id} className="w-80 shadow-lg border-blue-200 bg-blue-50 dark:bg-blue-950/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Uploading...</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => removeUpload(upload.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground truncate">
                {upload.file.name}
              </div>
              <Progress value={upload.progress} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {upload.progress}% complete
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {recentCompletedUploads.map((upload) => (
        <Card key={upload.id} className="w-80 shadow-lg border-green-200 bg-green-50 dark:bg-green-950/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Upload Complete</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => removeUpload(upload.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="text-xs text-muted-foreground truncate mt-1">
              {upload.file.name}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
