
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

/* ─── Section Header ─── */
const SectionHeader: React.FC<{ title: string; subtitle?: string; icon: React.ReactNode; accentColor: string }> = ({ title, subtitle, icon, accentColor }) => (
    <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/[0.06]" style={{ backgroundColor: `${accentColor}15` }}>
            {icon}
        </div>
        <div>
            <h2 className="text-lg font-black text-white tracking-tight">{title}</h2>
            {subtitle && <p className="text-[11px] text-zinc-500 font-medium">{subtitle}</p>}
        </div>
    </div>
);

/* ─── Theme Icon Mapper ─── */
const getThemeIcon = (iconName?: string) => {
    switch (iconName) {
        case 'Growth': return <GrowthIcon className="w-5 h-5 text-emerald-400" />;
        case 'Valuation': return <ValuationIcon className="w-5 h-5 text-amber-400" />;
        case 'Technology': return <TechnologyIcon className="w-5 h-5 text-sky-400" />;
        case 'Competition': return <CompetitionIcon className="w-5 h-5 text-rose-400" />;
        case 'Macro': return <MacroIcon className="w-5 h-5 text-zinc-400" />;
        default: return <RationaleIcon className="w-5 h-5 text-indigo-400" />;
    }
};

const getThemeAccent = (iconName?: string) => {
    switch (iconName) {
        case 'Growth': return '#10B981';
        case 'Valuation': return '#F59E0B';
        case 'Technology': return '#38BDF8';
        case 'Competition': return '#F43F5E';
        case 'Macro': return '#71717A';
        default: return '#6366F1';
    }
};

/* ─── Consensus Card ─── */
const ConsensusCard: React.FC<{ title: string; summary: string; tag: string; icon: string }> = ({ title, summary, tag, icon }) => {
    const accent = getThemeAccent(icon);
    return (
        <div className="group relative p-6 h-full flex flex-col rounded-[20px] border border-white/[0.06] bg-[#121214] overflow-hidden hover:border-white/[0.12] transition-all duration-300">
            {/* Left accent */}
            <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: accent }} />

            <div className="flex justify-between items-start mb-4 pl-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl border border-white/[0.06] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${accent}12` }}>
                        {getThemeIcon(icon)}
                    </div>
                    <h4 className="font-bold text-sm text-white leading-tight group-hover:text-indigo-300 transition-colors">{title}</h4>
                </div>
                <SentimentTag tag={tag} type="consensus" />
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed flex-grow pl-3">{summary}</p>
        </div>
    );
};

/* ─── Main Component ─── */
const ExpertOpinionsTab: React.FC<ExpertOpinionsTabProps> = ({ opinions, currentPrice }) => {
    return (
        <div className="space-y-10 animate-fade-in pb-12">

            {/* Price Targets */}
            {opinions.price_targets && (
                <section className="rounded-[24px] border border-white/[0.06] bg-gradient-to-b from-[#141418] to-[#0c0c0e] overflow-hidden">
                    <ExpertTargetPrice targets={opinions.price_targets} currentPrice={currentPrice} />
                </section>
            )}

            {/* Wall Street Consensus */}
            <section>
                <SectionHeader
                    title="Wall Street Consensus"
                    subtitle="Key investment themes from analysts"
                    icon={<UserIcon className="w-5 h-5 text-indigo-400" />}
                    accentColor="#6366F1"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <SectionHeader
                    title="Analyst Ratings & Actions"
                    subtitle="Distribution and recent firm activity"
                    icon={<RatingsIcon className="w-5 h-5 text-emerald-400" />}
                    accentColor="#10B981"
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Ratings Chart Card */}
                    <div className="p-6 rounded-[24px] border border-white/[0.06] bg-[#121214] flex flex-col h-full overflow-hidden">
                        <div className="mb-6 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">
                                Ratings Distribution
                            </h3>
                            <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                                <ChartIcon className="w-4 h-4 text-zinc-500" />
                            </div>
                        </div>
                        <div className="flex-grow flex items-center min-h-[200px]">
                            <RatingsChart data={opinions.analyst_ratings_breakdown} />
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/[0.04] flex justify-end">
                            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.15em]">Updated today</span>
                        </div>
                    </div>

                    {/* Recent Actions Card */}
                    <div className="p-6 rounded-[24px] border border-white/[0.06] bg-[#121214] flex flex-col h-full overflow-hidden">
                        <div className="mb-6 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">
                                Recent Firm Actions
                            </h3>
                            <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                                <TargetIcon className="w-4 h-4 text-zinc-500" />
                            </div>
                        </div>
                        <div className="flex-grow overflow-hidden min-h-[200px]">
                            <RecentAnalystActions actions={opinions.recent_analyst_actions} />
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/[0.04] flex justify-end">
                            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.15em]">Updated today</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Expert Verdict */}
            {opinions.expert_insights_summary && (
                <section>
                    <SectionHeader
                        title="Institutional Verdict"
                        subtitle="AI synthesis of analyst sentiment"
                        icon={<BotIcon className="w-5 h-5 text-sky-400" />}
                        accentColor="#38BDF8"
                    />
                    <div className="relative p-8 rounded-[24px] border border-white/[0.06] bg-gradient-to-br from-[#141418] to-[#0c0c0e] overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] pointer-events-none bg-indigo-500/10" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-[60px] pointer-events-none bg-sky-500/10" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <SparklesIcon className="w-4 h-4 text-indigo-400" />
                                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">AI-Powered Synthesis</span>
                            </div>
                            <p className="text-base md:text-lg text-zinc-300 leading-relaxed font-medium">
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
