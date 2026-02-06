
import React, { useRef, useState, useLayoutEffect, useMemo } from 'react';
import type { ChartAnnotation } from '../../types';
import ChartAnnotations from '../ChartAnnotations';

type ChartDataPoint = { 
    date: string; 
    close: number;
};

export interface PriceChartProps {
  data: ChartDataPoint[];
  annotations?: ChartAnnotation[];
  isLoading: boolean;
  error: string | null;
  type?: 'Line' | 'Candles' | 'Area';
}

const PADDING = { top: 20, right: 50, bottom: 30, left: 0 };

export const PriceChart: React.FC<PriceChartProps> = ({ data, annotations, isLoading, error, type = 'Line' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 280 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useLayoutEffect(() => {
    const observer = new ResizeObserver(entries => {
        if (entries[0]) {
            const { width } = entries[0].contentRect;
            const isMobile = window.innerWidth < 768;
            setSize({ width, height: isMobile ? 280 : 400 });
        }
    });
    const currentRef = containerRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, []);

  const { xScale, yScale, minPrice, maxPrice, dateToIndexMap, isPositive, supportResistanceLevels } = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return { xScale: () => 0, yScale: () => 0, minPrice: 0, maxPrice: 0, dateToIndexMap: new Map(), isPositive: true, supportResistanceLevels: [] };
    
    const allValues = data.map(d => d.close);
    let minP = Math.min(...allValues);
    let maxP = Math.max(...allValues);
    
    const first = data[0].close;
    const last = data[data.length - 1].close;
    const isPositive = last >= first;
    
    // Expand scale
    const paddingY = (maxP - minP) * 0.1;
    minP -= paddingY;
    maxP += paddingY;

    const priceRange = maxP - minP;
    const mainChartHeight = size.height - PADDING.bottom;

    const xScale = (index: number) => PADDING.left + (index / (data.length - 1)) * (size.width - PADDING.left - PADDING.right);
    const yScale = (val: number) => PADDING.top + (1 - (val - minP) / priceRange) * (mainChartHeight - PADDING.top);
    
    const map = new Map<string, number>();
    data.forEach((d, i) => {
        const dateKey = new Date(d.date).toISOString().split('T')[0];
        map.set(dateKey, i);
    });

    const supportResistanceLevels = annotations?.filter(a => a.type === 'SUPPORT' || a.type === 'RESISTANCE') || [];

    return { xScale, yScale, minPrice: minP, maxPrice: maxP, dateToIndexMap: map, isPositive, supportResistanceLevels };
  }, [data, size, annotations]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!Array.isArray(data) || data.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const index = Math.max(0, Math.min(data.length - 1, Math.round((mouseX - PADDING.left) / ((size.width - PADDING.left - PADDING.right) / (data.length - 1)))));
    setHoveredIndex(index);
  };
  
  const handleMouseLeave = () => {
      setHoveredIndex(null);
  };
  
  const hoveredPoint = (Array.isArray(data) && hoveredIndex !== null) ? data[hoveredIndex] : null;

  if (isLoading) return <div className="h-[280px] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2196F3]"></div></div>;
  if (error) return <div className="h-[280px] flex items-center justify-center text-[#FF5252]">{error}</div>;
  if (!Array.isArray(data) || data.length === 0) return <div className="h-[280px] flex items-center justify-center text-[#B0B8C4]">No data available.</div>;
  
  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.close)}`).join(' ');
  const chartColor = isPositive ? '#34D399' : '#FB7185'; // Neon Green or Neon Red

  return (
    <div className="w-full bg-[#121214] rounded-[24px] overflow-hidden border border-white/5 shadow-lg relative">
        <div 
            ref={containerRef} 
            onMouseMove={handleMouseMove} 
            onMouseLeave={handleMouseLeave} 
            onTouchMove={(e) => {
                if (!Array.isArray(data) || data.length === 0) return;
                const touch = e.touches[0];
                const rect = e.currentTarget.getBoundingClientRect();
                const mouseX = touch.clientX - rect.left;
                const index = Math.max(0, Math.min(data.length - 1, Math.round((mouseX - PADDING.left) / ((size.width - PADDING.left - PADDING.right) / (data.length - 1)))));
                setHoveredIndex(index);
            }}
            className="relative cursor-crosshair select-none"
            style={{ height: size.height }}
        >
        <svg width="100%" height={size.height}>
            <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColor} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={chartColor} stopOpacity="0.0" />
                </linearGradient>
                <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Grid & Y-Axis Labels */}
            {Array.from({ length: 5 }).map((_, i) => {
                const y = PADDING.top + i * ((size.height - PADDING.bottom - PADDING.top) / 4);
                const price = maxPrice - i * ((maxPrice - minPrice) / 4);
                return (
                    <g key={i}>
                        <line x1={PADDING.left} y1={y} x2={size.width - PADDING.right} y2={y} className="stroke-white/5" strokeWidth="1" strokeDasharray="4 4" />
                        <text x={size.width - PADDING.right + 8} y={y + 4} className="fill-zinc-500 text-[10px] font-mono" fontSize="10">${price.toFixed(0)}</text>
                    </g>
                );
            })}

            {/* AI-Driven Support & Resistance Levels */}
            {supportResistanceLevels.map((level, i) => {
                if (!level.price) return null;
                const y = yScale(level.price);
                const isSupport = level.type === 'SUPPORT';
                const color = isSupport ? '#10B981' : '#F43F5E'; // Emerald or Rose
                const dashArray = level.strength === 'strong' ? '' : '5 5';
                const strokeWidth = level.strength === 'strong' ? 1.5 : 1;
                const opacity = level.strength === 'weak' ? 0.6 : 0.8;

                return (
                    <g key={`sr-${i}`} className="transition-opacity duration-300">
                        <line 
                            x1={PADDING.left} 
                            y1={y} 
                            x2={size.width - PADDING.right} 
                            y2={y} 
                            stroke={color} 
                            strokeWidth={strokeWidth} 
                            strokeDasharray={dashArray} 
                            opacity={opacity}
                        />
                        <rect 
                            x={size.width - PADDING.right - 35} 
                            y={y - 8} 
                            width="35" 
                            height="16" 
                            rx="4" 
                            fill={color} 
                            opacity="0.2" 
                        />
                        <text 
                            x={size.width - PADDING.right - 30} 
                            y={y + 3} 
                            fill={color} 
                            fontSize="9" 
                            fontWeight="bold"
                            className="uppercase"
                        >
                            {isSupport ? 'SUP' : 'RES'}
                        </text>
                    </g>
                );
            })}

            {/* Chart Paths */}
            {type === 'Area' || type === 'Line' ? (
                <>
                    {type === 'Area' && (
                        <path 
                            d={`${linePath} L ${xScale(data.length - 1)} ${size.height - PADDING.bottom} L ${PADDING.left} ${size.height - PADDING.bottom} Z`} 
                            fill="url(#chartGradient)" 
                        />
                    )}
                    <path 
                        d={linePath} 
                        fill="none" 
                        stroke={chartColor} 
                        strokeWidth="2.5" 
                        strokeLinejoin="round" 
                        strokeLinecap="round"
                        filter="url(#neonGlow)"
                    />
                    <path 
                        d={linePath} 
                        fill="none" 
                        stroke={chartColor} 
                        strokeWidth="1.5" 
                        strokeLinejoin="round" 
                        strokeLinecap="round"
                    />
                </>
            ) : (
                // Simple Candle Representation
                data.map((d, i) => {
                    const x = xScale(i);
                    const yClose = yScale(d.close);
                    return <line key={i} x1={x} y1={yClose - 8} x2={x} y2={yClose + 8} stroke={chartColor} strokeWidth="2" />
                })
            )}

            {/* X-axis labels */}
            {data.map((d, i) => {
                const totalPoints = data.length;
                const tickInterval = Math.ceil(totalPoints / 5);
                if (i % tickInterval === 0 && i < totalPoints - (tickInterval / 2)) {
                    return (
                        <text key={d.date} x={xScale(i)} y={size.height - 10} textAnchor="middle" className="fill-zinc-500 text-[10px] font-mono">
                            {new Date(d.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </text>
                    )
                }
                return null;
            })}

            {/* Tooltip / Crosshair */}
            {hoveredPoint && hoveredIndex !== null && (
                <g>
                    <line x1={xScale(hoveredIndex)} y1={PADDING.top} x2={xScale(hoveredIndex)} y2={size.height - PADDING.bottom} className="stroke-white/30" strokeWidth="1" strokeDasharray="4 4"/>
                    <line x1={PADDING.left} y1={yScale(hoveredPoint.close)} x2={size.width - PADDING.right} y2={yScale(hoveredPoint.close)} className="stroke-white/30" strokeWidth="1" strokeDasharray="4 4"/>
                    <circle cx={xScale(hoveredIndex)} cy={yScale(hoveredPoint.close)} r="6" className="fill-white" stroke={chartColor} strokeWidth="2" />
                    
                    <g transform={`translate(${xScale(hoveredIndex) > size.width/2 ? xScale(hoveredIndex) - 120 : xScale(hoveredIndex) + 15}, ${PADDING.top})`}>
                        <rect x="0" y="0" width="110" height="55" rx="12" className="fill-[#18181B]/90 stroke-white/10 stroke-1 shadow-xl backdrop-blur-md" />
                        <text x="12" y="22" className="fill-zinc-400 text-[10px] font-medium">{new Date(hoveredPoint.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</text>
                        <text x="12" y="42" className="fill-white font-bold text-[18px] tracking-tight">${hoveredPoint.close.toFixed(2)}</text>
                    </g>
                </g>
            )}
        </svg>
        {annotations && (
            <ChartAnnotations
                annotations={annotations}
                dateToIndexMap={dateToIndexMap}
                xScale={xScale}
                yScale={yScale}
                width={size.width}
                height={size.height}
                padding={PADDING}
            />
        )}
        </div>
    </div>
  );
};

export default PriceChart;
