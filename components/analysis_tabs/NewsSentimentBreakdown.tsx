
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
    textColorClass: string; 
    bgColorClass: string; 
}> = ({ title, items, icon, textColorClass, bgColorClass }) => (
    <div className="g-card !p-0 overflow-hidden h-full flex flex-col bg-white dark:bg-[#18181B] border border-slate-200 dark:border-white/5">
        <div className={`flex items-center p-4 ${bgColorClass} border-b border-transparent dark:border-white/5`}>
            <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full mr-3 bg-white/50 dark:bg-white/10`}>
                 {React.cloneElement(icon, { className: `w-5 h-5 ${textColorClass}` })}
            </div>
            <h4 className={`text-lg font-bold ${textColorClass}`}>{title}</h4>
        </div>
        <div className="p-4 space-y-4 flex-grow">
            {items && items.length > 0 ? (
                items.map((item, index) => (
                    <div key={index} className="pb-4 border-b border-slate-100 dark:border-white/5 last:border-0 last:pb-0">
                        <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">{item.summary}</p>
                        <p className="text-xs text-slate-400 dark:text-zinc-500 mt-2 font-bold uppercase tracking-wider">- {item.source}</p>
                    </div>
                ))
            ) : (
                 <div className="text-sm p-6 text-center text-slate-400 dark:text-zinc-600 h-full flex items-center justify-center font-medium">
                    No {title.toLowerCase()} news found.
                </div>
            )}
        </div>
    </div>
);

const NewsSentimentBreakdown: React.FC<NewsSentimentBreakdownProps> = ({ data }) => {
    if (!data) {
        return (
            <div className="g-card !p-6 text-center text-slate-500 dark:text-zinc-500">
                News sentiment data is currently unavailable.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SentimentColumn 
                title="Positive" 
                items={data.positive} 
                icon={<PositiveNewsIcon />} 
                textColorClass="text-emerald-700 dark:text-emerald-400"
                bgColorClass="bg-emerald-50 dark:bg-emerald-500/10"
            />
            <SentimentColumn 
                title="Negative" 
                items={data.negative} 
                icon={<NegativeNewsIcon />} 
                textColorClass="text-rose-700 dark:text-rose-400"
                bgColorClass="bg-rose-50 dark:bg-rose-500/10"
            />
            <SentimentColumn 
                title="Neutral" 
                items={data.neutral} 
                icon={<NeutralNewsIcon />} 
                textColorClass="text-slate-700 dark:text-slate-200"
                bgColorClass="bg-slate-100 dark:bg-white/5"
            />
        </div>
    );
};

export default NewsSentimentBreakdown;
