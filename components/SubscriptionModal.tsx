
import React from 'react';
import { createPortal } from 'react-dom';
import { CheckCircleIcon, XIcon, SparklesIcon, RocketIcon, ShieldIcon } from './icons';

interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PlanFeature: React.FC<{ text: string }> = ({ text }) => (
    <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-zinc-300">
        <CheckCircleIcon className="w-5 h-5 text-emerald-500 flex-shrink-0" />
        <span>{text}</span>
    </li>
);

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div 
                className="bg-white dark:bg-[#121214] w-full max-w-4xl rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-scale-in border border-slate-200 dark:border-white/10"
                onClick={e => e.stopPropagation()}
            >
                {/* Left: Value Prop */}
                <div className="p-8 md:p-12 bg-slate-50 dark:bg-[#09090B] flex-1 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mr-16 -mt-16"></div>
                    
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                            <SparklesIcon className="w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Upgrade to Pro</h2>
                        <p className="text-slate-600 dark:text-zinc-400 mb-8 leading-relaxed">
                            Unlock institutional-grade data, unlimited AI analysis requests, and real-time portfolio alerts.
                        </p>
                        
                        <ul className="space-y-4">
                            <PlanFeature text="Unlimited Gemini 3 Pro Deep Analysis" />
                            <PlanFeature text="Real-time Market Pulse & Sentiment Scanning" />
                            <PlanFeature text="Advanced Portfolio Strategy Generation" />
                            <PlanFeature text="Priority Support & Early Access Features" />
                        </ul>
                    </div>
                </div>

                {/* Right: Pricing */}
                <div className="p-8 md:p-12 flex-1 flex flex-col justify-center bg-white dark:bg-[#121214]">
                    <div className="text-center mb-8">
                        <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
                        <div className="mt-4 flex items-baseline justify-center gap-1">
                            <span className="text-5xl font-extrabold text-slate-900 dark:text-white">$29</span>
                            <span className="text-slate-500 dark:text-zinc-500">/month</span>
                        </div>
                        <p className="text-sm text-slate-400 mt-2">Billed annually or $39 month-to-month</p>
                    </div>

                    <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform active:scale-[0.98] mb-4 flex items-center justify-center gap-2">
                        <RocketIcon className="w-5 h-5" />
                        Start 14-Day Free Trial
                    </button>
                    
                    <p className="text-xs text-center text-slate-400 dark:text-zinc-600">
                        No credit card required for trial. Cancel anytime.
                    </p>
                </div>

                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                    <XIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );

    const root = document.getElementById('modal-root');
    return root ? createPortal(modalContent, root) : null;
};

export default SubscriptionModal;
