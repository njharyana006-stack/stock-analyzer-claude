
import React from 'react';
import type { ExpertOpinions } from '../types';

interface RecentAnalystActionsProps {
    actions: ExpertOpinions['recent_analyst_actions'];
}

const AnalystActionRow: React.FC<{ action: { firm_action: string; details: string; price_target: string } }> = ({ action }) => {
    const target = action.price_target || '';
    const details = action.details || '';

    const isUpgrade = details.toLowerCase().includes('upgrades') || details.toLowerCase().includes('initiates');
    const isDowngrade = details.toLowerCase().includes('downgrades');
    const isPerform = target.toLowerCase().includes('perform');

    let accentColor = '#A1A1AA';
    if (isUpgrade) accentColor = '#10B981';
    if (isDowngrade) accentColor = '#F43F5E';
    if (isPerform) accentColor = '#F59E0B';

    return (
        <tr className="border-b border-white/[0.04] last:border-b-0 group hover:bg-white/[0.02] transition-colors">
            <td className="p-4 align-top">
                <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accentColor }} />
                    <span className="font-bold text-white text-sm">{action.firm_action}</span>
                </div>
            </td>
            <td className="p-4 text-zinc-400 text-sm font-medium leading-snug align-top">
                {details}
            </td>
            <td className="p-4 text-right align-top whitespace-nowrap">
                <span className="text-sm font-bold tabular-nums" style={{ color: accentColor }}>
                    {target}
                </span>
            </td>
        </tr>
    );
};

const RecentAnalystActions: React.FC<RecentAnalystActionsProps> = ({ actions }) => {
    if (!actions || actions.length === 0) {
        return (
            <div className="p-6 text-center text-sm font-medium text-zinc-500 border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
                No recent analyst actions found.
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl h-full flex flex-col">
            <div className="overflow-y-auto custom-scrollbar flex-grow -mr-2 pr-2">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10 bg-[#121214] border-b border-white/[0.06]">
                        <tr>
                            <th className="p-3 pl-4 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.15em]">Firm</th>
                            <th className="p-3 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.15em]">Action Details</th>
                            <th className="p-3 pr-4 text-right text-[10px] font-bold text-zinc-600 uppercase tracking-[0.15em]">Target</th>
                        </tr>
                    </thead>
                    <tbody>
                        {actions.map((item, index) => (
                            <AnalystActionRow key={index} action={item} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentAnalystActions;
