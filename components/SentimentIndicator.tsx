
import React from 'react';

interface SentimentIndicatorProps {
    sentiment: string;
}

const sentimentToValue: Record<string, number> = {
    "bullish": 90,
    "optimistic": 75,
    "mixed": 50,
    "neutral": 50,
    "cautious": 40,
    "bearish": 10,
};

const SentimentIndicator: React.FC<SentimentIndicatorProps> = ({ sentiment }) => {
    const safeSentiment = sentiment || '';
    const value = sentimentToValue[safeSentiment.toLowerCase()] ?? 50;
    
    let color = 'bg-slate-400';
    if (value > 60) color = 'bg-green-500';
    else if (value < 45) color = 'bg-red-500';
    
    return (
        <div className="space-y-1">
            <p className="font-semibold text-xs text-slate-700">{sentiment}</p>
            <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${value}%` }}></div>
            </div>
        </div>
    )
};

export default SentimentIndicator;
