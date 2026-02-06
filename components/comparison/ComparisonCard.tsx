
import React from 'react';
import type { AnalysisResponse } from '../../types';
import StockSelectorForCompare from './StockSelectorForCompare';
import { GrowthIcon, MarketCapIcon, TrendingDownIcon, PauseIcon, XIcon, BotIcon, SentimentIcon, RiskIcon, TechnicalIcon, AnalyzeIcon, SparklesIcon, ReloadIcon } from '../icons';
import { getStockLogo } from '../../constants/stocks';
import Sparkline from '../charts/Sparkline';

type AnalysisDataState = {
    state: 'loading' | 'loaded' | 'error';
    data: AnalysisResponse | null;
    error?: string;
};

interface ComparisonCardProps {
    ticker: string | null;
    analysis: AnalysisDataState | undefined;
    onSelect: (ticker: string) => void;
    onRemove: () => void;
    onRetry?: () => void;
    disabledTickers: string[];
    onLoadAnalysis: (analysis: AnalysisResponse) => void;
}

const MetricRow: React.FC<{ label: string; value: React.ReactNode; icon: React.ReactNode; }> = ({ label, value, icon }) => (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-white/5 last:border-b-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors px-2 rounded-lg -mx-2">
        <div className="flex items-center text-sm text-slate-500 dark:text-zinc-400 font-medium">
            {icon}
            <span className="ml-2">{label}</span>
        </div>
        <div className="font-bold text-slate-800 dark:text-zinc-200 text-sm text-right">{value}</div>
    </div>
);

const MiniRadialScore: React.FC<{ score: number }> = ({ score }) => {
    const radius = 16;
    const stroke = 3;
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 10) * circumference;

    const scoreColor = score >= 7 ? 'stroke-emerald-500' : score >= 4 ? 'stroke-amber-500' : 'stroke-rose-500';
    const textColor = score >= 7 ? 'text-emerald-500 dark:text-emerald-400' : score >= 4 ? 'text-amber-500 dark:text-amber-400' : 'text-rose-500 dark:text-rose-400';

    return (
        <div className="relative flex items-center justify-center w-10 h-10">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 38 38">
            <circle
                className="text-slate-100 dark:text-white/10"
                strokeWidth={stroke}
                stroke="currentColor"
                fill="transparent"
                r={normalizedRadius}
                cx="19"
                cy="19"
            />
            <circle
                className={`${scoreColor} transition-all duration-1000 ease-out`}
                strokeWidth={stroke}
                strokeDasharray={`${circumference} ${circumference}`}
                style={{ strokeDashoffset, strokeLinecap: 'round' }}
                stroke="currentColor"
                fill="transparent"
                r={normalizedRadius}
                cx="19"
                cy="19"
            />
            </svg>
            <span className={`absolute text-xs font-bold ${textColor}`}>{Math.round(score)}</span>
        </div>
    );
};

const ComparisonCard: React.FC<ComparisonCardProps> = ({ ticker, analysis, onSelect, onRemove, onRetry, disabledTickers, onLoadAnalysis }) => {
    
    const renderEmpty = () => (
        <StockSelectorForCompare onSelect={onSelect} disabledTickers={disabledTickers} />
    );

    const renderLoading = () => (
        <div className="h-full">
            <div className="bg-white dark:bg-[#121214] p-6 rounded-[32px] shadow-sm border border-slate-200 dark:border-white/5 animate-pulse h-full">
                <div className="h-8 bg-slate-200 dark:bg-white/10 rounded w-1/3 mb-4"></div>
                <div className="h-32 bg-slate-100 dark:bg-white/5 rounded-2xl w-full mb-6"></div>
                <div className="space-y-4">
                    <div className="h-6 bg-slate-100 dark:bg-white/5 rounded w-full"></div>
                    <div className="h-6 bg-slate-100 dark:bg-white/5 rounded w-full"></div>
                    <div className="h-6 bg-slate-100 dark:bg-white/5 rounded w-full"></div>
                </div>
            </div>
        </div>
    );
    
    const renderError = () => (
        <div className="h-full animate-fade-in">
            <div className="bg-white dark:bg-[#121214] p-6 rounded-[28px] shadow-sm border border-rose-200 dark:border-rose-500/20 h-full flex flex-col relative overflow-hidden group">
                 <div className="flex justify-between items-start z-10 mb-6">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{ticker}</h3>
                        <div className="flex items-center gap-1.5 mt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                            <p className="text-[10px] font-black uppercase tracking-[0.1em] text-rose-600/80 dark:text-rose-500/80">Error</p>
                        </div>
                    </div>
                    <button onClick={onRemove} className="p-2 bg-rose-50 dark:bg-rose-500/10 rounded-full text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 transition-colors" title="Remove">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-grow flex flex-col items-center justify-center text-center px-4 mb-6 z-10">
                    <div className="w-12 h-12 bg-rose-100 dark:bg-rose-500/20 rounded-full flex items-center justify-center mb-3">
                        <TrendingDownIcon className="w-6 h-6 text-rose-500" />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-zinc-300 font-bold">Analysis Failed</p>
                    <p className="text-xs text-slate-500 dark:text-zinc-500 mt-1 italic">
                        "{analysis?.error || 'System unavailable.'}"
                    </p>
                </div>

                <div className="mt-auto space-y-3 z-10">
                    <button 
                        onClick={onRetry}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:shadow-lg active:scale-[0.98]"
                    >
                        <ReloadIcon className="w-4 h-4" />
                        <span>Retry</span>
                    </button>
                </div>
            </div>
        </div>
    );

    const renderLoaded = () => {
        if (!analysis?.data) return renderError();
        const { overview, individual_analysis, news_sentiment_analysis, historical_data } = analysis.data;
        
        const logoUrl = getStockLogo(overview.ticker, overview.company_name);

        const formatPercent = (val: number) => {
            if (typeof val !== 'number') return <span className="text-zinc-500">N/A</span>;
            const sign = val > 0 ? '+' : '';
            const color = val > 0 ? 'text-emerald-500 dark:text-emerald-400' : val < 0 ? 'text-rose-500 dark:text-rose-400' : 'text-slate-500 dark:text-zinc-400';
            return <span className={color}>{`${sign}${val.toFixed(1)}%`}</span>;
        };

        const getSignalChip = (signal: 'Bullish' | 'Bearish' | 'Neutral') => {
            const config = {
                Bullish: { bg: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400', icon: <GrowthIcon className="w-3 h-3"/> },
                Bearish: { bg: 'bg-rose-100 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/20', text: 'text-rose-600 dark:text-rose-400', icon: <TrendingDownIcon className="w-3 h-3"/> },
                Neutral: { bg: 'bg-slate-100 border-slate-200 dark:bg-white/5 dark:border-white/10', text: 'text-slate-500 dark:text-zinc-400', icon: <PauseIcon className="w-3 h-3"/> },
            };
            const { bg, text, icon } = config[signal] || config.Neutral;
            return <span className={`inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide rounded-md border ${bg} ${text}`}>{icon}<span>{signal}</span></span>;
        };

        const getSentimentScoreDisplay = (score: number) => {
            let textColor = 'text-amber-500 dark:text-amber-400 font-bold';
            if (score > 3) textColor = 'text-emerald-500 dark:text-emerald-400 font-bold';
            else if (score < -3) textColor = 'text-rose-500 dark:text-rose-400 font-bold';
            
            return (
                <span className={`text-base ${textColor}`}>
                    {score.toFixed(1)}
                </span>
            );
        };
        
        // Generate chart data
        const chartData = historical_data?.map(d => d.close) || [];
        const chartDates = historical_data?.map(d => new Date(d.date).toLocaleDateString()) || [];
        const isChartPositive = chartData.length > 1 && chartData[chartData.length - 1] >= chartData[0];

        return (
            <div className="h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">
                <div className={`p-5 rounded-[32px] shadow-sm border border-slate-200 dark:border-white/5 h-full flex flex-col bg-white dark:bg-[#121214] relative overflow-hidden`}>
                    {/* Ambient Glow */}
                    <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[80px] opacity-20 pointer-events-none transition-colors duration-500 ${overview.signal === 'Bullish' ? 'bg-emerald-500' : overview.signal === 'Bearish' ? 'bg-rose-500' : 'bg-slate-400'}`}></div>

                    <div className="flex justify-between items-start z-10 mb-4">
                         <div className="flex items-center space-x-3 flex-1 overflow-hidden">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-[#18181B] flex items-center justify-center border border-slate-200 dark:border-white/5 p-1.5 shadow-sm">
                                <img
                                    src={logoUrl}
                                    alt={`${overview.company_name} logo`}
                                    className="w-full h-full object-contain rounded-lg"
                                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://ui-avatars.com/api/?name=${ticker}&background=1e293b&color=cbd5e1&bold=true`; }}
                                />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white truncate tracking-tight">{ticker}</h3>
                                <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 truncate uppercase tracking-wider">{overview.company_name}</p>
                            </div>
                        </div>
                        <button onClick={onRemove} className="p-2 text-slate-300 dark:text-zinc-600 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-full ml-2 flex-shrink-0 transition-colors">
                            <XIcon className="w-5 h-5" />
                        </button>
                    </div>
                    
                    {/* Trend Chart */}
                    <div className="h-16 w-full mb-4 relative">
                        <Sparkline 
                            data={chartData} 
                            isPositive={isChartPositive} 
                            dates={chartDates}
                            className={`w-full h-full stroke-[3px] ${isChartPositive ? 'text-emerald-500' : 'text-rose-500'} fill-none drop-shadow-sm`} 
                        />
                        <div className="absolute top-0 right-0 flex flex-col items-end">
                             <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">${overview.current_price.toFixed(2)}</span>
                             <span className={`text-xs font-bold ${isChartPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                {formatPercent(overview.ytd_change_percent)}
                             </span>
                        </div>
                    </div>
                    
                    <div className="mt-2 space-y-1 z-10 flex-grow">
                        <MetricRow label="Market Cap" value={overview.market_cap} icon={<MarketCapIcon className="w-4 h-4 text-slate-400 dark:text-zinc-500"/>} />
                        <MetricRow label="AI Signal" value={getSignalChip(overview.signal)} icon={<BotIcon className="w-4 h-4 text-slate-400 dark:text-zinc-500"/>} />
                        
                        <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-white/5 px-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg -mx-2 transition-colors">
                            <div className="flex items-center text-sm text-slate-500 dark:text-zinc-400 font-medium">
                                <TechnicalIcon className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
                                <span className="ml-2">Technical</span>
                            </div>
                            <MiniRadialScore score={individual_analysis.quad_factor_scores.technical_score} />
                        </div>
                         <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-white/5 px-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg -mx-2 transition-colors">
                            <div className="flex items-center text-sm text-slate-500 dark:text-zinc-400 font-medium">
                                <SentimentIcon className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
                                <span className="ml-2">Sentiment</span>
                            </div>
                            <MiniRadialScore score={individual_analysis.quad_factor_scores.sentiment_score} />
                        </div>
                         <div className="flex items-center justify-between py-3 px-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg -mx-2 transition-colors">
                            <div className="flex items-center text-sm text-slate-500 dark:text-zinc-400 font-medium">
                                <RiskIcon className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
                                <span className="ml-2">Risk Score</span>
                            </div>
                            <MiniRadialScore score={individual_analysis.quad_factor_scores.risk_alignment_score} />
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 z-10">
                        <button
                            onClick={() => onLoadAnalysis(analysis.data!)}
                            className="w-full text-center py-3 px-4 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold text-sm rounded-xl transition-colors border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center space-x-2 group active:scale-[0.98]"
                        >
                            <AnalyzeIcon className="w-4 h-4" />
                            <span>View Full Analysis</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (!ticker) return renderEmpty();
    if (!analysis || analysis.state === 'loading') return renderLoading();
    if (analysis.state === 'error') return renderError();
    if (analysis.state === 'loaded') return renderLoaded();

    return renderEmpty();
};

export default ComparisonCard;
