
import React from 'react';
import type { TradeStrategy } from '../../../types';
import { EntryIcon, StopLossIcon, TargetIcon } from '../../icons';

interface TradeStrategyRationaleProps {
    reasoning: TradeStrategy['reasoning'];
}

const RationaleCard: React.FC<{
    icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
    title: string;
    text: string;
    color: string;
}> = ({ icon, title, text, color }) => (
    <div className="bg-white dark:bg-slate-800/80 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-full">
        <div className="flex items-center space-x-3 mb-2">
            <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg ${color.replace('text-', 'bg-').replace('400', '100')} dark:${color.replace('text-', 'bg-').replace('400', '500/20')}`}>
                {React.cloneElement(icon, { className: `w-6 h-6 ${color.replace('text-sky-400', 'text-sky-600').replace('text-red-400', 'text-red-600').replace('text-green-400', 'text-green-600')} dark:${color}` })}
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white">{title}</h4>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{text}</p>
    </div>
);

const TradeStrategyRationale: React.FC<TradeStrategyRationaleProps> = ({ reasoning }) => {
    if (!reasoning) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RationaleCard 
                icon={<EntryIcon />}
                title="Entry Point Rationale"
                text={reasoning.entry_rationale}
                color="text-sky-400"
            />
            <RationaleCard 
                icon={<StopLossIcon />}
                title="Stop-Loss Rationale"
                text={reasoning.stop_loss_rationale}
                color="text-red-400"
            />
            <RationaleCard 
                icon={<TargetIcon />}
                title="Target Price Rationale"
                text={reasoning.target_rationale}
                color="text-green-400"
            />
        </div>
    );
};

export default TradeStrategyRationale;