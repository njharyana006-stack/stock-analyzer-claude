
import React, { useState, useMemo } from 'react';
import type { AIPortfolio } from '../../types';

interface PortfolioPieChartProps {
    portfolio: AIPortfolio;
}

const COLORS = [
    '#4f46e5', // indigo-600
    '#0ea5e9', // sky-500
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#f43f5e', // rose-500
    '#64748b', // slate-500
    '#14b8a6', // teal-500
    '#f97316', // orange-500
];

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x: number, y: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) {
    const start = polarToCartesian(x, y, outerRadius, endAngle);
    const end = polarToCartesian(x, y, outerRadius, startAngle);
    const startInner = polarToCartesian(x, y, innerRadius, endAngle);
    const endInner = polarToCartesian(x, y, innerRadius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    const d = [
        "M", start.x, start.y,
        "A", outerRadius, outerRadius, 0, largeArcFlag, 0, end.x, end.y,
        "L", endInner.x, endInner.y,
        "A", innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y,
        "Z"
    ].join(" ");

    return d;
}

const PortfolioPieChart: React.FC<PortfolioPieChartProps> = ({ portfolio }) => {
    const [hoveredTicker, setHoveredTicker] = useState<string | null>(null);

    // Prepare data: Normalize to 100% to ensure chart is full
    const chartData = useMemo(() => {
        if (!portfolio || !portfolio.stocks || portfolio.stocks.length === 0) return [];
        
        const total = portfolio.stocks.reduce((acc, stock) => acc + stock.allocation, 0);
        if (total === 0) return [];

        let currentAngle = 0;
        return portfolio.stocks.map((stock, index) => {
            const normalizedValue = (stock.allocation / total) * 100;
            const angle = (normalizedValue / 100) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle += angle;

            return {
                ...stock,
                displayPercent: normalizedValue, // For tooltip/legend
                startAngle,
                endAngle,
                color: COLORS[index % COLORS.length]
            };
        });
    }, [portfolio]);

    if (chartData.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center w-60 h-60 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-full bg-slate-50 dark:bg-white/5">
                <span className="text-xs text-slate-400 dark:text-zinc-500 font-bold">No Allocation</span>
            </div>
        );
    }

    const size = 200;
    const center = size / 2;
    const outerRadius = 90;
    const innerRadius = 60;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-64 h-64 group">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-indigo-500/5 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                
                <svg 
                    viewBox={`0 0 ${size} ${size}`} 
                    className="w-full h-full drop-shadow-sm transform transition-transform duration-500"
                >
                    {chartData.map((slice) => {
                        const isHovered = hoveredTicker === slice.ticker;
                        // Slightly expand radius on hover
                        const hoverOuter = isHovered ? outerRadius + 5 : outerRadius;
                        
                        return (
                            <path
                                key={slice.ticker}
                                d={describeArc(center, center, innerRadius, hoverOuter, slice.startAngle, slice.endAngle)}
                                fill={slice.color}
                                className="transition-all duration-300 ease-out cursor-pointer hover:opacity-90 stroke-white dark:stroke-[#121214] stroke-[2px]"
                                onMouseEnter={() => setHoveredTicker(slice.ticker)}
                                onMouseLeave={() => setHoveredTicker(null)}
                            />
                        );
                    })}
                </svg>
                
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-4xl font-black text-slate-900 dark:text-white leading-none">
                        {hoveredTicker 
                            ? chartData.find(s => s.ticker === hoveredTicker)?.displayPercent.toFixed(1) + '%' 
                            : chartData.length}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500 mt-1">
                        {hoveredTicker ? hoveredTicker : 'Assets'}
                    </p>
                </div>
            </div>
            
            {/* Legend Grid */}
            <div className="mt-6 w-full grid grid-cols-2 gap-x-4 gap-y-3 px-2">
                {chartData.map((stock) => (
                    <div 
                        key={stock.ticker} 
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-200 border border-transparent ${
                            hoveredTicker === stock.ticker 
                            ? 'bg-slate-100 dark:bg-white/10 border-slate-200 dark:border-white/20 shadow-sm scale-[1.02]' 
                            : 'hover:bg-slate-50 dark:hover:bg-white/5'
                        }`}
                        onMouseEnter={() => setHoveredTicker(stock.ticker)}
                        onMouseLeave={() => setHoveredTicker(null)}
                    >
                        <div className="flex items-center overflow-hidden">
                            <span
                                className="w-2.5 h-2.5 rounded-full mr-2.5 flex-shrink-0 shadow-sm"
                                style={{ backgroundColor: stock.color }}
                            ></span>
                            <span className="font-bold text-xs text-slate-700 dark:text-zinc-200 truncate">{stock.ticker}</span>
                        </div>
                        <span className="font-mono text-xs font-semibold text-slate-500 dark:text-zinc-400">
                            {stock.displayPercent.toFixed(1)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PortfolioPieChart;
