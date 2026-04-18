import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className, size = 32 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="4" y="4" width="24" height="24" rx="6" fill="var(--accent-color)" fillOpacity="0.15" />
      <path 
        d="M10 12H22M10 16H18M10 20H20" 
        stroke="var(--accent-color)" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <rect 
        x="20" y="20" width="8" height="8" rx="2" 
        fill="var(--accent-color)" 
        stroke="var(--bg-primary)" 
        strokeWidth="2"
      />
    </svg>
  );
};
