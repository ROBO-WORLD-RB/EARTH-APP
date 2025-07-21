import React, { useState, useEffect } from 'react';
import { usePWA } from '../services/pwaService';

interface InstallButtonProps {
  className?: string;
  variant?: 'floating' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
}

const InstallButton: React.FC<InstallButtonProps> = ({ 
  className = '', 
  variant = 'floating',
  size = 'md',
  showLabel = false,
  label = 'Install App'
}) => {
  const { canInstall, isInstalled, showInstallPrompt } = usePWA();
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [installAttempted, setInstallAttempted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if device is iOS
    const ua = window.navigator.userAgent;
    const iOS = /iPad|iPhone|iPod/.test(ua) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(iOS);
    
    // Check if user has previously dismissed the button
    const dismissed = localStorage.getItem('install-button-dismissed');
    if (dismissed) {
      setIsVisible(false);
    }
  }, []);

  // Don't show if already installed or not installable
  if (isInstalled || !isVisible || (!canInstall && !isIOS)) {
    return null;
  }

  const handleInstallClick = async () => {
    setInstallAttempted(true);
    
    if (isIOS) {
      setShowIOSInstructions(true);
    } else if (canInstall) {
      try {
        await showInstallPrompt();
      } catch (error) {
        console.error('Error showing install prompt:', error);
      }
    }
  };
  
  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    localStorage.setItem('install-button-dismissed', 'true');
  };

  // Size classes
  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4'
  };
  
  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  // Variant classes
  const variantClasses = variant === 'floating' 
    ? 'fixed bottom-4 right-4 z-40 rounded-full shadow-lg hover:shadow-xl' 
    : 'rounded-md shadow hover:shadow-md';
    
  // Base button classes
  const buttonClasses = `
    bg-gradient-to-r from-pink-500 to-purple-600 
    text-white 
    transition-all 
    flex items-center gap-2
    ${sizeClasses[size]}
    ${variantClasses}
    ${className}
  `;

  return (
    <>
      <div className={variant === 'floating' ? '' : 'inline-block'}>
        <button
          onClick={handleInstallClick}
          className={buttonClasses}
          aria-label={label}
          title={label}
        >
          <svg className={iconSizeClasses[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {showLabel && <span>{label}</span>}
          
          {variant === 'floating' && (
            <button 
              onClick={handleDismiss}
              className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-1 shadow-md hover:bg-gray-700 transition-colors"
              aria-label="Dismiss install button"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </button>
      </div>

      {/* iOS Install Instructions Modal */}
      {showIOSInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Install on iOS
              </h3>
              <button
                onClick={() => setShowIOSInstructions(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              To install EARTH AI on your iOS device:
            </p>
            
            <ol className="list-decimal pl-5 mb-6 text-gray-600 dark:text-gray-300 space-y-3">
              <li>
                Tap the <span className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                  Share
                </span> button in Safari
              </li>
              <li>
                Scroll down and tap <span className="font-medium">Add to Home Screen</span>
                <div className="mt-1 bg-gray-100 dark:bg-gray-700 rounded p-2 text-xs">
                  <svg className="w-6 h-6 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add to Home Screen
                </div>
              </li>
              <li>Tap <span className="font-medium">Add</span> in the top right corner</li>
            </ol>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowIOSInstructions(false)}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded hover:opacity-90 transition-opacity"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallButton;