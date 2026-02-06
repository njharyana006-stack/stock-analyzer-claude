
import React from 'react';
import type { IndividualAnalysis } from '../../../types';

interface FinancialSnapshotProps {
    financials: IndividualAnalysis['financial_highlights'];
}

const StatRow: React.FC<{ label: string; value: string | number | undefined }> = ({ label, value }) => (
    <div className="flex flex-col py-4 px-5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-colors">
        <span className="text-sm font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">{label}</span>
        <span className="text-xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
            {typeof value === 'number' ? value.toFixed(2) : value || '---'}
        </span>
    </div>
);

const FinancialSnapshot: React.FC<FinancialSnapshotProps> = ({ financials }) => (
    <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            <StatRow label="Market Cap" value={financials?.market_cap} />
            <StatRow label="P/E Ratio" value={financials?.pe_ratio} />
            <StatRow label="EPS" value={financials?.eps} />
            <StatRow label="Div Yield" value={financials?.dividend_yield} />
            
            <StatRow label="Gross Profit" value={financials?.gross_profit} />
            <StatRow label="Op. Income" value={financials?.operating_income} />
            <StatRow label="Net Income" value={financials?.net_income} />
            <StatRow label="Avg Vol" value={financials?.avg_volume} />
            
            <StatRow label="52W High" value={financials?.fifty_two_week_high} />
            <StatRow label="52W Low" value={financials?.fifty_two_week_low} />
        </div>
    </div>
);

export default FinancialSnapshot;
