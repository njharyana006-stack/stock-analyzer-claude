
import React from 'react';
import type { DashboardData, MarketIndex, Sector } from '../types';
import { SentimentIcon, SparklesIcon, TrendingDownIcon, GrowthIcon } from './icons';
import Sparkline from './charts/Sparkline';
import SectorPerformance from './SectorPerformance';

interface DashboardMetricsProps {
    data: DashboardData | null;
    sp500Index?: MarketIndex;
    sectorData?: Sector[];
    isLoading: boolean;
}

const SP500Card: React.FC<{ performance: DashboardData['sp500_performance'], indexData?: MarketIndex }> = ({ performance, indexData }) => {
    const isPositive = performance.isPositive;
    
    return (
        <div className="relative overflow-hidden h-full min-h-[200px] md:min-h-[360px] rounded-xl md:rounded-3xl group transition-all duration-300 hover:shadow-xl bg-slate-900 text-white border border-slate-800 shadow-card">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>

            <div className="p-6 md:p-8 relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center space-x-2 mb-3">
                             <div className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </div>
                            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Market Live</h4>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">S&P 500</h2>
                        <p className="text-xs md:text-sm text-slate-400 font-medium mt-1">Index &bull; SPX</p>
                    </div>
                    <div className="p-2 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                        <img 
                            src="https://logo.clearbit.com/standardandpoors.com" 
                            className="w-8 h-8 object-contain opacity-80 grayscale hover:grayscale-0 transition-all"
                            alt="S&P"
                            onError={(e) => e.currentTarget.style.display = 'none'} 
                        />
                    </div>
                </div>

                <div className="flex-grow flex flex-col justify-end pb-2">
                    <div className="flex items-baseline space-x-4">
                        <p className="text-4xl md:text-6xl font-bold text-white tabular-nums tracking-tighter">
                            {indexData?.price || '---'}
                        </p>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                         <div className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-bold tabular-nums shadow-lg backdrop-blur-md border ${isPositive ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/20 border-rose-500/30 text-rose-400'}`}>
                            {isPositive ? <GrowthIcon className="w-4 h-4 mr-1" /> : <TrendingDownIcon className="w-4 h-4 mr-1" />}
                            <span>{indexData?.change || '--'}</span>
                        </div>
                        <div className={`text-lg font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {performance.value}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Chart Layer */}
            <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 w-full opacity-30 pointer-events-none mask-image-gradient-b">
                 {indexData && <Sparkline data={indexData.chart_data} isPositive={isPositive} className={`h-full w-full stroke-[3px] ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`} />}
            </div>
        </div>
    )
};


const GlobalSentimentCard: React.FC<{ sentiment: DashboardData['market_sentiment'] }> = ({ sentiment }) => {
    const regions = [
        { name: 'US', label: 'Americas', data: sentiment.us },
        { name: 'EU', label: 'EMEA', data: sentiment.europe },
        { name: 'AS', label: 'APAC', data: sentiment.asia }
    ];
    
    const getSentimentColor = (text: string) => {
        const t = text.toLowerCase();
        if (t.includes('bull') || t.includes('pos')) return 'bg-emerald-500';
        if (t.includes('bear') || t.includes('neg')) return 'bg-rose-500';
        return 'bg-amber-400';
    };

    return (
        <div className="g-card !p-0 flex flex-col h-full min-h-[300px] md:min-h-[360px] bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
             <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none">
                        <SentimentIcon className="w-6 h-6"/>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Global Sentiment</h4>
                        <p className="text-xs text-slate-500">AI-driven mood analysis</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-4 md:p-6 flex flex-col justify-center space-y-5">
                {regions.map((region) => (
                    <div key={region.name} className="relative">
                         <div className="flex justify-between items-end mb-2">
                            <div className="flex items-center space-x-3">
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{region.name}</span>
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{region.label}</span>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                             <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 border border-slate-100 dark:border-slate-700">
                                 <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Social</p>
                                 <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${getSentimentColor(region.data.social_media)}`}></div>
                                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{region.data.social_media}</span>
                                 </div>
                             </div>
                             <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 border border-slate-100 dark:border-slate-700">
                                 <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Expert</p>
                                 <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{region.data.expert_opinion}</span>
                                 </div>
                             </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ data, sp500Index, sectorData, isLoading }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
                <div className="h-[250px] md:h-[360px] bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
                <div className="h-[250px] md:h-[360px] bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
                <div className="h-[250px] md:h-[360px] bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
            </div>
        );
    }

    if (!data) return null;

    const { sp500_performance, market_sentiment } = data;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            <div className="h-full">
                <SP500Card performance={sp500_performance} indexData={sp500Index} />
            </div>
            <div className="h-full">
                <GlobalSentimentCard sentiment={market_sentiment} />
            </div>
            {/* Sector Performance - Integrated into Header Row */}
            <div className="lg:col-span-2 xl:col-span-1 h-full min-h-[300px] md:min-h-[360px] g-card !p-0 flex flex-col bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                 <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-none">
                            <SparklesIcon className="w-6 h-6"/>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Sector Heatmap</h4>
                            <p className="text-xs text-slate-500">Daily performance</p>
                        </div>
                    </div>
                </div>
                <div className="flex-grow p-1 overflow-y-auto custom-scrollbar bg-slate-50/30 dark:bg-slate-900">
                    <SectorPerformance sectors={sectorData} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
};

export default DashboardMetrics;
