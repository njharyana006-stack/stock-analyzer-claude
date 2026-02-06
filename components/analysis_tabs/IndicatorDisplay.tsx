

import React from 'react';
import { InfoIcon } from '../icons';

interface IndicatorDisplayProps {
  label: string;
  value?: number;
  currentPrice?: number;
  tooltip: string;
  isBullish?: boolean;
}

const IndicatorDisplay: React.FC<IndicatorDisplayProps> = ({ label, value, tooltip, isBullish, currentPrice }) => {
  const dotColor = isBullish === true ? 'bg-green-500' : isBullish === false ? 'bg-red-500' : 'bg-slate-400';
  
  let diffText = '';
  let diffColor = 'text-slate-500';

  if (typeof currentPrice === 'number' && typeof value === 'number' && value !== 0) {
      const diff = currentPrice - value;
      const diffPercent = (diff / value) * 100;
      const isAbove = diff > 0;
      diffText = `${isAbove ? '+' : ''}${diffPercent.toFixed(1)}% vs SMA`;
      diffColor = isAbove ? 'text-green-600' : 'text-red-600';
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-md h-full group relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <div>
            <InfoIcon className="w-4 h-4 text-slate-400" />
            <div className="tooltip absolute right-0 bottom-full mb-2 w-64 bg-slate-800 text-white text-xs rounded-lg p-2 z-10 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                {tooltip}
            </div>
        </div>
      </div>
      <div className="flex items-baseline space-x-2 mt-1">
        {isBullish !== undefined && <span className={`w-2.5 h-2.5 rounded-full ${dotColor} self-center`}></span>}
        <p className="text-2xl font-bold text-slate-800">{value ? `$${value.toFixed(2)}` : 'N/A'}</p>
      </div>
      {diffText && <p className={`text-xs font-medium mt-1 ${diffColor}`}>{diffText}</p>}
    </div>
  );
};

export default IndicatorDisplay;