
import React, { useState, useEffect } from 'react';

interface SentimentBarProps {
    title?: string;
    percent?: number;
}

const SentimentBar: React.FC<SentimentBarProps> = ({ 
    title = "Market Sentiment", 
    percent = 60,
}) => {
    const [width, setWidth] = useState(0);
    const isBullish = percent > 50;
    
    useEffect(() => {
        const timer = setTimeout(() => setWidth(percent), 300);
        return () => clearTimeout(timer);
    }, [percent]);
    
    return (
        <div className="glass-panel rounded-[28px] p-5 w-full bg-white dark:bg-[#121214] border border-emerald-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow duration-300" role="region" aria-label={`${title} indicator`}>
            <div className="flex justify-between items-center mb-4 gap-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md border flex-shrink-0 ${isBullish ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20' : 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20'}`}>
                    {isBullish ? 'Bullish' : 'Bearish'}
                </span>
            </div>

            <div className="relative h-4 w-full bg-slate-200 dark:bg-zinc-800/80 rounded-full overflow-hidden shadow-inner" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label={`Sentiment score: ${percent}%`}>
                <div
                    className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${isBullish ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-rose-500 to-orange-500'}`}
                    style={{ width: `${width}%` }}
                >
                    {/* Shimmer */}
                    <div className="absolute inset-0 bg-white/20 animate-shimmer" style={{ transform: 'skewX(-20deg)' }} aria-hidden="true"></div>
                </div>
            </div>

            <div className="flex justify-between mt-3 text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                <span>Fear</span>
                <span className="text-slate-700 dark:text-zinc-300">{percent}% Score</span>
                <span>Greed</span>
            </div>
        </div>
    );
};

export default SentimentBar;
