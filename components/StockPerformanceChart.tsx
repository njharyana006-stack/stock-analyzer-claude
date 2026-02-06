


import React, { useState, useCallback } from 'react';
import type { StockOverview, StockPerformance } from '../types';
import { getStockPerformanceData } from '../services/geminiService';
import { extractJson } from '../utils';
import { allStocks } from '../constants/stocks';
import { ReloadIcon } from './icons';

interface StockPerformanceChartProps {
    overview: StockOverview;
}

const PerformanceBar: React.FC<{ label: string; value: number; compareValue?: number; ticker: string; compareTicker?: string; }> = ({ label, value, compareValue, ticker, compareTicker }) => {
    const displayValue = value ?? 0;
    const maxAbsValue = Math.max(Math.abs(displayValue), Math.abs(compareValue ?? 0), 5); // Base scale on max value, with a minimum floor
    
    const valueWidth = (Math.abs(displayValue) / maxAbsValue) * 50;
    const compareValueWidth = compareValue !== undefined ? (Math.abs(compareValue) / maxAbsValue) * 50 : 0;

    return (
        <div className="grid grid-cols-[40px_1fr_40px] items-center gap-x-3 py-1.5">
            <span className="text-sm font-medium text-slate-500 text-right">{label}</span>
            <div className="h-7 flex items-center relative">
                 {/* Center line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-px bg-slate-200"></div>

                {/* Compare Bar (underneath) */}
                {compareValue !== undefined && (
                    <div 
                        className="h-2.5 rounded absolute" 
                        style={{ 
                            width: `${compareValueWidth}%`,
                            left: compareValue >= 0 ? '50%' : `calc(50% - ${compareValueWidth}%)`,
                            backgroundColor: compareValue >= 0 ? '#38bdf8' : '#f97316' // sky-400 or orange-500
                        }}
                    />
                )}
                
                {/* Value Bar (on top) */}
                <div 
                    className="h-4 rounded absolute flex items-center" 
                    style={{ 
                        width: `${valueWidth}%`,
                        left: displayValue >= 0 ? '50%' : `calc(50% - ${valueWidth}%)`,
                        backgroundColor: displayValue >= 0 ? '#4f46e5' : '#ef4444' // indigo-600 or red-500
                    }}
                >
                    <span className="px-2 text-white font-bold text-[10px]">{displayValue.toFixed(1)}%</span>
                </div>
            </div>
            <span></span>
        </div>
    );
};


const StockPerformanceChart: React.FC<StockPerformanceChartProps> = ({ overview }) => {
    const [compareTicker, setCompareTicker] = useState<string | null>(null);
    const [compareData, setCompareData] = useState<StockPerformance | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCompare = useCallback(async (ticker: string | null) => {
        setCompareTicker(ticker);
        if (!ticker) {
            setCompareData(null);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const resultText = await getStockPerformanceData(ticker);
            const data: StockPerformance = JSON.parse(extractJson(resultText));
            setCompareData(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load comparison data.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const performanceData = [
        { label: '1D', value: overview.one_day_return, compareValue: compareData?.one_day_return },
        { label: '1W', value: overview.one_week_return, compareValue: compareData?.one_week_return },
        { label: '1M', value: overview.one_month_return, compareValue: compareData?.one_month_return },
        { label: '3M', value: overview.three_month_return, compareValue: compareData?.three_month_return },
        { label: '1Y', value: overview.one_year_return, compareValue: compareData?.one_year_return },
    ];
    
    return (
        <div>
            <div className="flex items-center justify-end gap-4 mb-4">
                <div className="flex items-center gap-x-3 gap-y-1 text-xs flex-wrap">
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-indigo-500"></span> {overview.ticker} (Positive)</div>
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-500"></span> {overview.ticker} (Negative)</div>
                    {compareTicker && <><div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-sky-400"></span> {compareTicker} (Positive)</div>
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-orange-400"></span> {compareTicker} (Negative)</div></>}
                </div>
                <select 
                    value={compareTicker || ''} 
                    onChange={e => handleCompare(e.target.value || null)}
                    className="text-sm p-1.5 rounded-md border-slate-300 bg-slate-50"
                >
                    <option value="">Compare with...</option>
                    {allStocks.filter(s => s.symbol !== overview.ticker).map(stock => (
                        <option key={stock.symbol} value={stock.symbol}>{stock.symbol}</option>
                    ))}
                </select>
            </div>
            
            {isLoading && <div className="text-center p-4"><ReloadIcon className="w-6 h-6 animate-spin mx-auto text-indigo-500" /></div>}
            {error && <div className="text-center p-4 text-red-500 text-sm">{error}</div>}
            
            <div className="space-y-1">
                {performanceData.map(data => (
                    <PerformanceBar 
                        key={data.label} 
                        {...data}
                        ticker={overview.ticker}
                        compareTicker={compareTicker || undefined}
                    />
                ))}
            </div>
        </div>
    );
};

export default StockPerformanceChart;