import React from 'react';

interface TradingStatusBadgeProps {
  status: string;
  color: 'green' | 'red' | 'gray';
}

const TradingStatusBadge: React.FC<TradingStatusBadgeProps> = ({ status, color }) => {
  const colorClasses = {
    green: 'bg-green-100 text-green-800 ring-green-200',
    red: 'bg-red-100 text-red-800 ring-red-200',
    gray: 'bg-slate-200 text-slate-800 ring-slate-300',
  }[color];

  const dotClasses = {
    green: 'bg-green-500 animate-pulse',
    red: 'bg-red-500',
    gray: 'bg-slate-500',
  }[color];

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${colorClasses}`}>
      <span className={`w-2 h-2 mr-1.5 rounded-full ${dotClasses}`}></span>
      {status}
    </span>
  );
};

export default TradingStatusBadge;