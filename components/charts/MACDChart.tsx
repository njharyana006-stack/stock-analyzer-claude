
import React, { useRef, useState, useLayoutEffect, useMemo } from 'react';

type MacdData = {
  date: string;
  macd: number;
  signal: number;
  histogram: number;
};

interface MACDChartProps {
  data: MacdData[];
}

const PADDING = { top: 20, bottom: 20, left: 5, right: 50 };
const CHART_HEIGHT = 200;

const MACDChart: React.FC<MACDChartProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hoveredData, setHoveredData] = useState<{ item: MacdData; x: number } | null>(null);

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

  const { macdPath, signalPath, histograms, zeroY, yScale, xScale, maxVal } = useMemo(() => {
    if (!data || data.length === 0 || width === 0) {
        return { macdPath: '', signalPath: '', histograms: [], zeroY: 0, yScale: () => 0, xScale: () => 0, maxVal: 0 };
    }

    const chartWidth = width - PADDING.left - PADDING.right;
    const chartHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;
    
    const allValues = data.flatMap(d => [d.macd, d.signal, d.histogram]);
    const minVal = Math.min(...allValues);
    const max = Math.max(...allValues);
    // Symmetrical scale looks better for oscillators
    const boundary = Math.max(Math.abs(minVal), Math.abs(max));
    
    const yScale = (val: number) => PADDING.top + chartHeight / 2 - (val / boundary) * (chartHeight / 2);
    const xScale = (index: number) => PADDING.left + (index / (data.length - 1)) * chartWidth;
    
    const zeroY = yScale(0);

    const macdPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.macd)}`).join(' ');
    const signalPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.signal)}`).join(' ');

    const barWidth = Math.max(1, chartWidth / data.length * 0.6);

    const histograms = data.map((d, i) => {
        const x = xScale(i) - barWidth / 2;
        const y = yScale(d.histogram);
        const height = Math.abs(y - zeroY);
        // Ensure bars start from zero line
        const barY = d.histogram >= 0 ? y : zeroY;
        return { x, y: barY, width: barWidth, height, value: d.histogram };
    });

    return { macdPath, signalPath, histograms, zeroY, yScale, xScale, maxVal: boundary };
  }, [data, width]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!data || data.length === 0 || width === 0) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      
      const chartWidth = width - PADDING.left - PADDING.right;
      const index = Math.round(((x - PADDING.left) / chartWidth) * (data.length - 1));
      
      if (index >= 0 && index < data.length) {
          setHoveredData({
              item: data[index],
              x: xScale(index)
          });
      }
  };

  const handleMouseLeave = () => setHoveredData(null);

  if (!data || data.length === 0) return null;

  return (
    <div className="w-full bg-[#121214] rounded-[24px] overflow-hidden border border-white/5 shadow-lg relative">
      <div 
        ref={containerRef} 
        className="relative cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
      <svg width="100%" height={CHART_HEIGHT}>
        {/* Grid Lines */}
        {[maxVal, maxVal/2, 0, -maxVal/2, -maxVal].map((val, i) => {
            if (i === 0 || i === 4) return null; // Skip edges if desired
            const y = yScale(val);
            return (
                <g key={val}>
                    <line 
                        x1={PADDING.left} 
                        y1={y} 
                        x2={width - PADDING.right} 
                        y2={y} 
                        className={`stroke-1 ${val === 0 ? 'stroke-slate-500' : 'stroke-slate-800 stroke-dashed'}`}
                        strokeDasharray={val !== 0 ? "4 4" : ""}
                    />
                    <text 
                        x={width - PADDING.right + 6} 
                        y={y + 3} 
                        className="fill-slate-500 text-[10px]"
                    >
                        {val.toFixed(2)}
                    </text>
                </g>
            );
        })}

        {/* Histogram */}
        {histograms.map((bar, i) => (
            <rect 
                key={i} 
                x={bar.x} 
                y={bar.y} 
                width={bar.width} 
                height={bar.height} 
                className={bar.value >= 0 ? 'fill-emerald-500/50' : 'fill-rose-500/50'} 
                rx="1"
            />
        ))}

        {/* Lines */}
        <path d={macdPath} fill="none" className="stroke-sky-400" strokeWidth="1.5" />
        <path d={signalPath} fill="none" className="stroke-orange-400" strokeWidth="1.5" />

        {/* Hover Interaction */}
        {hoveredData && (
            <g>
                <line x1={hoveredData.x} y1={PADDING.top} x2={hoveredData.x} y2={CHART_HEIGHT - PADDING.bottom} className="stroke-white/30" strokeWidth="1" strokeDasharray="4 4"/>
                
                {/* Markers on lines */}
                <circle cx={hoveredData.x} cy={yScale(hoveredData.item.macd)} r="3" className="fill-sky-400 stroke-white" />
                <circle cx={hoveredData.x} cy={yScale(hoveredData.item.signal)} r="3" className="fill-orange-400 stroke-white" />

                {/* Tooltip */}
                <g transform={`translate(${hoveredData.x > width / 2 ? hoveredData.x - 120 : hoveredData.x + 10}, 10)`}>
                    <rect x="0" y="0" width="110" height="70" rx="8" className="fill-[#18181B]/95 stroke-white/10 stroke-1 shadow-xl backdrop-blur-md" />
                    <text x="10" y="18" className="fill-zinc-400 text-[10px]">{new Date(hoveredData.item.date).toLocaleDateString([], {month: 'short', day: 'numeric'})}</text>
                    <text x="10" y="32" className="fill-sky-400 font-bold text-xs">MACD: {hoveredData.item.macd.toFixed(2)}</text>
                    <text x="10" y="46" className="fill-orange-400 font-bold text-xs">Signal: {hoveredData.item.signal.toFixed(2)}</text>
                    <text x="10" y="60" className={`font-bold text-xs ${hoveredData.item.histogram >= 0 ? 'fill-emerald-400' : 'fill-rose-400'}`}>Hist: {hoveredData.item.histogram.toFixed(2)}</text>
                </g>
            </g>
        )}
      </svg>
      
       <div className="flex justify-center space-x-6 text-[10px] text-slate-400 pb-2 -mt-2 relative z-10">
        <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-sky-400 mr-1.5"></span>MACD</div>
        <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-orange-400 mr-1.5"></span>Signal</div>
        <div className="flex items-center"><span className="w-2 h-2 rounded-sm bg-emerald-500/50 mr-1.5"></span>+ Hist</div>
        <div className="flex items-center"><span className="w-2 h-2 rounded-sm bg-rose-500/50 mr-1.5"></span>- Hist</div>
      </div>
      </div>
    </div>
  );
};

export default MACDChart;
