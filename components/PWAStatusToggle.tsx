import React, { useState, useEffect } from 'react';

interface PWAStatusToggleProps {
  className?: string;
}

const PWAStatusToggle: React.FC<PWAStatusToggleProps> = ({ className = '' }) => {
  const [isStatusVisible, setIsStatusVisible] = useState(false);
  
  useEffect(() => {
    // Check if status was previously shown
    const statusHidden = localStorage.getItem('pwa-status-hidden');
    setIsStatusVisible(!statusHidden);
  }, []);
  
  const handleToggle = () => {
    const newValue = !isStatusVisible;
    setIsStatusVisible(newValue);
    
    if (newValue) {
      localStorage.removeItem('pwa-status-hidden');
    } else {
      localStorage.setItem('pwa-status-hidden', 'true');
    }
  };
  
  return (
    <button
      onClick={handleToggle}
      className={`fixed bottom-4 right-20 z-40 bg-gray-800 text-white rounded-full p-2 shadow-lg hover:bg-gray-700 transition-colors ${className}`}
      aria-label={isStatusVisible ? 'Hide PWA Status' : 'Show PWA Status'}
      title={isStatusVisible ? 'Hide PWA Status' : 'Show PWA Status'}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {isStatusVisible ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        )}
      </svg>
    </button>
  );
};

export default PWAStatusToggle;