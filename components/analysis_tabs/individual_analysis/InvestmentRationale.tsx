
import React from 'react';
import type { IndividualAnalysis, RiskProfile } from '../../../types';
import { RationaleIcon, CheckCircleIcon, XCircleIcon, ShieldIcon, ScaleIcon } from '../../icons';
import RiskProfileFit from '../RiskProfileFit';

interface InvestmentRationaleProps {
    rationale: IndividualAnalysis['investment_rationale'];
    userRisk: RiskProfile;
}

const InvestmentRationale: React.FC<InvestmentRationaleProps> = ({ rationale, userRisk }) => {
    if (!rationale) {
        return <div className="text-slate-500 p-4">Investment rationale data not available.</div>;
    }

    return (
        <div className="space-y-8">
            
            {/* Risk Profile Analysis Section */}
            {rationale.risk_profile_fit_score && (
                 <div className="g-card bg-white dark:bg-[#121214] p-6 md:p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
                            <ShieldIcon className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Risk Profile Analysis</h2>
                    </div>
                    
                    <RiskProfileFit 
                        score={rationale.risk_profile_fit_score} 
                        userProfile={userRisk} 
                    />
                    
                    <div className="mt-8 bg-indigo-50 dark:bg-indigo-900/10 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                        <h4 className="font-bold text-indigo-800 dark:text-indigo-300 mb-2 text-base">AI Assessment</h4>
                        <p className="text-base leading-relaxed text-slate-700 dark:text-zinc-300">{rationale.risk_profile_fit_analysis}</p>
                    </div>
                </div>
            )}
            
            {/* Investment Case Section */}
            <div className="g-card bg-white dark:bg-[#121214] p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-500/20 shadow-sm">
                        <ScaleIcon className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Investment Strategy</h2>
                </div>

                <div className="prose dark:prose-invert max-w-none">
                    <p className="text-base md:text-lg leading-relaxed text-slate-700 dark:text-zinc-300 font-medium">
                        {rationale.investment_thesis}
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-slate-100 dark:border-white/5">
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
                        <h4 className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center mb-4 text-lg">
                            <CheckCircleIcon className="w-5 h-5 mr-2" />
                            Potential Catalysts
                        </h4>
                        <ul className="space-y-3">
                            {rationale.potential_catalysts?.map((item, index) => (
                                <li key={index} className="flex items-start text-sm md:text-base text-slate-700 dark:text-zinc-300">
                                    <span className="mr-2 text-emerald-500">•</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-rose-50 dark:bg-rose-900/10 p-6 rounded-2xl border border-rose-100 dark:border-rose-500/20">
                        <h4 className="font-bold text-rose-700 dark:text-rose-400 flex items-center mb-4 text-lg">
                            <XCircleIcon className="w-5 h-5 mr-2" />
                            Risk Factors
                        </h4>
                        <ul className="space-y-3">
                            {rationale.key_risks?.map((item, index) => (
                                <li key={index} className="flex items-start text-sm md:text-base text-slate-700 dark:text-zinc-300">
                                    <span className="mr-2 text-rose-500">•</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvestmentRationale;
