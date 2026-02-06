
import React from 'react';
import type { MajorHolders, Holder } from '../../types';
import { InfoIcon, UserIcon } from '../icons';

interface HoldersInfoProps {
  holders: MajorHolders;
}

const HolderRow: React.FC<{ holder: Holder }> = ({ holder }) => {
    const percentageValue = parseFloat(holder.percentage?.replace('%', '')) || 0;
    
    return (
        <div className="flex items-center py-4 border-b border-slate-100 dark:border-white/5 last:border-0 group hover:bg-slate-50 dark:hover:bg-white/5 px-3 rounded-xl transition-colors">
            <div className="mr-4 flex-shrink-0 bg-slate-100 dark:bg-white/5 p-2 rounded-lg border border-slate-200 dark:border-white/5 text-slate-400 dark:text-zinc-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                <UserIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate pr-4">{holder.name}</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">{holder.percentage || 'N/A'}</p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-slate-500 dark:text-zinc-400">{holder.shares} Shares</p>
                    <div className="w-24 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden ml-4">
                        <div
                            className="bg-indigo-500 dark:bg-indigo-400 h-full rounded-full"
                            style={{ width: `${Math.min(percentageValue * 2, 100)}%` }} // Visual scaling
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const HoldersTable: React.FC<{ title: string; data: Holder[] }> = ({ title, data }) => (
    <div className="flex-1 h-full bg-slate-50/50 dark:bg-[#18181B] rounded-2xl p-6 border border-slate-100 dark:border-white/5">
        <h4 className="text-sm font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-white/10 pb-2">
            {title}
        </h4>
        <div className="">
            {data && data.length > 0 ? (
                data.slice(0, 5).map((holder, index) => (
                    <HolderRow key={index} holder={holder} />
                ))
            ) : (
                <div className="px-4 py-8 text-center text-sm font-medium text-slate-400 dark:text-zinc-500 italic">No ownership data available.</div>
            )}
        </div>
    </div>
);


const HoldersInfo: React.FC<HoldersInfoProps> = ({ holders }) => {
  return (
    <div className="space-y-6">
        <div className="bg-sky-50 dark:bg-sky-500/10 p-5 rounded-2xl border border-sky-100 dark:border-sky-500/20 flex items-start gap-4">
            <InfoIcon className="w-5 h-5 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-sky-900 dark:text-sky-100 leading-relaxed">
                <p className="mb-2"><strong className="font-bold text-sky-700 dark:text-sky-300">Institutional Ownership</strong> indicates confidence from large firms ("Smart Money"). High percentages often suggest stability.</p>
                <p><strong className="font-bold text-sky-700 dark:text-sky-300">Insider Ownership</strong> shows leadership's vested interest. Significant insider buying is typically a bullish signal.</p>
            </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <HoldersTable title="Top Institutions" data={holders?.institutional || []} />
            <HoldersTable title="Top Insiders" data={holders?.insiders || []} />
        </div>
    </div>
  );
};

export default HoldersInfo;
