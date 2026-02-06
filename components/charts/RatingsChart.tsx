
import React, { useState, useEffect } from 'react';
import type { AnalystRatingsBreakdown } from '../../types';

interface RatingsChartProps {
    data: AnalystRatingsBreakdown;
}

const RatingBar: React.FC<{ label: string; value: number; total: number; color: string; glowColor: string; delay: number }> = ({ label, value, total, color, glowColor, delay }) => {
    const [width, setWidth] = useState(0);
    const percentage = total > 0 ? (value / total) * 100 : 0;

    useEffect(() => {
        const timer = setTimeout(() => setWidth(percentage), delay);
        return () => clearTimeout(timer);
    }, [percentage, delay]);

    return (
        <div className="w-full group">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-sm font-bold text-zinc-300">{label}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-zinc-600 tabular-nums">{percentage.toFixed(0)}%</span>
                    <span className="text-sm font-black text-white tabular-nums min-w-[40px] text-right">{value.toLocaleString()}</span>
                </div>
            </div>
            <div className="w-full h-3 rounded-full overflow-hidden bg-white/[0.04] border border-white/[0.04]">
                <div
                    className="h-full rounded-full transition-all duration-1000 ease-out relative"
                    style={{
                        width: `${width}%`,
                        background: `linear-gradient(90deg, ${color}, ${color}CC)`,
                        boxShadow: `0 0 12px ${glowColor}30`,
                    }}
                />
            </div>
        </div>
    );
};

const RatingsChart: React.FC<RatingsChartProps> = ({ data }) => {
    if (!data) {
        return <div className="p-6 text-center text-zinc-500 font-medium">No rating data available.</div>;
    }

    const totalRatings = data.buy + data.hold + data.sell;

    return (
        <div className="h-full w-full flex flex-col justify-center">
            <div className="space-y-5 w-full">
                <RatingBar label="Buy" value={data.buy} total={totalRatings} color="#10B981" glowColor="#10B981" delay={100} />
                <RatingBar label="Hold" value={data.hold} total={totalRatings} color="#F59E0B" glowColor="#F59E0B" delay={200} />
                <RatingBar label="Sell" value={data.sell} total={totalRatings} color="#F43F5E" glowColor="#F43F5E" delay={300} />
            </div>
            <div className="mt-6 flex justify-center">
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.15em]">
                    Based on {totalRatings.toLocaleString()} analyst ratings
                </p>
            </div>
        </div>
    );
};

export default RatingsChart;
