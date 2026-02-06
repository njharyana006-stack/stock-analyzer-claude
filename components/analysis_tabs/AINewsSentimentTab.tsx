
import React from 'react';
import type { NewsSentimentAnalysis, NewsTheme, NewsSentimentBreakdown as NewsSentimentBreakdownType } from '../../types';
import { InfoIcon, SparklesIcon, RationaleIcon, NewspaperIcon } from '../icons';
import NewsSentimentBreakdown from './NewsSentimentBreakdown';

const LastUpdated: React.FC = () => (
    <div className="mt-auto pt-3 flex justify-end border-t border-slate-100 dark:border-white/5">
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
        <div className="p-8 flex flex-col items-center justify-center h-full transition-all duration-300 hover:shadow-lg bg-white dark:bg-[#121214] border border-slate-200 dark:border-white/5 rounded-[24px] shadow-sm">
            <h4 className="text-xs font-bold text-slate-500 dark:text-zinc-400 mb-6 uppercase tracking-widest">Sentiment Score</h4>
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

interface AINewsSentimentTabProps {
  analysis: NewsSentimentAnalysis;
  breakdown?: NewsSentimentBreakdownType;
}

const AINewsSentimentTab: React.FC<AINewsSentimentTabProps> = ({ analysis, breakdown }) => {
    if (!analysis) {
        return <div className="p-8 text-center text-slate-500 dark:text-zinc-500 bg-white dark:bg-[#121214] rounded-[24px] border border-dashed border-slate-200 dark:border-white/10">AI News & Sentiment analysis is not available.</div>;
    }

    return (
        <div className="space-y-12 pb-12 animate-fade-in">
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <SentimentScoreGauge score={analysis.overall_sentiment_score} />
                </div>
                <div className="lg:col-span-2 space-y-6 flex flex-col">
                    <div className="p-6 md:p-8 flex-1 flex flex-col justify-center hover:shadow-md transition-shadow bg-white dark:bg-[#121214] border border-slate-200 dark:border-white/5 rounded-[24px] shadow-sm">
                         <div className="flex items-center mb-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mr-3 text-indigo-500 border border-indigo-100 dark:border-indigo-500/20">
                                <InfoIcon className="w-5 h-5" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Sentiment Summary</h4>
                        </div>
                        <p className="text-base text-slate-700 dark:text-zinc-300 leading-relaxed font-medium">{analysis.sentiment_summary}</p>
                        <LastUpdated />
                    </div>
                     <div className="p-6 md:p-8 flex-1 flex flex-col justify-center hover:shadow-md transition-shadow bg-white dark:bg-[#121214] border border-slate-200 dark:border-white/5 rounded-[24px] shadow-sm">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mr-3 text-emerald-500 border border-emerald-100 dark:border-emerald-500/20">
                                <RationaleIcon className="w-5 h-5" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Market Impact Summary</h4>
                        </div>
                        <p className="text-base text-slate-700 dark:text-zinc-300 leading-relaxed font-medium">{analysis.market_impact_summary}</p>
                        <LastUpdated />
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-black mb-6 flex items-center text-slate-900 dark:text-white tracking-tight">
                    <SparklesIcon className="w-6 h-6 mr-3 text-indigo-500" /> Key Themes Driving Sentiment
                </h3>
                {analysis.key_themes && analysis.key_themes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {analysis.key_themes.map((theme, index) => (
                            <ThemeCard key={index} theme={theme} />
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center text-slate-500 dark:text-zinc-500 border border-dashed border-slate-200 dark:border-white/10 rounded-[24px] bg-white/50 dark:bg-white/5">
                        No specific themes identified in current news cycle.
                    </div>
                )}
            </section>

            {breakdown && (
                <section>
                    <h3 className="text-xl font-black mb-6 flex items-center text-slate-900 dark:text-white tracking-tight">
                        <NewspaperIcon className="w-6 h-6 mr-3 text-indigo-500" /> Detailed News Breakdown
                    </h3>
                    <div className="overflow-hidden bg-white dark:bg-[#121214] shadow-sm border border-slate-200 dark:border-white/5 rounded-[24px]">
                        <NewsSentimentBreakdown data={breakdown} />
                        <div className="px-8 pb-6">
                            <LastUpdated />
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default AINewsSentimentTab;
