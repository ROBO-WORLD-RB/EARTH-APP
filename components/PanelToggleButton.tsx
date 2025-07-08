import React from 'react';
import BrainIcon from './icons/BrainIcon';

const PanelToggleButton: React.FC = () => {
  return (
    <div 
      className="fixed top-4 left-4 z-40"
      aria-label="Open AI Settings and History"
    >
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 via-purple-600 to-blue-500 flex items-center justify-center shadow-lg cursor-pointer transition-transform duration-200 hover:scale-110">
        <BrainIcon />
      </div>
    </div>
  );
};

export default PanelToggleButton;