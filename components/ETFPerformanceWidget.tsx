
import React from 'react';
import type { ETFPerformance } from '../types';
import { TrendingDownIcon, GrowthIcon, PieChartIcon, ArrowUpRightIcon } from './icons';

interface ETFPerformanceWidgetProps {
    data?: ETFPerformance[];
    isLoading: boolean;
}

const ETFRow: React.FC<{ etf: ETFPerformance }> = ({ etf }) => {
    const sixMonthIsPos = etf.six_month_return >= 0;
    const oneYearIsPos = etf.one_year_return >= 0;

    return (
        <div className="p-4 bg-white dark:bg-[#1C1C1E] border border-slate-100 dark:border-white/5 rounded-2xl hover:shadow-md transition-all duration-200 group">
            {/* Header with Symbol and Name */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[10px] font-black text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 shadow-sm flex-shrink-0">
                        {etf.symbol}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate leading-tight">{etf.name}</p>
                        <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 tabular-nums mt-0.5">${etf.price.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 gap-3">
                {/* 6 Month Return */}
                <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3 border border-slate-100 dark:border-white/5">
                    <p className="text-[9px] text-slate-500 dark:text-zinc-400 uppercase font-black tracking-wider mb-1.5">6 Month</p>
                    <div className={`flex items-baseline gap-1 ${sixMonthIsPos ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        <span className="text-lg font-black tabular-nums tracking-tight">
                            {sixMonthIsPos ? '+' : ''}{etf.six_month_return.toFixed(1)}%
                        </span>
                    </div>
                    <p className="text-[8px] text-slate-400 dark:text-zinc-500 uppercase font-bold tracking-wide mt-1">Return</p>
                </div>

                {/* 1 Year Return */}
                <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-3 border border-slate-100 dark:border-white/5">
                    <p className="text-[9px] text-slate-500 dark:text-zinc-400 uppercase font-black tracking-wider mb-1.5">1 Year</p>
                    <div className={`flex items-baseline gap-1 ${oneYearIsPos ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        <span className="text-lg font-black tabular-nums tracking-tight">
                            {oneYearIsPos ? '+' : ''}{etf.one_year_return.toFixed(1)}%
                        </span>
                    </div>
                    <p className="text-[8px] text-slate-400 dark:text-zinc-500 uppercase font-bold tracking-wide mt-1">Return</p>
                </div>
            </div>
        </div>
    );
};

const ETFPerformanceWidget: React.FC<ETFPerformanceWidgetProps> = ({ data, isLoading }) => {
    const etfList = data || [];

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6 px-2">
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                    <PieChartIcon className="w-6 h-6 text-indigo-500" />
                    Major ETF Benchmarks
                </h3>
            </div>
            
            <div className="flex-grow flex flex-col">
                {isLoading ? (
                    <div className="grid grid-cols-1 gap-4">
                        {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-32 bg-white dark:bg-[#121214] border border-slate-100 dark:border-white/5 rounded-2xl animate-pulse"></div>)}
                    </div>
                ) : etfList.length > 0 ? (
                    <>
                        <div className="flex-grow overflow-y-auto custom-scrollbar space-y-3">
                            {etfList.map((etf) => (
                                <ETFRow key={etf.symbol} etf={etf} />
                            ))}
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/5 text-center">
                            <span className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.2em]">Sector Relative Alpha Tracker</span>
                        </div>
                    </>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-[#121214] border border-slate-100 dark:border-white/5 rounded-2xl">
                        <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-4">
                            <TrendingDownIcon className="w-8 h-8 text-slate-300 dark:text-zinc-700" />
                        </div>
                        <p className="text-sm font-bold text-slate-400 dark:text-zinc-500">Benchmark data unavailable</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ETFPerformanceWidget;
