import React, { useRef, useState, useLayoutEffect, useMemo } from 'react';

type HistoricalDataPoint = { date: string; value: number };
type PredictionDataPoint = {
    date: string;
    prediction: number;
    upper_bound: number;
    lower_bound: number;
};

interface PredictionChartProps {
  historicalData: HistoricalDataPoint[];
  predictionData: PredictionDataPoint[];
}

const PADDING = { top: 20, right: 40, bottom: 30, left: 10 };

/**
 * An interactive chart for visualizing historical price data alongside AI-powered predictions.
 * It renders line charts for both datasets and a shaded area representing the confidence
 * interval of the prediction.
 * @param {PredictionChartProps} props The component props.
 * @returns {JSX.Element} The rendered prediction chart.
 */
const PredictionChart: React.FC<PredictionChartProps> = ({ historicalData, predictionData }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 300 });
  const [hoveredData, setHoveredData] = useState<{ point: PredictionDataPoint, x: number } | null>(null);
  
  const fullDataset = useMemo(() => {
    return [
      ...historicalData.map(d => ({...d, type: 'history'})),
      ...predictionData.map(d => ({ date: d.date, value: d.prediction, type: 'prediction' }))
    ]
  }, [historicalData, predictionData]);

  const { xScale, yScale, minVal, maxVal } = useMemo(() => {
    if (fullDataset.length === 0) {
      return { xScale: () => 0, yScale: () => 0, minVal: 0, maxVal: 0 };
    }

    const allValues = [
        ...historicalData.map(d => d.value),
        ...predictionData.flatMap(d => [d.lower_bound, d.upper_bound])
    ];
    
    const minV = Math.min(...allValues);
    const maxV = Math.max(...allValues);
    const valRange = (maxV - minV) === 0 ? 1 : (maxV - minV);
    
    const xScale = (index: number) => PADDING.left + (index / (fullDataset.length - 1)) * (size.width - PADDING.left - PADDING.right);
    const yScale = (val: number) => PADDING.top + (1 - (val - minV) / valRange) * (size.height - PADDING.top - PADDING.bottom);
    
    return { xScale, yScale, minVal: minV, maxVal: maxV };
  }, [fullDataset, size.width, size.height]);
  
  useLayoutEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setSize({ width: containerRef.current.offsetWidth, height: 300 });
      }
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleMouseMove = (event: React.MouseEvent<SVGRectElement>) => {
     if (predictionData.length === 0) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    
    const predictionStartIndex = historicalData.length;
    const predictionPointsCount = predictionData.length;

    const indexInFull = Math.round(((mouseX - PADDING.left) / (size.width - PADDING.left - PADDING.right)) * (fullDataset.length - 1));
    
    // Only show tooltip for prediction area
    if (indexInFull < predictionStartIndex) {
        setHoveredData(null);
        return;
    }
    
    const indexInPrediction = indexInFull - predictionStartIndex;
    
    const point = predictionData[indexInPrediction];
    if (!point) return;

    setHoveredData({ point, x: xScale(indexInFull) });
  };
  
  const handleMouseLeave = () => setHoveredData(null);

  const historicalPath = historicalData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.value)}`).join(' ');
  const predictionPath = predictionData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(historicalData.length -1 + i)} ${yScale(d.prediction)}`).join(' ');
  
  const confidenceAreaPath = predictionData.length > 0 ?
      (predictionData.map((d, i) => `L ${xScale(historicalData.length - 1 + i)} ${yScale(d.upper_bound)}`).join(' ') +
      predictionData.slice().reverse().map((d, i) => `L ${xScale(historicalData.length - 1 + predictionData.length - 1 - i)} ${yScale(d.lower_bound)}`).join(' '))
      : '';
  
  const fullConfidencePath = predictionData.length > 0 
    ? `M ${xScale(historicalData.length - 1)} ${yScale(predictionData[0].upper_bound)} ${confidenceAreaPath} Z`
    : '';

  return (
    <div ref={containerRef} className="w-full h-[300px]">
      <svg width="100%" height={size.height}>
         {/* Grid Lines & Y-Axis Labels */}
            {Array.from({ length: 5 }).map((_, i) => {
                const y = PADDING.top + (i / 4) * (size.height - PADDING.top - PADDING.bottom);
                const value = maxVal - (i / 4) * (maxVal - minVal);
                return (
                    <g key={i}>
                        <line x1={PADDING.left} y1={y} x2={size.width - PADDING.right} y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="2 4"/>
                        <text x={size.width - PADDING.right + 4} y={y + 4} fill="#6b7280" fontSize="10">${value.toFixed(2)}</text>
                    </g>
                );
            })}
        
        {/* Confidence Area */}
        <path d={fullConfidencePath} fill="#4f46e5" opacity="0.1" />

        {/* Historical Data Line */}
        <path d={historicalPath} fill="none" stroke="#64748b" strokeWidth="2" />

        {/* Prediction Data Line */}
        <path d={predictionPath} fill="none" stroke="#4f46e5" strokeWidth="2" strokeDasharray="4 4" />
        
        {/* Interaction Layer */}
        {hoveredData && (
            <g>
                <line x1={hoveredData.x} y1={PADDING.top} x2={hoveredData.x} y2={size.height - PADDING.bottom} stroke="#9ca3af" strokeWidth="1" strokeDasharray="3 3"/>
                <circle cx={hoveredData.x} cy={yScale(hoveredData.point.prediction)} r="4" fill="#4f46e5" stroke="white" strokeWidth="2"/>

                 <g transform={`translate(${hoveredData.x > size.width / 2 ? hoveredData.x - 145 : hoveredData.x + 15}, ${PADDING.top})`}>
                    <rect x="0" y="0" width="130" height="60" rx="4" fill="rgba(17, 24, 39, 0.85)" />
                    <text x="10" y="16" fill="#d1d5db" fontSize="10">{new Date(hoveredData.point.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</text>
                    <text x="10" y="34" fill="white" fontSize="12">Pred: <tspan fontWeight="bold">${hoveredData.point.prediction.toFixed(2)}</tspan></text>
                    <text x="10" y="50" fill="#d1d5db" fontSize="10">Range: ${hoveredData.point.lower_bound.toFixed(2)} - ${hoveredData.point.upper_bound.toFixed(2)}</text>
                </g>
            </g>
        )}

        <rect 
            x={PADDING.left}
            y={PADDING.top}
            width={size.width - PADDING.left - PADDING.right}
            height={size.height - PADDING.top - PADDING.bottom}
            fill="transparent"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        />
      </svg>
    </div>
  );
};

export default PredictionChart;
