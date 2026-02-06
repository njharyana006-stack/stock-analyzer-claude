
import React from 'react';
import { TrendUpIcon, TrendingDownIcon } from '../icons';
import Sparkline from './Sparkline';

interface MetricCardProps {
    title: string;
    value: string; // e.g., "+12.4%"
    isPositive: boolean;
    sparklineData?: number[];
    subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    isPositive,
    sparklineData,
    subtitle,
}) => {
    const colorClasses = isPositive
        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20'
        : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20';

    return (
        <div className="group bg-white dark:bg-[#1C1C1E] p-4 md:p-5 rounded-[20px] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col h-full">
            {/* Title */}
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-3">
                {title}
            </p>

            {/* Value with Trend Icon */}
            <div className="flex items-center gap-2 mb-3">
                <div className={`p-1.5 rounded-lg ${colorClasses}`}>
                    {isPositive ? (
                        <TrendUpIcon className="w-4 h-4" aria-hidden="true" />
                    ) : (
                        <TrendingDownIcon className="w-4 h-4" aria-hidden="true" />
                    )}
                </div>
                <span className={`text-2xl md:text-3xl font-black tabular-nums tracking-tight ${isPositive ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                    {value}
                </span>
            </div>

            {/* Sparkline */}
            {sparklineData && sparklineData.length > 1 && (
                <div className="h-12 w-full mt-auto">
                    <Sparkline
                        data={sparklineData}
                        isPositive={isPositive}
                        className={`w-full h-full stroke-[2px] ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}
                    />
                </div>
            )}

            {/* Subtitle */}
            {subtitle && (
                <p className="text-[9px] font-semibold text-slate-400 dark:text-zinc-500 mt-2">
                    {subtitle}
                </p>
            )}
        </div>
    );
};

export default React.memo(MetricCard);
