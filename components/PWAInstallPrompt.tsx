import React, { useState, useEffect } from 'react';
import { usePWA } from '../services/pwaService';

interface PWAInstallPromptProps {
  className?: string;
}

const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ className = '' }) => {
  const { canInstall, isInstalled, showInstallPrompt } = usePWA();
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has previously dismissed the prompt
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      setIsDismissed(true);
    }
  }, []);

  useEffect(() => {
    // Show prompt if app can be installed and hasn't been dismissed
    setIsVisible(canInstall && !isInstalled && !isDismissed);
  }, [canInstall, isInstalled, isDismissed]);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const accepted = await showInstallPrompt();
      if (!accepted) {
        // User dismissed the prompt
        handleDismiss();
      }
    } catch (error) {
      console.error('Error installing PWA:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  const handleRemindLater = () => {
    setIsVisible(false);
    // Show again after 24 hours
    setTimeout(() => {
      setIsVisible(canInstall && !isInstalled);
    }, 24 * 60 * 60 * 1000);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50 animate-slide-up ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">🌍</span>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Install EARTH AI
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            Get the full app experience with offline access and faster loading.
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-medium py-2 px-3 rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {isInstalling ? (
                <span className="flex items-center justify-center gap-1">
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                  Installing...
                </span>
              ) : (
                'Install'
              )}
            </button>
            
            <button
              onClick={handleRemindLater}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 px-2 transition-colors"
            >
              Later
            </button>
          </div>
        </div>
        
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Dismiss install prompt"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Benefits list */}
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <li className="flex items-center gap-2">
            <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Works offline
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Faster loading
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Native app feel
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;