
import React from 'react';
import type { ChartAnnotation } from '../types';
import { GrowthIcon, TrendingDownIcon, VolumeUpIcon, ChevronDoubleUpIcon, SparklesIcon } from './icons';

interface ChartAnnotationsProps {
    annotations: ChartAnnotation[];
    dateToIndexMap: Map<string, number>;
    xScale: (index: number) => number;
    yScale: (value: number) => number;
    width: number;
    height: number;
    padding: { top: number; right: number; bottom: number; left: number };
}

/**
 * An overlay component for stock charts that displays automated AI-generated annotations.
 * It renders visual markers for events like volume spikes, breakouts, and crossovers.
 * Note: Support and Resistance are now handled globally by the parent chart component.
 * @param {ChartAnnotationsProps} props The component props.
 * @returns {JSX.Element} The rendered annotations layer.
 */
const ChartAnnotations: React.FC<ChartAnnotationsProps> = ({ annotations, dateToIndexMap, xScale, yScale, width, height, padding }) => {

    const renderAnnotation = (anno: ChartAnnotation, index: number) => {
        const dateKey = new Date(anno.date).toISOString().split('T')[0];
        const pointIndex = dateToIndexMap.get(dateKey);

        if (pointIndex === undefined) return null;

        switch (anno.type) {
            case 'SUPPORT':
            case 'RESISTANCE':
                // These are now handled as horizontal lines in the main PriceChart component
                return null;
            
            case 'MOVING_AVERAGE_CROSSOVER':
                 const x = xScale(pointIndex);
                 const yPos = anno.price ? yScale(anno.price) : height / 2;
                 const isBullish = anno.direction === 'bullish';
                 const Icon = isBullish ? GrowthIcon : TrendingDownIcon;
                 const iconColor = isBullish ? 'text-green-500' : 'text-red-500';

                 return (
                     <g key={index} transform={`translate(${x}, ${yPos})`} className="group cursor-pointer">
                         <circle r="14" className={`${isBullish ? 'fill-green-100/80 stroke-green-200' : 'fill-red-100/80 stroke-red-200'}`} strokeWidth="1" />
                         <foreignObject x={-8} y={-8} width={16} height={16}>
                            <Icon className={`w-4 h-4 ${iconColor}`} />
                         </foreignObject>
                         <foreignObject x={15} y={-15} width={180} height={100} className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                            <div className="bg-slate-800 text-white text-xs rounded-lg p-3 shadow-xl border border-slate-700">
                                <p className="font-bold mb-1">{isBullish ? 'Bullish Cross' : 'Bearish Cross'}</p>
                                {anno.description}
                            </div>
                        </foreignObject>
                     </g>
                 );
            
            case 'VOLUME_SPIKE':
                const volX = xScale(pointIndex);
                return (
                     <g key={index} className="group cursor-pointer">
                        <line x1={volX} y1={padding.top} x2={volX} y2={height - padding.bottom} stroke="rgba(99, 102, 241, 0.3)" strokeWidth="1" strokeDasharray="4 2"/>
                        <circle cx={volX} cy={height-padding.bottom} r={6} className="fill-indigo-500" />
                        <foreignObject x={volX > width/2 ? volX - 160 : volX + 10} y={height - padding.bottom - 60} width={150} height={100} className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                            <div className="bg-slate-800 text-white text-xs rounded-lg p-3 shadow-xl border border-slate-700">
                                <p className="font-bold mb-1 flex items-center"><VolumeUpIcon className="w-3 h-3 mr-1" /> High Volume</p>
                                {anno.description}
                            </div>
                        </foreignObject>
                     </g>
                );

            case 'BREAKOUT':
            case 'MOMENTUM_SHIFT':
                 const evtX = xScale(pointIndex);
                 const evtY = anno.price ? yScale(anno.price) : (height - padding.bottom)/2;
                 return (
                     <g key={index} transform={`translate(${evtX}, ${evtY})`} className="group cursor-pointer">
                        <circle r="5" className="fill-sky-400 animate-pulse" />
                        <circle r="10" className="stroke-sky-400 fill-transparent" strokeWidth="1.5" />
                        <foreignObject x={15} y={-20} width={160} height={100} className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                             <div className="bg-slate-800 text-white text-xs rounded-lg p-3 shadow-xl border border-slate-700">
                                <p className="font-bold mb-1 flex items-center"><SparklesIcon className="w-3 h-3 mr-1 text-sky-400" /> {anno.type === 'BREAKOUT' ? 'Breakout' : 'Momentum'}</p>
                                {anno.description}
                            </div>
                        </foreignObject>
                     </g>
                 );

            default:
                return null;
        }
    };
    
    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <svg width={width} height={height} className="overflow-visible">
                {annotations.map(renderAnnotation)}
            </svg>
        </div>
    );
};

export default ChartAnnotations;
