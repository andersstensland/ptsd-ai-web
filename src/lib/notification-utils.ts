import { toast } from "sonner";

/**
 * Unified notification utilities for simplified notification management
 */

export const notificationUtils = {
  // Upload notifications - use only Sonner for immediate feedback
  upload: {
    started: (fileName: string) => {
      toast.loading(`Uploading ${fileName}...`, {
        id: `upload-${fileName}`,
        description: "Processing your document"
      });
    },
    
    progress: (fileName: string, progress: number) => {
      toast.loading(`Uploading ${fileName}`, {
        id: `upload-${fileName}`,
        description: `${progress}% complete`
      });
    },
    
    success: (fileName: string) => {
      toast.success("Upload Complete", {
        id: `upload-${fileName}`,
        description: `${fileName} has been successfully processed`,
        duration: 5000,
        action: {
          label: "View Documents",
          onClick: () => window.location.href = '/workspace/knowledge-base'
        }
      });
    },
    
    error: (fileName: string, error: string) => {
      toast.error("Upload Failed", {
        id: `upload-${fileName}`,
        description: `${fileName}: ${error}`,
        duration: 10000,
        action: {
          label: "Try Again",
          onClick: () => window.location.href = '/workspace/knowledge-base?tab=upload'
        }
      });
    },
    
    dismiss: (fileName: string) => {
      toast.dismiss(`upload-${fileName}`);
    }
  },

  // General notifications - use Sonner for immediate feedback
  general: {
    success: (title: string, description?: string) => {
      toast.success(title, { description });
    },
    
    error: (title: string, description?: string) => {
      toast.error(title, { description });
    },
    
    info: (title: string, description?: string) => {
      toast.info(title, { description });
    },
    
    warning: (title: string, description?: string) => {
      toast.warning(title, { description });
    }
  }
};
