"use client";

import React, { useCallback } from "react";
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
import { Upload, FileText, CheckCircle, XCircle, Loader2, Trash2 } from "lucide-react";
import { useUpload } from "@/lib/upload-context";

interface DocumentUploadProps {
  onUploadComplete?: () => void;
}

export function DocumentUpload({ onUploadComplete }: DocumentUploadProps) {
  const { uploads, addUpload, updateUpload, removeUpload, clearCompletedUploads, hasActiveUploads } = useUpload();

  const uploadFiles = useCallback(async (files: File[]) => {
    const uploadIds: string[] = [];
    
    // Add all files to the upload queue
    for (const file of files) {
      const uploadId = addUpload(file);
      uploadIds.push(uploadId);
    }

    // Upload files sequentially
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uploadId = uploadIds[i];
      
      try {
        const formData = new FormData();
        formData.append('file', file);

        // Use XMLHttpRequest for real progress tracking
        const xhr = new XMLHttpRequest();
        
        // Track upload progress
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            updateUpload(uploadId, { 
              progress: Math.min(percentComplete, 95) // Cap at 95% to show processing
            });
          }
        });

        // Handle upload completion
        const uploadPromise = new Promise<Response>((resolve, reject) => {
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(new Response(xhr.responseText, {
                status: xhr.status,
                statusText: xhr.statusText,
                headers: new Headers()
              }));
            } else {
              reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
            }
          };
          
          xhr.onerror = () => reject(new Error('Network error'));
          xhr.onabort = () => reject(new Error('Upload aborted'));
        });

        // Start the upload
        xhr.open('POST', '/api/documents/upload');
        xhr.send(formData);

        // Wait for completion
        const response = await uploadPromise;
        const result = JSON.parse(xhr.responseText || '{}');

        // Update to show processing
        updateUpload(uploadId, { 
          progress: 98
        });

        if (response.ok) {
          updateUpload(uploadId, { 
            status: 'complete', 
            progress: 100 
          });
        } else {
          updateUpload(uploadId, { 
            status: 'error', 
            error: result.error || 'Upload failed' 
          });
        }
      } catch (error) {
        console.error('Upload error:', error);
        updateUpload(uploadId, { 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Network error'
        });
      }
    }

    // Call onUploadComplete callback
    onUploadComplete?.();
  }, [addUpload, updateUpload, onUploadComplete]);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
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
            } ${hasActiveUploads ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {isDragActive ? 'Drop files here' : hasActiveUploads ? 'Upload in progress...' : 'Upload documents'}
              </p>
              <p className="text-sm text-muted-foreground">
                {hasActiveUploads ? 'Please wait for current uploads to complete' : 'Drag and drop files here, or click to select'}
              </p>
              <p className="text-xs text-muted-foreground">
                Supports PDF, DOCX, and TXT files (max 10MB each)
              </p>
            </div>
          </div>

          {uploads.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Upload Status</h3>
                <div className="flex gap-2">
                  {!hasActiveUploads && (
                    <Button variant="outline" size="sm" onClick={clearCompletedUploads}>
                      Clear Completed
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {uploads.map((upload) => (
                  <div key={upload.id} className="border rounded-lg p-4">
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
                      <div className="flex items-center gap-2">
                        {getStatusIcon(upload.status)}
                        {(upload.status === 'complete' || upload.status === 'error') && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeUpload(upload.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {upload.status === 'uploading' && (
                      <Progress value={upload.progress} className="mb-2" />
                    )}

                    {upload.status === 'error' && upload.error && (
                      <Alert className="mt-2 border-red-200">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription>{upload.error}</AlertDescription>
                      </Alert>
                    )}

                    {upload.status === 'complete' && (
                      <Alert className="mt-2 border-green-200">
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