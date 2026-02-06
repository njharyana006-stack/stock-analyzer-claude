
import React from 'react';
import type { TopMover } from '../types';
import Sparkline from './charts/Sparkline';
import { TrendingDownIcon } from './icons';

interface MostActiveStocksProps {
    movers?: TopMover[];
    isLoading: boolean;
    onSelectTicker: (ticker: string) => void;
}

const MoverItem: React.FC<{ mover: TopMover; onSelect: () => void }> = ({ mover, onSelect }) => {
    const isPositive = mover.is_positive;
    const colorClass = isPositive ? 'text-[var(--text-success)]' : 'text-[var(--text-danger)]';

    return (
        <button onClick={onSelect} className="w-full text-left p-2 hover:bg-slate-50 rounded-md transition-colors group flex items-center gap-3">
            <div className="flex-1 overflow-hidden">
                <p className="font-semibold text-sm text-slate-800">{mover.ticker}</p>
                <p className="text-xs text-slate-500 truncate">{mover.name}</p>
            </div>
            {mover.chart_data && mover.chart_data.length > 0 && (
                 <div className="w-20 h-8">
                    <Sparkline data={mover.chart_data} isPositive={isPositive} />
                </div>
            )}
            <div className="text-right tabular-nums">
                <p className="font-semibold text-sm text-slate-800">{mover.price}</p>
                <p className={`text-xs font-semibold ${colorClass}`}>{mover.percent_change}</p>
            </div>
        </button>
    );
};


const MostActiveStocks: React.FC<MostActiveStocksProps> = ({ movers, isLoading, onSelectTicker }) => {
    if (isLoading) {
        return (
            <div className="space-y-2 animate-pulse">
                {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-slate-100 rounded-lg"></div>)}
            </div>
        );
    }
    
    return (
        <div className="space-y-1">
            {movers && movers.length > 0 ? (
                movers.map(mover => (
                    <MoverItem key={mover.ticker} mover={mover} onSelect={() => onSelectTicker(mover.ticker)} />
                ))
            ) : (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center rounded-xl bg-slate-50/50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center mb-3">
                        <TrendingDownIcon className="w-5 h-5 text-slate-400 dark:text-zinc-500" />
                    </div>
                    <p className="text-sm font-bold text-slate-600 dark:text-zinc-300">Quiet Market</p>
                    <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1">No significant movers detected at this moment.</p>
                </div>
            )}
        </div>
    );
};

export default MostActiveStocks;
