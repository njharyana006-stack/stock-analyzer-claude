
import React, { useState } from 'react';
import type { AnalysisResponse } from '../../types';
import { RationaleIcon, SparklesIcon, StrategyIcon, StrengthsIcon, QuadFactorIcon, FinancialsIcon, ChevronDownIcon, ChevronUpIcon } from '../icons';
import TechnicalIndicators from './individual_analysis/TechnicalIndicators';
import FinancialSnapshot from './individual_analysis/FinancialSnapshot';
import StrengthsAndWeaknesses from './individual_analysis/StrengthsAndWeaknesses';
import AITradeStrategy from './individual_analysis/AITradeStrategy';
import InvestmentRationale from './individual_analysis/InvestmentRationale';
import QuadFactorScores from './individual_analysis/QuadFactorScores';
import TradeStrategyRationale from './individual_analysis/TradeStrategyRationale';

interface IndividualAnalysisTabProps {
    analysis: AnalysisResponse;
}

const CollapsibleSection: React.FC<{
    title: string;
    icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
    children: React.ReactNode;
    defaultOpen?: boolean;
    className?: string;
    iconColor?: string;
}> = ({ title, icon, children, defaultOpen = true, className, iconColor = 'indigo' }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const colors = {
        indigo: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20',
        emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20',
        rose: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20',
        amber: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20',
    };
    const style = colors[iconColor as keyof typeof colors] || colors.indigo;

    return (
        <div className={`w-full ${className || ''}`}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 bg-white dark:bg-[#121214] border border-slate-200 dark:border-white/5 rounded-[24px] shadow-sm hover:shadow-md transition-all group z-10 relative"
            >
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm transition-transform group-hover:scale-105 ${style}`}>
                        {React.cloneElement(icon, { className: "w-6 h-6" })}
                    </div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight text-left">{title}</h2>
                </div>
                <div className={`p-2 rounded-full bg-slate-100 dark:bg-white/5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDownIcon className="w-5 h-5" />
                </div>
            </button>

            <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[3000px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0 overflow-hidden'}`}>
                {children}
            </div>
        </div>
    );
};

const IndividualAnalysisTab: React.FC<IndividualAnalysisTabProps> = ({ analysis }) => {
    return (
        <div className="pb-12">
            
            <div className="flex flex-col gap-8">
                {/* 1. Financial Overview */}
                <CollapsibleSection title="Financial Health" icon={<FinancialsIcon />} iconColor="emerald">
                    <div className="bg-white dark:bg-[#121214] p-6 md:p-8 rounded-[24px] border border-slate-200 dark:border-white/5 shadow-sm">
                        {analysis.individual_analysis.financial_highlights && (
                            <FinancialSnapshot financials={analysis.individual_analysis.financial_highlights} />
                        )}
                    </div>
                </CollapsibleSection>

                {/* 2. AI Scores */}
                <CollapsibleSection title="Performance Ratings" icon={<QuadFactorIcon />} iconColor="indigo">
                    <div className="bg-white dark:bg-[#121214] p-6 md:p-8 rounded-[24px] border border-slate-200 dark:border-white/5 shadow-sm">
                        {analysis.individual_analysis.quad_factor_scores && (
                            <QuadFactorScores 
                                scores={analysis.individual_analysis.quad_factor_scores} 
                                rationale={analysis.individual_analysis.quad_factor_score_rationale}
                            />
                        )}
                    </div>
                </CollapsibleSection>

                {/* 3. Strengths & Weaknesses */}
                {(analysis.individual_analysis.strengths?.length > 0 || analysis.individual_analysis.weaknesses?.length > 0) && (
                    <CollapsibleSection title="SWOT Analysis" icon={<StrengthsIcon />} iconColor="amber">
                        <StrengthsAndWeaknesses 
                            strengths={analysis.individual_analysis.strengths} 
                            weaknesses={analysis.individual_analysis.weaknesses} 
                        />
                    </CollapsibleSection>
                )}

                {/* 4. Technical Analysis */}
                {analysis.individual_analysis.key_levels && (
                    <CollapsibleSection title="Technical Deep Dive" icon={<SparklesIcon />} iconColor="indigo">
                        <div className="bg-white dark:bg-[#121214] p-6 md:p-8 rounded-[24px] border border-slate-200 dark:border-white/5 shadow-sm">
                            <TechnicalIndicators 
                                keyLevels={analysis.individual_analysis.key_levels}
                                interpretation={analysis.individual_analysis.technical_interpretation}
                            />
                        </div>
                    </CollapsibleSection>
                )}
                
                {/* 5. Investment Rationale - Rendered directly, no collapse */}
                {analysis.individual_analysis.investment_rationale && (
                    <div className="w-full">
                        <InvestmentRationale rationale={analysis.individual_analysis.investment_rationale} userRisk={analysis.user_risk} />
                    </div>
                )}
                
                {/* 6. Trade Strategy */}
                {analysis.individual_analysis.trade_strategy && (
                    <CollapsibleSection title="AI Execution Strategy" icon={<StrategyIcon />} iconColor="rose">
                        <div className="bg-white dark:bg-[#121214] p-6 md:p-8 rounded-[24px] border border-slate-200 dark:border-white/5 shadow-sm">
                            <div className="space-y-10">
                                <AITradeStrategy strategy={analysis.individual_analysis.trade_strategy} currentPrice={analysis.overview.current_price} />
                                {analysis.individual_analysis.trade_strategy?.reasoning && (
                                    <div className="pt-8 border-t border-slate-100 dark:border-white/5">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                                            <RationaleIcon className="w-5 h-5 mr-3 text-indigo-500" />
                                            Strategy Rationale
                                        </h3>
                                        <TradeStrategyRationale reasoning={analysis.individual_analysis.trade_strategy.reasoning} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </CollapsibleSection>
                )}
            </div>
        </div>
    );
};

export default IndividualAnalysisTab;
