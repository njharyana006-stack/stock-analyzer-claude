import React from 'react';
import type { AnalystRatingsBreakdown } from '../types';

interface AnalystRatingsBreakdownCardProps {
    data?: AnalystRatingsBreakdown;
}

const RatingBar: React.FC<{ label: string; value: number; total: number; color: string }> = ({ label, value, total, color }) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-slate-700">{label}</span>
                <span className="text-sm font-bold text-slate-800">{value}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div
                    className={`${color} h-2.5 rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};


const AnalystRatingsBreakdownCard: React.FC<AnalystRatingsBreakdownCardProps> = ({ data }) => {
    if (!data) {
        return <div className="h-full flex items-center justify-center"><p className="text-sm text-slate-500 text-center py-4">No analyst ratings available.</p></div>;
    }
    
    const totalRatings = data.buy + data.hold + data.sell;

    return (
        <div className="h-full flex flex-col justify-center">
            <div className="space-y-4">
                <RatingBar label="Buy" value={data.buy} total={totalRatings} color="bg-green-500" />
                <RatingBar label="Hold" value={data.hold} total={totalRatings} color="bg-slate-400" />
                <RatingBar label="Sell" value={data.sell} total={totalRatings} color="bg-red-500" />
            </div>
            <p className="text-xs text-slate-500 text-center mt-4">Based on {totalRatings} analyst ratings</p>
        </div>
    );
};

export default AnalystRatingsBreakdownCard;
