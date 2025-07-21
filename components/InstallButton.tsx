import React, { useState, useEffect } from 'react';
import { usePWA } from '../services/pwaService';

interface InstallButtonProps {
  className?: string;
}

const InstallButton: React.FC<InstallButtonProps> = ({ className = '' }) => {
  const { canInstall, isInstalled, showInstallPrompt } = usePWA();
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if device is iOS
    const ua = window.navigator.userAgent;
    const iOS = /iPad|iPhone|iPod/.test(ua) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(iOS);
  }, []);

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
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

  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`fixed bottom-4 right-4 z-40 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all ${className}`}
        aria-label="Install App"
        title="Install App"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </button>

      {/* iOS Install Instructions Modal */}
      {showIOSInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Install on iOS
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              To install this app on your iOS device:
            </p>
            <ol className="list-decimal pl-5 mb-4 text-gray-600 dark:text-gray-300 space-y-2">
              <li>Tap the <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Share</span> button in Safari</li>
              <li>Scroll down and tap <span className="font-medium">Add to Home Screen</span></li>
              <li>Tap <span className="font-medium">Add</span> in the top right corner</li>
            </ol>
            <div className="flex justify-end">
              <button
                onClick={() => setShowIOSInstructions(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallButton;