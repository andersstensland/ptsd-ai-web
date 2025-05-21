"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

  const processFile = (file: File) => {
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

    // Simulate file upload and processing
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? {
                ...f,
                progress,
                status: progress < 100 ? "uploading" : "processing",
              }
            : f
        )
      );

      if (progress >= 100) {
        clearInterval(interval);

        // Simulate processing time
        setTimeout(() => {
          // 10% chance of error for demo purposes
          if (Math.random() < 0.1) {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === id
                  ? {
                      ...f,
                      status: "error",
                      error: "Failed to process document",
                    }
                  : f
              )
            );
            toast.error(`Processing failed: Failed to process ${file.name}`);
          } else {
            setFiles((prev) =>
              prev.map((f) => (f.id === id ? { ...f, status: "complete" } : f))
            );
            toast.info(`Document processed ${file.name} has been processed and is ready for RAG`);
            
            toast.success(`Document processed: ${file.name} has been processed and is ready for RAG`);
          }
        }, 1000);
      }
    }, 100);
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
      case "processing":
      case "uploading":
        return null;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Upload</CardTitle>
        <CardDescription>Upload documents to use with RAG</CardDescription>
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
            Support for PDF, DOCX, TXT, CSV, and Markdown files
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
              accept=".pdf,.docx,.txt,.md,.csv"
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
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {file.status === "uploading" ||
                    file.status === "processing" ? (
                      <div className="w-24">
                        <Progress value={file.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {file.status === "uploading"
                            ? "Uploading..."
                            : "Processing..."}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        {getStatusIcon(file.status)}
                        <span className="text-xs">
                          {file.status === "complete"
                            ? "Ready"
                            : file.status === "error"
                            ? "Failed"
                            : ""}
                        </span>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeFile(file.id)}
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
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">
          Max file size: 50MB. For larger files, please split them.
        </p>
        <Button disabled={!files.some((f) => f.status === "complete")}>
          Index Documents
        </Button>
      </CardFooter>
    </Card>
        
  );
}

