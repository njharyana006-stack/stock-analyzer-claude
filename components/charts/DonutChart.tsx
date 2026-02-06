
import React from 'react';

interface DonutChartProps {
  data: {
    label: string;
    value: number;
    color: string;
  }[];
  title?: string;
}

const DonutChart: React.FC<DonutChartProps> = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md h-full flex items-center justify-center">
        <p className="text-sm text-slate-500">No data available.</p>
      </div>
    );
  }

  const radius = 42.5;
  const strokeWidth = 15;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md h-full flex flex-col items-center justify-center">
      {title && <h4 className="text-md font-semibold text-slate-800 mb-4">{title}</h4>}
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          {data.map((segment, index) => {
            if (segment.value === 0) return null;
            const percent = (segment.value / total) * 100;
            const dash = (percent / 100) * circumference;
            const offset = (accumulatedPercent / 100) * circumference;
            accumulatedPercent += percent;

            return (
              <circle
                key={index}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${circumference}`}
                strokeDashoffset={-offset}
                className="transition-all duration-500 ease-out"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-800">{total}</span>
          <span className="text-xs text-slate-500">Total</span>
        </div>
      </div>
       <div className="mt-4 w-full space-y-1">
          {data.filter(s => s.value > 0).map(segment => (
             <div key={segment.label} className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full mr-1.5" style={{backgroundColor: segment.color}}></span>
                    <span className="text-slate-600">{segment.label}</span>
                </div>
                <span className="font-semibold text-slate-700">{((segment.value / total) * 100).toFixed(0)}%</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default DonutChart;