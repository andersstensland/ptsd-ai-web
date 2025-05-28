"use client";

import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DocumentUploadProps {
  onUploadComplete?: () => void;
}

interface UploadStatus {
  file: File;
  status: 'uploading' | 'complete' | 'error';
  progress: number;
  error?: string;
}

export function DocumentUpload({ onUploadComplete }: DocumentUploadProps) {
  const [uploads, setUploads] = useState<UploadStatus[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFiles = useCallback(async (files: File[]) => {
    setIsUploading(true);
    
    // Initialize upload status for each file
    const initialUploads: UploadStatus[] = files.map(file => ({
      file,
      status: 'uploading',
      progress: 0,
    }));
    
    setUploads(initialUploads);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (response.ok) {
          setUploads(prev => prev.map((upload, index) =>
            index === i
              ? { ...upload, status: 'complete' as const, progress: 100 }
              : upload
          ));
          toast.success(`${file.name} uploaded successfully`);
        } else {
          setUploads(prev => prev.map((upload, index) =>
            index === i
              ? { ...upload, status: 'error' as const, error: result.error || 'Upload failed' }
              : upload
          ));
          toast.error(`Failed to upload ${file.name}: ${result.error}`);
        }
      } catch (error) {
        console.error('Upload error:', error);
        setUploads(prev => prev.map((upload, index) =>
          index === i
            ? { ...upload, status: 'error' as const, error: 'Network error' }
            : upload
        ));
        toast.error(`Failed to upload ${file.name}: Network error`);
      }
    }

    setIsUploading(false);
    
    // Call onUploadComplete callback
    onUploadComplete?.();
  }, [onUploadComplete]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    uploadFiles(acceptedFiles);
  }, [uploadFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const clearUploads = () => {
    setUploads([]);
  };

  const getStatusIcon = (status: UploadStatus['status']) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>
            Upload PDF, DOCX, or TXT files to add them to your knowledge base
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {isDragActive ? 'Drop files here' : 'Upload documents'}
              </p>
              <p className="text-sm text-muted-foreground">
                Drag and drop files here, or click to select
              </p>
              <p className="text-xs text-muted-foreground">
                Supports PDF, DOCX, and TXT files (max 10MB each)
              </p>
            </div>
          </div>

          {uploads.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Upload Progress</h3>
                {!isUploading && (
                  <Button variant="outline" size="sm" onClick={clearUploads}>
                    Clear
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {uploads.map((upload, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{upload.file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(upload.file.size)}
                          </p>
                        </div>
                      </div>
                      {getStatusIcon(upload.status)}
                    </div>

                    {upload.status === 'uploading' && (
                      <Progress value={upload.progress} className="mb-2" />
                    )}

                    {upload.status === 'error' && upload.error && (
                      <Alert className="mt-2">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription>{upload.error}</AlertDescription>
                      </Alert>
                    )}

                    {upload.status === 'complete' && (
                      <Alert className="mt-2">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          File uploaded and processed successfully
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}