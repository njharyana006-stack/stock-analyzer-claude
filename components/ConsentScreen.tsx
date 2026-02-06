
import React, { useState, useRef, useEffect } from 'react';
import { ShieldExclamationIcon, CheckCircleIcon, XCircleIcon, LockIcon, ArrowLongRightIcon } from './icons';
import SmartStockLogo from './SmartStockLogo';
import { useConsent } from '../contexts/ConsentContext';
import { useAuth } from '../contexts/AuthContext';

const ConsentScreen: React.FC = () => {
    const { giveConsent } = useConsent();
    const { signOut } = useAuth();
    const [scrolledToBottom, setScrolledToBottom] = useState(false);
    const [checkedRisks, setCheckedRisks] = useState(false);
    const [checkedTerms, setCheckedTerms] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        // Check if scrolled near bottom (allow 20px tolerance)
        if (scrollHeight - scrollTop - clientHeight < 50) {
            setScrolledToBottom(true);
        }
    };

    // Initial check in case text is short enough to not scroll
    useEffect(() => {
        if (contentRef.current) {
            if (contentRef.current.scrollHeight <= contentRef.current.clientHeight) {
                setScrolledToBottom(true);
            }
        }
    }, []);

    const handleDecline = () => {
        setIsExiting(true);
        setTimeout(async () => {
            await signOut();
        }, 800);
    };

    const canAgree = scrolledToBottom && checkedRisks && checkedTerms;

    if (isExiting) {
        return (
            <div className="fixed inset-0 z-[100] bg-[#020617] flex items-center justify-center animate-fade-out">
                <div className="text-center space-y-4">
                    <SmartStockLogo className="w-16 h-16 mx-auto opacity-50 grayscale" />
                    <p className="text-slate-500 font-medium">Returning to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] bg-[#020617] flex items-center justify-center p-4 sm:p-6 backdrop-blur-3xl">
            {/* Ambient Background Effects */}
            <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>

            <div className="relative w-full max-w-2xl bg-[#09090B] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[90vh] animate-scale-in">
                
                {/* Header */}
                <div className="p-6 sm:p-8 pb-4 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent relative z-10">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 mb-4 drop-shadow-lg">
                            <SmartStockLogo />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                            Important Disclaimers
                        </h1>
                        <p className="text-slate-400 text-sm mt-2 font-medium max-w-md">
                            Transparency is our core value. Please review and accept the terms of service and risk disclosures to continue.
                        </p>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div 
                    ref={contentRef}
                    className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 custom-scrollbar bg-[#09090B] relative"
                    onScroll={handleScroll}
                >
                    <section className="space-y-3">
                        <div className="flex items-center gap-2 text-rose-400">
                            <div className="p-1.5 bg-rose-500/10 rounded-lg">
                                <ShieldExclamationIcon className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold uppercase tracking-wider text-sm">No Investment Advice</h3>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed text-justify border-l-2 border-rose-500/20 pl-4">
                            The content provided by SmartStock AI ("the App"), including AI-generated analysis, sentiment scores, and portfolio suggestions, is for <strong>informational and educational purposes only</strong>. It does not constitute financial, investment, legal, or tax advice. You should not treat any opinion expressed in the App as a specific inducement to make a particular investment or follow a particular strategy.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <div className="flex items-center gap-2 text-amber-400">
                            <div className="p-1.5 bg-amber-500/10 rounded-lg">
                                <ShieldExclamationIcon className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold uppercase tracking-wider text-sm">Risk of Loss</h3>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed text-justify border-l-2 border-amber-500/20 pl-4">
                            Investing in securities involves a risk of loss that you should be prepared to bear. Past performance is not indicative of future results. SmartStock AI uses artificial intelligence which may occasionally produce hallucinations, outdated, or incorrect data. <strong>You assume full responsibility for any trading decisions you make.</strong>
                        </p>
                    </section>

                    <section className="space-y-3">
                        <div className="flex items-center gap-2 text-sky-400">
                            <div className="p-1.5 bg-sky-500/10 rounded-lg">
                                <LockIcon className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold uppercase tracking-wider text-sm">Data & Privacy</h3>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed text-justify border-l-2 border-sky-500/20 pl-4">
                            We take your privacy seriously. We collect minimal data necessary to provide personalized analysis. Your specific portfolio data is processed securely and we do not sell your personal data to third parties. By using this app, you consent to our data processing practices.
                        </p>
                    </section>
                    
                    {!scrolledToBottom && (
                        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#09090B] to-transparent pointer-events-none flex justify-center items-end pb-4">
                            <span className="text-[10px] uppercase font-bold text-emerald-500 bg-[#09090B] px-3 py-1 rounded-full animate-bounce">Scroll to Read More</span>
                        </div>
                    )}
                    
                    <div className="h-4"></div> 
                </div>

                {/* Footer Controls */}
                <div className="p-6 sm:p-8 border-t border-white/5 bg-[#0F1012] relative z-20">
                    
                    {/* Checkboxes */}
                    <div className="space-y-4 mb-8">
                        <label className={`flex items-start gap-4 cursor-pointer group p-4 rounded-xl border transition-all duration-200 ${checkedRisks ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-white/5 border-transparent hover:bg-white/10'}`}>
                            <div className="relative flex items-center mt-0.5">
                                <input 
                                    type="checkbox" 
                                    className="peer sr-only"
                                    checked={checkedRisks}
                                    onChange={(e) => setCheckedRisks(e.target.checked)}
                                />
                                <div className="w-5 h-5 border-2 border-slate-500 peer-checked:border-emerald-500 peer-checked:bg-emerald-500 rounded transition-all flex items-center justify-center">
                                    <CheckCircleIcon className="w-3.5 h-3.5 text-black opacity-0 peer-checked:opacity-100" />
                                </div>
                            </div>
                            <span className="text-xs sm:text-sm text-slate-300 font-medium select-none group-hover:text-white transition-colors">
                                I understand that investing involves significant risk and I may lose money. I acknowledge that this app does not provide financial advice.
                            </span>
                        </label>

                        <label className={`flex items-start gap-4 cursor-pointer group p-4 rounded-xl border transition-all duration-200 ${checkedTerms ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-white/5 border-transparent hover:bg-white/10'}`}>
                            <div className="relative flex items-center mt-0.5">
                                <input 
                                    type="checkbox" 
                                    className="peer sr-only"
                                    checked={checkedTerms}
                                    onChange={(e) => setCheckedTerms(e.target.checked)}
                                />
                                <div className="w-5 h-5 border-2 border-slate-500 peer-checked:border-emerald-500 peer-checked:bg-emerald-500 rounded transition-all flex items-center justify-center">
                                    <CheckCircleIcon className="w-3.5 h-3.5 text-black opacity-0 peer-checked:opacity-100" />
                                </div>
                            </div>
                            <span className="text-xs sm:text-sm text-slate-300 font-medium select-none group-hover:text-white transition-colors">
                                I agree to the Terms of Service and Privacy Policy.
                            </span>
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col-reverse md:flex-row gap-4">
                        <button
                            onClick={handleDecline}
                            className="flex-1 px-6 py-4 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors border border-transparent hover:border-rose-500/20"
                        >
                            Decline & Exit
                        </button>
                        <button
                            onClick={giveConsent}
                            disabled={!canAgree}
                            className={`flex-[2] px-6 py-4 rounded-xl text-sm font-bold text-white transition-all shadow-lg flex items-center justify-center gap-3 ${
                                canAgree 
                                ? 'bg-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-500/20 transform hover:-translate-y-0.5 cursor-pointer' 
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                            }`}
                        >
                            {!scrolledToBottom ? (
                                <span>Read to the Bottom First</span>
                            ) : (
                                <>
                                    <span>I Understand & Agree</span>
                                    <ArrowLongRightIcon className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsentScreen;
