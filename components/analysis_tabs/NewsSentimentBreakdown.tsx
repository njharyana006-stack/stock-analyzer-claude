
import React from 'react';
import type { NewsSentimentBreakdown, NewsSentimentItem } from '../../types';
import { PositiveNewsIcon, NegativeNewsIcon, NeutralNewsIcon } from '../icons';

interface NewsSentimentBreakdownProps {
    data: NewsSentimentBreakdown;
}

const SentimentColumn: React.FC<{
    title: string;
    items: NewsSentimentItem[];
    icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
    accentColor: string;
    glowColor: string;
}> = ({ title, items, icon, accentColor, glowColor }) => (
    <div className="flex flex-col h-full relative overflow-hidden">
        {/* Header */}
        <div className="relative p-4 flex items-center gap-3 border-b border-white/[0.04]">
            <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: `linear-gradient(180deg, ${glowColor}08, transparent)` }} />
            <div className="relative w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accentColor}15` }}>
                {React.cloneElement(icon, { className: `w-4 h-4`, style: { color: accentColor } })}
            </div>
            <h4 className="text-sm font-bold relative" style={{ color: accentColor }}>{title}</h4>
            {items && items.length > 0 && (
                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-md relative" style={{ backgroundColor: `${accentColor}12`, color: accentColor }}>
                    {items.length}
                </span>
            )}
        </div>

        {/* Items */}
        <div className="p-4 space-y-3 flex-grow">
            {items && items.length > 0 ? (
                items.map((item, index) => (
                    <div key={index} className="group p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all duration-200">
                        <p className="text-sm text-zinc-300 leading-relaxed font-medium">{item.summary}</p>
                        <p className="text-[10px] text-zinc-600 mt-2 font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: accentColor }} />
                            {item.source}
                        </p>
                    </div>
                ))
            ) : (
                <div className="text-sm p-6 text-center text-zinc-600 h-full flex items-center justify-center font-medium">
                    No {title.toLowerCase()} news found.
                </div>
            )}
        </div>
    </div>
);

const NewsSentimentBreakdownComponent: React.FC<NewsSentimentBreakdownProps> = ({ data }) => {
    if (!data) {
        return (
            <div className="p-8 text-center text-zinc-500 border border-dashed border-white/10 rounded-[20px] bg-white/[0.02]">
                News sentiment data is currently unavailable.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.04]">
            <SentimentColumn
                title="Positive"
                items={data.positive}
                icon={<PositiveNewsIcon />}
                accentColor="#10B981"
                glowColor="#10B981"
            />
            <SentimentColumn
                title="Negative"
                items={data.negative}
                icon={<NegativeNewsIcon />}
                accentColor="#F43F5E"
                glowColor="#F43F5E"
            />
            <SentimentColumn
                title="Neutral"
                items={data.neutral}
                icon={<NeutralNewsIcon />}
                accentColor="#71717A"
                glowColor="#71717A"
            />
        </div>
    );
};

export default NewsSentimentBreakdownComponent;
