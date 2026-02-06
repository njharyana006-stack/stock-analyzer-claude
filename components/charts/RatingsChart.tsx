
import React, { useState, useEffect } from 'react';
import type { AnalystRatingsBreakdown } from '../../types';

interface RatingsChartProps {
  data: AnalystRatingsBreakdown;
}

const RatingBar: React.FC<{ label: string; value: number; total: number; color: string }> = ({ label, value, total, color }) => {
  const [width, setWidth] = useState(0);
  const percentage = total > 0 ? (value / total) * 100 : 0;

  useEffect(() => {
    // Small delay to trigger animation after mount
    const timer = setTimeout(() => setWidth(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-bold text-slate-700 dark:text-zinc-300 w-12">{label}</span>
        <span className="text-sm font-bold text-slate-800 dark:text-white tabular-nums text-right flex-1">{value.toLocaleString()}</span>
      </div>
      <div className="w-full bg-slate-100 dark:bg-white/5 rounded-full h-4 overflow-hidden border border-slate-200 dark:border-white/5">
        <div
          className={`${color} h-full rounded-full transition-all duration-1000 ease-out shadow-sm`}
          style={{ width: `${width}%` }}
        ></div>
      </div>
    </div>
  );
};


const RatingsChart: React.FC<RatingsChartProps> = ({ data }) => {
    if (!data) {
        return <div className="p-6 text-center text-slate-500 dark:text-zinc-500">No rating data available.</div>;
    }
    
    const totalRatings = data.buy + data.hold + data.sell;
    
  return (
    <div className="h-full bg-transparent w-full flex flex-col justify-center">
        <div className="space-y-5 w-full">
            <RatingBar label="Buy" value={data.buy} total={totalRatings} color="bg-emerald-500" />
            <RatingBar label="Hold" value={data.hold} total={totalRatings} color="bg-amber-400" />
            <RatingBar label="Sell" value={data.sell} total={totalRatings} color="bg-rose-500" />
        </div>
        <div className="mt-6 flex justify-center">
             <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                Based on {totalRatings.toLocaleString()} ratings
            </p>
        </div>
    </div>
  );
};

export default RatingsChart;
