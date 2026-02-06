
import React, { useState, useMemo } from 'react';
import type { MarketIndex } from '../types';
import Sparkline from './charts/Sparkline';
import AnimatedNumber from './AnimatedNumber';
import { ChevronDownIcon, ChevronUpIcon } from './icons';

interface MarketGlanceProps {
    indices?: MarketIndex[];
    isLoading: boolean;
    transparent?: boolean;
}

const IndexBentoCell: React.FC<{ 
    name: string; 
    ticker: string; 
    price: string; 
    changePercent: string; 
    isPositive: boolean; 
    chartData?: number[]; 
    transparent?: boolean;
}> = ({ name, ticker, price, changePercent, isPositive, chartData, transparent }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    // Safe handling for price string to avoid "undefined reading replace" errors
    const safePrice = price || "0";
    const priceNum = parseFloat(safePrice.replace(/[^0-9.-]+/g, ""));
    const hasData = !isNaN(priceNum) && price !== '---';
    
    // Apple-style Glassmorphism & Depth with standard interactive class
    const baseClasses = transparent 
        ? 'bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 shadow-lg card-hover' 
        : 'bg-white dark:bg-[#1C1C1E] border border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10 shadow-sm hover:shadow-md card-hover';

    const textColor = transparent ? 'text-white' : 'text-slate-900 dark:text-white';
    const subTextColor = transparent ? 'text-white/70' : 'text-slate-500 dark:text-zinc-400';
    const labelColor = transparent ? 'text-white/50' : 'text-slate-400 dark:text-zinc-500';

    const chartColor = isPositive 
        ? (transparent ? 'text-emerald-300' : 'text-emerald-500')
        : (transparent ? 'text-rose-300' : 'text-rose-500');
    
    // More subtle badge colors for premium feel
    const badgeBg = transparent
        ? (isPositive ? 'bg-emerald-400/20 text-emerald-100' : 'bg-rose-400/20 text-rose-100')
        : (isPositive ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400');

    // Derived Stats
    const stats = useMemo(() => {
        if (!chartData || !Array.isArray(chartData) || chartData.length === 0) return null;
        const low = Math.min(...chartData);
        const high = Math.max(...chartData);
        const open = chartData[0];
        const range = high - low;
        const progress = range > 0 ? ((priceNum - low) / range) * 100 : 50;
        return { low, high, open, progress };
    }, [chartData, priceNum]);

    // Clean up display ticker (remove Polygon I: prefix if present)
    const displayTicker = ticker.replace('I:', '');

    return (
        <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`relative flex flex-col justify-between p-5 md:p-6 rounded-[28px] overflow-hidden transition-all duration-300 text-left w-full ${baseClasses} ${isExpanded ? 'h-auto ring-1 ring-black/5 dark:ring-white/10' : 'min-h-[160px]'}`}
        >
            {/* Header */}
            <div className="flex justify-between items-start z-10 w-full mb-2">
                <div>
                    <span className={`text-sm font-bold block leading-tight ${subTextColor}`}>{name}</span>
                    <span className={`text-[10px] font-black uppercase tracking-wider opacity-80 ${labelColor}`}>{displayTicker}</span>
                </div>
                {hasData && (
                    <div className={`px-2.5 py-1 rounded-lg backdrop-blur-md ${badgeBg}`}>
                        <span className="text-xs font-bold tabular-nums tracking-tight">{changePercent}</span>
                    </div>
                )}
            </div>

            {/* Price (Big & Bold) */}
            <div className="z-10 mt-1 mb-4">
                <span className={`text-3xl lg:text-4xl font-black tracking-tight tabular-nums leading-none ${textColor}`}>
                    {hasData ? (
                        <AnimatedNumber value={priceNum} decimals={2} prefix={displayTicker === 'VIX' ? '' : '$'} />
                    ) : (
                        <span className="text-2xl text-slate-300 dark:text-zinc-700">---</span>
                    )}
                </span>
            </div>

            {/* Chart - Cleaner placement */}
            <div className={`h-12 w-full transition-all duration-500 ${isExpanded ? 'opacity-40' : 'opacity-100'}`}>
                 {chartData && Array.isArray(chartData) && hasData && (
                     <div className="w-full h-full -ml-1">
                        <Sparkline 
                            data={chartData} 
                            isPositive={isPositive} 
                            className={`w-full h-full stroke-[3px] ${chartColor} fill-none`} 
                        />
                     </div>
                 )}
            </div>

            {/* Expanded Details */}
            <div className={`grid transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-4 pt-4 border-t border-black/5 dark:border-white/5' : 'grid-rows-[0fr] opacity-0 mt-0 pt-0 border-none'}`}>
                <div className="min-h-0 space-y-3">
                    {stats && hasData && (
                        <div className="flex justify-between gap-4 text-xs">
                            <div>
                                <span className={`block text-[9px] uppercase font-bold ${labelColor} mb-0.5`}>Low</span>
                                <span className={`font-semibold tabular-nums ${textColor}`}>{stats.low.toFixed(2)}</span>
                            </div>
                            <div className="text-right">
                                <span className={`block text-[9px] uppercase font-bold ${labelColor} mb-0.5`}>High</span>
                                <span className={`font-semibold tabular-nums ${textColor}`}>{stats.high.toFixed(2)}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </button>
    );
};

const MarketGlance: React.FC<MarketGlanceProps> = ({ indices, isLoading, transparent }) => {
    
    const getData = (targetSymbol: string, fallbackName: string, fallbackTicker: string) => {
        // Robust matching including Polygon 'I:' prefixes
        const found = (Array.isArray(indices) ? indices : [])?.find(i => 
            i.symbol.includes(targetSymbol) || 
            i.name.includes(targetSymbol) || 
            (targetSymbol === 'S&P' && i.name.includes('S&P')) ||
            (targetSymbol === 'Dow' && i.name.includes('Dow'))
        );
        
        if (found) {
             return {
                 name: found.name,
                 ticker: found.symbol,
                 price: found.price,
                 changePercent: found.percent_change,
                 isPositive: found.is_positive,
                 chartData: found.chart_data
             };
        }
        
        return {
            name: fallbackName,
            ticker: fallbackTicker,
            price: '---',
            changePercent: '--',
            isPositive: true,
            chartData: []
        };
    };

    const sp500 = getData('S&P', 'S&P 500', 'SPX');
    const nasdaq = getData('Nasdaq', 'Nasdaq 100', 'NDX');
    const dow = getData('Dow', 'Dow Jones', 'DJI');
    const vix = getData('VIX', 'Volatility', 'VIX');

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
            <IndexBentoCell {...sp500} transparent={transparent} />
            <IndexBentoCell {...nasdaq} transparent={transparent} />
            <IndexBentoCell {...dow} transparent={transparent} />
            <IndexBentoCell {...vix} transparent={transparent} />
        </div>
    );
};

export default MarketGlance;
