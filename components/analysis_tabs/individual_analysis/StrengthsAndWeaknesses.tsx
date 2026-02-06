
import React from 'react';
import type { IndividualAnalysis } from '../../../types';
import { AnimatedCheckCircleIcon, XCircleIcon, CheckCircleIcon } from '../../icons';

interface StrengthsAndWeaknessesProps {
    strengths: IndividualAnalysis['strengths'];
    weaknesses: IndividualAnalysis['weaknesses'];
}

const StrengthsAndWeaknesses: React.FC<StrengthsAndWeaknessesProps> = ({ strengths, weaknesses }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Strengths Card */}
        <div className="g-card bg-white dark:bg-[#121214] p-6 md:p-8 border-l-4 border-emerald-500 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="text-xl font-bold mb-6 flex items-center text-emerald-700 dark:text-emerald-400">
                <div className="p-1.5 bg-emerald-100 dark:bg-emerald-500/10 rounded-full mr-3">
                    <CheckCircleIcon className="w-6 h-6" />
                </div>
                Key Strengths
            </h4>
            <ul className="space-y-4">
                {strengths?.map((item, index) => (
                    <li key={index} className="flex items-start text-base text-slate-700 dark:text-slate-200">
                        <AnimatedCheckCircleIcon className="w-5 h-5 mr-3 mt-0.5 text-emerald-500 flex-shrink-0" />
                        <span className="leading-relaxed font-medium">{item}</span>
                    </li>
                ))}
                {(!strengths || strengths.length === 0) && <li className="text-slate-500 italic">No major strengths identified.</li>}
            </ul>
        </div>

        {/* Weaknesses Card */}
        <div className="g-card bg-white dark:bg-[#121214] p-6 md:p-8 border-l-4 border-rose-500 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="text-xl font-bold mb-6 flex items-center text-rose-700 dark:text-rose-400">
                <div className="p-1.5 bg-rose-100 dark:bg-rose-500/10 rounded-full mr-3">
                    <XCircleIcon className="w-6 h-6" />
                </div>
                Key Risks & Weaknesses
            </h4>
            <ul className="space-y-4">
                {weaknesses?.map((item, index) => (
                    <li key={index} className="flex items-start text-base text-slate-700 dark:text-slate-200">
                        <XCircleIcon className="w-5 h-5 mr-3 mt-0.5 text-rose-500 flex-shrink-0" />
                        <span className="leading-relaxed font-medium">{item}</span>
                    </li>
                ))}
                {(!weaknesses || weaknesses.length === 0) && <li className="text-slate-500 italic">No major weaknesses identified.</li>}
            </ul>
        </div>
    </div>
);

export default StrengthsAndWeaknesses;
