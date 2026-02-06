
import React, { useState } from 'react';
import type { AnalysisResponse } from '../types';
import { SparklesIcon, CheckCircleIcon, ExclamationTriangleIcon, ChevronDownIcon, ChevronUpIcon } from './icons';

interface AnalysisSummaryProps {
    analysis: AnalysisResponse;
}

const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({ analysis }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { individual_analysis, overview } = analysis;
    
    if (!individual_analysis?.investment_rationale) return null;
    
    const { investment_thesis } = individual_analysis.investment_rationale;
    const { strengths, weaknesses } = individual_analysis;
    const { confidence_score } = overview;

    const getConfidenceStyle = (score: number) => {
        if (score >= 8) return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30';
        if (score >= 5) return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30';
        return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30';
    };

    return (
        <div className="g-card overflow-hidden shadow-sm transition-all duration-300">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-500/10 dark:to-transparent">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
                        <SparklesIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Investment Thesis</h3>
                </div>

                {typeof confidence_score === 'number' && (
                    <div className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 ${getConfidenceStyle(confidence_score)}`}>
                        <span className="uppercase tracking-wider opacity-75">Confidence</span>
                        <span className="text-sm">{confidence_score}/10</span>
                    </div>
                )}
            </div>
            
            <div className="p-6 md:p-8">
                {/* Thesis Text - Clamped if not expanded */}
                <div className="relative">
                     <p className={`text-base text-slate-700 dark:text-zinc-300 leading-relaxed font-medium border-l-2 border-indigo-500 pl-4 transition-all duration-500 ${!isExpanded ? 'line-clamp-3' : ''}`}>
                        {investment_thesis}
                    </p>
                    {/* Fade out effect when collapsed */}
                    {!isExpanded && (
                        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white dark:from-[#121214] to-transparent"></div>
                    )}
                </div>

                {/* Toggle Button */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 mt-4 transition-colors group"
                >
                    <span>{isExpanded ? 'Hide detailed analysis' : 'Show detailed analysis'}</span>
                    {isExpanded ? (
                        <ChevronUpIcon className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                    ) : (
                        <ChevronDownIcon className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                    )}
                </button>

                {/* Expandable Content (Strengths & Risks) */}
                <div
                    className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-500 ease-in-out overflow-hidden ${
                        isExpanded ? 'max-h-[1000px] opacity-100 mt-8' : 'max-h-0 opacity-0 mt-0'
                    }`}
                >
                    {/* Key Strengths Column */}
                    <div className="flex-1 p-5 bg-emerald-50 dark:bg-[#18181B] rounded-[20px] border border-emerald-100 dark:border-white/5 hover:border-emerald-300 dark:hover:border-emerald-500/20 transition-colors">
                        <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-4 flex items-center">
                            <CheckCircleIcon className="w-4 h-4 mr-2" /> Key Strengths
                        </h4>
                        <ul className="space-y-3">
                            {strengths.map((str, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-zinc-300">
                                    <div className="mt-0.5 p-0.5 bg-emerald-200 dark:bg-emerald-500/10 rounded-full">
                                        <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-500" />
                                    </div>
                                    <span className="leading-relaxed">{str}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Key Risks Column */}
                    <div className="flex-1 p-5 bg-rose-50 dark:bg-[#18181B] rounded-[20px] border border-rose-100 dark:border-white/5 hover:border-rose-300 dark:hover:border-rose-500/20 transition-colors">
                        <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-4 flex items-center">
                            <ExclamationTriangleIcon className="w-4 h-4 mr-2" /> Key Risks
                        </h4>
                        <ul className="space-y-3">
                            {weaknesses.map((wk, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-zinc-300">
                                    <div className="mt-0.5 p-0.5 bg-rose-200 dark:bg-rose-500/10 rounded-full">
                                        <ExclamationTriangleIcon className="w-3.5 h-3.5 text-rose-700 dark:text-rose-500" />
                                    </div>
                                    <span className="leading-relaxed">{wk}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisSummary;
