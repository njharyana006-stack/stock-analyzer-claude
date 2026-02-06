
import React from 'react';
import type { ComparisonInsight } from '../types';
import { BotIcon, RationaleIcon, GrowthIcon } from './icons';
import { popularStocks } from '../constants/stocks';

interface ComparisonInsightsProps {
    insights: ComparisonInsight;
}

const WinnerCard: React.FC<{ title: string; winner?: { ticker: string; reason: string } }> = ({ title, winner }) => {
    if (!winner || !winner.ticker) {
        return (
             <div className="bg-white dark:bg-[#121214] p-5 rounded-[24px] shadow-sm border border-slate-200 dark:border-white/5 h-full">
                <h4 className="font-bold text-slate-800 dark:text-white">{title}</h4>
                <p className="text-sm text-slate-500 dark:text-zinc-500 mt-2">No clear winner for this goal among the selected stocks.</p>
            </div>
        )
    }

    const stockInfo = popularStocks.find(s => s.symbol === winner.ticker);

    return (
        <div className="bg-white dark:bg-[#121214] p-5 rounded-[24px] shadow-sm border border-slate-200 dark:border-white/5 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
            <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-indigo-500 transition-colors">{title}</h4>
            <div className="mt-4 flex items-center space-x-4">
                 <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#18181B] border border-slate-200 dark:border-white/5 p-2 flex items-center justify-center shadow-sm">
                     <img
                        src={stockInfo ? `https://logo.clearbit.com/${stockInfo.domain}` : `https://ui-avatars.com/api/?name=${winner.ticker}`}
                        alt={`${winner.ticker} logo`}
                        className="w-full h-full object-contain rounded-lg"
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://ui-avatars.com/api/?name=${winner.ticker}&background=e5e7eb&color=4b5563&bold=true`; }}
                    />
                </div>
                <div>
                    <p className="font-extrabold text-2xl text-indigo-600 dark:text-indigo-400 leading-none">{winner.ticker}</p>
                    <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Winner</span>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">{winner.reason}</p>
            </div>
        </div>
    )
};

/**
 * A component that displays AI-generated insights when comparing multiple stocks.
 * It shows a high-level summary, which stock is better for specific investment goals,
 * and a detailed table comparing key metrics.
 */
const ComparisonInsights: React.FC<ComparisonInsightsProps> = ({ insights }) => {
    // Robustly handle potentially missing array to prevent "reading '0'" errors
    const comparisonData = Array.isArray(insights?.key_metric_comparison) ? insights.key_metric_comparison : [];
    // Safe access to tickers: Check if array has elements and if the first element has values
    const tickers = comparisonData.length > 0 && comparisonData[0]?.values 
        ? Object.keys(comparisonData[0].values) 
        : [];
    
    return (
        <div className="space-y-8 animate-slide-up">
            {/* AI Summary */}
            <div className="bg-white dark:bg-[#121214] p-6 md:p-8 rounded-[32px] shadow-sm border border-slate-200 dark:border-white/5">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                        <BotIcon className="w-6 h-6 text-indigo-500" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                        AI Comparative Analysis
                    </h4>
                </div>
                <p className="text-base text-slate-600 dark:text-zinc-300 leading-relaxed pl-1 border-l-2 border-indigo-500/50 ml-2">
                    {insights?.overall_summary || "Analysis summary unavailable."}
                </p>
            </div>

            {/* Winners Grid */}
            {insights?.winner_for_goals && (
                <div>
                     <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center px-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>
                        Goal-Based Winners
                     </h4>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <WinnerCard title="📈 Growth Potential" winner={insights.winner_for_goals.growth} />
                        <WinnerCard title="💰 Value Play" winner={insights.winner_for_goals.value} />
                        <WinnerCard title="🛡️ Income & Safety" winner={insights.winner_for_goals.dividends} />
                     </div>
                </div>
            )}
            
            {/* Comparison Table */}
            {comparisonData.length > 0 && tickers.length > 0 && (
                 <div className="bg-white dark:bg-[#121214] p-6 md:p-8 rounded-[32px] shadow-sm border border-slate-200 dark:border-white/5">
                    <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Key Metric Comparison</h4>
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-4 font-bold text-slate-500 dark:text-zinc-500 bg-slate-50/50 dark:bg-white/5 rounded-l-xl uppercase text-xs tracking-wider">Metric</th>
                                    {tickers.map((ticker, i) => (
                                        <th key={ticker} className={`p-4 font-bold text-slate-900 dark:text-white text-center bg-slate-50/50 dark:bg-white/5 ${i === tickers.length - 1 ? 'rounded-r-xl' : ''}`}>
                                            {ticker}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonData.map((row) => (
                                    <tr key={row.metric} className="border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-semibold text-slate-700 dark:text-zinc-400">{row.metric}</td>
                                        {tickers.map(ticker => {
                                            const isBest = row.best_ticker === ticker;
                                            return (
                                                <td key={ticker} className={`p-4 text-center font-medium ${isBest ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/30 dark:bg-indigo-500/10' : 'text-slate-800 dark:text-zinc-200'}`}>
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        {isBest && <span className="text-xs">🏆 </span>}
                                                        {row.values ? (row.values[ticker] || 'N/A') : 'N/A'}
                                                    </div>
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                </div>
            )}

            {/* Sector Summary */}
            {insights?.sector_performance_summary && (
                 <div className="bg-white dark:bg-[#121214] p-6 md:p-8 rounded-[32px] shadow-sm border border-slate-200 dark:border-white/5">
                    <h4 className="text-lg font-bold text-slate-800 dark:text-white flex items-center mb-3">
                        <RationaleIcon className="w-5 h-5 mr-3 text-indigo-500" />
                        Sector Performance Context
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                        {insights.sector_performance_summary}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ComparisonInsights;
