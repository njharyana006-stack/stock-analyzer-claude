
import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { AnalysisResponse, RiskProfile, ComparisonInsight } from '../../types';
import { getStockAnalysis, getComparisonAnalysis } from '../../services/geminiService';
import { extractJson, isValidAnalysisResponse } from '../../utils';
import ComparisonCard from './ComparisonCard';
import { CompareIcon, ReloadIcon, SparklesIcon } from '../icons';
import ComparisonInsights from './ComparisonInsights';

interface ComparisonPageProps {
    onBack: () => void;
    onLoadAnalysis: (analysis: AnalysisResponse) => void;
    tickers: (string | null)[];
    onTickersChange: (tickers: (string | null)[]) => void;
    onReset: () => void;
}

type AnalysisDataState = {
    state: 'loading' | 'loaded' | 'error';
    data: AnalysisResponse | null;
    error?: string;
}

const ComparisonPage: React.FC<ComparisonPageProps> = ({ onBack, onLoadAnalysis, tickers, onTickersChange, onReset }) => {
    const [analysisData, setAnalysisData] = useState<Record<string, AnalysisDataState>>({});
    const [comparisonInsight, setComparisonInsight] = useState<ComparisonInsight | null>(null);
    const [isInsightLoading, setIsInsightLoading] = useState(false);
    
    // Ref to track which tickers have been fetched in the current lifecycle to avoid duplicate calls
    const fetchedTickers = useRef<Set<string>>(new Set());

    const fetchStockData = useCallback(async (ticker: string) => {
        setAnalysisData(prev => ({
            ...prev,
            [ticker]: { state: 'loading', data: null }
        }));

        try {
            const riskProfile: RiskProfile = 'Moderate'; // Default to moderate for comparisons
            const resultText = await getStockAnalysis(ticker, riskProfile);
            const jsonString = extractJson(resultText);
            const result = JSON.parse(jsonString);

            if (!isValidAnalysisResponse(result)) {
                throw new Error(`The AI returned an invalid data structure for ${ticker}.`);
            }

            setAnalysisData(prev => ({
                ...prev,
                [ticker]: { state: 'loaded', data: result }
            }));
        } catch (e) {
            console.error(`Failed to fetch data for ${ticker}`, e);
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            setAnalysisData(prev => ({
                ...prev,
                [ticker]: { state: 'error', data: null, error: errorMessage }
            }));
        }
    }, []);
    
    // Auto-fetch newly selected tickers
    useEffect(() => {
        tickers.forEach(ticker => {
            if (ticker && !analysisData[ticker] && !fetchedTickers.current.has(ticker)) {
                fetchedTickers.current.add(ticker);
                fetchStockData(ticker);
            }
        });
    }, [tickers, fetchStockData, analysisData]);
    
    // Cleanup ref when tickers are removed
    useEffect(() => {
        const currentTickers = new Set(tickers.filter((t): t is string => t !== null));
        fetchedTickers.current.forEach(t => {
            if (!currentTickers.has(t)) {
                fetchedTickers.current.delete(t);
            }
        });
    }, [tickers]);
    
    useEffect(() => {
        const loadedAnalyses = tickers
            .filter((t): t is string => t !== null)
            .map(t => analysisData[t])
            .filter((a): a is AnalysisDataState => a?.state === 'loaded' && a.data !== null)
            .map(a => a.data as AnalysisResponse);

        if (loadedAnalyses.length >= 2) {
            setIsInsightLoading(true);
            setComparisonInsight(null);
            getComparisonAnalysis(loadedAnalyses)
                .then(resultText => {
                    const insights: ComparisonInsight = JSON.parse(extractJson(resultText));
                    setComparisonInsight(insights);
                })
                .catch(e => {
                    console.error("Failed to fetch comparison insights", e);
                })
                .finally(() => {
                    setIsInsightLoading(false);
                });
        } else {
            setComparisonInsight(null);
        }
    }, [analysisData, tickers]);

    const handleSelectStock = (index: number, ticker: string) => {
        const newTickers = [...tickers];
        newTickers[index] = ticker;
        onTickersChange(newTickers);
        // fetchStockData is handled by useEffect
    };

    const handleRemoveStock = (index: number) => {
        const newTickers = [...tickers];
        newTickers[index] = null;
        onTickersChange(newTickers);
    };

    const handleRetry = (ticker: string) => {
        fetchStockData(ticker);
    };
    
    const hasTickers = tickers.some(t => t !== null);

    return (
        <div className="animate-fade-in space-y-8 pb-24 pt-8">
             <div className="text-center p-8 bg-white dark:bg-[#121214] rounded-[32px] shadow-sm border border-slate-200 dark:border-white/5">
                <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-glow">
                        <CompareIcon className="w-8 h-8 text-white" />
                    </div>
                </div>
                <h2 className="mt-6 text-3xl font-black text-slate-900 dark:text-white tracking-tight">Compare & Contrast</h2>
                <p className="mt-2 text-base text-slate-600 dark:text-zinc-400 max-w-xl mx-auto font-medium">
                    Select up to four stocks to see a side-by-side comparison of key metrics, performance, and AI-driven scores.
                </p>
                 {hasTickers && (
                     <button
                        onClick={onReset}
                        className="mt-6 flex items-center justify-center mx-auto space-x-2 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-all hover:scale-105"
                    >
                        <ReloadIcon className="w-4 h-4" />
                        <span>Reset Comparison</span>
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {tickers.map((ticker, index) => (
                    <ComparisonCard 
                        key={index}
                        ticker={ticker}
                        analysis={ticker ? analysisData[ticker] : undefined}
                        onSelect={(newTicker) => handleSelectStock(index, newTicker)}
                        onRemove={() => handleRemoveStock(index)}
                        onRetry={ticker ? () => handleRetry(ticker) : undefined}
                        disabledTickers={tickers.filter(t => t !== null) as string[]}
                        onLoadAnalysis={onLoadAnalysis}
                    />
                ))}
            </div>
            
            {(isInsightLoading || comparisonInsight) && (
                <div className="mt-8 pt-8 border-t border-slate-200 dark:border-white/5">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center justify-center md:justify-start">
                        <SparklesIcon className="w-7 h-7 mr-3 text-indigo-500" />
                        AI Comparison Insights
                    </h3>
                    {isInsightLoading ? (
                         <div className="bg-white dark:bg-[#121214] p-8 rounded-[32px] shadow-sm border border-slate-200 dark:border-white/5 animate-pulse">
                            <div className="h-4 bg-slate-200 dark:bg-white/5 rounded w-1/4 mb-6"></div>
                            <div className="space-y-3">
                                <div className="h-3 bg-slate-200 dark:bg-white/5 rounded w-full"></div>
                                <div className="h-3 bg-slate-200 dark:bg-white/5 rounded w-5/6"></div>
                                <div className="h-3 bg-slate-200 dark:bg-white/5 rounded w-4/6"></div>
                            </div>
                         </div>
                    ) : comparisonInsight ? (
                        <ComparisonInsights insights={comparisonInsight} />
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default ComparisonPage;
