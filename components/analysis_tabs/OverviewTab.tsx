
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
    const strokeColor = color === 'emerald' ? 'text-emerald-500' : color === 'indigo' ? 'text-indigo-500' : 'text-amber-500';
    const accentHex = color === 'emerald' ? '#10B981' : color === 'indigo' ? '#6366F1' : '#F59E0B';

    return (
        <div className="group relative p-5 rounded-[20px] border border-white/[0.06] bg-[#121214] overflow-hidden hover:border-white/[0.1] transition-all duration-300 cursor-default">
            {/* Subtle glow */}
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] pointer-events-none opacity-10" style={{ background: accentHex }} />

            <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/[0.06]" style={{ backgroundColor: `${accentHex}15` }}>
                    {React.cloneElement(icon as React.ReactElement, { className: 'w-4 h-4', style: { color: accentHex } })}
                </div>
                <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-sm text-white truncate">{title}</h4>
                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.15em]">{label}</p>
                </div>
            </div>
            <div className="h-14 relative z-10">
                <Sparkline
                    data={data}
                    isPositive={true}
                    className={`w-full h-full stroke-[2.5px] ${strokeColor} fill-none opacity-80 group-hover:opacity-100 transition-opacity`}
                />
            </div>
        </div>
    );
};

const OverviewTab: React.FC<OverviewTabProps> = ({ analysis }) => {
    const prices = analysis.historical_data?.map(d => d.close) || [];
    const trendData = prices.slice(-30);
    const volData = prices.slice(-14).map(p => Math.abs(p - (prices[prices.length-1] || 0)));
    const momData = prices.slice(-90).filter((_, i) => i % 3 === 0);

    return (
        <div className="flex flex-col gap-8 pb-12">

            {/* Chart Previews Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up">
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

            {/* Chart Section */}
            <div className="animate-slide-up rounded-[24px] border border-white/[0.06] bg-[#121214] p-6 md:p-8 overflow-hidden" style={{ animationDelay: '100ms' }}>
                <div className="mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <ChartIcon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-white tracking-tight">Price Action</h3>
                        <p className="text-[11px] text-zinc-500 font-medium">Historical chart with annotations</p>
                    </div>
                </div>
                <PriceChartSection
                    historicalData={analysis.historical_data}
                    annotations={analysis.chart_annotations}
                    overview={analysis.overview}
                />
            </div>

            {/* AI Thesis */}
            <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                <AnalysisSummary analysis={analysis} />
            </div>

            {/* Price Targets */}
            {analysis.expert_opinions?.price_targets && (
                <div className="animate-slide-up rounded-[24px] border border-white/[0.06] bg-gradient-to-b from-[#141418] to-[#0c0c0e] overflow-hidden" style={{ animationDelay: '300ms' }}>
                    <ExpertTargetPrice
                        targets={analysis.expert_opinions.price_targets}
                        currentPrice={analysis.overview.current_price}
                    />
                </div>
            )}
        </div>
    );
};

export default OverviewTab;
