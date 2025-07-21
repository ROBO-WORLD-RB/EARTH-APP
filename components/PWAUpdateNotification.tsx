import React, { useState, useEffect } from 'react';
import { usePWA } from '../services/pwaService';

interface PWAUpdateNotificationProps {
  className?: string;
}

const PWAUpdateNotification: React.FC<PWAUpdateNotificationProps> = ({ className = '' }) => {
  const { updateAvailable, applyUpdate } = usePWA();
  const [isVisible, setIsVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setIsVisible(updateAvailable);
  }, [updateAvailable]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await applyUpdate();
      // The page will reload automatically after update
    } catch (error) {
      console.error('Error applying update:', error);
      setIsUpdating(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`fixed top-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg shadow-lg p-4 z-50 animate-slide-down ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
            Update Available
          </h3>
          <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
            A new version of EARTH AI is ready with improvements and bug fixes.
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-2 px-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUpdating ? (
                <span className="flex items-center justify-center gap-1">
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </span>
              ) : (
                'Update Now'
              )}
            </button>
            
            <button
              onClick={handleDismiss}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 px-2 transition-colors"
            >
              Later
            </button>
          </div>
        </div>
        
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
          aria-label="Dismiss update notification"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Update details */}
      <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
        <div className="text-xs text-blue-600 dark:text-blue-400">
          <p className="font-medium mb-1">What's new:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Performance improvements</li>
            <li>Bug fixes and stability</li>
            <li>Enhanced offline support</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PWAUpdateNotification;