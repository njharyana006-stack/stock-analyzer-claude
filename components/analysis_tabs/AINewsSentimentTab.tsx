
import React from 'react';
import type { NewsSentimentAnalysis, NewsTheme, NewsSentimentBreakdown as NewsSentimentBreakdownType } from '../../types';
import { InfoIcon, SparklesIcon, RationaleIcon, NewspaperIcon } from '../icons';
import NewsSentimentBreakdown from './NewsSentimentBreakdown';

/* ─── Premium SVG Sentiment Gauge ─── */
const SentimentScoreGauge: React.FC<{ score: number }> = ({ score }) => {
    const safeScore = score ?? 0;
    const percentage = ((safeScore + 10) / 20) * 100;
    const clampedPct = Math.max(0, Math.min(100, percentage));

    // SVG arc math
    const radius = 80;
    const strokeWidth = 12;
    const cx = 100;
    const cy = 95;
    const startAngle = Math.PI;
    const endAngle = 0;
    const arcLength = Math.PI * radius;
    const filledLength = (clampedPct / 100) * arcLength;

    // Needle angle: -90 deg (left) to +90 deg (right)
    const needleAngle = -90 + (clampedPct / 100) * 180;

    let statusText = 'Neutral';
    let glowColor = '#F59E0B';
    let gradId = 'gaugeNeutral';

    if (safeScore > 3) {
        statusText = 'Bullish Signal';
        glowColor = '#10B981';
        gradId = 'gaugeBull';
    } else if (safeScore < -3) {
        statusText = 'Bearish Signal';
        glowColor = '#EF4444';
        gradId = 'gaugeBear';
    }

    const describeArc = (r: number) => {
        const x1 = cx - r;
        const y1 = cy;
        const x2 = cx + r;
        return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y1}`;
    };

    return (
        <div className="relative flex flex-col items-center justify-center h-full p-8 rounded-[28px] border border-white/[0.06] bg-gradient-to-b from-[#141418] to-[#0c0c0e] overflow-hidden group">
            {/* Ambient glow */}
            <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 80%, ${glowColor}22, transparent 70%)` }} />

            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-6 relative z-10">Sentiment Score</span>

            <div className="relative z-10 w-[200px] h-[110px]">
                <svg viewBox="0 0 200 110" className="w-full h-full">
                    <defs>
                        <linearGradient id="gaugeBull" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#F43F5E" />
                            <stop offset="50%" stopColor="#F59E0B" />
                            <stop offset="100%" stopColor="#10B981" />
                        </linearGradient>
                        <linearGradient id="gaugeBear" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#F43F5E" />
                            <stop offset="50%" stopColor="#F59E0B" />
                            <stop offset="100%" stopColor="#10B981" />
                        </linearGradient>
                        <linearGradient id="gaugeNeutral" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#F43F5E" />
                            <stop offset="50%" stopColor="#F59E0B" />
                            <stop offset="100%" stopColor="#10B981" />
                        </linearGradient>
                        <filter id="gaugeGlow">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Background track */}
                    <path d={describeArc(radius)} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} strokeLinecap="round" />

                    {/* Filled arc */}
                    <path
                        d={describeArc(radius)}
                        fill="none"
                        stroke={`url(#${gradId})`}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={`${arcLength}`}
                        strokeDashoffset={arcLength - filledLength}
                        filter="url(#gaugeGlow)"
                        className="transition-all duration-[1500ms] ease-out"
                    />

                    {/* Needle */}
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

            {/* Scale labels */}
            <div className="flex justify-between w-full mt-4 px-2 relative z-10">
                <span className="text-[9px] font-bold text-rose-500/60">-10</span>
                <span className="text-[9px] font-bold text-zinc-600">0</span>
                <span className="text-[9px] font-bold text-emerald-500/60">+10</span>
            </div>
        </div>
    );
};

/* ─── Insight Card (Summary / Impact) ─── */
const InsightCard: React.FC<{
    icon: React.ReactNode;
    iconBg: string;
    title: string;
    content: string;
    accentColor: string;
}> = ({ icon, iconBg, title, content, accentColor }) => (
    <div className="group relative flex-1 flex flex-col p-6 md:p-7 rounded-[24px] border border-white/[0.06] bg-[#121214] overflow-hidden hover:border-white/[0.1] transition-all duration-300">
        {/* Top accent line */}
        <div className="absolute top-0 left-6 right-6 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)` }} />

        <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-white/[0.06] ${iconBg}`}>
                {icon}
            </div>
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
    const sentimentScore = theme.sentiment_score ?? 0;
    const isPositive = sentimentScore > 0;
    const isNegative = sentimentScore < 0;
    const accentColor = isPositive ? '#10B981' : isNegative ? '#EF4444' : '#71717A';
    const scoreBg = isPositive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : isNegative ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-white/5 text-zinc-400 border-white/10';

    return (
        <div
            className="group relative p-5 rounded-[20px] border border-white/[0.06] bg-[#121214] hover:border-white/[0.12] transition-all duration-300 flex flex-col h-full overflow-hidden"
            style={{ animationDelay: `${index * 80}ms` }}
        >
            {/* Left accent bar */}
            <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: accentColor }} />

            <div className="flex justify-between items-start mb-3 pl-3">
                <h5 className="font-bold text-white text-sm leading-snug pr-3 group-hover:text-indigo-300 transition-colors">{theme.theme}</h5>
                <span className={`flex-shrink-0 px-2.5 py-1 text-[10px] font-bold rounded-lg border ${scoreBg}`}>
                    {sentimentScore > 0 ? '+' : ''}{sentimentScore.toFixed(1)}
                </span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed flex-grow pl-3">{theme.summary}</p>
        </div>
    );
};

/* ─── Main Component ─── */
interface AINewsSentimentTabProps {
    analysis: NewsSentimentAnalysis;
    breakdown?: NewsSentimentBreakdownType;
}

const AINewsSentimentTab: React.FC<AINewsSentimentTabProps> = ({ analysis, breakdown }) => {
    if (!analysis) {
        return (
            <div className="p-12 text-center text-zinc-500 rounded-[24px] border border-dashed border-white/10 bg-white/[0.02]">
                <SparklesIcon className="w-8 h-8 mx-auto mb-3 text-zinc-600" />
                <p className="font-medium">AI News & Sentiment analysis is not available.</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-12 animate-fade-in">
            {/* Gauge + Summaries */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <SentimentScoreGauge score={analysis.overall_sentiment_score} />
                </div>
                <div className="lg:col-span-2 flex flex-col gap-5">
                    <InsightCard
                        icon={<InfoIcon className="w-5 h-5 text-indigo-400" />}
                        iconBg="bg-indigo-500/10"
                        title="Sentiment Summary"
                        content={analysis.sentiment_summary}
                        accentColor="#6366F1"
                    />
                    <InsightCard
                        icon={<RationaleIcon className="w-5 h-5 text-emerald-400" />}
                        iconBg="bg-emerald-500/10"
                        title="Market Impact Summary"
                        content={analysis.market_impact_summary}
                        accentColor="#10B981"
                    />
                </div>
            </section>

            {/* Key Themes */}
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
                {analysis.key_themes && analysis.key_themes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {analysis.key_themes.map((theme, index) => (
                            <ThemeCard key={index} theme={theme} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="p-10 text-center text-zinc-600 border border-dashed border-white/10 rounded-[20px] bg-white/[0.02]">
                        No specific themes identified in current news cycle.
                    </div>
                )}
            </section>

            {/* Detailed Breakdown */}
            {breakdown && (
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                            <NewspaperIcon className="w-5 h-5 text-violet-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white tracking-tight">Detailed News Breakdown</h3>
                            <p className="text-[11px] text-zinc-500 font-medium">Categorized by sentiment polarity</p>
                        </div>
                    </div>
                    <div className="rounded-[24px] border border-white/[0.06] bg-[#121214] overflow-hidden">
                        <NewsSentimentBreakdown data={breakdown} />
                    </div>
                </section>
            )}
        </div>
    );
};

export default AINewsSentimentTab;
