
import React, { useMemo, useRef, useState, useLayoutEffect } from 'react';

interface RSIChartProps {
  data: { date: string; value: number }[];
}

const PADDING = { top: 10, right: 50, bottom: 20, left: 10 };
const CHART_HEIGHT = 150;

const RSIChart: React.FC<RSIChartProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hoveredData, setHoveredData] = useState<{ date: string; value: number; x: number; y: number } | null>(null);

  useLayoutEffect(() => {
    const observer = new ResizeObserver(entries => {
      if (entries[0]) {
        setWidth(entries[0].contentRect.width);
      }
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);
  
  const { path, xScale, yScale } = useMemo(() => {
    if (!data || data.length < 2 || width === 0) return { path: '', xScale: () => 0, yScale: () => 0 };

    const min = 0;
    const max = 100;
    const range = max - min;
    const chartWidth = width - PADDING.left - PADDING.right;
    const chartHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

    const xScale = (index: number) => PADDING.left + (index / (data.length - 1)) * chartWidth;
    const yScale = (val: number) => PADDING.top + ((max - val) / range) * chartHeight;
    
    const path = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.value)}`).join(' ');

    return { path, xScale, yScale };
  }, [data, width]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!data || data.length === 0 || width === 0) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      
      // Inverse scale to find index
      const chartWidth = width - PADDING.left - PADDING.right;
      const index = Math.round(((x - PADDING.left) / chartWidth) * (data.length - 1));
      
      if (index >= 0 && index < data.length) {
          const item = data[index];
          setHoveredData({
              date: item.date,
              value: item.value,
              x: xScale(index),
              y: yScale(item.value)
          });
      }
  };

  const handleMouseLeave = () => {
      setHoveredData(null);
  };
  
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full bg-[#121214] rounded-[24px] overflow-hidden border border-white/5 shadow-lg relative">
        <div 
            ref={containerRef} 
            className="h-[150px] relative cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <svg width="100%" height={CHART_HEIGHT}>
                {/* Overbought/Oversold zones */}
                <rect x={PADDING.left} y={yScale(100)} width={Math.max(0, width - PADDING.left - PADDING.right)} height={yScale(70) - yScale(100)} className="fill-rose-500/10" />
                <rect x={PADDING.left} y={yScale(30)} width={Math.max(0, width - PADDING.left - PADDING.right)} height={yScale(0) - yScale(30)} className="fill-emerald-500/10" />

                {/* Y-axis labels and grid lines */}
                {[70, 50, 30].map(val => (
                    <g key={val}>
                        <line 
                            x1={PADDING.left} 
                            y1={yScale(val)} 
                            x2={width - PADDING.right} 
                            y2={yScale(val)} 
                            className={`stroke-1 ${val === 50 ? 'stroke-slate-600' : 'stroke-slate-700 stroke-dashed'}`}
                            strokeDasharray={val !== 50 ? "4 4" : ""}
                        />
                        <text 
                            x={width - PADDING.right + 6} 
                            y={yScale(val) + 3} 
                            className="fill-slate-400 text-[10px] font-medium"
                        >
                            {val}
                        </text>
                    </g>
                ))}

                {/* RSI Line */}
                <path d={path} fill="none" className="stroke-violet-400" strokeWidth="2" />
                
                {/* Interaction Layer */}
                {hoveredData && (
                    <g>
                        <line x1={hoveredData.x} y1={PADDING.top} x2={hoveredData.x} y2={CHART_HEIGHT - PADDING.bottom} className="stroke-white/30" strokeWidth="1" strokeDasharray="4 4" />
                        <circle cx={hoveredData.x} cy={hoveredData.y} r="4" className="fill-violet-500 stroke-white stroke-2" />
                        
                        {/* Tooltip */}
                        <g transform={`translate(${hoveredData.x > width / 2 ? hoveredData.x - 100 : hoveredData.x + 10}, 10)`}>
                            <rect x="0" y="0" width="90" height="45" rx="8" className="fill-[#18181B]/90 stroke-white/10 stroke-1 shadow-xl backdrop-blur-md" />
                            <text x="10" y="18" className="fill-zinc-400 text-[10px]">{new Date(hoveredData.date).toLocaleDateString([], {month: 'short', day: 'numeric'})}</text>
                            <text x="10" y="34" className="fill-white font-bold text-sm">RSI: {hoveredData.value.toFixed(2)}</text>
                        </g>
                    </g>
                )}
            </svg>
            
            {/* Current Value Label (Static if not hovering, or redundant) */}
            {!hoveredData && data.length > 0 && (
                <div className="absolute top-2 left-4 pointer-events-none">
                    <span className="text-xs text-violet-400 font-bold">RSI (14): {data[data.length-1].value.toFixed(2)}</span>
                </div>
            )}
        </div>
    </div>
  );
};

export default RSIChart;
