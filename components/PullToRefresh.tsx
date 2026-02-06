
import React, { useState, useRef, useEffect } from 'react';
import { ReloadIcon } from './icons';

interface PullToRefreshProps {
    onRefresh: () => Promise<void>;
    children: React.ReactNode;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children }) => {
    const [startY, setStartY] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const THRESHOLD = 80;

    const handleTouchStart = (e: React.TouchEvent) => {
        if (containerRef.current && containerRef.current.scrollTop === 0) {
            setStartY(e.touches[0].clientY);
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (startY === 0) return;
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY;

        if (diff > 0 && containerRef.current?.scrollTop === 0) {
            // Add resistance
            setPullDistance(Math.min(diff * 0.5, 150)); 
        }
    };

    const handleTouchEnd = async () => {
        if (pullDistance > THRESHOLD) {
            setRefreshing(true);
            setPullDistance(60); // Snap to loading position
            try {
                await onRefresh();
            } finally {
                setTimeout(() => {
                    setRefreshing(false);
                    setPullDistance(0);
                    setStartY(0);
                }, 500);
            }
        } else {
            setPullDistance(0);
            setStartY(0);
        }
    };

    return (
        <div 
            id="main-scroll-container"
            ref={containerRef}
            className="h-full w-full overflow-auto relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div 
                className="absolute top-0 left-0 w-full flex justify-center items-center pointer-events-none"
                style={{ 
                    height: `${pullDistance}px`, 
                    transition: refreshing ? 'height 0.3s ease' : 'none',
                    overflow: 'hidden'
                }}
            >
                <div className={`flex flex-col items-center justify-center ${refreshing ? 'animate-pulse' : ''} transition-opacity duration-300`} style={{ opacity: Math.min(pullDistance / THRESHOLD, 1) }}>
                    <ReloadIcon className={`w-6 h-6 text-indigo-500 ${refreshing ? 'animate-spin' : ''} ${!refreshing && pullDistance > THRESHOLD ? 'rotate-180 transition-transform duration-300' : ''}`} />
                    <span className="text-[10px] font-bold text-indigo-500 mt-1">
                        {refreshing ? 'Refreshing...' : pullDistance > THRESHOLD ? 'Release to Update' : 'Pull Down'}
                    </span>
                </div>
            </div>
            
            <div 
                style={{ 
                    transform: `translateY(${pullDistance}px)`,
                    transition: refreshing ? 'transform 0.3s ease' : pullDistance === 0 ? 'transform 0.3s ease' : 'none'
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default PullToRefresh;
