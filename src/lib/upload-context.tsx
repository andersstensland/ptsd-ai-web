"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useNotifications } from "./notification-context";

export interface UploadStatus {
  id: string;
  file: File;
  status: 'uploading' | 'complete' | 'error';
  progress: number;
  error?: string;
  startTime: number;
}

interface UploadContextType {
  uploads: UploadStatus[];
  addUpload: (file: File) => string;
  updateUpload: (id: string, updates: Partial<UploadStatus>) => void;
  removeUpload: (id: string) => void;
  clearCompletedUploads: () => void;
  hasActiveUploads: boolean;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export function UploadProvider({ children }: { children: React.ReactNode }) {
  const [uploads, setUploads] = useState<UploadStatus[]>([]);
  const { addNotification } = useNotifications();

  // Load uploads from localStorage on mount
  useEffect(() => {
    const savedUploads = localStorage.getItem('uploads');
    if (savedUploads) {
      try {
        const parsed = JSON.parse(savedUploads);
        // Only restore non-uploading uploads (completed or error states)
        const restoredUploads = parsed.filter((upload: UploadStatus) => 
          upload.status === 'complete' || upload.status === 'error'
        );
        setUploads(restoredUploads);
      } catch (error) {
        console.error('Failed to restore uploads from localStorage:', error);
      }
    }
  }, []);

  // Save uploads to localStorage whenever uploads change
  useEffect(() => {
    localStorage.setItem('uploads', JSON.stringify(uploads));
  }, [uploads]);

  // Show persistent notifications for active uploads
  useEffect(() => {
    uploads.forEach(upload => {
      if (upload.status === 'complete') {
        toast.success(`${upload.file.name} uploaded successfully`, {
          id: `upload-${upload.id}`,
          duration: 5000,
        });
        
        // Add to notification system
        addNotification({
          type: 'success',
          title: 'Upload Completed',
          message: `${upload.file.name} has been successfully uploaded and processed.`,
          action: {
            label: 'View Documents',
            onClick: () => window.location.href = '/workspace/knowledge-base'
          }
        });
      } else if (upload.status === 'error') {
        toast.error(`Failed to upload ${upload.file.name}: ${upload.error}`, {
          id: `upload-${upload.id}`,
          duration: 10000,
        });
        
        // Add to notification system
        addNotification({
          type: 'error',
          title: 'Upload Failed',
          message: `${upload.file.name}: ${upload.error || 'Unknown error occurred'}`,
          action: {
            label: 'Try Again',
            onClick: () => window.location.href = '/workspace/knowledge-base?tab=upload'
          }
        });
      }
    });
  }, [uploads, addNotification]);

  const addUpload = (file: File): string => {
    const id = Math.random().toString(36).substring(7);
    const newUpload: UploadStatus = {
      id,
      file,
      status: 'uploading',
      progress: 0,
      startTime: Date.now(),
    };
    
    setUploads(prev => [...prev, newUpload]);
    
    // Show uploading toast
    toast.loading(`Uploading ${file.name}...`, {
      id: `upload-${id}`,
    });
    
    // Add to notification system
    addNotification({
      type: 'info',
      title: 'Upload Started',
      message: `${file.name} upload has begun. You can continue using the app while it processes.`
    });
    
    return id;
  };

  const updateUpload = (id: string, updates: Partial<UploadStatus>) => {
    setUploads(prev => prev.map(upload => 
      upload.id === id ? { ...upload, ...updates } : upload
    ));
  };

  const removeUpload = (id: string) => {
    setUploads(prev => prev.filter(upload => upload.id !== id));
    toast.dismiss(`upload-${id}`);
  };

  const clearCompletedUploads = () => {
    uploads.forEach(upload => {
      if (upload.status === 'complete' || upload.status === 'error') {
        toast.dismiss(`upload-${upload.id}`);
      }
    });
    setUploads(prev => prev.filter(upload => upload.status === 'uploading'));
  };

  const hasActiveUploads = uploads.some(upload => upload.status === 'uploading');

  return (
    <UploadContext.Provider
      value={{
        uploads,
        addUpload,
        updateUpload,
        removeUpload,
        clearCompletedUploads,
        hasActiveUploads,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
}

export function useUpload() {
  const context = useContext(UploadContext);
  if (context === undefined) {
    throw new Error('useUpload must be used within an UploadProvider');
  }
  return context;
}
