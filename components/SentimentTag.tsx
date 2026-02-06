
import React from 'react';

interface SentimentTagProps {
    tag: string;
    type?: 'sentiment' | 'consensus';
}

const SentimentTag: React.FC<SentimentTagProps> = ({ tag, type = 'sentiment' }) => {
    if (!tag) return null;

    const tagLower = tag.toLowerCase();

    // Unified dark-mode-first color system
    const colorConfig: Record<string, Record<string, { bg: string; text: string; border: string }>> = {
        sentiment: {
            'highly bullish': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
            'bullish': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
            'cautiously optimistic': { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20' },
            'mixed': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
            'neutral': { bg: 'bg-white/5', text: 'text-zinc-400', border: 'border-white/10' },
            'cautious': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
            'bearish': { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
        },
        consensus: {
            'strong buy': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
            'cautious buy': { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20' },
            'moderate buy': { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20' },
            'mixed': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
            'hold': { bg: 'bg-white/5', text: 'text-zinc-400', border: 'border-white/10' },
            'sell': { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
            'strong sell': { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
            'underperform': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
        }
    };

    const defaultStyle = { bg: 'bg-white/5', text: 'text-zinc-400', border: 'border-white/10' };
    const style = colorConfig[type]?.[tagLower] || defaultStyle;

    return (
        <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold rounded-lg border ${style.bg} ${style.text} ${style.border}`}>
            {tag}
        </span>
    );
};

export default React.memo(SentimentTag);
