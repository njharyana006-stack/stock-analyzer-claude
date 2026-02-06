
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { getMarketPulseData } from '../services/geminiService';
import { extractJson } from '../utils';
import type { MarketPulseData, SocialPost, ExpertTake } from '../types';
import { AnalyzeIcon, BotIcon, ReloadIcon, NewspaperIcon, RssIcon, XSocialIcon, RedditIcon, SparklesIcon, ArrowUpRightIcon } from './icons';
import { allStocks } from '../constants/stocks';
import LoadingSignal from './LoadingSignal';

const exampleData: MarketPulseData & { ticker: string } = {
    ticker: 'TSLA',
    overall_summary: "Recent sentiment for Tesla is mixed. There's excitement around the new Cybertruck production ramp-up and AI advancements, but concerns remain about delivery numbers and increased competition in the EV space.",
    social_posts: [
        { source: 'X', author: '@EV_fanatic', sentiment: 'Bullish', content: "Cybertruck deliveries are finally happening at scale! This is going to be a huge Q4 for $TSLA. To the moon!" },
        { source: 'Reddit', author: 'u/ValueInvestor_82', sentiment: 'Bearish', content: "Am I the only one worried about the margins? The price cuts are eating into profitability and competition from BYD is getting serious." },
        { source: 'X', author: '@MarketMinds', sentiment: 'Neutral', content: "Watching $TSLA closely. The FSD V12 update looks promising, but the stock is trading in a tight range. Waiting for a clear catalyst before making a move." },
    ],
    expert_takes: [
        { source: 'Morgan Stanley', author: 'Adam Jonas', summary: "Reiterates 'Overweight' rating, citing Tesla's untapped potential in AI and robotics beyond just cars. Believes the market is underestimating Dojo's value.", prediction: "Price target remains at $380." },
        { source: 'CNBC', author: 'Jim Cramer', summary: "Cramer expresses caution, noting that while Tesla is an innovator, the valuation is still stretched given the current macroeconomic headwinds and automotive challenges.", prediction: "Advises trimming positions on strength." }
    ]
};

const suggestedTickers = ['AAPL', 'GOOGL', 'AMZN', 'MSFT', 'META'];

const getSentimentStyling = (sentiment: SocialPost['sentiment']) => {
    switch (sentiment) {
        case 'Bullish': return { text: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/20', dot: 'bg-emerald-500' };
        case 'Bearish': return { text: 'text-rose-700 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10', border: 'border-rose-200 dark:border-rose-500/20', dot: 'bg-rose-500' };
        default: return { text: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-500/10', border: 'border-slate-200 dark:border-slate-500/20', dot: 'bg-slate-400' };
    }
}

const getSourceIcon = (source: string) => {
    const s = (source || '').toLowerCase();
    if (s.includes('reddit')) return <RedditIcon className="w-4 h-4 text-orange-500" />;
    if (s.includes('x') || s.includes('twitter')) return <XSocialIcon className="w-4 h-4 text-slate-700 dark:text-slate-300" />;
    return <RssIcon className="w-4 h-4 text-sky-500" />;
}

const SocialPostCard: React.FC<{ post: SocialPost }> = ({ post }) => {
    const s = getSentimentStyling(post.sentiment);
    return (
        <div className="bg-white dark:bg-[#121214] rounded-2xl border border-slate-200 dark:border-white/5 p-5 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                        {getSourceIcon(post.source)}
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{post.author}</p>
                        <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium">{post.source}</p>
                    </div>
                </div>
                <span className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-full border ${s.bg} ${s.text} ${s.border}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}></span>
                    {post.sentiment}
                </span>
            </div>
            <p className="text-[13px] leading-relaxed text-slate-600 dark:text-zinc-400 line-clamp-4">{post.content}</p>
        </div>
    );
};

const ExpertTakeCard: React.FC<{ take: ExpertTake }> = ({ take }) => (
    <div className="bg-white dark:bg-[#121214] rounded-2xl border border-slate-200 dark:border-white/5 p-5 hover:shadow-md transition-all duration-200">
        <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                <NewspaperIcon className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            </div>
            <div className="min-w-0">
                <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{take.author}</p>
                <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium">{take.source}</p>
            </div>
        </div>
        <p className="text-[13px] leading-relaxed text-slate-600 dark:text-zinc-400 mb-3 line-clamp-4">{take.summary}</p>
        {take.prediction && (
            <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
                <SparklesIcon className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                <p className="text-[12px] font-semibold text-indigo-700 dark:text-indigo-400 truncate">{take.prediction}</p>
            </div>
        )}
    </div>
);

const MarketPulseExample: React.FC<{ onAnalyzeTicker: (ticker: string) => void }> = ({ onAnalyzeTicker }) => (
    <div className="space-y-8">
        <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-indigo-900/20 dark:to-emerald-900/10 rounded-2xl border border-emerald-200/60 dark:border-indigo-500/20 p-6">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center"><SparklesIcon className="w-5 h-5 mr-2 text-emerald-600 dark:text-indigo-500" /> What to Expect</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">When you scan a ticker, the AI will provide a real-time summary of social media chatter and expert opinions. Here's an example for <span className="font-bold text-slate-900 dark:text-white">{exampleData.ticker}</span>:</p>
        </div>

        <div className="bg-white dark:bg-[#121214] rounded-2xl border border-slate-200 dark:border-white/5 p-6">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center"><BotIcon className="w-5 h-5 mr-2 text-emerald-500 dark:text-indigo-500" /> AI Summary for {exampleData.ticker}</h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{exampleData.overall_summary}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-4 flex items-center uppercase tracking-wide">
                    <XSocialIcon className="w-4 h-4 mr-2 text-slate-400" />
                    Social Media Chatter
                </h3>
                <div className="space-y-3">
                    {exampleData.social_posts.map((post, i) => <SocialPostCard key={i} post={post} />)}
                </div>
            </div>
            <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-4 flex items-center uppercase tracking-wide">
                    <NewspaperIcon className="w-4 h-4 mr-2 text-slate-400" />
                    Expert & Analyst Takes
                </h3>
                <div className="space-y-3">
                    {exampleData.expert_takes.map((take, i) => <ExpertTakeCard key={i} take={take} />)}
                </div>
            </div>
        </div>

        <div className="bg-white dark:bg-[#121214] rounded-2xl border border-slate-200 dark:border-white/5 p-6">
            <h3 className="font-semibold text-center text-slate-700 dark:text-slate-200 mb-4 text-sm">Or, try one of these tickers:</h3>
            <div className="flex flex-wrap justify-center gap-2">
                {suggestedTickers.map(t => (
                    <button
                        key={t}
                        onClick={() => onAnalyzeTicker(t)}
                        className="px-5 py-2.5 text-sm font-bold text-emerald-700 bg-emerald-50 rounded-full hover:bg-emerald-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 transition-all active:scale-95 border border-emerald-200/60 dark:border-indigo-500/20"
                    >
                        ${t}
                    </button>
                ))}
            </div>
        </div>
    </div>
);


const MarketPulsePage: React.FC<{ addToast: (message: string, type: 'info' | 'success' | 'error') => void; }> = ({ addToast }) => {
    const [ticker, setTicker] = useState('');
    const [data, setData] = useState<MarketPulseData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredStocks = ticker ? allStocks.filter(s =>
        s.symbol.toLowerCase().includes(ticker.toLowerCase()) ||
        s.name.toLowerCase().includes(ticker.toLowerCase())
    ).slice(0, 5) : [];

    const handleSelectStock = (symbol: string) => {
        setTicker(symbol);
        setShowDropdown(false);
    };

    const handleFetchPulse = useCallback(async (tickerToFetch: string) => {
        if (!tickerToFetch) {
            addToast('Please enter a stock ticker.', 'error');
            return;
        }
        setShowDropdown(false);
        setIsLoading(true);
        setError(null);
        setData(null);
        addToast(`Fetching market pulse for ${tickerToFetch}...`, 'info');
        try {
            const resultText = await getMarketPulseData(tickerToFetch);
            const result = JSON.parse(extractJson(resultText));
            setData(result);
            addToast(`Market pulse for ${tickerToFetch} loaded!`, 'success');
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            setError(errorMessage);
            addToast(`Failed to fetch market pulse for ${tickerToFetch}.`, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [addToast]);

    const handleSuggestedTicker = (ticker: string) => {
        setTicker(ticker);
        handleFetchPulse(ticker);
    };

    return (
        <div className="animate-fade-in space-y-8 pt-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center p-8 bg-white dark:bg-[#121214] rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                <div className="flex justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/20">
                        <NewspaperIcon className="w-8 h-8 text-white" />
                    </div>
                </div>
                <h2 className="mt-4 text-2xl font-black text-slate-900 dark:text-white tracking-tight">Market Pulse</h2>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-zinc-400 font-medium max-w-lg mx-auto leading-relaxed">
                    Get real-time market sentiment by scanning social media and expert opinions with AI.
                </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={(e) => { e.preventDefault(); handleFetchPulse(ticker); }} className="bg-white dark:bg-[#121214] rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm p-4 max-w-md mx-auto relative z-20">
                <div className="flex items-center gap-3">
                    <div className="flex-grow relative" ref={dropdownRef}>
                        <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">Enter Stock Ticker</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={ticker}
                                onChange={(e) => {
                                    setTicker(e.target.value.toUpperCase());
                                    setShowDropdown(true);
                                }}
                                onFocus={() => setShowDropdown(true)}
                                placeholder="e.g., NVDA, TSLA..."
                                className="w-full p-2.5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl shadow-inner text-slate-800 dark:text-slate-100 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:ring-indigo-500/50 focus:border-emerald-500 dark:focus:border-indigo-500 transition-all"
                            />
                            {showDropdown && filteredStocks.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#18181B] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto ring-1 ring-black/5 dark:ring-white/5 animate-scale-in">
                                    {filteredStocks.map(stock => (
                                        <button
                                            key={stock.symbol}
                                            type="button"
                                            onClick={() => handleSelectStock(stock.symbol)}
                                            className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 border-b border-slate-100 dark:border-white/5 last:border-0 flex items-center justify-between group transition-colors"
                                        >
                                            <div className="min-w-0">
                                                <span className="font-bold text-slate-900 dark:text-white block text-sm">{stock.symbol}</span>
                                                <span className="text-xs text-slate-500 dark:text-zinc-400 block truncate">{stock.name}</span>
                                            </div>
                                            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-black/20 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 dark:group-hover:text-indigo-400 transition-colors flex-shrink-0 ml-2">
                                                <ArrowUpRightIcon className="w-3 h-3" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !ticker.trim()}
                        className="self-end flex-shrink-0 flex justify-center items-center space-x-2 px-5 py-2.5 border border-transparent text-sm font-bold rounded-xl shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 transition-all active:scale-95"
                    >
                        <AnalyzeIcon className="w-5 h-5" />
                        <span>{isLoading ? '...' : 'Scan'}</span>
                    </button>
                </div>
            </form>

            {/* Content */}
            <div>
                {isLoading && (
                    <LoadingSignal message={`Scanning the web for ${ticker}...`} subMessage="Analyzing social media trends and expert sentiment." />
                )}

                {error && <div className="text-center text-red-600 dark:text-red-400 p-4 bg-red-50 dark:bg-red-500/10 rounded-xl text-sm font-medium">{error}</div>}

                {!isLoading && !error && data && (
                    <div className="space-y-8 animate-slide-up">
                        {/* AI Summary */}
                        <div className="bg-white dark:bg-[#121214] rounded-2xl border border-slate-200 dark:border-white/5 p-6 shadow-sm">
                            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center">
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mr-3 flex-shrink-0">
                                    <BotIcon className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                                </div>
                                AI Summary for {ticker}
                            </h3>
                            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{data.overall_summary}</p>
                        </div>

                        {/* Cards Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-bold text-xs text-slate-500 dark:text-zinc-400 mb-4 flex items-center uppercase tracking-wider">
                                    <XSocialIcon className="w-4 h-4 mr-2 text-slate-400 dark:text-zinc-500" />
                                    Social Media Chatter
                                    <span className="ml-auto text-[11px] font-semibold text-slate-400 dark:text-zinc-600">{data.social_posts.length} posts</span>
                                </h3>
                                <div className="space-y-3">
                                    {data.social_posts.map((post, i) => <SocialPostCard key={i} post={post} />)}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-xs text-slate-500 dark:text-zinc-400 mb-4 flex items-center uppercase tracking-wider">
                                    <NewspaperIcon className="w-4 h-4 mr-2 text-slate-400 dark:text-zinc-500" />
                                    Expert & Analyst Takes
                                    <span className="ml-auto text-[11px] font-semibold text-slate-400 dark:text-zinc-600">{data.expert_takes.length} opinions</span>
                                </h3>
                                <div className="space-y-3">
                                    {data.expert_takes.map((take, i) => <ExpertTakeCard key={i} take={take} />)}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!isLoading && !error && !data && (
                    <MarketPulseExample onAnalyzeTicker={handleSuggestedTicker} />
                )}
            </div>
        </div>
    );
};

export default MarketPulsePage;
