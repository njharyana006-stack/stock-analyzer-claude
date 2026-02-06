
import React from 'react';
import type { RiskProfile } from '../types';
import { AnalyzeIcon, BotIcon, QuadFactorIcon, SentimentIcon, TechnicalIcon, RiskIcon, SparklesIcon, ArrowLongRightIcon } from './icons';
import { getStockLogo } from '../constants/stocks';

interface StockDiscoveryProps {
    onAnalyze: (ticker: string, riskProfile: RiskProfile) => void;
    currentRiskProfile: RiskProfile;
}

const FeatureCard: React.FC<{ title: string; desc: string; icon: React.ReactNode; delay: string; color: string }> = ({ title, desc, icon, delay, color }) => {
    const baseColor = color.match(/text-([a-z]+)-/)?.[1] || 'indigo';
    
    return (
        <div 
            className="relative overflow-hidden p-4 sm:p-5 rounded-3xl bg-[#1E293B]/40 backdrop-blur-md border border-white/10 hover:bg-[#1E293B]/60 hover:border-white/20 transition-all duration-500 group flex flex-col justify-between h-[150px] sm:h-[180px] shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10"
            style={{ animationDelay: delay }}
        >
            <div className={`absolute -top-10 -right-10 w-24 h-24 sm:w-32 sm:h-32 bg-${baseColor}-500/20 rounded-full blur-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-100 pointer-events-none`}></div>
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-300 ${color}`}>
                {icon}
            </div>
            <div className="relative z-10">
                <h4 className="text-sm sm:text-lg font-bold text-white mb-1 tracking-tight">{title}</h4>
                <p className="text-[10px] sm:text-xs text-slate-400 font-medium leading-relaxed line-clamp-2">{desc}</p>
            </div>
        </div>
    );
};

const TrendingCard: React.FC<{ ticker: string; name: string; change: string; onSelect: () => void; delay: string }> = ({ ticker, name, change, onSelect, delay }) => (
    <button 
        onClick={onSelect}
        className="flex items-center justify-between p-4 w-full bg-white dark:bg-[#18181B] hover:bg-slate-50 dark:hover:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-emerald-300 dark:hover:border-indigo-500/30 rounded-[24px] transition-all duration-300 group text-left shadow-sm hover:shadow-xl active:scale-95 animate-slide-up"
        style={{ animationDelay: delay }}
    >
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 dark:border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm overflow-hidden p-1.5">
                <img src={getStockLogo(ticker)} alt={ticker} className="w-full h-full object-contain" onError={(e) => { e.currentTarget.src=`https://ui-avatars.com/api/?name=${ticker}&background=random&color=fff&bold=true`; }} />
            </div>
            <div>
                <p className="font-black text-slate-900 dark:text-white text-sm tracking-tight">{ticker}</p>
                <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-semibold uppercase tracking-wide">{name}</p>
            </div>
        </div>
        <div className="text-right">
            <div className="inline-block px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 tabular-nums">{change}</p>
            </div>
        </div>
    </button>
);

const StockDiscovery: React.FC<StockDiscoveryProps> = ({ onAnalyze, currentRiskProfile }) => {
    return (
        <div className="animate-fade-in w-full max-w-7xl mx-auto pb-24 md:pb-20 relative px-4 sm:px-6">
            <div className="absolute top-20 left-1/4 w-32 h-32 bg-indigo-500/20 rounded-full blur-[80px] animate-pulse-slow pointer-events-none"></div>
            <div className="absolute bottom-40 right-1/4 w-40 h-40 bg-emerald-500/10 rounded-full blur-[80px] animate-float pointer-events-none" style={{ animationDelay: '1s' }}></div>

            <div className="relative rounded-[48px] overflow-hidden mb-16 border border-white/20 dark:border-white/5 shadow-2xl bg-[#020617] group transform transition-all duration-700 hover:shadow-indigo-500/10">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-[20s]"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 p-6 sm:p-8 md:p-16 items-center">
                    <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
                        <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 w-fit shadow-lg animate-slide-up">
                            <SparklesIcon className="w-4 h-4 text-indigo-400" />
                            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Gemini 3.0 Pro Powered</span>
                        </div>
                        <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[0.95]">
                                Market <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">Clarity.</span>
                            </h2>
                            <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-xl leading-relaxed font-medium tracking-wide">
                                Institutional-grade analysis synthesized from millions of data points. Technicals, Sentiment, and Fundamentals—unified.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4 pt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <button 
                                onClick={() => onAnalyze('NVDA', currentRiskProfile)}
                                className="h-12 sm:h-14 px-6 sm:px-8 bg-white text-black font-black rounded-full hover:bg-indigo-50 transition-all active:scale-95 flex items-center gap-3 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] group/btn text-sm sm:text-base"
                            >
                                <AnalyzeIcon className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                                <span>Scan NVIDIA</span>
                            </button>
                            <div className="flex items-center gap-4 px-6 h-12 sm:h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                                <div className="flex -space-x-2">
                                    {[1,2,3].map(i => <div key={i} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-700 border-2 border-black" />)}
                                </div>
                                <span className="text-xs font-bold text-white">10k+ Analyses Today</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 relative mt-8 lg:mt-0 perspective-1000">
                        <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none"></div>
                        <div className="relative grid grid-cols-2 gap-3 sm:gap-4 transform sm:rotate-y-6 sm:rotate-x-6 hover:rotate-0 transition-transform duration-700 ease-out p-2 sm:p-4">
                            <FeatureCard 
                                title="Technical" 
                                desc="RSI, MACD & Trends" 
                                icon={<TechnicalIcon className="w-5 h-5 sm:w-6 sm:h-6" />} 
                                color="text-sky-400"
                                delay="0.3s"
                            />
                            <FeatureCard 
                                title="Sentiment" 
                                desc="Social & Analyst Mood" 
                                icon={<SentimentIcon className="w-5 h-5 sm:w-6 sm:h-6" />} 
                                color="text-emerald-400"
                                delay="0.4s"
                            />
                            <FeatureCard 
                                title="Fundamentals" 
                                desc="P/E, Revenue & Cash" 
                                icon={<QuadFactorIcon className="w-5 h-5 sm:w-6 sm:h-6" />} 
                                color="text-amber-400"
                                delay="0.5s"
                            />
                            <FeatureCard 
                                title="Risk Profile" 
                                desc={`Tailored to ${currentRiskProfile}`} 
                                icon={<RiskIcon className="w-5 h-5 sm:w-6 sm:h-6" />} 
                                color="text-rose-400"
                                delay="0.6s"
                            />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 bg-[#0F172A] rounded-full border-[3px] border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.4)] z-20 ring-4 ring-[#020617]">
                                <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-20"></div>
                                <BotIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-md" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-8">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] flex items-center">
                        <SparklesIcon className="w-4 h-4 mr-2 text-indigo-500" /> Trending Now
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-slate-200 dark:from-white/10 to-transparent ml-6"></div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <TrendingCard ticker="NVDA" name="NVIDIA Corp." change="+165% YTD" onSelect={() => onAnalyze('NVDA', currentRiskProfile)} delay="0.1s" />
                    <TrendingCard ticker="TSLA" name="Tesla Inc." change="+12% 1M" onSelect={() => onAnalyze('TSLA', currentRiskProfile)} delay="0.2s" />
                    <TrendingCard ticker="PLTR" name="Palantir Tech" change="+45% 3M" onSelect={() => onAnalyze('PLTR', currentRiskProfile)} delay="0.3s" />
                    <TrendingCard ticker="AMD" name="Adv. Micro Devices" change="+5% 1W" onSelect={() => onAnalyze('AMD', currentRiskProfile)} delay="0.4s" />
                </div>
            </div>
        </div>
    );
};

export default StockDiscovery;
