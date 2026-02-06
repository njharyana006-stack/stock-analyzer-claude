
import React from 'react';

interface GaugeChartProps {
  value: number;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ value }) => {
    const percentage = Math.min(Math.max(value, 0), 100);

    let statusText = 'Neutral';
    let textColor = 'text-slate-600';
    let ringColor = '#a855f7'; // purple-500 for neutral

    if (percentage > 70) {
        statusText = 'Overbought';
        textColor = 'text-red-600';
        ringColor = '#ef4444'; // red-500
    } else if (percentage < 30) {
        statusText = 'Oversold';
        textColor = 'text-green-600';
        ringColor = '#22c55e'; // green-500
    }

    const radius = 50;
    const strokeWidth = 12;
    const innerRadius = radius - strokeWidth / 2;
    const circumference = innerRadius * Math.PI; // It's a semi-circle
    const arc = (percentage / 100) * circumference;

    const getArc = (start: number, end: number, color: string) => {
        const startAngle = -90 + start * 1.8;
        const endAngle = -90 + end * 1.8;
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        const startX = radius + innerRadius * Math.cos(startAngle * Math.PI / 180);
        const startY = radius + innerRadius * Math.sin(startAngle * Math.PI / 180);
        const endX = radius + innerRadius * Math.cos(endAngle * Math.PI / 180);
        const endY = radius + innerRadius * Math.sin(endAngle * Math.PI / 180);

        return <path d={`M ${startX} ${startY} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${endX} ${endY}`} stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" />;
    };


    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <div className="relative">
                 <svg width="180" height="90" viewBox="0 0 100 50" className="overflow-visible">
                    {/* Background arcs */}
                    {getArc(0, 30, '#d1d5db')}
                    {getArc(30, 70, '#d1d5db')}
                    {getArc(70, 100, '#d1d5db')}
                    
                    {/* Value arc */}
                    {getArc(0, Math.min(30, percentage), '#22c55e')}
                    {getArc(30, Math.min(70, percentage), '#a855f7')}
                    {getArc(70, percentage, '#ef4444')}
                </svg>
            </div>
            <p className="text-4xl font-bold text-slate-800 mt-1">{value.toFixed(1)}</p>
            <p className={`text-base font-semibold ${textColor}`}>{statusText}</p>
        </div>
    );
};

export default GaugeChart;