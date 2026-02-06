
import React, { useMemo, useState, useEffect } from 'react';

interface VolumeChartProps {
    data: { date: string; volume: number; close: number; open: number }[];
    height?: number;
}

const VolumeChart: React.FC<VolumeChartProps> = ({ data, height = 100 }) => {
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const PADDING = { left: 0, right: 50 };
    
    const { bars, maxVol } = useMemo(() => {
        if (!data || data.length === 0) return { bars: [], maxVol: 0 };
        const max = Math.max(...data.map(d => d.volume));
        
        const bars = data.map((d, i) => {
            // Use price comparison with previous day if open/close data is synthetic or sparse
            const prevClose = i > 0 ? data[i-1].close : d.open;
            const isUp = d.close >= prevClose; 
            return {
                xPercent: (i / (data.length - 1)) * 100,
                heightPercent: Math.max((d.volume / max) * 100, 2), // Min height for visibility
                color: isUp ? '#00C853' : '#FF5252', // Green or Red
                volume: d.volume
            };
        });
        return { bars, maxVol: max };
    }, [data]);

    if (!data || !data.length) return null;

    return (
        <div className="w-full bg-[#1A2332] rounded-xl border border-[#2C3646] overflow-hidden relative mt-2" style={{ height }}>
            <div className="absolute top-2 left-2 text-[10px] text-[#B0B8C4] font-bold">Volume</div>
            <div className="absolute top-2 right-2 text-[10px] text-[#B0B8C4] font-mono">
                {(maxVol / 1000000).toFixed(1)}M
            </div>
            <div className="w-full h-full flex items-end px-0 pr-[50px] pb-1">
                {bars.map((bar, i) => (
                    <div 
                        key={i}
                        style={{ 
                            width: `${100 / bars.length}%`, 
                            height: `${isMounted ? bar.heightPercent : 0}%`,
                            backgroundColor: bar.color,
                            opacity: 0.7,
                            transition: `height 0.5s ease-out ${i * 5}ms`
                        }}
                        className="mx-[0.5px] hover:opacity-100"
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default VolumeChart;
