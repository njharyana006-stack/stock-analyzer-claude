
import React, { useState } from 'react';
import { ChevronLeftIcon, SparklesIcon, CheckCircleIcon, XIcon, RocketIcon } from './icons';

interface ManagePlanPageProps {
    onBack: () => void;
    addToast: (message: string, type: 'info' | 'success' | 'error') => void;
}

const ManagePlanPage: React.FC<ManagePlanPageProps> = ({ onBack, addToast }) => {
    const [isCancelling, setIsCancelling] = useState(false);

    const handleCancel = () => {
        setIsCancelling(true);
        setTimeout(() => {
            setIsCancelling(false);
            addToast("Subscription cancelled. You will retain access until the end of the billing period.", "info");
        }, 1500);
    };

    const handleUpgrade = () => {
        addToast("Enterprise plan request sent to sales team.", "success");
    };

    return (
        <div className="animate-fade-in w-full max-w-3xl mx-auto pt-8 pb-20 px-4">
            <div className="flex items-center gap-4 mb-8">
                <button 
                    onClick={onBack}
                    className="p-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-500 dark:text-zinc-400 transition-colors"
                >
                    <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Manage Subscription</h1>
            </div>

            <div className="space-y-8">
                {/* Current Plan Card */}
                <div className="bg-white dark:bg-[#121214] rounded-[32px] p-8 border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-sm font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider mb-2">Current Plan</p>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white">Pro Plan</h2>
                                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full border border-emerald-200 dark:border-emerald-500/30">Active</span>
                                </div>
                            </div>
                            <div className="w-14 h-14 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center shadow-lg">
                                <SparklesIcon className="w-7 h-7" />
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 mb-8">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-slate-600 dark:text-zinc-400">Billing Amount</span>
                                <span className="text-lg font-bold text-slate-900 dark:text-white">$29.00 / month</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-600 dark:text-zinc-400">Next Billing Date</span>
                                <span className="text-sm font-bold text-slate-900 dark:text-white">Oct 24, 2024</span>
                            </div>
                        </div>

                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-zinc-300">
                                <CheckCircleIcon className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                <span>Unlimited AI Analysis & Reports</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-zinc-300">
                                <CheckCircleIcon className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                <span>Real-time Market Pulse Access</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-zinc-300">
                                <CheckCircleIcon className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                <span>Advanced Portfolio Strategy Tools</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100 dark:border-white/5">
                            <button className="flex-1 py-3 px-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-white font-bold rounded-xl transition-colors shadow-sm">
                                Update Payment Method
                            </button>
                            <button 
                                onClick={handleCancel}
                                disabled={isCancelling}
                                className="flex-1 py-3 px-4 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20 font-bold rounded-xl transition-colors"
                            >
                                {isCancelling ? 'Processing...' : 'Cancel Subscription'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Upgrade Option */}
                <div className="g-card p-8 border-2 border-dashed border-slate-200 dark:border-white/10 bg-transparent hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                            <RocketIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Upgrade to Enterprise</h3>
                            <p className="text-sm text-slate-500 dark:text-zinc-400">For teams and high-volume API access.</p>
                        </div>
                        <button 
                            onClick={handleUpgrade}
                            className="ml-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                        >
                            Contact Sales
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagePlanPage;
