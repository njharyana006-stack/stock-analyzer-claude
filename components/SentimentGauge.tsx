
import React from 'react';

interface SentimentGaugeProps {
    sentiment: string;
    label: string;
}

const sentimentConfig: Record<string, { value: number, emoji: string }> = {
    "bullish": { value: 90, emoji: '🟢' },
    "optimistic": { value: 75, emoji: '🟢' },
    "mixed": { value: 50, emoji: '⚪' },
    "neutral": { value: 50, emoji: '⚪' },
    "cautious": { value: 40, emoji: '🔴' },
    "bearish": { value: 10, emoji: '🔴' },
};

const SentimentGauge: React.FC<SentimentGaugeProps> = ({ sentiment, label }) => {
    const safeSentiment = sentiment || '';
    const { value, emoji } = sentimentConfig[safeSentiment.toLowerCase()] ?? { value: 50, emoji: '⚪' };
    
    // Map value (0-100) to angle (-90 to 90 degrees)
    const angle = (value / 100) * 180 - 90;

    return (
        <div className="flex flex-col items-center">
            <p className="font-semibold text-xs text-slate-500 dark:text-slate-400">{label}</p>
            <div className="relative w-24 h-12 mt-1">
                {/* Gauge Background Arc */}
                <svg viewBox="0 0 100 50" className="w-full h-full">
                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-200 dark:text-slate-700" />
                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="url(#gradient)" strokeWidth="10" />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ef4444" />
                            <stop offset="50%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#22c55e" />
                        </linearGradient>
                    </defs>
                </svg>
                {/* Needle */}
                <div 
                    className="absolute bottom-0 left-1/2 w-0.5 h-9 bg-slate-800 dark:bg-slate-200 rounded-t-full origin-bottom transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
                >
                    <div className="w-2 h-2 rounded-full bg-slate-800 dark:bg-slate-200 absolute -top-1 -left-0.5"></div>
                </div>
            </div>
            <p className="font-bold text-sm text-slate-700 dark:text-slate-200 mt-1">{sentiment}</p>
        </div>
    );
};

export default SentimentGauge;
