
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

/* ─── Trending Card ─── */
const TrendingIntelCard: React.FC<{ ticker: string; name: string; tag: string; accent: string; onSelect: () => void }> = ({ ticker, name, tag, accent, onSelect }) => (
    <button
        onClick={onSelect}
        className="relative flex flex-col justify-between p-5 w-full bg-white dark:bg-[#111113] hover:bg-slate-50 dark:hover:bg-[#161618] border border-slate-200/80 dark:border-white/[0.06] rounded-2xl transition-all duration-500 group text-left shadow-sm hover:shadow-xl hover:-translate-y-1 overflow-hidden min-h-[140px]"
    >
        {/* Accent glow */}
        <div className={`absolute -top-10 -right-10 w-28 h-28 rounded-full blur-[50px] opacity-0 group-hover:opacity-40 transition-opacity duration-700 ${accent}`}></div>

        <div className="flex items-center gap-3 relative z-10">
            <div className="w-11 h-11 rounded-xl bg-white dark:bg-[#1a1a1d] flex items-center justify-center border border-slate-200 dark:border-white/[0.06] shadow-sm overflow-hidden p-1.5 group-hover:scale-110 transition-transform duration-300">
                <img
                    src={getStockLogo(ticker)}
                    alt={ticker}
                    className="w-full h-full object-contain"
                    onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${ticker}&background=random&color=fff&bold=true`; }}
                />
            </div>
            <div>
                <p className="font-extrabold text-slate-900 dark:text-white text-sm tracking-tight">{ticker}</p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-500 font-medium">{name}</p>
            </div>
        </div>

        <div className="flex items-center justify-between mt-4 relative z-10">
            <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border ${
                tag === 'High Vol' ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20' :
                tag === 'Breaking News' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' :
                tag === 'AI Updates' ? 'bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20' :
                'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
            }`}>
                {tag}
            </span>
            <ArrowLongRightIcon className="w-4 h-4 text-slate-300 dark:text-zinc-700 group-hover:text-slate-600 dark:group-hover:text-zinc-300 group-hover:translate-x-1 transition-all duration-300" />
        </div>
    </button>
);

/* ─── Category Pill ─── */
const CategoryPill: React.FC<{ label: string; icon: React.ReactNode; active?: boolean; onClick: () => void }> = ({ label, icon, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap border ${
            active
                ? 'bg-slate-900 dark:bg-white text-white dark:text-black border-slate-900 dark:border-white shadow-lg shadow-slate-900/20 dark:shadow-white/10'
                : 'bg-white dark:bg-white/5 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/10 hover:shadow-md'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

/* ─── Stat Chip ─── */
const StatChip: React.FC<{ label: string; value: string; trend?: 'up' | 'down' | 'neutral' }> = ({ label, value, trend }) => (
    <div className="flex flex-col items-center gap-1 px-5 py-3 bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-white/[0.06]">
        <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest">{label}</span>
        <span className={`text-lg font-black tracking-tight ${
            trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' :
            trend === 'down' ? 'text-rose-600 dark:text-rose-400' :
            'text-slate-900 dark:text-white'
        }`}>{value}</span>
    </div>
);

/* ─── Skeleton Shimmer ─── */
const SkeletonBlock: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`bg-slate-200/60 dark:bg-white/[0.06] rounded-2xl animate-pulse ${className}`}></div>
);

const LoadingSkeleton: React.FC<{ ticker: string }> = ({ ticker }) => (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
        {/* Ticker banner skeleton */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-[#111113] dark:to-[#0a0a0b] border border-slate-200/80 dark:border-white/[0.06] p-8">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-white/[0.06] animate-pulse"></div>
                <div className="space-y-2">
                    <div className="w-24 h-5 bg-slate-200 dark:bg-white/[0.06] rounded-lg animate-pulse"></div>
                    <div className="w-48 h-3 bg-slate-200/70 dark:bg-white/[0.04] rounded-lg animate-pulse"></div>
                </div>
            </div>
            <div className="mt-6 flex items-center gap-3">
                <SparklesIcon className="w-5 h-5 text-indigo-400 animate-spin" />
                <span className="text-sm font-bold text-slate-600 dark:text-zinc-400">Scanning global market intelligence for <span className="text-indigo-600 dark:text-indigo-400">{ticker}</span></span>
            </div>
            {/* Animated progress bar */}
            <div className="mt-4 h-1.5 w-full bg-slate-200 dark:bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 rounded-full animate-[shimmer_2s_infinite] bg-[length:200%_100%]"></div>
            </div>
        </div>
        {/* Cards skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonBlock className="h-[320px]" />
            <SkeletonBlock className="h-[320px]" />
        </div>
        <SkeletonBlock className="h-[280px]" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SkeletonBlock className="h-[200px]" />
            <SkeletonBlock className="h-[200px]" />
            <SkeletonBlock className="h-[200px]" />
        </div>
    </div>
);

/* ─── Intel Discovery (Landing State) ─── */
const IntelDiscovery: React.FC<{ onAnalyze: (ticker: string) => void }> = ({ onAnalyze }) => {
    return (
        <div className="animate-fade-in w-full max-w-7xl mx-auto pb-12 space-y-10">
            {/* Hero Section - Abstract gradient mesh */}
            <div className="relative w-full rounded-[32px] overflow-hidden shadow-2xl border border-white/10 dark:border-white/[0.06] bg-[#0a0a0b]">
                {/* Layered gradient mesh background */}
                <div className="absolute inset-0">
                    <div className="absolute top-[-30%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[100px] animate-pulse-slow"></div>
                    <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-violet-600/20 rounded-full blur-[80px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute bottom-[-10%] right-[10%] w-[300px] h-[300px] bg-cyan-500/15 rounded-full blur-[60px]"></div>
                    {/* Noise texture */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-25 mix-blend-overlay pointer-events-none"></div>
                    {/* Grid pattern overlay */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
                </div>

                <div className="relative z-10 px-8 md:px-16 py-16 md:py-24 flex flex-col items-start">
                    {/* Pill badge */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] backdrop-blur-xl rounded-full border border-white/[0.1] mb-8">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-[11px] font-bold text-white/70 uppercase tracking-widest">Live Market Intelligence</span>
                    </div>

                    {/* Main heading - editorial style */}
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.05] mb-6 max-w-3xl">
                        Decode the <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-violet-300 to-emerald-300">Market Signal.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-white/50 max-w-xl font-medium leading-relaxed mb-10">
                        AI-synthesized news, social pulse, and expert consensus — distilled into actionable intelligence in seconds.
                    </p>

                    {/* CTA Row */}
                    <div className="flex flex-wrap gap-4 items-center">
                        <button
                            onClick={() => onAnalyze('TSLA')}
                            className="group px-8 py-4 bg-white hover:bg-zinc-100 text-black font-bold rounded-2xl transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_50px_rgba(255,255,255,0.25)] flex items-center gap-3 active:scale-[0.98]"
                        >
                            <SparklesIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            <span>Scan Market Pulse</span>
                            <ArrowLongRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <div className="flex items-center gap-3 px-5 py-3 bg-white/[0.05] backdrop-blur-md rounded-2xl border border-white/[0.08]">
                            <div className="flex -space-x-2">
                                {['AAPL', 'GOOG', 'MSFT'].map((t) => (
                                    <img
                                        key={t}
                                        src={getStockLogo(t)}
                                        alt={t}
                                        className="w-7 h-7 rounded-lg border-2 border-[#0a0a0b] object-contain bg-white p-0.5"
                                        onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${t}&background=random&color=fff&bold=true`; }}
                                    />
                                ))}
                            </div>
                            <span className="text-xs font-medium text-white/40">500+ tickers available</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Scan Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center border border-indigo-100 dark:border-indigo-500/20">
                            <RssIcon className="w-4 h-4 text-indigo-500" />
                        </div>
                        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">Quick Scan</h3>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-widest">Popular Tickers</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <TrendingIntelCard ticker="NVDA" name="NVIDIA Corporation" tag="High Vol" accent="bg-emerald-500" onSelect={() => onAnalyze('NVDA')} />
                    <TrendingIntelCard ticker="AAPL" name="Apple Inc." tag="Breaking News" accent="bg-amber-500" onSelect={() => onAnalyze('AAPL')} />
                    <TrendingIntelCard ticker="MSFT" name="Microsoft Corp." tag="AI Updates" accent="bg-violet-500" onSelect={() => onAnalyze('MSFT')} />
                    <TrendingIntelCard ticker="PLTR" name="Palantir Technologies" tag="Trending" accent="bg-rose-500" onSelect={() => onAnalyze('PLTR')} />
                </div>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                {[
                    { icon: <NewspaperIcon className="w-5 h-5 text-indigo-500" />, title: 'News Sentiment', desc: 'AI-scanned headlines scored for market impact', bg: 'bg-indigo-50 dark:bg-indigo-500/5', border: 'border-indigo-100 dark:border-indigo-500/10' },
                    { icon: <SentimentIcon className="w-5 h-5 text-rose-500" />, title: 'Social Pulse', desc: 'Community sentiment from Reddit, X, and forums', bg: 'bg-rose-50 dark:bg-rose-500/5', border: 'border-rose-100 dark:border-rose-500/10' },
                    { icon: <UserIcon className="w-5 h-5 text-emerald-500" />, title: 'Expert Consensus', desc: 'Wall Street analyst ratings and price targets', bg: 'bg-emerald-50 dark:bg-emerald-500/5', border: 'border-emerald-100 dark:border-emerald-500/10' },
                ].map((item, i) => (
                    <div key={i} className={`flex items-start gap-4 p-5 rounded-2xl border ${item.border} ${item.bg} transition-all hover:shadow-md`}>
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center shadow-sm border border-white dark:border-white/[0.06] flex-shrink-0">
                            {item.icon}
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{item.title}</h4>
                            <p className="text-xs text-slate-500 dark:text-zinc-500 leading-relaxed font-medium">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ─── Ticker Hero Banner (shown when analysis is loaded) ─── */
const TickerBanner: React.FC<{ analysis: AnalysisResponse; ticker: string }> = ({ analysis, ticker }) => {
    const sentimentScore = analysis.news_sentiment_analysis?.overall_sentiment_score ?? 0;
    const isPositive = sentimentScore > 0;
    const price = analysis.overview?.current_price;
    const change = analysis.overview?.price_change;
    const changePct = analysis.overview?.price_change_percentage;

    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 to-white dark:from-[#111113] dark:to-[#0a0a0b] border border-slate-200/80 dark:border-white/[0.06] shadow-sm">
            {/* Subtle accent glow */}
            <div className={`absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[80px] opacity-30 ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-[60px] opacity-10 bg-indigo-500"></div>

            <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Left - Ticker Info */}
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#1a1a1d] flex items-center justify-center border border-slate-200 dark:border-white/[0.06] shadow-md overflow-hidden p-2">
                        <img
                            src={getStockLogo(ticker)}
                            alt={ticker}
                            className="w-full h-full object-contain"
                            onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${ticker}&background=random&color=fff&bold=true`; }}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{ticker}</h2>
                            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                                isPositive
                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                                    : 'bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                            }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                {isPositive ? 'Bullish Sentiment' : sentimentScore < -3 ? 'Bearish Sentiment' : 'Neutral Sentiment'}
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-zinc-500 font-medium">
                            {analysis.overview?.company_name || 'Market Intelligence Report'}
                        </p>
                    </div>
                </div>

                {/* Right - Quick Stats */}
                <div className="flex flex-wrap gap-3">
                    {price && <StatChip label="Price" value={`$${price.toFixed(2)}`} />}
                    {change != null && <StatChip label="Change" value={`${change >= 0 ? '+' : ''}${change.toFixed(2)}`} trend={change >= 0 ? 'up' : 'down'} />}
                    {changePct != null && <StatChip label="%" value={`${changePct >= 0 ? '+' : ''}${changePct.toFixed(2)}%`} trend={changePct >= 0 ? 'up' : 'down'} />}
                    <StatChip label="Sentiment" value={sentimentScore.toFixed(1)} trend={isPositive ? 'up' : sentimentScore < -3 ? 'down' : 'neutral'} />
                </div>
            </div>
        </div>
    );
};

/* ─── Section Divider ─── */
const SectionDivider: React.FC<{ icon: React.ReactNode; title: string; badge?: string; badgeColor?: string }> = ({ icon, title, badge, badgeColor = 'indigo' }) => {
    const badgeColors: Record<string, string> = {
        indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20',
        rose: 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
        amber: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    };

    return (
        <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/[0.06] shadow-sm">
                    {icon}
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">{title}</h3>
            </div>
            {badge && (
                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg border ${badgeColors[badgeColor]}`}>
                    {badge}
                </span>
            )}
        </div>
    );
};

/* ─── Main NewsPage ─── */
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
        <div className="space-y-8 pt-6 pb-28 px-1 md:px-4">
            {/* Sticky Search Bar */}
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
                <LoadingSkeleton ticker={currentTicker} />
            ) : error ? (
                /* Error State */
                <div className="max-w-2xl mx-auto">
                    <div className="p-8 bg-white dark:bg-[#111113] border border-rose-200 dark:border-rose-500/20 rounded-3xl text-center shadow-sm">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center border border-rose-100 dark:border-rose-500/20">
                            <span className="text-2xl">!</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Analysis Failed</h3>
                        <p className="text-sm text-rose-600 dark:text-rose-400 font-medium mb-6">{error}</p>
                        <button
                            onClick={() => handleFetchNews(currentTicker, currentRiskProfile)}
                            className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-[0.98]"
                        >
                            Retry Analysis
                        </button>
                    </div>
                </div>
            ) : fullAnalysis ? (
                /* ─── Analysis Results ─── */
                <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
                    {/* Ticker Hero Banner */}
                    <TickerBanner analysis={fullAnalysis} ticker={currentTicker} />

                    {/* Bento Grid - News Sentiment + Social Pulse */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* News Sentiment Card */}
                        <div className="bg-white dark:bg-[#111113] rounded-3xl border border-slate-200/80 dark:border-white/[0.06] shadow-sm overflow-hidden flex flex-col">
                            <div className="px-6 py-5 border-b border-slate-100 dark:border-white/[0.04] bg-gradient-to-r from-transparent to-indigo-50/50 dark:to-indigo-500/[0.03]">
                                <SectionDivider
                                    icon={<NewspaperIcon className="w-4.5 h-4.5 text-indigo-500" />}
                                    title="News Sentiment"
                                    badge="AI Scanned"
                                    badgeColor="indigo"
                                />
                            </div>
                            <div className="p-5 md:p-6 flex-1">
                                <AINewsSentimentTab analysis={fullAnalysis.news_sentiment_analysis} />
                            </div>
                        </div>

                        {/* Social Pulse Card */}
                        <div className="bg-white dark:bg-[#111113] rounded-3xl border border-slate-200/80 dark:border-white/[0.06] shadow-sm overflow-hidden flex flex-col">
                            <div className="px-6 py-5 border-b border-slate-100 dark:border-white/[0.04] bg-gradient-to-r from-transparent to-rose-50/50 dark:to-rose-500/[0.03]">
                                <SectionDivider
                                    icon={<SentimentIcon className="w-4.5 h-4.5 text-rose-500" />}
                                    title="Social Pulse"
                                    badge="Community"
                                    badgeColor="rose"
                                />
                            </div>
                            <div className="p-5 md:p-6 flex-1">
                                <MarketSentimentTab marketSentiment={fullAnalysis.market_sentiment} mode="social_only" />
                            </div>
                        </div>
                    </div>

                    {/* Expert Consensus - Full Width */}
                    <div className="bg-white dark:bg-[#111113] rounded-3xl border border-slate-200/80 dark:border-white/[0.06] shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 dark:border-white/[0.04] bg-gradient-to-r from-transparent to-emerald-50/50 dark:to-emerald-500/[0.03]">
                            <SectionDivider
                                icon={<UserIcon className="w-4.5 h-4.5 text-emerald-500" />}
                                title="Expert Consensus"
                                badge="Wall Street"
                                badgeColor="emerald"
                            />
                        </div>
                        <div className="p-5 md:p-6">
                            <ExpertOpinionsTab opinions={fullAnalysis.expert_opinions} currentPrice={fullAnalysis.overview.current_price} />
                        </div>
                    </div>

                    {/* Headlines - Magazine Layout */}
                    <div>
                        <div className="mb-6">
                            <SectionDivider
                                icon={<GlobeAmericasIcon className="w-4.5 h-4.5 text-amber-500" />}
                                title="Latest Headlines"
                                badge="Live Feed"
                                badgeColor="amber"
                            />
                        </div>
                        <NewsFeed
                            articles={fullAnalysis.stock_specific_news || []}
                            title=""
                            variant="magazine"
                        />
                    </div>
                </div>
            ) : (
                <IntelDiscovery onAnalyze={(t) => handleFetchNews(t, currentRiskProfile)} />
            )}

            {/* CSS for shimmer animation */}
            <style>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </div>
    );
};

export default NewsPage;
