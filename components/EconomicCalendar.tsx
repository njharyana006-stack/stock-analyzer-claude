
import React from 'react';
import type { EconomicEvent } from '../types';
import { FireIcon, ExclamationTriangleIcon, InfoIcon, CalendarIcon, GlobeAmericasIcon } from './icons';

interface EconomicCalendarProps {
    events?: EconomicEvent[];
    isLoading: boolean;
}

const getImpactConfig = (impact: EconomicEvent['impact']) => {
     switch (impact) {
        case 'High': return {
            bg: 'bg-rose-50 dark:bg-rose-500/10',
            text: 'text-rose-600 dark:text-rose-400',
            icon: <FireIcon className="w-3.5 h-3.5" />
        };
        case 'Medium': return {
            bg: 'bg-amber-50 dark:bg-amber-500/10',
            text: 'text-amber-600 dark:text-amber-400',
            icon: <ExclamationTriangleIcon className="w-3.5 h-3.5" />
        };
        default: return {
            bg: 'bg-sky-50 dark:bg-sky-500/10',
            text: 'text-sky-600 dark:text-sky-400',
            icon: <InfoIcon className="w-3.5 h-3.5" />
        };
    }
}

const EventRow: React.FC<{ event: EconomicEvent }> = ({ event }) => {
    const eventDate = new Date(event.date);
    const day = eventDate.toLocaleDateString('en-US', { day: '2-digit' });
    const month = eventDate.toLocaleDateString('en-US', { month: 'short' });
    const { bg, text, icon } = getImpactConfig(event.impact);

    return (
        <div className="group flex items-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-white/5">
            {/* Date Badge */}
            <div className="flex-shrink-0 w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10 flex flex-col items-center justify-center text-center mr-4">
                <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase leading-none">{month}</span>
                <span className="text-lg font-black text-slate-900 dark:text-white leading-tight">{day}</span>
            </div>

            <div className="flex-grow min-w-0 mr-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {event.event_name}
                </h4>
                <div className="flex items-center mt-1 text-xs text-slate-500 dark:text-zinc-500">
                    <GlobeAmericasIcon className="w-3 h-3 mr-1" />
                    <span>{event.region}</span>
                </div>
            </div>

            <div className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${bg} ${text}`}>
                {icon}
            </div>
        </div>
    );
};

const EconomicCalendar: React.FC<EconomicCalendarProps> = ({ events, isLoading }) => {
    if (isLoading) {
        return (
            <div className="h-full flex flex-col">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 px-1 flex items-center gap-3">
                    <CalendarIcon className="w-6 h-6 text-indigo-500" />
                    Economic Calendar
                </h3>
                <div className="space-y-3 animate-pulse">
                    {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-slate-100 dark:bg-white/5 rounded-xl"></div>)}
                </div>
            </div>
        );
    }

    if (!events || !Array.isArray(events) || events.length === 0) {
        return (
             <div className="h-full flex flex-col">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 px-1 flex items-center gap-3">
                    <CalendarIcon className="w-6 h-6 text-indigo-500" />
                    Economic Calendar
                </h3>
                <div className="flex-grow flex items-center justify-center p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
                    <p className="text-sm text-slate-500 dark:text-zinc-500 font-medium">No major events scheduled.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <CalendarIcon className="w-6 h-6 text-indigo-500" />
                    Economic Calendar
                </h3>
            </div>
            
            <div className="flex-grow bg-white dark:bg-[#121214] rounded-[24px] border border-slate-100 dark:border-white/5 p-2 shadow-sm">
                <div className="flex flex-col space-y-1">
                    {events.map((event, i) => <EventRow key={i} event={event} />)}
                </div>
                <div className="mt-2 text-center pb-1">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-widest">Global Impact Watch</span>
                </div>
            </div>
        </div>
    );
};

export default EconomicCalendar;
