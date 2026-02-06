
import React from 'react';
import type { IndividualAnalysis } from '../../../types';
import { StrategyIcon, EntryIcon, StopLossIcon, TargetIcon, PercentIcon } from '../../icons';
import TradeStrategyChart from '../../charts/TradeStrategyChart';

interface AITradeStrategyProps {
    strategy: IndividualAnalysis['trade_strategy'];
    currentPrice: number;
}

const StrategyInfoCard: React.FC<{ icon: React.ReactElement<React.SVGProps<SVGSVGElement>>; label: string; value: string | number; colorClass: string; isPercent?: boolean; }> = ({ icon, label, value, colorClass, isPercent }) => (
    <div className="g-card !p-4 flex items-center space-x-4 shadow-sm hover:shadow-md transition-shadow">
        <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg ${colorClass.replace('text-', 'bg-').replace('400', '100').replace('600', '100')} dark:${colorClass.replace('text-', 'bg-').replace('400', '500/20').replace('600', '500/20')}`}>
            {React.cloneElement(icon, { className: `w-7 h-7 ${colorClass.replace('text-sky-400', 'text-sky-600').replace('text-red-400', 'text-red-600').replace('text-green-400', 'text-green-600')} dark:${colorClass}` })}
        </div>
        <div>
            <div className="flex items-center space-x-1.5">
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</p>
            </div>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}{isPercent ? '%' : ''}</p>
        </div>
    </div>
);

const AITradeStrategy: React.FC<AITradeStrategyProps> = ({ strategy, currentPrice }) => (
    <div className="flex flex-col lg:flex-row gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 flex-1">
            <StrategyInfoCard 
                icon={<EntryIcon />} 
                label="Entry Point" 
                value={strategy?.entry_point || 'N/A'} 
                colorClass="text-sky-400" 
            />
            <StrategyInfoCard 
                icon={<StopLossIcon />} 
                label="Stop-Loss" 
                value={strategy?.stop_loss || 'N/A'} 
                colorClass="text-red-400" 
            />
            <StrategyInfoCard 
                icon={<TargetIcon />} 
                label="Target Price" 
                value={strategy?.target_price || 'N/A'} 
                colorClass="text-green-400" 
            />
            <StrategyInfoCard 
                icon={<PercentIcon />} 
                label="Expected Return" 
                value={strategy?.expected_return_percent || 0} 
                colorClass="text-green-400" 
                isPercent 
            />
        </div>
        <div className="flex-1">
             {strategy && strategy.entry_point && strategy.entry_point.toLowerCase() !== 'n/a' && currentPrice > 0 && (
                <TradeStrategyChart
                    strategy={strategy}
                    currentPrice={currentPrice}
                />
             )}
        </div>
    </div>
);

export default AITradeStrategy;
