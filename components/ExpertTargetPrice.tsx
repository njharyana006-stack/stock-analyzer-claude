
import React, { useState, useEffect } from 'react';
import { TargetIcon } from './icons';

interface ExpertTargetPriceProps {
    targets?: { high: number; low: number; median: number };
    currentPrice: number;
}

const ExpertTargetPrice: React.FC<ExpertTargetPriceProps> = ({ targets, currentPrice }) => {
    const [animWidthLow, setAnimWidthLow] = useState(0);
    const [animWidthHigh, setAnimWidthHigh] = useState(0);
    const [animMarker, setAnimMarker] = useState(0);

    if (!targets) return null;
    const { low, high, median } = targets;
    
    const min = Math.min(low, currentPrice) * 0.9;
    const max = Math.max(high, currentPrice) * 1.1;
    const range = max - min;

    const getPct = (val: number) => ((val - min) / range) * 100;

    // Upside calculation
    const upside = ((median - currentPrice) / currentPrice) * 100;
    const isUpside = upside >= 0;

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimWidthLow(getPct(median) - getPct(low));
            setAnimWidthHigh(getPct(high) - getPct(median));
            setAnimMarker(getPct(currentPrice));
        }, 200);
        return () => clearTimeout(timer);
    }, [targets, currentPrice]);

    return (
        <div className="g-card p-6 mb-6 shadow-sm">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-center text-indigo-500">
                        <TargetIcon className="w-5 h-5" />
                    </span>
                    12-Month Analyst Price Targets
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${isUpside ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20' : 'text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20'}`}>
                    {isUpside ? '+' : ''}{upside.toFixed(1)}% Upside
                </span>
            </div>
            
            <div className="relative h-12 mb-6 mt-2">
                {/* Background Track */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-zinc-800 rounded-full -translate-y-1/2"></div>
                
                {/* Colored Ranges - Animated Widths */}
                {/* Low to Avg */}
                <div 
                    className="absolute top-1/2 h-1 bg-gradient-to-r from-rose-400/50 to-slate-400/50 dark:from-rose-500/50 dark:to-zinc-500/50 rounded-l-full -translate-y-1/2 transition-all duration-1000 ease-out"
                    style={{ left: `${getPct(low)}%`, width: `${animWidthLow}%` }}
                ></div>
                {/* Avg to High */}
                <div 
                    className="absolute top-1/2 h-1 bg-gradient-to-r from-slate-400/50 to-emerald-400/50 dark:from-zinc-500/50 dark:to-emerald-500/50 rounded-r-full -translate-y-1/2 transition-all duration-1000 ease-out"
                    style={{ left: `${getPct(median)}%`, width: `${animWidthHigh}%` }}
                ></div>

                {/* Points with Labels */}
                {[
                    { val: low, color: '#F43F5E', label: 'Low', pos: 'bottom' },
                    { val: median, color: '#71717A', label: 'Avg', pos: 'top' },
                    { val: high, color: '#10B981', label: 'High', pos: 'bottom' }
                ].map((p) => (
                    <div key={p.label} className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center" style={{ left: `${getPct(p.val)}%`, transform: 'translate(-50%, -50%)' }}>
                        <div className="w-3 h-3 rounded-full border-2 border-white dark:border-[#121214] shadow-sm animate-pop-in" style={{ backgroundColor: p.color }}></div>
                    </div>
                ))}

                {/* Current Price Marker - Animated Position */}
                <div 
                    className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center z-10 transition-all duration-1000 ease-out" 
                    style={{ left: `${animMarker}%`, transform: 'translate(-50%, -50%)' }}
                >
                    <div className="w-5 h-5 border-[3px] border-white dark:border-white rounded-full bg-indigo-600 dark:bg-[#121214] shadow-lg animate-pop-in"></div>
                    <div className="absolute -top-9 bg-slate-900 dark:bg-white text-white dark:text-[#121214] text-[10px] font-bold px-2 py-1 rounded-md shadow-lg whitespace-nowrap after:content-[''] after:absolute after:left-1/2 after:bottom-[-4px] after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-slate-900 dark:after:border-t-white animate-fade-in tabular-nums">
                        ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex justify-between text-xs text-slate-500 dark:text-zinc-500 mt-4 font-medium border-t border-slate-100 dark:border-white/5 pt-4">
                <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500"></span>Low: <span className="text-slate-900 dark:text-white font-bold tabular-nums">${low.toLocaleString()}</span></span>
                <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-500"></span>Avg: <span className="text-slate-900 dark:text-white font-bold tabular-nums">${median.toLocaleString()}</span></span>
                <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>High: <span className="text-slate-900 dark:text-white font-bold tabular-nums">${high.toLocaleString()}</span></span>
            </div>
        </div>
    );
};

export default ExpertTargetPrice;
