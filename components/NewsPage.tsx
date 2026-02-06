
import React, { useState, useCallback } from 'react';
import type { NewsArticle, RiskProfile, AnalysisResponse } from '../types';
import { getStockAnalysis } from '../services/geminiService';
import { extractJson, isValidAnalysisResponse } from '../utils';
import StockSelector from './StockSelector';
import NewsFeed from './NewsFeed';
import { NewspaperIcon, SparklesIcon, UserIcon, BotIcon, RssIcon, ArrowLongRightIcon, SentimentIcon, GlobeAmericasIcon } from './icons';
import AINewsSentimentTab from './analysis_tabs/AINewsSentimentTab';
import RatingsChart from './charts/RatingsChart';
import SentimentTag from './SentimentTag';
import MarketSentimentTab from './analysis_tabs/MarketSentimentTab';
import ExpertOpinionsTab from './analysis_tabs/ExpertOpinionsTab';
import { getStockLogo } from '../constants/stocks';

interface NewsPageProps {
    addToast: (message: string, type: 'info' | 'success' | 'error') => void;
}

const TrendingIntelCard: React.FC<{ ticker: string; name: string; tag: string; onSelect: () => void }> = ({ ticker, name, tag, onSelect }) => (
    <button 
        onClick={onSelect}
        className="flex items-center justify-between p-4 w-full bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 hover:border-emerald-300 dark:hover:border-cyan-500/30 rounded-[20px] transition-all duration-300 group text-left shadow-sm hover:shadow-md"
    >
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#121214] flex items-center justify-center border border-slate-200 dark:border-white/5 group-hover:scale-110 transition-transform shadow-sm overflow-hidden p-1 bg-white">
                <img 
                    src={getStockLogo(ticker)} 
                    alt={ticker} 
                    className="w-full h-full object-contain"
                    onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${ticker}&background=random&color=fff&bold=true`; }}
                />
            </div>
            <div>
                <p className="font-bold text-slate-900 dark:text-white leading-none">{ticker}</p>
                <p className="text-[10px] text-slate-500 dark:text-zinc-500 mt-1 font-semibold">{name}</p>
            </div>
        </div>
        <div className="text-right">
            <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-cyan-500/10 dark:text-cyan-400 border border-emerald-100 dark:border-cyan-500/20 uppercase tracking-tight">
                {tag}
            </span>
        </div>
    </button>
);

const IntelDiscovery: React.FC<{ onAnalyze: (ticker: string) => void }> = ({ onAnalyze }) => {
    return (
        <div className="animate-fade-in w-full max-w-6xl mx-auto pb-12">
            <div className="relative w-full h-[500px] rounded-[40px] overflow-hidden mb-12 group shadow-2xl border border-white/10 bg-black">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transform group-hover:scale-105 transition-transform duration-[20s]"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2832&auto=format&fit=crop')` }} 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black/90 backdrop-blur-[1px]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                    <div className="mb-8 relative">
                        <div className="absolute inset-0 bg-cyan-500 blur-[60px] opacity-30 rounded-full animate-pulse-slow"></div>
                        <div className="relative w-24 h-24 bg-black/40 backdrop-blur-xl rounded-3xl border border-cyan-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.2)] ring-1 ring-white/10">
                            <SparklesIcon className="w-12 h-12 text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                        </div>
                        <div className="absolute -top-4 -right-4 w-3 h-3 bg-cyan-400 rounded-full blur-[2px] animate-bounce"></div>
                        <div className="absolute -bottom-2 -left-6 w-2 h-2 bg-purple-400 rounded-full blur-[1px] animate-pulse"></div>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-cyan-200 tracking-tight mb-4 drop-shadow-[0_0_25px_rgba(34,211,238,0.3)] font-sans">
                        MARKET <br className="hidden md:block" /> INTELLIGENCE
                    </h2>
                    <p className="text-lg text-cyan-100/70 max-w-2xl font-medium leading-relaxed mb-10 tracking-wide">
                        Synthesizing social pulses, expert opinions, and global news into instant clarity.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button 
                            onClick={() => onAnalyze('TSLA')}
                            className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] flex items-center gap-2 active:scale-95 group/btn"
                        >
                            <BotIcon className="w-5 h-5 group-hover/btn:animate-spin" />
                            <span>Scan Market Pulse</span>
                        </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-32 w-full opacity-60 pointer-events-none flex items-end justify-center">
                         <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1200 200">
                            <defs>
                                <linearGradient id="waveGrad" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                                </linearGradient>
                                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#22c55e" />
                                    <stop offset="50%" stopColor="#eab308" />
                                    <stop offset="100%" stopColor="#ef4444" />
                                </linearGradient>
                            </defs>
                            <path d="M0 160 Q 300 100 600 160 T 1200 160 V 200 H 0 Z" fill="url(#waveGrad)" />
                            <path d="M0 160 Q 300 100 600 160 T 1200 160" fill="none" stroke="url(#lineGrad)" strokeWidth="3" strokeLinecap="round" className="drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                            <circle cx="300" cy="130" r="4" fill="#22c55e" className="animate-ping" />
                            <circle cx="600" cy="160" r="4" fill="#eab308" />
                            <circle cx="900" cy="130" r="4" fill="#ef4444" />
                         </svg>
                    </div>
                </div>
            </div>
            <div className="border-t border-slate-200 dark:border-white/5 pt-10">
                <h3 className="text-sm font-black text-slate-500 dark:text-zinc-500 uppercase tracking-wider mb-6 flex items-center">
                    <RssIcon className="w-4 h-4 mr-2" /> Trending Intel
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <TrendingIntelCard ticker="NVDA" name="NVIDIA Corp." tag="High Vol" onSelect={() => onAnalyze('NVDA')} />
                    <TrendingIntelCard ticker="AAPL" name="Apple Inc." tag="Breaking News" onSelect={() => onAnalyze('AAPL')} />
                    <TrendingIntelCard ticker="MSFT" name="Microsoft" tag="AI Updates" onSelect={() => onAnalyze('MSFT')} />
                    <TrendingIntelCard ticker="PLTR" name="Palantir Tech" tag="Trending" onSelect={() => onAnalyze('PLTR')} />
                </div>
            </div>
        </div>
    );
};

const NewsPage: React.FC<NewsPageProps> = ({ addToast }) => {
    const [fullAnalysis, setFullAnalysis] = useState<AnalysisResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentTicker, setCurrentTicker] = useState('AAPL');
    const [currentRiskProfile, setCurrentRiskProfile] = useState<RiskProfile>('Moderate');
    
    const handleFetchNews = useCallback(async (ticker: string, riskProfile: RiskProfile) => {
        setCurrentTicker(ticker);
        setCurrentRiskProfile(riskProfile);
        setIsLoading(true);
        setError(null);
        setFullAnalysis(null);
        addToast(`Analyzing market intelligence for ${ticker}...`, 'info');
        try {
            const resultText = await getStockAnalysis(ticker, riskProfile);
            const result = JSON.parse(extractJson(resultText));
            if (!isValidAnalysisResponse(result)) {
                throw new Error("The AI returned incomplete data.");
            }
            setFullAnalysis(result);
            addToast(`Market intel for ${ticker} ready.`, 'success');
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            setError(errorMessage);
            addToast(`Failed to analyze news for ${ticker}.`, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [addToast]);

    return (
        <div className="space-y-8 pt-8 pb-28 px-1 md:px-4">
            <div className="relative z-[60] max-w-4xl mx-auto">
                <StockSelector 
                    onAnalyze={handleFetchNews} 
                    initialTicker={currentTicker} 
                    initialRiskProfile={currentRiskProfile} 
                    isLoading={isLoading}
                    hideRiskProfile={true}
                />
            </div>
            {isLoading ? (
                <div className="p-16 text-center bg-white dark:bg-[#121214] rounded-[32px] border border-slate-200 dark:border-white/5 animate-pulse max-w-4xl mx-auto shadow-sm">
                    <SparklesIcon className="w-12 h-12 text-emerald-500 dark:text-indigo-500 animate-spin mx-auto mb-6" />
                    <p className="text-slate-800 dark:text-zinc-200 font-bold text-lg">Scanning global market data...</p>
                    <p className="text-slate-500 dark:text-zinc-500 text-sm mt-2">Analyzing sentiment, social trends & expert opinions for {currentTicker}</p>
                </div>
            ) : error ? (
                <div className="p-6 mt-4 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm rounded-2xl text-center border border-rose-200 dark:border-rose-500/20 flex items-center justify-center max-w-2xl mx-auto">
                    <span className="w-2 h-2 bg-rose-500 rounded-full mr-2 animate-pulse"></span>
                    {error}
                </div>
            ) : fullAnalysis ? (
                <div className="space-y-8 animate-scale-in">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white/80 dark:bg-[#121214]/50 backdrop-blur-xl p-1 rounded-[32px] border border-slate-200 dark:border-white/5 shadow-sm h-full">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/5">
                                <div className="flex items-center">
                                    <NewspaperIcon className="w-5 h-5 text-emerald-500 dark:text-indigo-400 mr-2" />
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">News Sentiment</h3>
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-lg border border-slate-200 dark:border-white/5">AI SCANNED</span>
                            </div>
                            <div className="p-4 md:p-6">
                                <AINewsSentimentTab analysis={fullAnalysis.news_sentiment_analysis} />
                            </div>
                        </div>
                        <div className="bg-white/80 dark:bg-[#121214]/50 backdrop-blur-xl p-1 rounded-[32px] border border-slate-200 dark:border-white/5 shadow-sm h-full flex flex-col">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/5">
                                <div className="flex items-center">
                                    <SentimentIcon className="w-5 h-5 text-rose-500 dark:text-rose-400 mr-2" />
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Social Pulse</h3>
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-lg border border-slate-200 dark:border-white/5">COMMUNITY</span>
                            </div>
                            <div className="p-4 md:p-6 flex-grow">
                                <MarketSentimentTab marketSentiment={fullAnalysis.market_sentiment} mode="social_only" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/80 dark:bg-[#121214]/50 backdrop-blur-xl p-1 rounded-[32px] border border-slate-200 dark:border-white/5 shadow-sm">
                         <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/5">
                            <div className="flex items-center">
                                <UserIcon className="w-5 h-5 text-indigo-500 dark:text-indigo-400 mr-2" />
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Expert Consensus</h3>
                            </div>
                        </div>
                        <div className="p-4 md:p-6">
                            <ExpertOpinionsTab opinions={fullAnalysis.expert_opinions} currentPrice={fullAnalysis.overview.current_price} />
                        </div>
                    </div>
                    <div className="mt-8">
                         <div className="flex items-center justify-between mb-6 px-2">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                                <NewspaperIcon className="w-5 h-5 mr-3 text-emerald-500 dark:text-indigo-400" />
                                Latest Headlines
                            </h3>
                         </div>
                         <NewsFeed 
                            articles={fullAnalysis.stock_specific_news || []}
                            title=""
                        />
                    </div>
                </div>
            ) : (
                <IntelDiscovery onAnalyze={(t) => handleFetchNews(t, currentRiskProfile)} />
            )}
        </div>
    );
};

export default NewsPage;
