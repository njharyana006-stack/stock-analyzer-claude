
import React from 'react';
import type { Sector } from '../types';

const SectorTile: React.FC<{ sector: Sector }> = ({ sector }) => {
    const { name, change_percent } = sector;
    const safePercent = change_percent ?? 0;
    const isPositive = safePercent >= 0;

    // Vivid color logic for "Live" feel
    const getStyle = () => {
        if (safePercent > 1.5) return 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-emerald-600 shadow-emerald-200/50';
        if (safePercent > 0) return 'bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-800 border-emerald-200 dark:from-emerald-900/40 dark:to-emerald-900/60 dark:text-emerald-300 dark:border-emerald-800';
        if (safePercent === 0) return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
        if (safePercent > -1.5) return 'bg-gradient-to-br from-rose-50 to-rose-100 text-rose-800 border-rose-200 dark:from-rose-900/40 dark:to-rose-900/60 dark:text-rose-300 dark:border-rose-800';
        return 'bg-gradient-to-br from-rose-500 to-rose-600 text-white border-rose-600 shadow-rose-200/50';
    };

    const styleClass = getStyle();
    // Shorter names for tighter grids. Safe name access.
    const displayName = (name || '').replace('Communication Services', 'Comm. Svcs').replace('Consumer Discretionary', 'Cons. Disc.').replace('Consumer Staples', 'Cons. Staples').replace('Information Technology', 'Info Tech');

    return (
        <div 
            className={`group flex flex-col justify-center items-center p-3 rounded-xl border ${styleClass} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer min-h-[70px] relative overflow-hidden`}
            title={name}
        >
            {/* Shine effect on hover */}
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            
            <p className="font-bold text-[11px] leading-tight text-center mb-1 z-10">
                {displayName}
            </p>
            <p className="font-extrabold text-sm tabular-nums tracking-tight z-10">
                {isPositive && safePercent !== 0 ? '+' : ''}{safePercent.toFixed(2)}%
            </p>
        </div>
    );
};


const SectorPerformance: React.FC<{ sectors?: Sector[], isLoading: boolean }> = ({ sectors, isLoading }) => {
    if(isLoading) {
        return (
            <div className="animate-pulse grid grid-cols-2 gap-2 p-2">
                {[...Array(11)].map((_, i) => <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>)}
            </div>
        )
    }

    if (!sectors || sectors.length === 0) {
         return (
             <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                    <span className="text-2xl">📊</span>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Sector data unavailable</p>
            </div>
        );
    }
    
    // Sort by performance
    const sortedSectors = [...sectors].sort((a,b) => (b.change_percent ?? 0) - (a.change_percent ?? 0));

    return (
        <div className="p-2 h-full flex flex-col">
            <div className="grid grid-cols-2 gap-2.5 flex-grow content-start">
                {sortedSectors.map((sector) => (
                    <SectorTile key={sector.name} sector={sector} />
                ))}
            </div>
             <div className="mt-4 mb-2 flex justify-between items-center px-2 opacity-75">
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">Lowest Perf.</span>
                 <div className="flex gap-1 h-1.5 w-24 mx-2">
                    <div className="flex-1 rounded-l-full bg-rose-500"></div>
                    <div className="flex-1 bg-rose-200 dark:bg-rose-800"></div>
                    <div className="flex-1 bg-emerald-200 dark:bg-emerald-800"></div>
                    <div className="flex-1 rounded-r-full bg-emerald-500"></div>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Highest Perf.</span>
            </div>
        </div>
    );
};

export default SectorPerformance;
