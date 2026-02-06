
import React, { useState, useEffect } from 'react';
import { TargetIcon } from './icons';

interface ExpertTargetPriceProps {
    targets?: { high: number; low: number; median: number };
    currentPrice: number;
}

const ExpertTargetPrice: React.FC<ExpertTargetPriceProps> = ({ targets, currentPrice }) => {
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setAnimated(true), 200);
        return () => clearTimeout(timer);
    }, [targets, currentPrice]);

    if (!targets) return null;
    const { low, high, median } = targets;

    const min = Math.min(low, currentPrice) * 0.9;
    const max = Math.max(high, currentPrice) * 1.1;
    const range = max - min;
    const getPct = (val: number) => ((val - min) / range) * 100;

    const upside = ((median - currentPrice) / currentPrice) * 100;
    const isUpside = upside >= 0;

    const markers = [
        { val: low, label: 'Low', color: '#F43F5E', textColor: 'text-rose-400' },
        { val: median, label: 'Avg', color: '#71717A', textColor: 'text-zinc-400' },
        { val: high, label: 'High', color: '#10B981', textColor: 'text-emerald-400' },
    ];

    return (
        <div className="relative p-6 md:p-8 overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] pointer-events-none opacity-20" style={{ background: isUpside ? '#10B981' : '#F43F5E' }} />

            {/* Header */}
            <div className="flex justify-between items-center mb-10 relative z-10">
                <h3 className="text-base font-bold text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <TargetIcon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <span className="block">12-Month Analyst Price Targets</span>
                        <span className="text-[10px] text-zinc-500 font-medium">Consensus range from Wall Street analysts</span>
                    </div>
                </h3>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${isUpside ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
                    <span className={`w-2 h-2 rounded-full animate-pulse ${isUpside ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                    <span className={`text-sm font-bold tabular-nums ${isUpside ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isUpside ? '+' : ''}{upside.toFixed(1)}% Upside
                    </span>
                </div>
            </div>

            {/* Range Visualization */}
            <div className="relative h-20 mb-8 z-10">
                {/* Background track */}
                <div className="absolute top-1/2 left-0 right-0 h-[3px] bg-white/[0.06] rounded-full -translate-y-1/2" />

                {/* Low to Median gradient */}
                <div
                    className="absolute top-1/2 h-[3px] rounded-l-full -translate-y-1/2 transition-all duration-1000 ease-out"
                    style={{
                        left: `${getPct(low)}%`,
                        width: animated ? `${getPct(median) - getPct(low)}%` : '0%',
                        background: 'linear-gradient(90deg, #F43F5E60, #71717A60)',
                    }}
                />
                {/* Median to High gradient */}
                <div
                    className="absolute top-1/2 h-[3px] rounded-r-full -translate-y-1/2 transition-all duration-1000 ease-out"
                    style={{
                        left: `${getPct(median)}%`,
                        width: animated ? `${getPct(high) - getPct(median)}%` : '0%',
                        background: 'linear-gradient(90deg, #71717A60, #10B98160)',
                    }}
                />

                {/* Range markers */}
                {markers.map(m => (
                    <div key={m.label} className="absolute top-1/2 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out" style={{ left: `${getPct(m.val)}%` }}>
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-[#121214] shadow-lg" style={{ backgroundColor: m.color, boxShadow: `0 0 12px ${m.color}40` }} />
                        <div className="absolute top-6 flex flex-col items-center">
                            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider">{m.label}</span>
                            <span className={`text-sm font-black tabular-nums ${m.textColor}`}>${m.val.toLocaleString()}</span>
                        </div>
                    </div>
                ))}

                {/* Current price marker */}
                <div
                    className="absolute top-1/2 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-1000 ease-out"
                    style={{ left: animated ? `${getPct(currentPrice)}%` : '50%' }}
                >
                    {/* Label above */}
                    <div className="absolute -top-10 flex flex-col items-center">
                        <div className="bg-white text-[#09090B] text-[11px] font-black px-3 py-1.5 rounded-lg shadow-lg shadow-white/10 tabular-nums whitespace-nowrap">
                            ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white" />
                    </div>
                    {/* Marker dot */}
                    <div className="w-5 h-5 rounded-full bg-white border-[3px] border-[#121214] shadow-[0_0_16px_rgba(255,255,255,0.3)]" />
                </div>
            </div>
        </div>
    );
};

export default ExpertTargetPrice;
