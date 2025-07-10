import React, { useState } from 'react';
import { FileMessage } from '../types';
import { formatFileSize, getFileIcon, getFileCategory, truncateFileName } from '../utils/fileProcessor';

interface FilePreviewProps {
  file: FileMessage;
  onRemove?: (fileId: string) => void;
  showRemove?: boolean;
  className?: string;
}

const FilePreview: React.FC<FilePreviewProps> = ({ 
  file, 
  onRemove, 
  showRemove = true,
  className = ''
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isImageError, setIsImageError] = useState(false);
  const [showFullName, setShowFullName] = useState(false);

  const category = getFileCategory({ name: file.name, type: file.type } as File);
  const isImage = category === 'image';
  const isText = category === 'text' || category === 'code';

  const handleRemove = () => {
    if (onRemove) {
      onRemove(file.id);
    }
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handleImageError = () => {
    setIsImageError(true);
  };

  const renderPreview = () => {
    if (isImage && !isImageError) {
      return (
        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <img
            src={file.content}
            alt={file.name}
            className={`w-full h-full object-cover ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
      );
    }

    if (isText) {
      return (
        <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <span className="text-2xl">{getFileIcon({ name: file.name, type: file.type } as File)}</span>
        </div>
      );
    }

    return (
      <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <span className="text-2xl">{getFileIcon({ name: file.name, type: file.type } as File)}</span>
      </div>
    );
  };

  return (
    <div className={`flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {renderPreview()}
      
      <div className="flex-1 min-w-0">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setShowFullName(!showFullName)}
          title={file.name}
        >
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {showFullName ? file.name : truncateFileName(file.name, 25)}
          </span>
          {file.name.length > 25 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {showFullName ? '↺' : '...'}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span>{formatFileSize(file.size)}</span>
          <span>•</span>
          <span>{file.type || 'Unknown type'}</span>
          <span>•</span>
          <span>{new Date(file.uploadDate).toLocaleTimeString()}</span>
        </div>
      </div>

      {showRemove && onRemove && (
        <button
          onClick={handleRemove}
          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title="Remove file"
        >
          <svg 
            className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default FilePreview; 