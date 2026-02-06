
import React, { useState, useMemo } from 'react';
import type { MarketSentiment, SocialPost, NewsSentimentAnalysis, NewsTheme, NewsSentimentBreakdown as NewsSentimentBreakdownType } from '../../types';
import SentimentTag from '../SentimentTag';
import { RssIcon, XSocialIcon, RedditIcon, SparklesIcon, InfoIcon, RationaleIcon, NewspaperIcon } from '../icons';
import NewsSentimentBreakdown from './NewsSentimentBreakdown';

interface SentimentAnalysisTabProps {
    marketSentiment: MarketSentiment;
    newsAnalysis?: NewsSentimentAnalysis;
    newsBreakdown?: NewsSentimentBreakdownType;
    mode?: 'full' | 'social_only';
}

/* ─── Premium SVG Sentiment Gauge ─── */
const SentimentScoreGauge: React.FC<{ score: number }> = ({ score }) => {
    const safeScore = score ?? 0;
    const percentage = ((safeScore + 10) / 20) * 100;
    const clampedPct = Math.max(0, Math.min(100, percentage));

    const radius = 80;
    const strokeWidth = 12;
    const cx = 100;
    const cy = 95;
    const arcLength = Math.PI * radius;
    const filledLength = (clampedPct / 100) * arcLength;
    const needleAngle = -90 + (clampedPct / 100) * 180;

    let statusText = 'Neutral';
    let glowColor = '#F59E0B';

    if (safeScore > 3) { statusText = 'Bullish Signal'; glowColor = '#10B981'; }
    else if (safeScore < -3) { statusText = 'Bearish Signal'; glowColor = '#EF4444'; }

    const describeArc = (r: number) => {
        const x1 = cx - r;
        const x2 = cx + r;
        return `M ${x1} ${cy} A ${r} ${r} 0 0 1 ${x2} ${cy}`;
    };

    return (
        <div className="relative flex flex-col items-center justify-center h-full p-8 rounded-[28px] border border-white/[0.06] bg-gradient-to-b from-[#141418] to-[#0c0c0e] overflow-hidden">
            <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 80%, ${glowColor}22, transparent 70%)` }} />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-6 relative z-10">Aggregate Sentiment</span>
            <div className="relative z-10 w-[200px] h-[110px]">
                <svg viewBox="0 0 200 110" className="w-full h-full">
                    <defs>
                        <linearGradient id="gaugeGradAgg" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#F43F5E" /><stop offset="50%" stopColor="#F59E0B" /><stop offset="100%" stopColor="#10B981" />
                        </linearGradient>
                        <filter id="gaugeGlowAgg"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                    </defs>
                    <path d={describeArc(radius)} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} strokeLinecap="round" />
                    <path d={describeArc(radius)} fill="none" stroke="url(#gaugeGradAgg)" strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={`${arcLength}`} strokeDashoffset={arcLength - filledLength} filter="url(#gaugeGlowAgg)" className="transition-all duration-[1500ms] ease-out" />
                    <g transform={`rotate(${needleAngle}, ${cx}, ${cy})`} className="transition-all duration-[1500ms] ease-out">
                        <line x1={cx} y1={cy} x2={cx} y2={cy - radius + strokeWidth + 8} stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                        <circle cx={cx} cy={cy} r="5" fill={glowColor} stroke="#121214" strokeWidth="2" />
                    </g>
                </svg>
            </div>
            <div className="relative z-10 text-center -mt-1">
                <p className="text-5xl font-black text-white tracking-tighter tabular-nums">{safeScore.toFixed(1)}</p>
                <div className="mt-2 flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: glowColor }} />
                    <span className="text-sm font-bold" style={{ color: glowColor }}>{statusText}</span>
                </div>
            </div>
            <div className="flex justify-between w-full mt-4 px-2 relative z-10">
                <span className="text-[9px] font-bold text-rose-500/60">-10</span>
                <span className="text-[9px] font-bold text-zinc-600">0</span>
                <span className="text-[9px] font-bold text-emerald-500/60">+10</span>
            </div>
        </div>
    );
};

/* ─── Insight Card ─── */
const InsightCard: React.FC<{ icon: React.ReactNode; iconBg: string; title: string; content: string; accentColor: string }> = ({ icon, iconBg, title, content, accentColor }) => (
    <div className="group relative flex-1 flex flex-col p-6 md:p-7 rounded-[24px] border border-white/[0.06] bg-[#121214] overflow-hidden hover:border-white/[0.1] transition-all duration-300">
        <div className="absolute top-0 left-6 right-6 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)` }} />
        <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-white/[0.06] ${iconBg}`}>{icon}</div>
            <h4 className="text-sm font-bold text-white tracking-tight">{title}</h4>
        </div>
        <p className="text-[15px] text-zinc-400 leading-relaxed font-medium flex-grow">{content}</p>
        <div className="mt-4 pt-3 border-t border-white/[0.04] flex justify-end">
            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.15em]">Real-time analysis</span>
        </div>
    </div>
);

/* ─── Theme Card ─── */
const ThemeCard: React.FC<{ theme: NewsTheme; index: number }> = ({ theme, index }) => {
    const s = theme.sentiment_score ?? 0;
    const accentColor = s > 0 ? '#10B981' : s < 0 ? '#EF4444' : '#71717A';
    const scoreBg = s > 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : s < 0 ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-white/5 text-zinc-400 border-white/10';
    return (
        <div className="group relative p-5 rounded-[20px] border border-white/[0.06] bg-[#121214] hover:border-white/[0.12] transition-all duration-300 flex flex-col h-full overflow-hidden">
            <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: accentColor }} />
            <div className="flex justify-between items-start mb-3 pl-3">
                <h5 className="font-bold text-white text-sm leading-snug pr-3 group-hover:text-indigo-300 transition-colors">{theme.theme}</h5>
                <span className={`flex-shrink-0 px-2.5 py-1 text-[10px] font-bold rounded-lg border ${scoreBg}`}>{s > 0 ? '+' : ''}{s.toFixed(1)}</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed flex-grow pl-3">{theme.summary}</p>
        </div>
    );
};

/* ─── Source Icon Helper ─── */
const getSourceIcon = (source: string) => {
    const s = (source || '').toLowerCase();
    if (s.includes('reddit')) return <RedditIcon className="w-4 h-4 text-orange-500" />;
    if (s.includes('x') || s.includes('twitter')) return <XSocialIcon className="w-4 h-4 text-zinc-300" />;
    return <RssIcon className="w-4 h-4 text-sky-400" />;
};

const getSourceAccent = (source: string) => {
    const s = (source || '').toLowerCase();
    if (s.includes('reddit')) return { border: 'border-orange-500/20', glow: 'orange' };
    if (s.includes('x') || s.includes('twitter')) return { border: 'border-zinc-500/20', glow: 'zinc' };
    return { border: 'border-sky-500/20', glow: 'sky' };
};

/* ─── Social Post Card ─── */
const SocialPostCard: React.FC<{ post: SocialPost }> = ({ post }) => {
    const accent = getSourceAccent(post.source);
    return (
        <div className={`group relative p-5 rounded-[20px] border border-white/[0.06] bg-[#121214] hover:border-white/[0.1] transition-all duration-300 flex flex-col h-full overflow-hidden`}>
            {/* Source accent top line */}
            <div className={`absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent`} />

            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center`}>
                        {getSourceIcon(post.source)}
                    </div>
                    <div className="overflow-hidden">
                        <p className="font-bold text-xs text-white truncate">{post.author}</p>
                        <p className="text-[10px] text-zinc-600 font-medium">{post.source}</p>
                    </div>
                </div>
                <SentimentTag tag={post.sentiment} type="sentiment" />
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed line-clamp-4 font-medium">
                "{post.content}"
            </p>
        </div>
    );
};

/* ─── Sentiment Meter ─── */
const SentimentMeter: React.FC<{ posts: SocialPost[] }> = ({ posts }) => {
    const stats = useMemo(() => {
        const total = posts.length;
        if (total === 0) return { bullish: 0, bearish: 0, neutral: 0, score: 50 };
        const bullish = posts.filter(p => p.sentiment === 'Bullish').length;
        const bearish = posts.filter(p => p.sentiment === 'Bearish').length;
        const neutral = posts.filter(p => p.sentiment === 'Neutral').length;
        const score = ((bullish * 100) + (neutral * 50)) / total;
        return { bullish: (bullish / total) * 100, bearish: (bearish / total) * 100, neutral: (neutral / total) * 100, score };
    }, [posts]);

    const getScoreLabel = (score: number) => {
        if (score >= 75) return { label: 'Euphoric', color: '#10B981' };
        if (score >= 60) return { label: 'Bullish', color: '#34D399' };
        if (score >= 40) return { label: 'Neutral', color: '#71717A' };
        if (score >= 25) return { label: 'Bearish', color: '#F43F5E' };
        return { label: 'Panic', color: '#EF4444' };
    };
    const scoreInfo = getScoreLabel(stats.score);

    return (
        <div className="relative rounded-[24px] p-6 border border-white/[0.06] bg-gradient-to-b from-[#141418] to-[#0c0c0e] overflow-hidden h-full flex flex-col justify-center">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: `radial-gradient(ellipse at 70% 20%, ${scoreInfo.color}15, transparent 60%)` }} />

            <h4 className="text-[10px] font-bold text-zinc-500 mb-6 uppercase tracking-[0.2em] relative z-10">Social Sentiment</h4>

            {/* Score + Label */}
            <div className="relative z-10 mb-6">
                <div className="flex items-end justify-between mb-3">
                    <span className="text-5xl font-black text-white tracking-tighter tabular-nums leading-none">{stats.score.toFixed(0)}</span>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: scoreInfo.color }} />
                        <span className="text-sm font-bold uppercase tracking-wider" style={{ color: scoreInfo.color }}>{scoreInfo.label}</span>
                    </div>
                </div>

                {/* Gradient bar */}
                <div className="relative h-3 w-full rounded-full overflow-hidden bg-white/[0.06]">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500 opacity-20" />
                    <div
                        className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500 transition-all duration-1000 ease-out"
                        style={{ width: `${stats.score}%` }}
                    />
                    {/* Indicator tick */}
                    <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_6px_rgba(255,255,255,0.5)] z-10 transition-all duration-1000 ease-out" style={{ left: `${stats.score}%` }} />
                </div>
                <div className="flex justify-between mt-2 text-[9px] font-bold text-zinc-600 uppercase tracking-[0.15em]">
                    <span>Bearish</span><span>Neutral</span><span>Bullish</span>
                </div>
            </div>

            {/* Breakdown chips */}
            <div className="grid grid-cols-3 gap-2 relative z-10 mt-auto">
                {[
                    { label: 'Bullish', value: stats.bullish, color: '#10B981', bg: 'bg-emerald-500/[0.08]', border: 'border-emerald-500/15' },
                    { label: 'Neutral', value: stats.neutral, color: '#71717A', bg: 'bg-white/[0.03]', border: 'border-white/[0.06]' },
                    { label: 'Bearish', value: stats.bearish, color: '#F43F5E', bg: 'bg-rose-500/[0.08]', border: 'border-rose-500/15' },
                ].map(item => (
                    <div key={item.label} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl ${item.bg} border ${item.border}`}>
                        <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: item.color, opacity: 0.7 }}>{item.label}</span>
                        <span className="text-xl font-black tabular-nums" style={{ color: item.color }}>{item.value.toFixed(0)}%</span>
                        <div className="h-1 w-full rounded-full overflow-hidden" style={{ backgroundColor: `${item.color}15` }}>
                            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ─── Main Component ─── */
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
        <div className="space-y-10 animate-fade-in pb-12">

            {/* Sentiment Gauges & Summary */}
            {mode === 'full' && (
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <SentimentScoreGauge score={newsAnalysis?.overall_sentiment_score || 0} />
                    </div>
                    <div className="lg:col-span-2 flex flex-col gap-5">
                        <InsightCard
                            icon={<InfoIcon className="w-5 h-5 text-indigo-400" />}
                            iconBg="bg-indigo-500/10"
                            title="AI Sentiment Summary"
                            content={newsAnalysis?.sentiment_summary || marketSentiment?.community_sentiment_summary || ''}
                            accentColor="#6366F1"
                        />
                        <InsightCard
                            icon={<RationaleIcon className="w-5 h-5 text-emerald-400" />}
                            iconBg="bg-emerald-500/10"
                            title="Market Impact"
                            content={newsAnalysis?.market_impact_summary || marketSentiment?.market_impact_summary || ''}
                            accentColor="#10B981"
                        />
                    </div>
                </section>
            )}

            {/* Key Themes */}
            {mode === 'full' && newsAnalysis?.key_themes && newsAnalysis.key_themes.length > 0 && (
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                            <SparklesIcon className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white tracking-tight">Key Themes</h3>
                            <p className="text-[11px] text-zinc-500 font-medium">Driving market sentiment</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {newsAnalysis.key_themes.map((theme, index) => (
                            <ThemeCard key={index} theme={theme} index={index} />
                        ))}
                    </div>
                </section>
            )}

            {/* Community Pulse */}
            <section>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                            <RssIcon className="w-5 h-5 text-rose-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white tracking-tight">Community Pulse</h3>
                            <p className="text-[11px] text-zinc-500 font-medium">Social media sentiment signals</p>
                        </div>
                    </div>

                    {/* Source filter */}
                    <div className="flex bg-white/[0.03] p-1 rounded-xl border border-white/[0.06]">
                        {sources.map(source => (
                            <button
                                key={source}
                                onClick={() => setActiveSource(source)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                                    activeSource === source
                                    ? 'bg-white/[0.08] text-white shadow-sm'
                                    : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                            >
                                {source}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className="lg:col-span-1 h-full min-h-[300px]">
                        <SentimentMeter posts={filteredPosts} />
                    </div>
                    <div className="lg:col-span-2">
                        {filteredPosts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                                {filteredPosts.slice(0, 6).map((post, index) => (
                                    <SocialPostCard key={index} post={post} />
                                ))}
                            </div>
                        ) : (
                            <div className="h-full min-h-[200px] flex items-center justify-center p-8 rounded-[20px] border border-dashed border-white/10 bg-white/[0.02]">
                                <p className="text-zinc-500 font-medium">No social signals detected for "{activeSource}".</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Detailed Breakdown */}
            {mode === 'full' && newsBreakdown && (
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                            <NewspaperIcon className="w-5 h-5 text-violet-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white tracking-tight">Sentiment Breakdown</h3>
                            <p className="text-[11px] text-zinc-500 font-medium">Categorized by polarity</p>
                        </div>
                    </div>
                    <div className="rounded-[24px] border border-white/[0.06] bg-[#121214] overflow-hidden">
                        <NewsSentimentBreakdown data={newsBreakdown} />
                    </div>
                </section>
            )}
        </div>
    );
};

export default SentimentAnalysisTab;
