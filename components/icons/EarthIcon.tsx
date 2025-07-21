import React from 'react';

interface EarthIconProps {
  className?: string;
}

const EarthIcon: React.FC<EarthIconProps> = ({ className = "w-6 h-6" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="earthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="50%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      
      {/* Main circle */}
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="url(#earthGradient)"
        stroke="white"
        strokeWidth="2"
      />
      
      {/* Letter C */}
      <path
        d="M35 35 Q25 35 25 50 Q25 65 35 65"
        stroke="white"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Plus sign */}
      <path
        d="M70 45 L70 55 M65 50 L75 50"
        stroke="#EC4899"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default EarthIcon;