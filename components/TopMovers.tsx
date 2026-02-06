
import React from 'react';
import type { TopMover } from '../types';
import { SparklesIcon } from './icons';

interface TopMoversProps {
    topMovers?: {
        top_gainers: TopMover[];
    };
    isLoading?: boolean;
    onSelectTicker?: (ticker: string) => void;
    title?: string;
    limit?: number;
}

// Mock data for My Watchlist visual replication
const watchlistMock: TopMover[] = [
    { ticker: 'INVC', name: 'Innovate Corp', price: '$145.80', change: '+1.23%', percent_change: '+1.23%', is_positive: true },
    { ticker: 'QNTM', name: 'Quantum Systems', price: '$3,210.50', change: '+0.89%', percent_change: '+0.89%', is_positive: true },
];

const StockRow: React.FC<{ item: TopMover }> = ({ item }) => {
    const isPos = item.is_positive;
    const color = isPos ? 'text-[#00C853]' : 'text-[#FF5252]';
    
    return (
        <div className="flex items-center justify-between h-[60px] border-b border-[#2C3646] last:border-0">
            <div className="flex items-center gap-3">
                <div className="w-[40px] h-[40px] rounded-full bg-[#2C3646] flex items-center justify-center text-white font-bold text-xs">
                    {item.ticker.substring(0, 1)}
                </div>
                <div className="flex flex-col">
                    <span className="text-[14px] font-bold text-white">{item.ticker}</span>
                    <span className="text-[13px] text-[#B0B8C4]">{item.name}</span>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-[14px] font-bold text-white">{item.price}</span>
                <span className={`text-[12px] ${color}`}>{item.percent_change}</span>
            </div>
        </div>
    );
};

const TopMovers: React.FC<TopMoversProps> = ({ topMovers, title = "Top Gainers", limit = 3 }) => {
    const data = title === "My Watchlist" ? watchlistMock : (topMovers?.top_gainers || []);
    const displayData = data.slice(0, limit);

    return (
        <div className="bg-[#1A2332] rounded-[12px] p-4 shadow-card w-full">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-[16px] font-bold text-white">{title}</h3>
                <SparklesIcon className="w-4 h-4 text-[#B0B8C4]" />
            </div>
            
            <div className="flex flex-col">
                {displayData.map((mover, idx) => (
                    <StockRow key={idx} item={mover} />
                ))}
                {displayData.length === 0 && (
                    <div className="py-8 flex flex-col items-center justify-center text-center opacity-60">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2">
                            <SparklesIcon className="w-5 h-5 text-[#B0B8C4]" />
                        </div>
                        <span className="text-[#B0B8C4] text-xs font-medium">Awaiting market data</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopMovers;
