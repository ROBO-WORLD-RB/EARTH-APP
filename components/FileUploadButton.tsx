import React, { useState, useRef, useCallback } from 'react';
import { validateFile } from '../utils/fileProcessor';

interface FileUploadButtonProps {
  onFileSelect: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({ 
  onFileSelect, 
  disabled = false,
  className = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const fileArray = Array.from(files);
      const validFiles: File[] = [];
      const errors: string[] = [];

      for (const file of fileArray) {
        const validation = validateFile(file);
        if (validation.isValid) {
          validFiles.push(file);
        } else {
          errors.push(`${file.name}: ${validation.error}`);
        }
      }

      if (errors.length > 0) {
        setError(errors.join('\n'));
      }

      if (validFiles.length > 0) {
        onFileSelect(validFiles);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process files');
    } finally {
      setIsUploading(false);
    }
  }, [onFileSelect]);

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragOver(true);
    }
  }, [disabled, isUploading]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!disabled && !isUploading) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [disabled, isUploading, handleFileSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    // Reset input value to allow selecting the same file again
    if (e.target) {
      e.target.value = '';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || isUploading}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative flex items-center justify-center p-2 rounded-full
          transition-all duration-200 ease-in-out
          ${isDragOver 
            ? 'bg-purple-100 dark:bg-purple-900/30 border-2 border-dashed border-purple-400' 
            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
          }
          ${disabled || isUploading 
            ? 'opacity-50 cursor-not-allowed' 
            : 'cursor-pointer hover:scale-105'
          }
        `}
        title="Upload files (drag & drop supported)"
      >
        {isUploading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Processing...</span>
          </div>
        ) : (
          <svg 
            className="w-5 h-5 text-gray-600 dark:text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
            />
          </svg>
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleInputChange}
        className="hidden"
        accept=".txt,.md,.json,.csv,.js,.ts,.jsx,.tsx,.html,.css,.xml,.pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.svg,.gif"
      />

      {error && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg shadow-lg z-50 max-w-xs">
          <div className="text-red-700 dark:text-red-300 text-sm whitespace-pre-line">
            {error}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 w-2 h-2 bg-red-100 dark:bg-red-900/30 border-l border-b border-red-300 dark:border-red-700 rotate-45"></div>
        </div>
      )}

      {isDragOver && (
        <div className="absolute inset-0 bg-purple-500/10 border-2 border-dashed border-purple-400 rounded-full flex items-center justify-center">
          <span className="text-purple-600 dark:text-purple-400 text-sm font-medium">
            Drop files here
          </span>
        </div>
      )}
    </div>
  );
};

export default FileUploadButton; 