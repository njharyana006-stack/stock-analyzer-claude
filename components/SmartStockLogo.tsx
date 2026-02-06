
import React from 'react';

interface SmartStockLogoProps {
    className?: string;
    variant?: 'icon' | 'full';
}

export const SmartStockLogo: React.FC<SmartStockLogoProps> = ({ className, variant = 'icon' }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <svg 
                viewBox="0 0 100 100" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <linearGradient id="logo_grad" x1="0" y1="100" x2="100" y2="0" gradientUnits="userSpaceOnUse">
                        {/* Emerald to Teal Gradient */}
                        <stop offset="0%" stopColor="#10b981" /> 
                        <stop offset="100%" stopColor="#0d9488" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
                
                {/* Main 'A' Shape / Chart Line */}
                <path 
                    d="M20 85 L45 25 L70 85" 
                    stroke="url(#logo_grad)" 
                    strokeWidth="10" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                />
                
                {/* Crossbar / Rising Trend */}
                <path 
                    d="M35 60 L55 60" 
                    stroke="url(#logo_grad)" 
                    strokeWidth="8" 
                    strokeLinecap="round" 
                />
                
                {/* The Arrow (Breakout) - Teal/Cyan Accent */}
                <path 
                    d="M15 85 L40 55 L55 70 L85 15" 
                    stroke="#2dd4bf" 
                    strokeWidth="8" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    filter="url(#glow)"
                />
                <path 
                    d="M85 15 L85 35 M85 15 L65 15" 
                    stroke="#2dd4bf" 
                    strokeWidth="8" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    filter="url(#glow)"
                />
            </svg>
        </div>
    );
};

export default SmartStockLogo;
