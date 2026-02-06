
import React from 'react';
import type { AnalysisResponse } from '../../types';
import PriceChartSection from '../PriceChartSection';
import AnalysisSummary from '../AnalysisSummary';
import ExpertTargetPrice from '../ExpertTargetPrice';
import Sparkline from '../charts/Sparkline';
import { TrendUpIcon, ShieldIcon, SparklesIcon, ChartIcon } from '../icons';

interface OverviewTabProps {
    analysis: AnalysisResponse;
}

const ChartPreviewCard: React.FC<{ title: string; icon: React.ReactNode; data: number[]; color: 'emerald' | 'indigo' | 'amber'; label: string }> = ({ title, icon, data, color, label }) => {
    // Matching Dashboard MarketGlance styling exactly
    const strokeColor = color === 'emerald' ? 'text-emerald-500' : color === 'indigo' ? 'text-indigo-500' : 'text-amber-500';
    const iconColor = color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' : color === 'indigo' ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-600 dark:text-amber-400';
    const iconBg = color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-500/10' : color === 'indigo' ? 'bg-indigo-50 dark:bg-indigo-500/10' : 'bg-amber-50 dark:bg-amber-500/10';

    return (
        <div className="bg-white dark:bg-[#1C1C1E] p-6 rounded-[24px] shadow-sm border border-slate-100 dark:border-white/5 hover:shadow-md transition-all duration-300 card-hover group cursor-default">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${iconBg} ${iconColor}`}>
                        {icon}
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{title}</h4>
                        <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-wider">{label}</p>
                    </div>
                </div>
            </div>
            <div className="h-16 relative">
                <Sparkline 
                    data={data} 
                    isPositive={true} 
                    className={`w-full h-full stroke-[3px] ${strokeColor} fill-none opacity-90 group-hover:opacity-100 transition-opacity`} 
                />
            </div>
        </div>
    );
};

const OverviewTab: React.FC<OverviewTabProps> = ({ analysis }) => {
    // Generate synthetic data subsets for previews
    const prices = analysis.historical_data?.map(d => d.close) || [];
    const trendData = prices.slice(-30);
    const volData = prices.slice(-14).map(p => Math.abs(p - (prices[prices.length-1] || 0)));
    const momData = prices.slice(-90).filter((_, i) => i % 3 === 0);

    return (
        <div className="flex flex-col gap-8 pb-12">
            
            {/* Chart Previews Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-slide-up">
                <ChartPreviewCard 
                    title="Short-Term Trend" 
                    label="30 Day View"
                    icon={<TrendUpIcon className="w-5 h-5" />} 
                    data={trendData.length > 0 ? trendData : [10,12,11,14,13,15,16]} 
                    color="emerald" 
                />
                <ChartPreviewCard 
                    title="Price Volatility" 
                    label="14 Day Fluctuation"
                    icon={<ShieldIcon className="w-5 h-5" />} 
                    data={volData.length > 0 ? volData : [2,5,1,3,6,2,4]} 
                    color="amber" 
                />
                <ChartPreviewCard 
                    title="Momentum" 
                    label="Quarterly Pace"
                    icon={<SparklesIcon className="w-5 h-5" />} 
                    data={momData.length > 0 ? momData : [100,105,110,108,115,120]} 
                    color="indigo" 
                />
            </div>

            {/* 1. Chart Section */}
            <div className="animate-slide-up bg-white dark:bg-[#121214] p-6 md:p-8 rounded-[24px] border border-slate-200 dark:border-white/5 shadow-sm" style={{ animationDelay: '100ms' }}>
                <div className="mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <ChartIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Price Action</h3>
                </div>
                <PriceChartSection 
                    historicalData={analysis.historical_data}
                    annotations={analysis.chart_annotations}
                    overview={analysis.overview}
                />
            </div>

            {/* 2. AI Thesis */}
            <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                <AnalysisSummary analysis={analysis} />
            </div>

            {/* 3. Price Targets */}
            <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
                <ExpertTargetPrice 
                    targets={analysis.expert_opinions?.price_targets} 
                    currentPrice={analysis.overview.current_price} 
                />
            </div>
        </div>
    );
};

export default OverviewTab;
