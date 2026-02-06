
import React, { useState, useMemo, useRef } from 'react';
import type { MarketSentiment, SocialPost, NewsSentimentAnalysis, NewsTheme, NewsSentimentBreakdown as NewsSentimentBreakdownType } from '../../types';
import SentimentTag from '../SentimentTag';
import { RssIcon, XSocialIcon, RedditIcon, ChevronLeftIcon, ChevronRightIcon, SparklesIcon, CheckCircleIcon, InfoIcon, RationaleIcon, NewspaperIcon } from '../icons';
import NewsSentimentBreakdown from './NewsSentimentBreakdown';

interface SentimentAnalysisTabProps {
    marketSentiment: MarketSentiment;
    newsAnalysis?: NewsSentimentAnalysis;
    newsBreakdown?: NewsSentimentBreakdownType;
    mode?: 'full' | 'social_only';
}

const LastUpdated: React.FC = () => (
    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-end">
        <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-wider">
            Updated: Just now
        </span>
    </div>
);

const SentimentScoreGauge: React.FC<{ score: number }> = ({ score }) => {
    const safeScore = score ?? 0;
    const percentage = ((safeScore + 10) / 20) * 100;
    const angle = (percentage / 100) * 180;
    const rotation = -90 + angle;

    let statusText = 'Neutral';
    let textColor = 'text-amber-600 dark:text-amber-400';
    let ringColor = 'border-amber-500 dark:border-amber-400';

    if (safeScore > 3) {
        statusText = 'Positive';
        textColor = 'text-emerald-600 dark:text-green-400';
        ringColor = 'border-emerald-500 dark:border-green-400';
    } else if (safeScore < -3) {
        statusText = 'Negative';
        textColor = 'text-rose-600 dark:text-red-400';
        ringColor = 'border-rose-500 dark:border-red-400';
    }

    return (
        <div className="p-8 flex flex-col items-center justify-center h-full transition-all duration-300 bg-white dark:bg-[#121214] border border-slate-200 dark:border-white/5 rounded-[24px] shadow-sm">
            <h4 className="text-xs font-bold text-slate-500 dark:text-zinc-400 mb-6 uppercase tracking-widest">Aggregate Sentiment Score</h4>
            <div className="relative w-48 h-24 overflow-hidden mb-4">
                <div className="absolute top-0 left-0 w-full h-full border-8 border-slate-100 dark:border-zinc-800 rounded-t-full border-b-0"></div>
                <div 
                    className="absolute top-0 left-0 w-full h-full border-8 border-rose-500/80 rounded-t-full border-b-0"
                    style={{ clipPath: 'polygon(0 0, 35% 0, 35% 100%, 0 100%)' }}
                ></div>
                <div 
                    className="absolute top-0 left-0 w-full h-full border-8 border-amber-500/80 rounded-t-full border-b-0"
                    style={{ clipPath: 'polygon(35% 0, 65% 0, 65% 100%, 35% 100%)' }}
                ></div>
                <div 
                    className="absolute top-0 left-0 w-full h-full border-8 border-emerald-500/80 rounded-t-full border-b-0"
                    style={{ clipPath: 'polygon(65% 0, 100% 0, 100% 100%, 65% 100%)' }}
                ></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-20 bg-slate-800 dark:bg-white origin-bottom transition-transform duration-1000 ease-out" style={{ transform: `rotate(${rotation}deg)` }}>
                    <div className={`w-4 h-4 rounded-full absolute -top-2 -left-1.5 ring-4 ring-white dark:ring-[#121214] shadow-md ${ringColor.replace('border-', 'bg-')}`}></div>
                </div>
            </div>
            <p className="text-5xl font-black text-slate-900 dark:text-white -mt-2 tracking-tighter">{safeScore.toFixed(1)}</p>
            <p className={`text-lg font-bold mt-2 ${textColor}`}>{statusText}</p>
        </div>
    );
};

const ThemeCard: React.FC<{ theme: NewsTheme }> = ({ theme }) => {
    const sentimentScore = theme.sentiment_score ?? 0;
    const scoreColor = sentimentScore > 0 ? 'text-emerald-700 dark:text-emerald-400' : sentimentScore < 0 ? 'text-rose-700 dark:text-rose-400' : 'text-slate-600 dark:text-zinc-400';
    const bgColor = sentimentScore > 0 ? 'bg-emerald-50 dark:bg-emerald-500/10' : sentimentScore < 0 ? 'bg-rose-50 dark:bg-rose-500/10' : 'bg-slate-50 dark:bg-white/5';
    const borderColor = sentimentScore > 0 ? 'border-emerald-100 dark:border-emerald-500/20' : sentimentScore < 0 ? 'border-rose-100 dark:border-rose-500/20' : 'border-slate-100 dark:border-white/5';

    return (
        <div className={`p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1 border ${borderColor} group bg-white dark:bg-[#121214] flex flex-col h-full rounded-[24px] shadow-sm`}>
            <div className="flex justify-between items-start mb-4">
                <h5 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-sm">{theme.theme}</h5>
                <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border border-transparent ${bgColor} ${scoreColor}`}>{sentimentScore > 0 ? '+' : ''}{sentimentScore.toFixed(1)}</span>
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-zinc-400 leading-relaxed flex-grow">{theme.summary}</p>
        </div>
    );
};

const getSourceIcon = (source: string) => {
    const s = (source || '').toLowerCase();
    if (s.includes('reddit')) return <RedditIcon className="w-4 h-4 text-orange-500" />;
    if (s.includes('x') || s.includes('twitter')) return <XSocialIcon className="w-4 h-4 text-slate-800 dark:text-slate-300" />;
    return <RssIcon className="w-4 h-4 text-sky-500" />;
};

const SocialPostCard: React.FC<{ post: SocialPost }> = ({ post }) => (
    <div className="bg-white dark:bg-[#121214] p-5 rounded-[24px] border border-slate-200 dark:border-white/5 hover:border-indigo-300 dark:hover:border-indigo-500/30 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group">
        <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-2 overflow-hidden">
                <div className="flex-shrink-0 p-1.5 bg-slate-50 dark:bg-white/5 rounded-lg shadow-sm border border-slate-100 dark:border-white/5">
                    {getSourceIcon(post.source)}
                </div>
                <p className="font-bold text-xs text-slate-900 dark:text-white truncate">{post.author}</p>
            </div>
            <SentimentTag tag={post.sentiment} type="sentiment" />
        </div>
        <p className="text-sm font-medium text-slate-700 dark:text-zinc-300 leading-relaxed line-clamp-4">
            "{post.content}"
        </p>
    </div>
);

const SentimentMeter: React.FC<{ posts: SocialPost[] }> = ({ posts }) => {
    const stats = useMemo(() => {
        const total = posts.length;
        if (total === 0) return { bullish: 0, bearish: 0, neutral: 0, score: 50 };
        
        const bullish = posts.filter(p => p.sentiment === 'Bullish').length;
        const bearish = posts.filter(p => p.sentiment === 'Bearish').length;
        const neutral = posts.filter(p => p.sentiment === 'Neutral').length;
        
        const score = ((bullish * 100) + (neutral * 50)) / total;
        
        return {
            bullish: (bullish / total) * 100,
            bearish: (bearish / total) * 100,
            neutral: (neutral / total) * 100,
            score
        };
    }, [posts]);

    const getScoreLabel = (score: number) => {
        if (score >= 75) return { label: 'Euphoric', color: 'text-emerald-500 dark:text-emerald-400' };
        if (score >= 60) return { label: 'Bullish', color: 'text-emerald-600 dark:text-emerald-500' };
        if (score >= 40) return { label: 'Neutral', color: 'text-slate-500 dark:text-slate-400' };
        if (score >= 25) return { label: 'Bearish', color: 'text-rose-500 dark:text-rose-400' };
        return { label: 'Panic', color: 'text-rose-600 dark:text-rose-500' };
    };

    const scoreInfo = getScoreLabel(stats.score);

    return (
        <div className="bg-white dark:bg-[#121214] rounded-[24px] p-6 border border-slate-200 dark:border-white/5 relative overflow-hidden shadow-sm h-full flex flex-col justify-center">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>
            
            <h4 className="text-xs font-bold text-slate-500 dark:text-zinc-400 mb-6 uppercase tracking-widest relative z-10">Social Sentiment</h4>

            {/* Main Bar Meter */}
            <div className="relative z-10 w-full mb-8">
                <div className="flex justify-between items-end mb-2">
                    <span className={`text-4xl font-black tracking-tight leading-none ${scoreInfo.color}`}>{stats.score.toFixed(0)}</span>
                    <span className={`text-sm font-bold uppercase tracking-wider ${scoreInfo.color}`}>{scoreInfo.label}</span>
                </div>
                <div className="h-4 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden relative">
                    <div 
                        className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500`}
                        style={{ width: `${stats.score}%` }}
                    ></div>
                    {/* Tick Mark for Score */}
                    <div 
                        className="absolute top-0 bottom-0 w-1 bg-white dark:bg-black z-20 shadow-lg" 
                        style={{ left: `${stats.score}%` }} 
                    />
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-widest">
                    <span>Bearish</span>
                    <span>Neutral</span>
                    <span>Bullish</span>
                </div>
            </div>

            {/* Vertical Breakdown Bars */}
            <div className="grid grid-cols-3 gap-3 relative z-10 w-full mt-auto">
                <div className="flex flex-col gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 text-center">
                    <span className="text-[10px] font-bold text-emerald-600/70 dark:text-emerald-400/70 uppercase">Bullish</span>
                    <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{stats.bullish.toFixed(0)}%</span>
                    <div className="h-1.5 w-full bg-emerald-200 dark:bg-emerald-500/20 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${stats.bullish}%` }}></div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-center">
                    <span className="text-[10px] font-bold text-slate-500/70 dark:text-zinc-400/70 uppercase">Neutral</span>
                    <span className="text-xl font-black text-slate-600 dark:text-zinc-300">{stats.neutral.toFixed(0)}%</span>
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-400 dark:bg-slate-500 rounded-full" style={{ width: `${stats.neutral}%` }}></div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/10 text-center">
                    <span className="text-[10px] font-bold text-rose-600/70 dark:text-rose-400/70 uppercase">Bearish</span>
                    <span className="text-xl font-black text-rose-600 dark:text-rose-400">{stats.bearish.toFixed(0)}%</span>
                    <div className="h-1.5 w-full bg-rose-200 dark:bg-rose-500/20 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500 rounded-full" style={{ width: `${stats.bearish}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SentimentAnalysisTab: React.FC<SentimentAnalysisTabProps> = ({ marketSentiment, newsAnalysis, newsBreakdown, mode = 'full' }) => {
    const [activeSource, setActiveSource] = useState('All');

    const sources = useMemo(() => {
        if (!marketSentiment?.social_media_summary) return ['All'];
        const uniqueSources = [...new Set(marketSentiment.social_media_summary.map(post => post.source))];
        return ['All', ...uniqueSources];
    }, [marketSentiment?.social_media_summary]);

    const filteredPosts = useMemo(() => {
        if (!marketSentiment?.social_media_summary) return [];
        if (activeSource === 'All') return marketSentiment.social_media_summary;
        return marketSentiment.social_media_summary.filter(post => post.source === activeSource);
    }, [activeSource, marketSentiment?.social_media_summary]);

    return (
        <div className="space-y-12 animate-fade-in pb-12">
            
            {/* 1. Top Level Sentiment Gauges & Summary */}
            {mode === 'full' && (
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        {/* News Sentiment Gauge */}
                        <SentimentScoreGauge score={newsAnalysis?.overall_sentiment_score || 0} />
                    </div>
                    
                    <div className="lg:col-span-2 space-y-6 flex flex-col">
                        {/* Intelligence Briefings */}
                        <div className="p-6 md:p-8 flex-1 flex flex-col justify-center hover:shadow-md transition-shadow bg-white dark:bg-[#121214] border border-slate-200 dark:border-white/5 rounded-[24px] shadow-sm">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mr-3 text-indigo-500 border border-indigo-100 dark:border-indigo-500/20">
                                    <InfoIcon className="w-5 h-5" />
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">AI Sentiment Summary</h4>
                            </div>
                            <p className="text-base text-slate-700 dark:text-zinc-300 leading-relaxed font-medium">
                                {newsAnalysis?.sentiment_summary || marketSentiment?.community_sentiment_summary}
                            </p>
                            <LastUpdated />
                        </div>
                        <div className="p-6 md:p-8 flex-1 flex flex-col justify-center hover:shadow-md transition-shadow bg-white dark:bg-[#121214] border border-slate-200 dark:border-white/5 rounded-[24px] shadow-sm">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mr-3 text-emerald-500 border border-emerald-100 dark:border-emerald-500/20">
                                    <RationaleIcon className="w-5 h-5" />
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Market Impact</h4>
                            </div>
                            <p className="text-base text-slate-700 dark:text-zinc-300 leading-relaxed font-medium">
                                {newsAnalysis?.market_impact_summary || marketSentiment?.market_impact_summary}
                            </p>
                            <LastUpdated />
                        </div>
                    </div>
                </section>
            )}

            {/* 2. Key Themes */}
            {mode === 'full' && newsAnalysis?.key_themes && newsAnalysis.key_themes.length > 0 && (
                <section>
                    <h3 className="text-xl font-black mb-6 flex items-center text-slate-900 dark:text-white tracking-tight">
                        <SparklesIcon className="w-6 h-6 mr-3 text-indigo-500" /> Key Themes Driving Sentiment
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {newsAnalysis.key_themes.map((theme, index) => (
                            <ThemeCard key={index} theme={theme} />
                        ))}
                    </div>
                </section>
            )}

            {/* 3. Social Pulse Section */}
            <section>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center tracking-tight">
                        <RssIcon className="w-6 h-6 mr-3 text-rose-500" />
                        Community Pulse
                    </h3>
                    
                    {/* Source Filter */}
                    <div className="flex bg-slate-100 dark:bg-[#18181B] p-1 rounded-xl border border-slate-200 dark:border-white/5">
                        {sources.map(source => (
                            <button
                                key={source}
                                onClick={() => setActiveSource(source)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                                    activeSource === source
                                    ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300'
                                }`}
                            >
                                {source}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Meter */}
                    <div className="lg:col-span-1 h-full min-h-[300px]">
                        <SentimentMeter posts={filteredPosts} />
                    </div>

                    {/* Posts Feed */}
                    <div className="lg:col-span-2">
                        {filteredPosts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                                {filteredPosts.slice(0, 6).map((post, index) => (
                                    <SocialPostCard key={index} post={post} />
                                ))}
                            </div>
                        ) : (
                            <div className="h-full min-h-[200px] flex items-center justify-center p-8 bg-slate-50 dark:bg-white/5 rounded-[24px] border border-dashed border-slate-200 dark:border-white/10">
                                <p className="text-slate-500 dark:text-zinc-500 font-medium">No social signals detected for "{activeSource}".</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* 4. Detailed Breakdown */}
            {mode === 'full' && newsBreakdown && (
                <section>
                    <h3 className="text-xl font-black mb-6 flex items-center text-slate-900 dark:text-white tracking-tight">
                        <NewspaperIcon className="w-6 h-6 mr-3 text-indigo-500" /> Sentiment Breakdown
                    </h3>
                    <div className="overflow-hidden bg-white dark:bg-[#121214] shadow-sm border border-slate-200 dark:border-white/5 rounded-[24px]">
                        <NewsSentimentBreakdown data={newsBreakdown} />
                        <div className="px-8 pb-6">
                            <LastUpdated />
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default SentimentAnalysisTab;
