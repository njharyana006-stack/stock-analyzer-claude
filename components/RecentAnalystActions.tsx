
import React from 'react';
import type { ExpertOpinions } from '../types';

interface RecentAnalystActionsProps {
  actions: ExpertOpinions['recent_analyst_actions'];
}

const AnalystActionRow: React.FC<{ action: { firm_action: string; details: string; price_target: string } }> = ({ action }) => {
    const target = action.price_target || '';
    const details = action.details || '';
    
    // Attempt to parse a numerical value for styling, but display the original string.
    const isPerform = target.toLowerCase().includes('perform');
    const isUpgrade = details.toLowerCase().includes('upgrades') || details.toLowerCase().includes('initiates');
    const isDowngrade = details.toLowerCase().includes('downgrades');

    let targetColor = 'text-slate-700 dark:text-zinc-300';
    if (isUpgrade) targetColor = 'text-emerald-600 dark:text-emerald-400';
    if (isDowngrade) targetColor = 'text-rose-600 dark:text-rose-400';
    if (isPerform) targetColor = 'text-amber-600 dark:text-amber-400';


    return (
        <tr className="border-b border-slate-100 dark:border-white/5 last:border-b-0 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
            <td className="p-4 font-bold text-slate-800 dark:text-zinc-200 text-sm align-top">
                {action.firm_action}
            </td>
            <td className="p-4 text-slate-600 dark:text-zinc-400 text-sm font-medium leading-snug align-top">
                {details}
            </td>
            <td className={`p-4 text-right font-bold text-sm ${targetColor} align-top whitespace-nowrap`}>
                {target}
            </td>
        </tr>
    );
};

const RecentAnalystActions: React.FC<RecentAnalystActionsProps> = ({ actions }) => {
  if (!actions || actions.length === 0) {
    return <div className="p-4 text-center text-sm font-medium text-slate-500 dark:text-zinc-500 bg-slate-50 dark:bg-white/5 rounded-lg border border-dashed border-slate-200 dark:border-white/10">No recent analyst actions found.</div>;
  }

  return (
    <div className="overflow-hidden rounded-xl bg-transparent h-full flex flex-col">
      <div className="overflow-y-auto custom-scrollbar flex-grow -mr-2 pr-2">
        <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-white/5 sticky top-0 z-10 backdrop-blur-md border-b border-slate-100 dark:border-white/5">
            <tr>
                <th className="p-3 pl-4 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Firm</th>
                <th className="p-3 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Action Details</th>
                <th className="p-3 pr-4 text-right text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Target</th>
            </tr>
            </thead>
            <tbody>
            {actions.map((item, index) => (
                <AnalystActionRow
                key={index}
                action={item}
                />
            ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentAnalystActions;
