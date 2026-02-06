
import React, { useState, useRef, useEffect } from 'react';
import type { AnalysisResponse } from '../types';
import { ChartIcon, QuadFactorIcon, UserIcon, SentimentIcon, CompanyIcon, CheckCircleIcon, ChevronUpIcon, ArrowLongRightIcon, SparklesIcon } from './icons';
import OverviewTab from './analysis_tabs/OverviewTab';
import InfographicOverviewTab from './analysis_tabs/InfographicOverviewTab';
import IndividualAnalysisTab from './analysis_tabs/IndividualAnalysisTab';
import ExpertOpinionsTab from './analysis_tabs/ExpertOpinionsTab';
import CompanyProfileTab from './analysis_tabs/CompanyProfileTab';
import SentimentAnalysisTab from './analysis_tabs/MarketSentimentTab';
import RelatedStocks from './RelatedStocks';

interface TabbedAnalysisProps {
    analysis: AnalysisResponse;
}

const tabs: { id: string; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { id: 'Overview', label: 'Overview', icon: ChartIcon },
    { id: 'Individual Analysis', label: 'Analysis', icon: QuadFactorIcon },
    { id: 'Sentiment Analysis', label: 'Sentiment', icon: SentimentIcon },
    { id: 'Expert Opinions', label: 'Experts', icon: UserIcon },
    { id: 'Company Profile', label: 'Company', icon: CompanyIcon },
];

const TabbedAnalysis: React.FC<TabbedAnalysisProps> = ({ analysis }) => {
    const [activeTab, setActiveTab] = useState<string>('Overview');
    const [viewMode, setViewMode] = useState<'classic' | 'infographic'>('classic');
    const containerRef = useRef<HTMLDivElement>(null);
    const tabsBarRef = useRef<HTMLDivElement>(null);
    const touchStart = useRef<number | null>(null);
    const touchEnd = useRef<number | null>(null);

    // Load saved view mode from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('smartstock_view_mode');
        if (saved === 'infographic' || saved === 'classic') {
            setViewMode(saved);
        }
    }, []);

    // Save view mode to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('smartstock_view_mode', viewMode);
    }, [viewMode]);

    const toggleViewMode = () => {
        setViewMode(mode => mode === 'classic' ? 'infographic' : 'classic');
    };

    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        touchEnd.current = null;
        touchStart.current = e.targetTouches[0].clientX;
    };

    const onTouchMove = (e: React.TouchEvent) => {
        touchEnd.current = e.targetTouches[0].clientX;
    };

    const onTouchEnd = () => {
        if (!touchStart.current || !touchEnd.current) return;
        const distance = touchStart.current - touchEnd.current;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        const currentIndex = tabs.findIndex(t => t.id === activeTab);

        if (isLeftSwipe && currentIndex < tabs.length - 1) {
            setActiveTab(tabs[currentIndex + 1].id);
            scrollToTop();
        }
        if (isRightSwipe && currentIndex > 0) {
            setActiveTab(tabs[currentIndex - 1].id);
            scrollToTop();
        }
    };

    const scrollToTop = () => {
        const headerOffset = 180;
        window.scrollTo({ top: headerOffset, behavior: 'smooth' });
    };

    const handleNextTab = () => {
        const currentIndex = tabs.findIndex(t => t.id === activeTab);
        if (currentIndex < tabs.length - 1) {
            setActiveTab(tabs[currentIndex + 1].id);
            scrollToTop();
        }
    };

    const renderContent = (tabId: string) => {
        switch (tabId) {
            case 'Overview':
                return viewMode === 'infographic'
                    ? <InfographicOverviewTab analysis={analysis} />
                    : <OverviewTab analysis={analysis} />;
            case 'Individual Analysis':
                return <IndividualAnalysisTab analysis={analysis} />;
            case 'Expert Opinions':
                return analysis.expert_opinions ? <ExpertOpinionsTab opinions={analysis.expert_opinions} currentPrice={analysis.overview.current_price} /> : null;
            case 'Sentiment Analysis':
                return <SentimentAnalysisTab
                    marketSentiment={analysis.market_sentiment}
                    newsAnalysis={analysis.news_sentiment_analysis}
                    newsBreakdown={analysis.expert_opinions?.news_sentiment_breakdown}
                />;
            case 'Company Profile':
                return (
                    <div className="space-y-8 animate-slide-up">
                        <CompanyProfileTab profile={analysis.company_profile} holders={analysis.individual_analysis.major_holders} />
                        {analysis.related_stocks && analysis.related_stocks.length > 0 && (
                            <section className="bg-white dark:bg-[#121214] p-6 md:p-8 rounded-[24px] border border-slate-200 dark:border-white/5 shadow-sm">
                                <h3 className="text-xl font-black flex items-center text-slate-900 dark:text-white mb-8 tracking-tight">
                                    <UserIcon className="w-6 h-6 mr-3 text-indigo-500" />
                                    Related Stocks
                                </h3>
                                <RelatedStocks stocks={analysis.related_stocks} />
                            </section>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    const activeTabIndex = tabs.findIndex(t => t.id === activeTab);
    const nextTab = activeTabIndex < tabs.length - 1 ? tabs[activeTabIndex + 1] : null;

    return (
        <div className="w-full min-h-screen pb-32">
            {/* ─── Modern Sticky Tab Navigation ─── */}
            <div className="sticky top-[70px] md:top-[80px] z-30 mb-10 -mx-4 md:mx-0">
                {/* Glass background layer */}
                <div className="absolute inset-0 bg-[#F8FAFC]/80 dark:bg-[#09090B]/80 backdrop-blur-xl md:bg-transparent md:backdrop-blur-none"></div>

                <div className="relative px-4 py-3 md:py-4" ref={tabsBarRef}>
                    {/* Desktop: Segmented Control */}
                    <div className="hidden md:flex items-center justify-center gap-4">
                        {/* View Mode Toggle - Only visible on Overview tab */}
                        {activeTab === 'Overview' && (
                            <button
                                onClick={toggleViewMode}
                                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-[#18181B] border border-slate-200/80 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-200 group"
                                aria-label={`Switch to ${viewMode === 'classic' ? 'infographic' : 'classic'} view`}
                            >
                                {viewMode === 'classic' ? (
                                    <>
                                        <SparklesIcon className="w-5 h-5 text-indigo-500 group-hover:text-indigo-600 transition-colors" />
                                        <span className="text-sm font-bold text-slate-700 dark:text-zinc-300">Infographic</span>
                                    </>
                                ) : (
                                    <>
                                        <ChartIcon className="w-5 h-5 text-slate-600 dark:text-zinc-400 group-hover:text-slate-700 dark:group-hover:text-zinc-300 transition-colors" />
                                        <span className="text-sm font-bold text-slate-700 dark:text-zinc-300">Classic</span>
                                    </>
                                )}
                            </button>
                        )}

                        <div className="inline-flex items-center bg-white dark:bg-[#18181B] rounded-2xl p-1.5 border border-slate-200/80 dark:border-white/10 shadow-lg shadow-slate-200/50 dark:shadow-black/20">
                            {tabs.map((tab, index) => {
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`relative flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                                            isActive
                                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg'
                                                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200 hover:bg-slate-50 dark:hover:bg-white/5'
                                        }`}
                                    >
                                        <tab.icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white dark:text-slate-900' : 'text-slate-400 dark:text-zinc-500'}`} />
                                        <span>{tab.label}</span>
                                        {isActive && (
                                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-400"></span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mobile: Scrollable pills with step indicator */}
                    <div className="md:hidden">
                        {/* View Mode Toggle - Mobile - Only visible on Overview tab */}
                        {activeTab === 'Overview' && (
                            <div className="flex items-center justify-center mb-3">
                                <button
                                    onClick={toggleViewMode}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-[#18181B] border border-slate-200 dark:border-white/10 shadow-md active:scale-95 transition-all"
                                    aria-label={`Switch to ${viewMode === 'classic' ? 'infographic' : 'classic'} view`}
                                >
                                    {viewMode === 'classic' ? (
                                        <>
                                            <SparklesIcon className="w-4 h-4 text-indigo-500" />
                                            <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">Infographic</span>
                                        </>
                                    ) : (
                                        <>
                                            <ChartIcon className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
                                            <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">Classic</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Step indicator dots */}
                        <div className="flex items-center justify-center gap-1.5 mb-3">
                            {tabs.map((tab, index) => (
                                <div
                                    key={tab.id}
                                    className={`transition-all duration-300 rounded-full ${
                                        activeTab === tab.id
                                            ? 'w-6 h-1.5 bg-slate-900 dark:bg-white'
                                            : index < activeTabIndex
                                                ? 'w-1.5 h-1.5 bg-emerald-500'
                                                : 'w-1.5 h-1.5 bg-slate-300 dark:bg-zinc-600'
                                    }`}
                                />
                            ))}
                        </div>

                        <div className="flex overflow-x-auto scrollbar-none snap-x gap-1.5">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`snap-center flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap border ${
                                            isActive
                                                ? 'bg-slate-900 text-white dark:bg-white dark:text-black border-slate-900 dark:border-white shadow-md'
                                                : 'bg-white dark:bg-[#18181B] text-slate-500 dark:text-zinc-400 border-slate-200 dark:border-white/10 active:scale-95'
                                        }`}
                                    >
                                        <tab.icon className={`w-3.5 h-3.5 ${isActive ? 'text-white dark:text-black' : 'text-slate-400 dark:text-zinc-500'}`} />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Bottom border accent line */}
                <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent"></div>
            </div>

            {/* Content Area with Swipe Handling */}
            <div
                ref={containerRef}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                className="animate-fade-in space-y-8 w-full max-w-full min-h-[500px]"
            >
                {renderContent(activeTab)}
            </div>

            {/* ─── Section Footer ─── */}
            <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col items-center justify-center space-y-6 pb-12 relative z-10">
                <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 dark:text-zinc-700">
                    <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-500/50" />
                    <span>Section Complete: {activeTab}</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm px-4">
                    {nextTab && (
                        <button
                            onClick={handleNextTab}
                            className="flex-1 flex items-center justify-between px-5 py-3.5 rounded-2xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 shadow-lg transition-all active:scale-[0.98] group"
                        >
                            <span className="text-left">
                                <span className="block text-[9px] font-bold opacity-60 uppercase tracking-wider mb-0.5">Next</span>
                                <span className="block text-sm font-bold">{nextTab.label}</span>
                            </span>
                            <div className="w-7 h-7 rounded-full bg-white/20 dark:bg-slate-900/10 flex items-center justify-center group-hover:bg-white/30 dark:group-hover:bg-slate-900/20 transition-colors">
                                <ArrowLongRightIcon className="w-4 h-4" />
                            </div>
                        </button>
                    )}

                    <button
                        onClick={scrollToTop}
                        className={`flex items-center justify-center space-x-2 px-5 py-3.5 rounded-2xl bg-white dark:bg-[#121214] hover:bg-slate-50 dark:hover:bg-[#18181B] text-slate-600 dark:text-zinc-400 font-semibold text-sm border border-slate-200 dark:border-white/10 transition-all active:scale-[0.98] ${!nextTab ? 'w-full' : ''}`}
                    >
                        <ChevronUpIcon className="w-4 h-4" />
                        <span>Top</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TabbedAnalysis;
