
import React from 'react';
import type { RiskProfile } from '../../types';

interface RiskProfileFitProps {
    score: number;
    userProfile: RiskProfile;
}

const RiskProfileFit: React.FC<RiskProfileFitProps> = ({ score, userProfile }) => {
    const normalizedScore = Math.max(1, Math.min(10, score));
    const markerPositionPercent = ((normalizedScore - 1) / 9) * 100;

    const getFitAnalysis = () => {
        let stockRiskCategory: 'Conservative' | 'Moderate' | 'Aggressive';
        if (normalizedScore <= 3.5) stockRiskCategory = 'Conservative';
        else if (normalizedScore <= 7.5) stockRiskCategory = 'Moderate';
        else stockRiskCategory = 'Aggressive';

        if (stockRiskCategory === userProfile) {
            return {
                text: `Excellent Fit`,
                details: `This stock's ${stockRiskCategory.toLowerCase()} risk profile aligns perfectly with your ${userProfile.toLowerCase()} preference.`,
                color: 'text-emerald-500 dark:text-emerald-400',
                bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
                borderColor: 'border-emerald-200 dark:border-emerald-500/20',
            };
        }
        
        const userRiskValue = { 'Conservative': 1, 'Moderate': 2, 'Aggressive': 3 }[userProfile];
        const stockRiskValue = { 'Conservative': 1, 'Moderate': 2, 'Aggressive': 3 }[stockRiskCategory];

        if (Math.abs(userRiskValue - stockRiskValue) === 1) {
            return {
                text: `Moderate Fit`,
                details: `This stock has a ${stockRiskCategory.toLowerCase()} risk profile, which is a reasonable but not perfect match for your ${userProfile.toLowerCase()} strategy.`,
                color: 'text-amber-500 dark:text-amber-400',
                bgColor: 'bg-amber-50 dark:bg-amber-500/10',
                borderColor: 'border-amber-200 dark:border-amber-500/20',
            };
        }

        return {
            text: `Poor Fit`,
            details: `This stock's ${stockRiskCategory.toLowerCase()} risk profile may not align with your ${userProfile.toLowerCase()} goals. Proceed with institutional caution.`,
            color: 'text-rose-500 dark:text-rose-400',
            bgColor: 'bg-rose-50 dark:bg-rose-500/10',
            borderColor: 'border-rose-200 dark:border-rose-500/20',
        };
    };
    
    const fitAnalysis = getFitAnalysis();

    return (
        <div className="w-full space-y-8 py-6">
            {/* Gauge Area - Increased container height (h-32) and added margins to prevent overlap */}
            <div className="relative h-32 w-full flex flex-col justify-end px-2 mt-4">
                {/* Gradient Track */}
                <div className="h-2.5 w-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 rounded-full shadow-inner opacity-80"></div>
                
                {/* Animated Indicator */}
                <div 
                    className="absolute top-0 bottom-3 -translate-x-1/2 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] z-10"
                    style={{ left: `${markerPositionPercent}%` }}
                >
                    <div className="flex flex-col items-center h-full justify-end pb-1">
                        <div className="bg-slate-900 dark:bg-white text-white dark:text-black text-[11px] font-black px-2.5 py-1.5 rounded-lg shadow-2xl mb-2 flex items-center justify-center min-w-[80px] border border-white/20">
                            SCORE {normalizedScore.toFixed(1)}
                        </div>
                        <div className="w-6 h-6 rounded-full bg-white dark:bg-zinc-900 border-4 border-slate-900 dark:border-white shadow-xl"></div>
                    </div>
                </div>

                {/* Min/Max Labels */}
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-600 mt-4">
                    <span>Conservative</span>
                    <span>Aggressive</span>
                </div>
            </div>

            {/* Analysis Box */}
             <div className={`p-6 rounded-[24px] border ${fitAnalysis.borderColor} ${fitAnalysis.bgColor} transition-all duration-500 flex gap-4 items-start shadow-sm`}>
                <div className={`w-10 h-10 rounded-xl bg-white dark:bg-black/20 flex-shrink-0 flex items-center justify-center shadow-sm ${fitAnalysis.color}`}>
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                      </svg>
                </div>
                <div className="flex-1">
                    <p className={`font-black text-base uppercase tracking-wider ${fitAnalysis.color}`}>{fitAnalysis.text}</p>
                    <p className={`text-sm md:text-base mt-2 text-slate-700 dark:text-zinc-300 leading-relaxed font-medium`}>{fitAnalysis.details}</p>
                </div>
            </div>
        </div>
    );
};

export default RiskProfileFit;
