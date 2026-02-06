
import React, { useState, useEffect, useRef } from 'react';

interface DataPoint {
    date: string;
    value: number;
}

interface AreaChartGradientProps {
    stockData: DataPoint[];
    comparisonData: DataPoint[]; // e.g., S&P 500
    stockLabel?: string;
    comparisonLabel?: string;
    height?: number;
    showTimeRange?: boolean;
}

type TimeRange = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y';

const AreaChartGradient: React.FC<AreaChartGradientProps> = ({
    stockData,
    comparisonData,
    stockLabel = 'Stock',
    comparisonLabel = 'S&P 500',
    height = 400,
    showTimeRange = true,
}) => {
    const [timeRange, setTimeRange] = useState<TimeRange>('1M');
    const [hoveredPoint, setHoveredPoint] = useState<{ x: number; stockValue: number; compValue: number; date: string } | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter data based on time range
    const getFilteredData = (data: DataPoint[], range: TimeRange) => {
        const now = new Date();
        const cutoffDate = new Date(now);

        switch (range) {
            case '1D':
                cutoffDate.setDate(now.getDate() - 1);
                break;
            case '1W':
                cutoffDate.setDate(now.getDate() - 7);
                break;
            case '1M':
                cutoffDate.setMonth(now.getMonth() - 1);
                break;
            case '3M':
                cutoffDate.setMonth(now.getMonth() - 3);
                break;
            case '6M':
                cutoffDate.setMonth(now.getMonth() - 6);
                break;
            case '1Y':
                cutoffDate.setFullYear(now.getFullYear() - 1);
                break;
        }

        return data.filter(point => new Date(point.date) >= cutoffDate);
    };

    const filteredStockData = getFilteredData(stockData, timeRange);
    const filteredCompData = getFilteredData(comparisonData, timeRange);

    // Draw chart on canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size with device pixel ratio for sharp rendering
        const dpr = window.devicePixelRatio || 1;
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(dpr, dpr);

        const padding = { top: 20, right: 20, bottom: 40, left: 50 };
        const chartWidth = rect.width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        // Clear canvas
        ctx.clearRect(0, 0, rect.width, height);

        if (filteredStockData.length === 0 || filteredCompData.length === 0) {
            // Draw "No data" message
            ctx.fillStyle = '#94a3b8';
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('No data available for this time range', rect.width / 2, height / 2);
            return;
        }

        // Find min and max values for scaling
        const allValues = [...filteredStockData.map(d => d.value), ...filteredCompData.map(d => d.value)];
        const minValue = Math.min(...allValues);
        const maxValue = Math.max(...allValues);
        const valueRange = maxValue - minValue;

        // Helper function to get x position
        const getX = (index: number, dataLength: number) => {
            return padding.left + (index / (dataLength - 1)) * chartWidth;
        };

        // Helper function to get y position
        const getY = (value: number) => {
            return padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;
        };

        // Draw grid lines
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (chartHeight / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(padding.left + chartWidth, y);
            ctx.stroke();
        }

        // Draw comparison (S&P 500) area - teal
        ctx.beginPath();
        ctx.moveTo(getX(0, filteredCompData.length), getY(filteredCompData[0].value));
        filteredCompData.forEach((point, index) => {
            ctx.lineTo(getX(index, filteredCompData.length), getY(point.value));
        });
        ctx.lineTo(getX(filteredCompData.length - 1, filteredCompData.length), padding.top + chartHeight);
        ctx.lineTo(padding.left, padding.top + chartHeight);
        ctx.closePath();

        // Teal gradient fill
        const tealGradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
        tealGradient.addColorStop(0, 'rgba(20, 184, 166, 0.4)');
        tealGradient.addColorStop(1, 'rgba(20, 184, 166, 0.05)');
        ctx.fillStyle = tealGradient;
        ctx.fill();

        // Draw comparison line
        ctx.beginPath();
        ctx.moveTo(getX(0, filteredCompData.length), getY(filteredCompData[0].value));
        filteredCompData.forEach((point, index) => {
            ctx.lineTo(getX(index, filteredCompData.length), getY(point.value));
        });
        ctx.strokeStyle = '#14B8A6';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw stock area - purple
        ctx.beginPath();
        ctx.moveTo(getX(0, filteredStockData.length), getY(filteredStockData[0].value));
        filteredStockData.forEach((point, index) => {
            ctx.lineTo(getX(index, filteredStockData.length), getY(point.value));
        });
        ctx.lineTo(getX(filteredStockData.length - 1, filteredStockData.length), padding.top + chartHeight);
        ctx.lineTo(padding.left, padding.top + chartHeight);
        ctx.closePath();

        // Purple gradient fill
        const purpleGradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
        purpleGradient.addColorStop(0, 'rgba(139, 92, 246, 0.5)');
        purpleGradient.addColorStop(1, 'rgba(139, 92, 246, 0.05)');
        ctx.fillStyle = purpleGradient;
        ctx.fill();

        // Draw stock line
        ctx.beginPath();
        ctx.moveTo(getX(0, filteredStockData.length), getY(filteredStockData[0].value));
        filteredStockData.forEach((point, index) => {
            ctx.lineTo(getX(index, filteredStockData.length), getY(point.value));
        });
        ctx.strokeStyle = '#8B5CF6';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw y-axis labels
        ctx.fillStyle = '#64748b';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'right';
        for (let i = 0; i <= 4; i++) {
            const value = minValue + (valueRange / 4) * (4 - i);
            const y = padding.top + (chartHeight / 4) * i;
            ctx.fillText(`$${value.toFixed(0)}`, padding.left - 10, y + 4);
        }

        // Draw x-axis labels (dates)
        ctx.textAlign = 'center';
        const labelCount = 5;
        for (let i = 0; i < labelCount; i++) {
            const index = Math.floor((filteredStockData.length - 1) * (i / (labelCount - 1)));
            const point = filteredStockData[index];
            if (point) {
                const date = new Date(point.date);
                const label = `${date.getMonth() + 1}/${date.getDate()}`;
                const x = getX(index, filteredStockData.length);
                ctx.fillText(label, x, padding.top + chartHeight + 20);
            }
        }

    }, [filteredStockData, filteredCompData, height, timeRange]);

    // Handle mouse move for tooltip
    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas || filteredStockData.length === 0) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const padding = { left: 50, right: 20 };
        const chartWidth = rect.width - padding.left - padding.right;

        // Find closest data point
        const index = Math.round(((x - padding.left) / chartWidth) * (filteredStockData.length - 1));
        if (index >= 0 && index < filteredStockData.length && index < filteredCompData.length) {
            setHoveredPoint({
                x: e.clientX - rect.left,
                stockValue: filteredStockData[index].value,
                compValue: filteredCompData[index].value,
                date: filteredStockData[index].date,
            });
        }
    };

    const handleMouseLeave = () => {
        setHoveredPoint(null);
    };

    return (
        <div className="relative">
            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full" />
                    <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">{stockLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full" />
                    <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">{comparisonLabel}</span>
                </div>
            </div>

            {/* Time Range Selector */}
            {showTimeRange && (
                <div className="flex items-center justify-center gap-2 mb-4">
                    {(['1D', '1W', '1M', '3M', '6M', '1Y'] as TimeRange[]).map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                                timeRange === range
                                    ? 'bg-indigo-500 text-white shadow-md'
                                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-white/10'
                            }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            )}

            {/* Chart Container */}
            <div ref={containerRef} className="relative bg-white dark:bg-[#1C1C1E] rounded-2xl border border-slate-100 dark:border-white/5 p-4 shadow-sm">
                <canvas
                    ref={canvasRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="cursor-crosshair"
                />

                {/* Tooltip */}
                {hoveredPoint && (
                    <div
                        className="absolute bg-slate-900 dark:bg-slate-800 text-white px-3 py-2 rounded-lg shadow-xl text-xs font-semibold z-10 pointer-events-none animate-fade-in"
                        style={{
                            left: `${hoveredPoint.x}px`,
                            top: '20px',
                            transform: 'translateX(-50%)',
                        }}
                    >
                        <div className="text-[10px] text-slate-300 mb-1">
                            {new Date(hoveredPoint.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <div className="w-2 h-2 rounded-full bg-purple-500" />
                            <span>{stockLabel}: ${hoveredPoint.stockValue.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-teal-500" />
                            <span>{comparisonLabel}: ${hoveredPoint.compValue.toFixed(2)}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(AreaChartGradient);
