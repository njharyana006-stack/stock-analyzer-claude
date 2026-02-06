
import React from 'react';
import type { ExpertOpinions } from '../../types';
import SentimentTag from '../SentimentTag';
import RatingsChart from '../charts/RatingsChart';
import { RatingsIcon, GrowthIcon, ValuationIcon, TechnologyIcon, CompetitionIcon, MacroIcon, RationaleIcon, UserIcon, ChartIcon, TargetIcon, BotIcon, SparklesIcon } from '../icons';
import RecentAnalystActions from '../RecentAnalystActions';
import ExpertTargetPrice from '../ExpertTargetPrice';

interface ExpertOpinionsTabProps {
    opinions: ExpertOpinions;
    currentPrice: number;
}

const LastUpdated: React.FC = () => (
    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-white/5 flex justify-end">
        <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-wider">
            Updated: Today
        </span>
    </div>
);

const SectionHeader: React.FC<{ title: string; icon: React.ReactNode; color?: string }> = ({ title, icon, color = 'indigo' }) => {
    const colorClasses = {
        indigo: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20',
        emerald: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20',
        rose: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20',
        sky: 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-100 dark:border-sky-500/20',
    };
    const style = colorClasses[color as keyof typeof colorClasses] || colorClasses.indigo;

    return (
        <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${style}`}>
                {icon}
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h2>
        </div>
    );
};

const getThemeIcon = (iconName?: string) => {
    const props = { className: "w-5 h-5" };
    switch (iconName) {
        case 'Growth': return <GrowthIcon {...props} className="w-5 h-5 text-emerald-500" />;
        case 'Valuation': return <ValuationIcon {...props} className="w-5 h-5 text-amber-500" />;
        case 'Technology': return <TechnologyIcon {...props} className="w-5 h-5 text-sky-500" />;
        case 'Competition': return <CompetitionIcon {...props} className="w-5 h-5 text-rose-500" />;
        case 'Macro': return <MacroIcon {...props} className="w-5 h-5 text-slate-500" />;
        default: return <RationaleIcon {...props} className="w-5 h-5 text-indigo-500" />;
    }
};

const ConsensusCard: React.FC<{ title: string; summary: string; tag: string; icon: string }> = ({ title, summary, tag, icon }) => (
    <div className="p-6 h-full flex flex-col transition-all hover:border-indigo-200 dark:hover:border-indigo-500/30 group shadow-sm bg-white dark:bg-[#121214] border border-slate-200 dark:border-white/5 rounded-[24px]">
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-center flex-shrink-0 shadow-sm">
                    {getThemeIcon(icon)}
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{title}</h4>
            </div>
            <SentimentTag tag={tag} type="consensus" />
        </div>
        <p className="text-sm font-medium text-slate-600 dark:text-zinc-400 leading-relaxed flex-grow">
            {summary}
        </p>
    </div>
);

const ExpertOpinionsTab: React.FC<ExpertOpinionsTabProps> = ({ opinions, currentPrice }) => {
    return (
        <div className="space-y-10 animate-fade-in pb-12">
            
            {/* Price Targets Section */}
            {opinions.price_targets && (
                <section className="bg-white dark:bg-[#121214] border border-slate-200 dark:border-white/5 rounded-[24px] shadow-sm overflow-hidden">
                    <ExpertTargetPrice targets={opinions.price_targets} currentPrice={currentPrice} />
                </section>
            )}

            {/* Wall Street Consensus */}
            <section>
                <SectionHeader title="Wall Street Consensus" icon={<UserIcon className="w-5 h-5" />} color="indigo" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {opinions.wall_street_consensus?.map((item, index) => (
                        <ConsensusCard 
                            key={index} 
                            title={item.title} 
                            summary={item.summary} 
                            tag={item.consensus_tag} 
                            icon={item.theme_icon} 
                        />
                    ))}
                </div>
            </section>

            {/* Analyst Ratings & Actions */}
            <section>
                <SectionHeader title="Analyst Ratings & Actions" icon={<RatingsIcon className="w-5 h-5" />} color="emerald" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Ratings Chart Card */}
                    <div className="p-6 bg-white dark:bg-[#121214] flex flex-col h-full shadow-sm border border-slate-200 dark:border-white/5 rounded-[24px]">
                        <div className="mb-6 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wide">
                                Ratings Distribution
                            </h3>
                            <div className="p-1.5 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5">
                                <ChartIcon className="w-4 h-4 text-slate-400" />
                            </div>
                        </div>
                        <div className="flex-grow flex items-center min-h-[200px]">
                            <RatingsChart data={opinions.analyst_ratings_breakdown} />
                        </div>
                        <LastUpdated />
                    </div>

                    {/* Recent Actions Card */}
                    <div className="p-6 bg-white dark:bg-[#121214] flex flex-col h-full shadow-sm border border-slate-200 dark:border-white/5 rounded-[24px]">
                        <div className="mb-6 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wide">
                                Recent Firm Actions
                            </h3>
                            <div className="p-1.5 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5">
                                <TargetIcon className="w-4 h-4 text-slate-400" />
                            </div>
                        </div>
                        <div className="flex-grow overflow-hidden min-h-[200px]">
                            <RecentAnalystActions actions={opinions.recent_analyst_actions} />
                        </div>
                        <LastUpdated />
                    </div>
                </div>
            </section>

            {/* Expert Verdict Summary (Replaces redundant News Breakdown) */}
            {opinions.expert_insights_summary && (
                <section>
                    <SectionHeader title="Institutional Verdict" icon={<BotIcon className="w-5 h-5" />} color="sky" />
                    <div className="p-8 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-500/10 dark:to-[#121214] border border-indigo-100 dark:border-indigo-500/20 rounded-[24px] shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none"></div>
                        <div className="relative z-10">
                            <h4 className="text-base font-bold text-indigo-800 dark:text-indigo-300 mb-4 flex items-center">
                                <SparklesIcon className="w-4 h-4 mr-2" />
                                AI Synthesis of Analyst Sentiment
                            </h4>
                            <p className="text-base md:text-lg text-slate-700 dark:text-zinc-300 leading-relaxed font-medium">
                                {opinions.expert_insights_summary}
                            </p>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default ExpertOpinionsTab;
