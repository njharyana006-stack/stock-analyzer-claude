
import React, { useState, useEffect, useCallback } from 'react';
import { XIcon, ChevronRightIcon, CheckCircleIcon, ArrowLongRightIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';

interface TourStep {
    targetIds: string[];
    title: string;
    content: string;
    preferredPosition: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const TOUR_STEPS: TourStep[] = [
    { targetIds: ['tour-welcome-center'], title: 'Welcome to SmartStock AI', content: 'Institutional-grade market intelligence. Let\'s take a quick tour.', preferredPosition: 'center' },
    { targetIds: ['tour-hero'], title: 'Market Command', content: 'Your real-time snapshot of indices and alerts.', preferredPosition: 'bottom' },
    { targetIds: ['tour-widgets'], title: 'Smart Grid', content: 'Interactive sentiment and economic metrics.', preferredPosition: 'top' },
    { targetIds: ['tour-nav-desktop', 'tour-nav-mobile'], title: 'Navigation Hub', content: 'Access Deep Analysis and Strategy tools here.', preferredPosition: 'right' }
];

const OnboardingModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [rect, setRect] = useState<DOMRect | null>(null);
    const [pos, setPos] = useState({ top: 0, left: 0 });
    const LS_KEY = 'smartstock_tour_v2_completed';

    useEffect(() => {
        if (localStorage.getItem(LS_KEY) === 'true') return;
        setTimeout(() => setIsOpen(true), 1500);
    }, []);

    const finish = useCallback(() => {
        localStorage.setItem(LS_KEY, 'true');
        setIsOpen(false);
    }, []);

    const updatePos = useCallback(() => {
        const step = TOUR_STEPS[currentStepIndex];
        if (step.targetIds.includes('tour-welcome-center')) { setRect(null); return; }
        const el = step.targetIds.map(id => document.getElementById(id)).find(e => e && e.offsetParent);
        if (!el) { if (currentStepIndex < TOUR_STEPS.length - 1) setCurrentStepIndex(c => c + 1); else finish(); return; }
        const r = el.getBoundingClientRect();
        setRect(r);
        setPos({ top: r.bottom + 20, left: Math.max(10, r.left + r.width / 2 - 160) });
    }, [currentStepIndex, finish]);

    useEffect(() => { if (isOpen) updatePos(); }, [isOpen, currentStepIndex, updatePos]);

    if (!isOpen) return null;
    const isWelcome = currentStepIndex === 0;

    return (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`bg-[#18181B] border border-white/10 p-8 rounded-[32px] shadow-2xl max-w-sm w-full relative overflow-hidden animate-scale-in`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
                <h3 className="text-xl font-bold text-white mb-2">{TOUR_STEPS[currentStepIndex].title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-8">{TOUR_STEPS[currentStepIndex].content}</p>
                <div className="flex justify-between items-center">
                    <button onClick={finish} className="text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-widest">Skip Tour</button>
                    <button onClick={() => currentStepIndex < TOUR_STEPS.length - 1 ? setCurrentStepIndex(c => c + 1) : finish()} className="px-6 py-2.5 bg-white text-black font-black rounded-xl hover:bg-zinc-200 transition-all flex items-center gap-2 text-sm shadow-lg">
                        <span>{currentStepIndex === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}</span>
                        <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OnboardingModal;
