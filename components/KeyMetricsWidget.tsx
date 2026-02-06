
import React from 'react';
import { SparklesIcon, DropIcon, BitcoinIcon, CheckCircleIcon } from './icons';
import type { MarketFundamentals } from '../types';
import Sparkline from './charts/Sparkline';

interface KeyMetricsWidgetProps {
    data?: MarketFundamentals;
    lastUpdated?: Date | null;
}

const getAssetIcon = (name: string) => {
    const lower = (name || '').toLowerCase();
    if (lower.includes('gold')) return <SparklesIcon className="w-5 h-5 text-amber-400" />;
    if (lower.includes('silver')) return <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-slate-200"></div>;
    if (lower.includes('oil')) return <DropIcon className="w-5 h-5 text-slate-800 dark:text-slate-200" />;
    if (lower.includes('bitcoin') || lower.includes('btc')) return <BitcoinIcon className="w-5 h-5 text-orange-500" />;
    return <SparklesIcon className="w-5 h-5 text-slate-400" />;
};

const MarketRateCard: React.FC<{ 
    name: string; 
    price: string; 
    change: string; 
    trend: 'up' | 'down' | 'neutral'; 
    weekly_trend?: number[];
}> = ({ name, price, change, trend, weekly_trend }) => {
    
    const isUp = trend === 'up';
    const isDown = trend === 'down';
    
    const colorClass = isUp ? 'text-emerald-700 dark:text-emerald-400' : isDown ? 'text-rose-700 dark:text-rose-400' : 'text-slate-600 dark:text-zinc-400';
    const bgClass = isUp ? 'bg-emerald-50 dark:bg-emerald-500/10' : isDown ? 'bg-rose-50 dark:bg-rose-500/10' : 'bg-slate-50 dark:bg-white/5';

    return (
        <div className="relative flex flex-col justify-between p-4 rounded-[24px] bg-white dark:bg-[#1C1C1E] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden">
            <div className="flex justify-between items-start z-10 w-full mb-1">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                        {getAssetIcon(name)}
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[50px]">{name}</span>
                </div>
                <div className={`px-2 py-0.5 rounded-md text-[10px] font-black tabular-nums ${bgClass} ${colorClass}`}>
                    {change}
                </div>
            </div>

            <div className="z-10 mt-1 mb-2">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white tabular-nums leading-none">
                    {price}
                </span>
            </div>

            <div className="h-8 w-full opacity-40 group-hover:opacity-100 transition-opacity">
                 {weekly_trend && Array.isArray(weekly_trend) && weekly_trend.length > 1 ? (
                    <Sparkline 
                        data={weekly_trend} 
                        isPositive={isUp} 
                        className={`w-full h-full stroke-[2px] ${isUp ? 'text-emerald-500' : 'text-rose-500'} fill-none`} 
                    />
                 ) : (
                    <div className="h-full w-full border-b border-dashed border-slate-200 dark:border-white/5 opacity-20"></div>
                 )}
            </div>
        </div>
    );
};

const KeyMetricsWidget: React.FC<KeyMetricsWidgetProps> = ({ data, lastUpdated }) => {
    const metrics = data ? [data.gold, data.silver, data.oil, data.bitcoin] : [];
    const formattedTime = lastUpdated ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--';

    return (
        <div className="w-full flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <SparklesIcon className="w-6 h-6 text-amber-500" />
                    Key Market Rates
                </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 flex-grow">
                {metrics.length > 0 ? metrics.map((metric, idx) => (
                    metric && <MarketRateCard key={idx} {...metric} />
                )) : (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="h-[100px] bg-slate-100 dark:bg-white/5 rounded-[24px] animate-pulse"></div>
                    ))
                )}
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 text-center px-1">
                <p className="inline-flex items-center text-[9px] text-slate-400 dark:text-zinc-500 font-black uppercase tracking-[0.2em]">
                    <CheckCircleIcon className="w-3 h-3 mr-2 text-emerald-500" />
                    Global Sync: {formattedTime}
                </p>
            </div>
        </div>
    );
};

export default KeyMetricsWidget;
