
import React, { useState, useRef, useMemo } from 'react';

interface SparklineProps {
    data: number[];
    isPositive?: boolean;
    className?: string;
    dates?: string[]; // Optional dates for tooltip
}

// Helper functions moved outside component to be stable and clean
const line = (pointA: number[], pointB: number[]) => {
    const lengthX = pointB[0] - pointA[0];
    const lengthY = pointB[1] - pointA[1];
    return {
        length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
        angle: Math.atan2(lengthY, lengthX)
    }
}

const controlPoint = (current: number[], previous: number[], next: number[], reverse?: boolean) => {
    const p = previous || current;
    const n = next || current;
    const smoothing = 0.2;
    const o = line(p, n);
    const angle = o.angle + (reverse ? Math.PI : 0);
    const length = o.length * smoothing;
    const x = current[0] + Math.cos(angle) * length;
    const y = current[1] + Math.sin(angle) * length;
    return [x, y];
}

const bezierCommand = (point: number[], i: number, a: number[][]) => {
    const [cpsX, cpsY] = controlPoint(a[i - 1], a[i - 2], point);
    const [cpeX, cpeY] = controlPoint(point, a[i - 1], a[i + 1], true);
    return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`;
}

const svgPath = (points: number[][], command: (point: number[], i: number, a: number[][]) => string) => {
    return points.reduce((acc, point, i, a) => i === 0 ? `M ${point[0]},${point[1]}` : `${acc} ${command(point, i, a)}`, '');
}

const Sparkline: React.FC<SparklineProps> = ({ data, isPositive = true, className, dates }) => {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const width = 120;
    const height = 40;

    // Calculate points unconditionally (handle empty data inside)
    const points = useMemo(() => {
        if (!data || !Array.isArray(data) || data.length < 2) return [];
        
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min === 0 ? 1 : max - min;

        return data.map((d, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - (((d - min) / range) * (height - 4)) - 2; 
            return [x, y];
        });
    }, [data]);

    // Calculate path unconditionally
    const d = useMemo(() => {
        if (points.length === 0) return '';
        return svgPath(points, bezierCommand);
    }, [points]);

    // Early return AFTER hooks are called
    if (!data || !Array.isArray(data) || data.length < 2) {
        return <div className={`w-full h-full ${className}`} />;
    }

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const index = Math.round((mouseX / rect.width) * (data.length - 1));
        setHoverIndex(Math.max(0, Math.min(data.length - 1, index)));
    };

    const handleMouseLeave = () => {
        setHoverIndex(null);
    };

    return (
        <div className="relative w-full h-full group">
            <svg 
                ref={svgRef}
                viewBox={`0 0 ${width} ${height}`} 
                className={`w-full h-full overflow-visible ${className}`} 
                preserveAspectRatio="none"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
                <path
                    d={d}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                />
                
                {/* Hover Indicator */}
                {hoverIndex !== null && points[hoverIndex] && (
                    <g>
                        <circle 
                            cx={points[hoverIndex][0]} 
                            cy={points[hoverIndex][1]} 
                            r="3" 
                            className="fill-white stroke-current" 
                            strokeWidth="2" 
                        />
                        <line 
                            x1={points[hoverIndex][0]} 
                            y1={0} 
                            x2={points[hoverIndex][0]} 
                            y2={height} 
                            stroke="currentColor" 
                            strokeWidth="1" 
                            strokeDasharray="2 2" 
                            opacity="0.5" 
                        />
                    </g>
                )}
                
                {/* Transparent overlay for easier hovering */}
                <rect width={width} height={height} fill="transparent" />
            </svg>

            {/* Tooltip */}
            {hoverIndex !== null && data[hoverIndex] !== undefined && (
                <div 
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded shadow-lg pointer-events-none whitespace-nowrap z-20"
                    style={{ 
                        left: `${(hoverIndex / (data.length - 1)) * 100}%`,
                        transform: `translateX(-50%)`
                    }}
                >
                    <div className="font-bold">{data[hoverIndex].toFixed(2)}</div>
                    {dates && dates[hoverIndex] && <div className="text-slate-400 text-[9px]">{dates[hoverIndex]}</div>}
                </div>
            )}
        </div>
    );
};

export default Sparkline;
