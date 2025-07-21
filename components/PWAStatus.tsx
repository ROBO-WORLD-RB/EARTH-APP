import React, { useState, useEffect } from 'react';
import { usePWA } from '../services/pwaService';

interface PWAStatusProps {
  className?: string;
}

const PWAStatus: React.FC<PWAStatusProps> = ({ className = '' }) => {
  const { canInstall, isInstalled, updateAvailable, getAppVersion } = usePWA();
  const [version, setVersion] = useState<string>('unknown');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isVisible, setIsVisible] = useState(false);

  // Check if user has previously dismissed the status
  useEffect(() => {
    const statusHidden = localStorage.getItem('pwa-status-hidden');
    setIsVisible(!statusHidden);
  }, []);

  useEffect(() => {
    getAppVersion().then(setVersion);
  }, [getAppVersion]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('pwa-status-hidden', 'true');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 left-4 bg-gray-800 text-white text-xs p-3 rounded-lg shadow-lg z-50 max-w-xs ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold">PWA Status</h4>
        <button 
          onClick={handleClose}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Close PWA status"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Online:</span>
          <span className={isOnline ? 'text-green-400' : 'text-red-400'}>
            {isOnline ? '✓' : '✗'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Can Install:</span>
          <span className={canInstall ? 'text-green-400' : 'text-gray-400'}>
            {canInstall ? '✓' : '✗'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Installed:</span>
          <span className={isInstalled ? 'text-green-400' : 'text-gray-400'}>
            {isInstalled ? '✓' : '✗'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Update Available:</span>
          <span className={updateAvailable ? 'text-yellow-400' : 'text-gray-400'}>
            {updateAvailable ? '✓' : '✗'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>SW Version:</span>
          <span className="text-gray-300">{version}</span>
        </div>
        <div className="flex justify-between">
          <span>Display Mode:</span>
          <span className="text-gray-300">
            {window.matchMedia('(display-mode: standalone)').matches ? 'Standalone' : 'Browser'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PWAStatus;