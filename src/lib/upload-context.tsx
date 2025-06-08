"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { notificationUtils } from "./notification-utils";

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

  // Enhanced upload status tracking with simplified notifications
  useEffect(() => {
    uploads.forEach(upload => {
      if (upload.status === 'complete') {
        notificationUtils.upload.success(upload.file.name);
      } else if (upload.status === 'error') {
        notificationUtils.upload.error(upload.file.name, upload.error || 'Unknown error occurred');
      } else if (upload.status === 'uploading') {
        notificationUtils.upload.progress(upload.file.name, upload.progress);
      }
    });
  }, [uploads]);

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
    
    // Start upload notification
    notificationUtils.upload.started(file.name);
    
    return id;
  };

  const updateUpload = (id: string, updates: Partial<UploadStatus>) => {
    setUploads(prev => prev.map(upload => 
      upload.id === id ? { ...upload, ...updates } : upload
    ));
  };

  const removeUpload = (id: string) => {
    const upload = uploads.find(u => u.id === id);
    setUploads(prev => prev.filter(upload => upload.id !== id));
    if (upload) {
      notificationUtils.upload.dismiss(upload.file.name);
    }
  };

  const clearCompletedUploads = () => {
    uploads.forEach(upload => {
      if (upload.status === 'complete' || upload.status === 'error') {
        notificationUtils.upload.dismiss(upload.file.name);
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
