
import React, { useMemo, useState } from 'react';
import type { ChartAnnotation } from '../../types';
import { timeAgo } from '../../utils';
import { GrowthIcon, TrendingDownIcon, VolumeUpIcon, SparklesIcon, ChevronDoubleUpIcon, ShieldExclamationIcon, RssIcon } from '../icons';

type HistoricalDataPoint = { date: string; close: number };

interface TimelineEvent {
    date: string;
    type: 'PriceMove' | ChartAnnotation['type'];
    description: string;
    value?: number; // e.g., percentage change
    icon: React.ReactElement;
}

interface SignificantEventsTimelineProps {
    historicalData: HistoricalDataPoint[];
    annotations?: ChartAnnotation[];
}

const SIGNIFICANT_MOVE_THRESHOLD = 5; // 5%

const getIconForAnnotation = (anno: ChartAnnotation) => {
    const props = { className: "w-4 h-4 text-white" };
    switch (anno.type) {
        case 'SUPPORT': return <ShieldExclamationIcon {...props} />;
        case 'RESISTANCE': return <ShieldExclamationIcon {...props} />;
        case 'VOLUME_SPIKE': return <VolumeUpIcon {...props} />;
        case 'BREAKOUT': return <ChevronDoubleUpIcon {...props} />;
        case 'MOMENTUM_SHIFT': return <SparklesIcon {...props} />;
        case 'MOVING_AVERAGE_CROSSOVER':
            return anno.direction === 'bullish' ? <GrowthIcon {...props} /> : <TrendingDownIcon {...props} />;
        default: return <RssIcon {...props} />;
    }
};

const getColorForAnnotation = (anno: ChartAnnotation) => {
    switch (anno.type) {
        case 'SUPPORT': return 'bg-green-500';
        case 'RESISTANCE': return 'bg-red-500';
        case 'VOLUME_SPIKE': return 'bg-indigo-500';
        case 'BREAKOUT': return 'bg-sky-500';
        case 'MOVING_AVERAGE_CROSSOVER':
            return anno.direction === 'bullish' ? 'bg-green-500' : 'bg-red-500';
        default: return 'bg-slate-500';
    }
}

const SignificantEventsTimeline: React.FC<SignificantEventsTimelineProps> = ({ historicalData, annotations }) => {
    
    const events: TimelineEvent[] = useMemo(() => {
        const allEvents: TimelineEvent[] = [];

        if (!historicalData || historicalData.length === 0) return allEvents;

        // 1. Process significant price moves
        for (let i = 1; i < historicalData.length; i++) {
            const prev = historicalData[i-1];
            const curr = historicalData[i];
            const change = ((curr.close - prev.close) / prev.close) * 100;
            if (Math.abs(change) >= SIGNIFICANT_MOVE_THRESHOLD) {
                allEvents.push({
                    date: curr.date,
                    type: 'PriceMove',
                    description: `Price ${change > 0 ? 'gained' : 'lost'} ${Math.abs(change).toFixed(1)}%`,
                    value: change,
                    icon: change > 0 ? <GrowthIcon className="w-4 h-4 text-white" /> : <TrendingDownIcon className="w-4 h-4 text-white" />
                });
            }
        }
        
        // 2. Process AI annotations
        if(annotations) {
            annotations.forEach(anno => {
                // Filter out support/resistance lines as they are not point-in-time events
                if (anno.type !== 'SUPPORT' && anno.type !== 'RESISTANCE') {
                     allEvents.push({
                        date: anno.date,
                        type: anno.type,
                        description: anno.description,
                        icon: getIconForAnnotation(anno)
                    });
                }
            });
        }
        
        // 3. Sort by date
        return allEvents.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    }, [historicalData, annotations]);

    const [visibleCount, setVisibleCount] = useState(5);

    if (events.length === 0) {
        return <div className="text-center text-sm text-slate-500 p-4 bg-slate-50 rounded-lg">No significant events or annotations found in this timeframe.</div>
    }

    return (
        <div className="flow-root">
            <ul className="-mb-8">
                {events.slice(0, visibleCount).map((event, eventIdx) => (
                    <li key={event.date + event.type + eventIdx}>
                        <div className="relative pb-8">
                            {eventIdx !== events.length - 1 && (
                                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                            )}
                            <div className="relative flex space-x-3 items-start">
                                <div>
                                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-white ${event.type === 'PriceMove' ? (event.value! > 0 ? 'bg-green-500' : 'bg-red-500') : getColorForAnnotation(event as unknown as ChartAnnotation)}`}>
                                        {event.icon}
                                    </span>
                                </div>
                                <div className="min-w-0 flex-1 pt-1.5">
                                    <p className="text-sm text-slate-500">
                                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                    <p className="font-medium text-slate-900">{event.description}</p>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
             {visibleCount < events.length && (
                <div className="mt-4 text-center">
                    <button 
                        onClick={() => setVisibleCount(prev => prev + 5)}
                        className="px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md"
                    >
                        Load More Events
                    </button>
                </div>
             )}
        </div>
    );
};

export default SignificantEventsTimeline;
