
import React from 'react';
import type { AnalysisResponse } from '../../types';
import CircularProgressMetric from '../charts/CircularProgressMetric';
import MetricCard from '../charts/MetricCard';
import HorizontalBarMetric from '../charts/HorizontalBarMetric';
import AreaChartGradient from '../charts/AreaChartGradient';
import AnimatedNumber from '../AnimatedNumber';
import { TrendUpIcon, TrendingDownIcon } from '../icons';

interface InfographicOverviewTabProps {
    analysis: AnalysisResponse;
}

const InfographicOverviewTab: React.FC<InfographicOverviewTabProps> = ({ analysis }) => {
    const { overview, individual_analysis, historical_data, stock_90_day_performance, spy_90_day_performance } = analysis;

    // Prepare data for area chart
    const stockChartData = historical_data?.slice(-90).map(d => ({
        date: d.date,
        value: d.close,
    })) || [];

    // Ensure spy data has same length as stock data
    const spyChartData = stockChartData.length > 0 && spy_90_day_performance && spy_90_day_performance.length > 0
        ? spy_90_day_performance.slice(0, stockChartData.length).map((value, index) => ({
            date: stockChartData[index]?.date || `Day ${index + 1}`,
            value: value,
        }))
        : stockChartData.map((d, index) => ({ date: d.date, value: d.value * 0.98 })); // Fallback: use stock data with slight offset

    // Normalize confidence score to 0-100
    const confidencePercent = overview.confidence_score * 10;

    // Signal indicator
    const isPositive = overview.signal === 'Bullish';
    const signalColor = isPositive ? 'emerald' : overview.signal === 'Bearish' ? 'rose' : 'slate';

    // Prepare sparkline data for metric cards
    const pricesLast30 = historical_data?.slice(-30).map(d => d.close) || [];

    // Normalize financial metrics to 0-100 scale for horizontal bars
    const normalizeMetric = (value: number, min: number, max: number) => {
        return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
    };

    // Parse P/E ratio safely
    const peRatioStr = individual_analysis?.financial_highlights?.pe_ratio || '0';
    const peRatio = parseFloat(peRatioStr.replace(/[^0-9.-]/g, '')) || 0;
    const peNormalized = normalizeMetric(Math.abs(peRatio), 0, 50); // Assume 0-50 range

    // Parse market cap (convert to number in billions) safely
    const marketCapStr = individual_analysis?.financial_highlights?.market_cap || '0';
    const marketCapNum = parseFloat(marketCapStr.replace(/[^0-9.]/g, '')) || 0;
    const marketCapNormalized = normalizeMetric(marketCapNum, 0, 3000); // Assume 0-3T range

    // Parse volume safely
    const volumeStr = individual_analysis?.financial_highlights?.avg_volume || '0';
    const volumeNum = parseFloat(volumeStr.replace(/[^0-9.]/g, '')) || 0;
    const volumeNormalized = normalizeMetric(volumeNum, 0, 200); // Assume 0-200M range

    // Parse dividend yield safely
    const dividendYieldStr = individual_analysis?.financial_highlights?.dividend_yield || '0';
    const dividendYield = parseFloat(dividendYieldStr.replace(/[^0-9.-]/g, '')) || 0;
    const dividendNormalized = Math.min(100, Math.abs(dividendYield) * 20); // Scale 0-5% to 0-100%

    return (
        <div className="flex flex-col gap-6 md:gap-8 pb-12">

            {/* Hero Section - Confidence, Price, Signal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 animate-slide-up">
                {/* Confidence Score - Large Circular */}
                <div className="flex items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-500/10 dark:to-indigo-500/10 rounded-[24px] border border-purple-100 dark:border-purple-500/20 shadow-sm">
                    <CircularProgressMetric
                        value={confidencePercent}
                        label="AI Confidence"
                        subtitle={overview.confidence_reasoning}
                        color="purple"
                        size="lg"
                        animate={true}
                    />
                </div>

                {/* Current Price */}
                <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-[#1C1C1E] rounded-[24px] border border-slate-100 dark:border-white/5 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-3">
                        Current Price
                    </p>
                    <div className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight mb-2">
                        $<AnimatedNumber value={overview.current_price} decimals={2} />
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${isPositive ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-rose-50 dark:bg-rose-500/10'}`}>
                        {isPositive ? (
                            <TrendUpIcon className={`w-4 h-4 ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`} />
                        ) : (
                            <TrendingDownIcon className={`w-4 h-4 ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`} />
                        )}
                        <span className={`text-sm font-black ${isPositive ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                            {overview.one_day_return >= 0 ? '+' : ''}{overview.one_day_return.toFixed(2)}%
                        </span>
                    </div>
                </div>

                {/* Signal */}
                <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-[#1C1C1E] rounded-[24px] border border-slate-100 dark:border-white/5 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-3">
                        AI Signal
                    </p>
                    <div className={`text-4xl md:text-5xl font-black mb-3 ${signalColor === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' : signalColor === 'rose' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400'}`}>
                        {overview.signal}
                    </div>
                    <div className="w-full">
                        <HorizontalBarMetric
                            label="Strength"
                            value={confidencePercent}
                            color={signalColor === 'emerald' ? 'emerald' : signalColor === 'rose' ? 'purple' : 'indigo'}
                            size="sm"
                            animate={true}
                        />
                    </div>
                </div>
            </div>

            {/* Large Area Chart - Stock vs S&P 500 */}
            <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
                <AreaChartGradient
                    stockData={stockChartData}
                    comparisonData={spyChartData}
                    stockLabel={overview.ticker}
                    comparisonLabel="S&P 500"
                    height={400}
                    showTimeRange={true}
                />
            </div>

            {/* Performance Metric Cards - 4 columns */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
                <MetricCard
                    title="1 Day"
                    value={`${overview.one_day_return >= 0 ? '+' : ''}${overview.one_day_return.toFixed(1)}%`}
                    isPositive={overview.one_day_return >= 0}
                    sparklineData={pricesLast30.slice(-7)}
                    subtitle="Daily Return"
                />
                <MetricCard
                    title="1 Week"
                    value={`${overview.one_week_return >= 0 ? '+' : ''}${overview.one_week_return.toFixed(1)}%`}
                    isPositive={overview.one_week_return >= 0}
                    sparklineData={pricesLast30.slice(-14)}
                    subtitle="Weekly Return"
                />
                <MetricCard
                    title="1 Month"
                    value={`${overview.one_month_return >= 0 ? '+' : ''}${overview.one_month_return.toFixed(1)}%`}
                    isPositive={overview.one_month_return >= 0}
                    sparklineData={pricesLast30}
                    subtitle="Monthly Return"
                />
                <MetricCard
                    title="YTD"
                    value={`${overview.ytd_change_percent >= 0 ? '+' : ''}${overview.ytd_change_percent.toFixed(1)}%`}
                    isPositive={overview.ytd_change_percent >= 0}
                    sparklineData={pricesLast30}
                    subtitle="Year to Date"
                />
            </div>

            {/* Circular Progress Indicators - Technical, Sentiment, Risk */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 animate-slide-up" style={{ animationDelay: '300ms' }}>
                <div className="flex items-center justify-center p-6 bg-white dark:bg-[#1C1C1E] rounded-[24px] border border-slate-100 dark:border-white/5 shadow-sm">
                    <CircularProgressMetric
                        value={individual_analysis.quad_factor_scores.technical_score * 10}
                        label="Technical Score"
                        subtitle={individual_analysis.quad_factor_score_rationale?.technical_summary?.slice(0, 80) + '...' || ''}
                        color="purple"
                        size="md"
                        animate={true}
                    />
                </div>
                <div className="flex items-center justify-center p-6 bg-white dark:bg-[#1C1C1E] rounded-[24px] border border-slate-100 dark:border-white/5 shadow-sm">
                    <CircularProgressMetric
                        value={individual_analysis.quad_factor_scores.sentiment_score * 10}
                        label="Sentiment Score"
                        subtitle={individual_analysis.quad_factor_score_rationale?.sentiment_summary?.slice(0, 80) + '...' || ''}
                        color="teal"
                        size="md"
                        animate={true}
                    />
                </div>
                <div className="flex items-center justify-center p-6 bg-white dark:bg-[#1C1C1E] rounded-[24px] border border-slate-100 dark:border-white/5 shadow-sm">
                    <CircularProgressMetric
                        value={individual_analysis.quad_factor_scores.risk_alignment_score * 10}
                        label="Risk Alignment"
                        subtitle={individual_analysis.quad_factor_score_rationale?.risk_alignment_summary?.slice(0, 80) + '...' || ''}
                        color="indigo"
                        size="md"
                        animate={true}
                    />
                </div>
            </div>

            {/* Technical Indicators Section */}
            <div className="bg-white dark:bg-[#1C1C1E] p-6 md:p-8 rounded-[24px] border border-slate-100 dark:border-white/5 shadow-sm animate-slide-up" style={{ animationDelay: '400ms' }}>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Technical Indicators</h3>
                <div className="space-y-4">
                    <HorizontalBarMetric
                        label="RSI (14)"
                        value={individual_analysis.key_levels.RSI_Value}
                        displayValue={individual_analysis.key_levels.RSI_Value.toFixed(1)}
                        color="purple"
                        size="md"
                        tooltip={`RSI: ${individual_analysis.key_levels.RSI_Value.toFixed(1)} - ${individual_analysis.key_levels.RSI_Value > 70 ? 'Overbought' : individual_analysis.key_levels.RSI_Value < 30 ? 'Oversold' : 'Neutral'}`}
                        animate={true}
                    />
                    {individual_analysis.key_levels.macd && (
                        <HorizontalBarMetric
                            label="MACD Signal"
                            value={normalizeMetric(individual_analysis.key_levels.macd.histogram, -5, 5)}
                            displayValue={individual_analysis.key_levels.macd.histogram.toFixed(2)}
                            color="teal"
                            size="md"
                            tooltip={`MACD Histogram: ${individual_analysis.key_levels.macd.histogram.toFixed(2)}`}
                            animate={true}
                        />
                    )}
                    <HorizontalBarMetric
                        label="50-Day SMA"
                        value={normalizeMetric(overview.current_price - individual_analysis.key_levels["50_Day_SMA"], -20, 20)}
                        displayValue={`$${individual_analysis.key_levels["50_Day_SMA"].toFixed(2)}`}
                        color="indigo"
                        size="md"
                        tooltip={`50-Day SMA: $${individual_analysis.key_levels["50_Day_SMA"].toFixed(2)}`}
                        animate={true}
                    />
                    <HorizontalBarMetric
                        label="200-Day SMA"
                        value={normalizeMetric(overview.current_price - individual_analysis.key_levels["200_Day_SMA"], -50, 50)}
                        displayValue={`$${individual_analysis.key_levels["200_Day_SMA"].toFixed(2)}`}
                        color="blue"
                        size="md"
                        tooltip={`200-Day SMA: $${individual_analysis.key_levels["200_Day_SMA"].toFixed(2)}`}
                        animate={true}
                    />
                </div>
            </div>

            {/* Financial Health Section */}
            <div className="bg-white dark:bg-[#1C1C1E] p-6 md:p-8 rounded-[24px] border border-slate-100 dark:border-white/5 shadow-sm animate-slide-up" style={{ animationDelay: '500ms' }}>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Financial Health</h3>
                <div className="space-y-4">
                    <HorizontalBarMetric
                        label="P/E Ratio"
                        value={peNormalized}
                        displayValue={individual_analysis.financial_highlights.pe_ratio}
                        color="emerald"
                        size="md"
                        tooltip={`P/E Ratio: ${individual_analysis.financial_highlights.pe_ratio}`}
                        animate={true}
                    />
                    <HorizontalBarMetric
                        label="Market Cap"
                        value={marketCapNormalized}
                        displayValue={individual_analysis.financial_highlights.market_cap}
                        color="indigo"
                        size="md"
                        tooltip={`Market Cap: ${individual_analysis.financial_highlights.market_cap}`}
                        animate={true}
                    />
                    <HorizontalBarMetric
                        label="Avg Volume"
                        value={volumeNormalized}
                        displayValue={individual_analysis.financial_highlights.avg_volume}
                        color="purple"
                        size="md"
                        tooltip={`Average Volume: ${individual_analysis.financial_highlights.avg_volume}`}
                        animate={true}
                    />
                    <HorizontalBarMetric
                        label="Dividend Yield"
                        value={dividendNormalized}
                        displayValue={individual_analysis.financial_highlights.dividend_yield}
                        color="teal"
                        size="md"
                        tooltip={`Dividend Yield: ${individual_analysis.financial_highlights.dividend_yield}`}
                        animate={true}
                    />
                </div>
            </div>

            {/* AI Investment Thesis */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 p-6 md:p-8 rounded-[24px] border border-indigo-100 dark:border-indigo-500/20 shadow-sm animate-slide-up" style={{ animationDelay: '600ms' }}>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">AI Investment Thesis</h3>
                <p className="text-sm md:text-base leading-relaxed text-slate-700 dark:text-zinc-300">
                    {individual_analysis.investment_rationale.investment_thesis}
                </p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3">
                            Potential Catalysts
                        </h4>
                        <ul className="space-y-2">
                            {individual_analysis.investment_rationale.potential_catalysts.map((catalyst, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-slate-700 dark:text-zinc-300">
                                    <span className="text-emerald-500 mt-1">•</span>
                                    <span>{catalyst}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-3">
                            Key Risks
                        </h4>
                        <ul className="space-y-2">
                            {individual_analysis.investment_rationale.key_risks.map((risk, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-slate-700 dark:text-zinc-300">
                                    <span className="text-rose-500 mt-1">•</span>
                                    <span>{risk}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default React.memo(InfographicOverviewTab);
