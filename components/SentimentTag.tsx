
import React from 'react';

interface SentimentTagProps {
    tag: string;
    type?: 'sentiment' | 'consensus';
}

const SentimentTag: React.FC<SentimentTagProps> = ({ tag, type = 'sentiment' }) => {
  if (!tag) return null;

  const tagLower = tag.toLowerCase();

  const colorConfig = {
    sentiment: {
      'highly bullish': 'bg-green-100 text-green-800',
      'bullish': 'bg-green-100 text-green-800',
      'cautiously optimistic': 'bg-sky-100 text-sky-800',
      'mixed': 'bg-yellow-100 text-yellow-800',
      'neutral': 'bg-slate-200 text-slate-800',
      'cautious': 'bg-orange-100 text-orange-800',
      'bearish': 'bg-red-100 text-red-800',
    },
    consensus: {
      'strong buy': 'bg-green-100 text-green-800',
      'cautious buy': 'bg-sky-100 text-sky-800',
      'moderate buy': 'bg-sky-100 text-sky-800',
      'mixed': 'bg-yellow-100 text-yellow-800',
      'hold': 'bg-slate-200 text-slate-800',
      'sell': 'bg-red-100 text-red-800',
      'strong sell': 'bg-red-100 text-red-800',
      'underperform': 'bg-orange-100 text-orange-800',
    }
  };

  const colorClasses = colorConfig[type][tagLower] || 'bg-slate-200 text-slate-800';

  return (
    <div className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-block ${colorClasses}`}>
      {tag}
    </div>
  );
};

export default React.memo(SentimentTag);