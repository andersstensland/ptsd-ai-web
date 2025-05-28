"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Upload, X, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";

type FileStatus = "idle" | "uploading" | "processing" | "complete" | "error";

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  status: FileStatus;
  progress: number;
  error?: string;
  chunksCreated?: number;
}

export function DocumentUpload() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const uploadFile = async (file: File, fileId: string) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: "complete" as FileStatus,
                progress: 100,
                chunksCreated: result.chunksCreated,
              }
            : f
        )
      );

      toast.success(`Successfully processed ${result.title} (${result.chunksCreated} chunks created)`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: "error" as FileStatus,
                error: errorMessage,
              }
            : f
        )
      );

      toast.error(`Processing failed: ${errorMessage}`);
    }
  };

  const processFile = async (file: File) => {
    // Validate file type
    const supportedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!supportedTypes.includes(file.type)) {
      toast.error(`Unsupported file type: ${file.type}. Please upload PDF, DOCX, or TXT files.`);
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error(`File too large: ${file.name}. Maximum size is 10MB.`);
      return;
    }

    const id = Math.random().toString(36).substring(2, 9);
    const newFile: FileItem = {
      id,
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
      progress: 0,
    };

    setFiles((prev) => [...prev, newFile]);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                progress: Math.min(progress, 90),
                status: progress < 90 ? "uploading" : "processing",
              }
            : f
        )
      );

      if (progress >= 90) {
        clearInterval(interval);
      }
    }, 200);

    // Actually upload and process the file
    await uploadFile(file, id);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach(processFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach(processFile);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const getStatusIcon = (status: FileStatus) => {
    switch (status) {
      case "complete":
        return <Check className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Upload</CardTitle>
        <CardDescription>Upload documents to use with RAG (PDF, DOCX, TXT)</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/20"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-1">Drag and drop your files</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Support for PDF, DOCX, and TXT files (max 10MB each)
          </p>
          <div className="flex justify-center">
            <Label
              htmlFor="file-upload"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md cursor-pointer"
            >
              <Upload className="h-4 w-4 inline mr-2" />
              Select Files
            </Label>
            <Input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.docx,.txt"
            />
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-medium">Uploaded Files</h3>
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between border rounded-md p-3"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                        {file.chunksCreated && ` • ${file.chunksCreated} chunks`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {(file.status === "uploading" || file.status === "processing") && (
                      <div className="flex items-center gap-2">
                        <Progress value={file.progress} className="w-16" />
                        <span className="text-xs text-muted-foreground">
                          {file.status === "uploading" ? "Uploading..." : "Processing..."}
                        </span>
                      </div>
                    )}
                    {getStatusIcon(file.status)}
                    {file.error && (
                      <span className="text-xs text-red-500 max-w-32 truncate">
                        {file.error}
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      disabled={file.status === "uploading" || file.status === "processing"}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
