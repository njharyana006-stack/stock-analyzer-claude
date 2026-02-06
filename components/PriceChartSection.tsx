
import React, { useState, useMemo } from 'react';
import type { AnalysisResponse, StockOverview } from '../types';
import { PriceChart } from './charts/PriceChart';
import VolumeChart from './charts/VolumeChart';
import RSIChart from './charts/RSIChart';
import MACDChart from './charts/MACDChart';
import { calculateRSI, calculateMACD } from '../utils';
import { ChartIcon } from './icons';

type TimeRange = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL';
type ChartType = 'Line' | 'Candles' | 'Area';
type IndicatorType = 'None' | 'RSI' | 'MACD';

interface PriceChartSectionProps {
    historicalData: AnalysisResponse['historical_data'];
    annotations?: AnalysisResponse['chart_annotations'];
    overview: StockOverview;
}

// Synthetic data generator for demo purposes if API data is sparse
const generateSyntheticData = (currentPrice: number, oneYearReturnPercent: number, points: number = 365) => {
    const data = [];
    const now = new Date();
    const volatility = 0.02; 
    const safeReturn = oneYearReturnPercent || 0;
    const safePrice = currentPrice || 100;
    const startPrice = safePrice / (1 + (safeReturn / 100));
    
    for (let i = 0; i < points; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - (points - 1 - i));
        const progress = i / (points - 1);
        const trendPrice = startPrice + (safePrice - startPrice) * progress;
        const noise = (Math.random() - 0.5) * volatility * trendPrice;
        let closePrice = trendPrice + noise;
        if (i === points - 1) closePrice = safePrice;

        data.push({
            date: date.toISOString().split('T')[0],
            open: closePrice * (1 - Math.random() * 0.01),
            high: closePrice * 1.02,
            low: closePrice * 0.98,
            close: closePrice,
            volume: Math.floor(1000000 + Math.random() * 5000000)
        });
    }
    return data;
};

const PriceChartSection: React.FC<PriceChartSectionProps> = ({ historicalData, annotations, overview }) => {
    const [timeRange, setTimeRange] = useState<TimeRange>('1Y');
    const [chartType, setChartType] = useState<ChartType>('Area');
    const [activeIndicator, setActiveIndicator] = useState<IndicatorType>('None');

    const fullData = useMemo(() => {
        if (Array.isArray(historicalData) && historicalData.length > 20) return historicalData;
        return generateSyntheticData(overview.current_price, overview.one_year_return, 365);
    }, [historicalData, overview]);

    const filteredData = useMemo(() => {
        const sorted = [...fullData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const now = new Date();
        const startDate = new Date();
        
        switch(timeRange) {
            case '1D': startDate.setDate(now.getDate() - 1); break;
            case '1W': startDate.setDate(now.getDate() - 7); break;
            case '1M': startDate.setDate(now.getDate() - 30); break;
            case '3M': startDate.setDate(now.getDate() - 90); break;
            case '6M': startDate.setDate(now.getDate() - 180); break;
            case '1Y': startDate.setFullYear(now.getFullYear() - 1); break;
            case 'ALL': startDate.setFullYear(now.getFullYear() - 5); break;
        }
        
        if ((timeRange === '1D' || timeRange === '1W') && sorted.length > 0 && new Date(sorted[sorted.length-1].date).getTime() < startDate.getTime()) {
             return sorted.slice(-10);
        }

        return sorted.filter(d => new Date(d.date) >= startDate);
    }, [fullData, timeRange]);

    const indicatorData = useMemo(() => {
        if (activeIndicator === 'None') return null;
        
        const closes = filteredData.map(d => d.close);
        
        if (activeIndicator === 'RSI') {
            const rsiValues = calculateRSI(closes);
            return rsiValues.map((val, i) => ({ date: filteredData[i].date, value: val }));
        }
        
        if (activeIndicator === 'MACD') {
            const macdValues = calculateMACD(closes);
            return macdValues.map((val, i) => ({ ...val, date: filteredData[i].date }));
        }
        
        return null;
    }, [filteredData, activeIndicator]);

    return (
        <div className="space-y-6">
            {/* Floating Controls Header */}
            <div className="flex flex-col xl:flex-row items-center justify-between gap-4 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex gap-2 w-full xl:w-auto overflow-x-auto scrollbar-none">
                    {/* Chart Type Toggle */}
                    <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex-shrink-0">
                        {(['Line', 'Candles', 'Area'] as ChartType[]).map(type => (
                            <button
                                key={type}
                                onClick={() => setChartType(type)}
                                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 whitespace-nowrap ${
                                    chartType === type 
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' 
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    {/* Indicator Toggle */}
                    <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex-shrink-0">
                        {(['None', 'RSI', 'MACD'] as IndicatorType[]).map(type => (
                            <button
                                key={type}
                                onClick={() => setActiveIndicator(type)}
                                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 whitespace-nowrap ${
                                    activeIndicator === type 
                                    ? 'bg-indigo-500 text-white shadow-md' 
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Time Range Selector */}
                <div className="overflow-x-auto scrollbar-none w-full xl:w-auto">
                    <div className="flex space-x-1 bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        {(['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'] as TimeRange[]).map(range => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                                    timeRange === range
                                    ? 'bg-indigo-500 text-white shadow-md'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                                }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Price Chart Card */}
            <div className="g-card p-1 shadow-sm">
                <PriceChart 
                    data={filteredData.map(d => ({ date: d.date, close: d.close }))} 
                    annotations={annotations}
                    isLoading={false} 
                    error={null}
                    type={chartType}
                />
                <div className="mt-1 border-t border-slate-100 dark:border-white/5 pt-1">
                    <VolumeChart data={filteredData} height={80} />
                </div>
            </div>

            {/* Indicator Charts */}
            {activeIndicator === 'RSI' && indicatorData && (
                <div className="animate-slide-up">
                    <h4 className="text-sm font-bold text-slate-500 dark:text-zinc-400 mb-2 px-2">Relative Strength Index</h4>
                    <RSIChart data={indicatorData as {date: string, value: number}[]} />
                </div>
            )}

            {activeIndicator === 'MACD' && indicatorData && (
                <div className="animate-slide-up">
                    <h4 className="text-sm font-bold text-slate-500 dark:text-zinc-400 mb-2 px-2">MACD (12, 26, 9)</h4>
                    <MACDChart data={indicatorData as any[]} />
                </div>
            )}

            {/* Key Levels (Support/Resistance) */}
            {annotations && annotations.some(a => a.type === 'SUPPORT' || a.type === 'RESISTANCE') && (
                <div className="bg-white dark:bg-[#1A2332] p-4 rounded-xl border border-slate-200 dark:border-[#2C3646] shadow-sm">
                    <h4 className="text-slate-800 dark:text-white font-bold mb-3 text-sm uppercase tracking-wider opacity-80">Key Levels</h4>
                    <div className="flex flex-wrap gap-3">
                        {annotations.filter(a => a.type === 'RESISTANCE').map((a, i) => (
                            <div key={`res-${i}`} className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                <span className="text-red-700 dark:text-red-400 text-xs font-bold">Res: ${a.price?.toFixed(2)}</span>
                            </div>
                        ))}
                        {annotations.filter(a => a.type === 'SUPPORT').map((a, i) => (
                            <div key={`sup-${i}`} className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                <span className="text-emerald-700 dark:text-emerald-400 text-xs font-bold">Sup: ${a.price?.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PriceChartSection;
