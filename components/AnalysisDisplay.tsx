
import React, { useState, useEffect } from 'react';
import type { AnalysisResponse } from '../types';
import { popularStocks } from '../constants/stocks';
import TabbedAnalysis from './TabbedAnalysis';
import Sparkline from './charts/Sparkline';
import AnimatedNumber from './AnimatedNumber';
import { GrowthIcon, TrendingDownIcon, BotIcon, SparklesIcon, BookmarkIcon, TrendUpIcon, PauseIcon, CheckCircleIcon, BellIcon } from './icons';
import { getDomainFromUrl } from '../utils';
import { useAuth } from '../contexts/AuthContext';
import { saveStock, castVote, getUserVote, getAlerts, toggleAlert } from '../services/dbService';
import { getStockLogo } from '../constants/stocks';

interface AnalysisDisplayProps {
  result: AnalysisResponse;
  addToast: (message: string, type: 'info' | 'success' | 'error') => void;
}

const HeroPattern: React.FC = () => (
    <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
         style={{ 
             backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', 
             backgroundSize: '24px 24px' 
         }}>
    </div>
);

const StockHeader: React.FC<{ overview: AnalysisResponse['overview']; profile: AnalysisResponse['company_profile']; addToast: (msg: string, type: 'success' | 'error' | 'info') => void; fullAnalysis: AnalysisResponse }> = ({ overview, profile, addToast, fullAnalysis }) => {
    const { user } = useAuth();
    const [isSaved, setIsSaved] = useState(false);
    const [isAlertSet, setIsAlertSet] = useState(false);
    const [userVote, setUserVote] = useState<'Bullish' | 'Bearish' | null>(null);
    const [isVoteLoading, setIsVoteLoading] = useState(false);

    const logoUrl = getStockLogo(overview.ticker);

    const currentPrice = overview.current_price ?? 0;
    const oneDayReturn = overview.one_day_return ?? 0;
    const isPositive = oneDayReturn >= 0;
    const priceChange = currentPrice * (oneDayReturn / (100));

    const [meterWidth, setMeterWidth] = useState(0);
    useEffect(() => {
        const timer = setTimeout(() => {
            setMeterWidth((overview.confidence_score || 0) * 10);
        }, 300);
        
        if (user) {
            getUserVote(user.id, overview.ticker).then(vote => {
                if (vote) setUserVote(vote);
            });
            getAlerts(user.id).then(alerts => {
                const found = alerts.some((a: any) => a.symbol === overview.ticker);
                setIsAlertSet(found);
            });
        }

        return () => clearTimeout(timer);
    }, [overview.confidence_score, user, overview.ticker]);

    const sparklineData = [
        currentPrice * 0.99, currentPrice * 0.995, currentPrice * 0.992, 
        currentPrice * 0.998, currentPrice * 1.002, currentPrice * 1.005, currentPrice
    ];

    const getRatingColor = (rating: string) => {
        const r = rating?.toLowerCase() || '';
        if (r.includes('buy') || r.includes('outperform')) return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400';
        if (r.includes('sell') || r.includes('underperform')) return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-500/20 dark:text-rose-400';
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400';
    };

    const handleSave = async () => {
        if (!user) {
            addToast("Please sign in to save stocks.", 'info');
            return;
        }
        try {
            await saveStock(user.id, overview.ticker, overview.company_name, currentPrice, fullAnalysis);
            setIsSaved(true);
            addToast(`${overview.ticker} added to watchlist.`, 'success');
        } catch (e) {
            console.error("Failed to save stock", e);
            addToast("Failed to save stock.", 'error');
        }
    };

    const handleToggleAlert = async () => {
        const uid = user ? user.id : 'guest-user-id';
        try {
            const isAdded = await toggleAlert(uid, overview.ticker);
            setIsAlertSet(isAdded);
            addToast(isAdded ? `Alert set for ${overview.ticker}` : `Alert removed for ${overview.ticker}`, 'info');
            window.dispatchEvent(new Event('stock_activity_changed'));
        } catch (e) {
            console.error(e);
            addToast("Failed to toggle alert.", 'error');
        }
    };

    const handleVote = async (vote: 'Bullish' | 'Bearish') => {
        if (!user) {
            addToast("Please sign in to vote.", 'info');
            return;
        }
        setUserVote(vote);
        setIsVoteLoading(true);
        try {
            await castVote(user.id, overview.ticker, vote, overview.signal);
            addToast(`Vote registered: ${vote}`, 'success');
        } catch (e) {
            console.error("Failed to cast vote", e);
            addToast("Failed to register vote.", 'error');
        } finally {
            setIsVoteLoading(false);
        }
    };

    return (
        <div className="relative w-full mb-6 group animate-scale-in">
            <div className="relative overflow-hidden rounded-[32px] bg-white dark:bg-[#121214] border border-slate-200 dark:border-white/10 shadow-xl">
                <div className={`absolute inset-0 bg-gradient-to-br ${isPositive ? 'from-emerald-50/80 via-white to-white dark:from-emerald-900/20' : 'from-rose-50/80 via-white to-white dark:from-rose-900/20'}`}></div>
                <HeroPattern />
                <div className="relative z-10 p-5 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-slate-50 dark:bg-[#18181B] p-2 flex items-center justify-center shadow-lg border border-slate-100 dark:border-white/5 relative">
                                <img 
                                    src={logoUrl} 
                                    alt={`${overview.company_name} logo`} 
                                    className="w-full h-full object-contain rounded-xl" 
                                    onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${overview.ticker}&background=random&color=fff&bold=true`; }}
                                />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{overview.ticker}</h1>
                                <p className="text-sm md:text-base text-slate-600 dark:text-zinc-400 font-bold mt-1 line-clamp-1">
                                    {overview.company_name}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-[10px] font-bold bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded text-slate-600 dark:text-zinc-300 uppercase border border-slate-200 dark:border-white/5">{profile?.exchange || 'US'}</span>
                                    {overview.rating && (
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${getRatingColor(overview.rating)}`}>
                                            {overview.rating}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            <div className="flex items-center gap-2">
                                <button onClick={handleToggleAlert} className={`p-2 rounded-full border transition-all ${isAlertSet ? 'bg-amber-100 border-amber-500 text-amber-600 dark:bg-amber-500/20' : 'bg-white dark:bg-white/5 border-slate-200 text-slate-400 hover:text-amber-500'}`} title="Price Alert">
                                    <BellIcon className="w-5 h-5" />
                                </button>
                                <button onClick={handleSave} className={`p-2 rounded-full border transition-all ${isSaved ? 'bg-indigo-100 border-indigo-500 text-indigo-600' : 'bg-white dark:bg-white/5 border-slate-200 text-slate-400 hover:text-indigo-500'}`} title="Save">
                                    <BookmarkIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex flex-col items-start md:items-end bg-white/60 dark:bg-white/5 p-4 rounded-2xl border border-white/50 dark:border-white/5 backdrop-blur-md">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-medium text-slate-400">$</span>
                                    <AnimatedNumber value={currentPrice} className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter" />
                                </div>
                                <div className="flex items-center gap-3 mt-2">
                                    <div className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 border ${isPositive ? 'bg-emerald-100 border-emerald-200 text-emerald-800' : 'bg-rose-100 border-rose-200 text-rose-800'}`}>
                                        {isPositive ? <GrowthIcon className="w-4 h-4" /> : <TrendingDownIcon className="w-4 h-4" />}
                                        <span className="text-sm font-black">{Math.abs(oneDayReturn).toFixed(2)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-600 flex items-center justify-center shadow-lg text-white flex-shrink-0">
                                <BotIcon className="w-7 h-7" />
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase">AI Verdict</p>
                                        <div className="text-xs font-bold text-slate-600 dark:text-zinc-300">Confidence: <span className="text-indigo-600 dark:text-indigo-400">{overview.confidence_score}/10</span></div>
                                    </div>
                                    <h3 className={`text-2xl font-black ${overview.signal === 'Bullish' ? 'text-emerald-600' : overview.signal === 'Bearish' ? 'text-rose-600' : 'text-amber-500'}`}>{overview.signal}</h3>
                                    <div className="w-full bg-slate-200 dark:bg-white/10 rounded-full h-2 mt-2 overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-[1500ms] ${overview.signal === 'Bullish' ? 'bg-emerald-500' : overview.signal === 'Bearish' ? 'bg-rose-500' : 'bg-amber-500'}`} style={{ width: `${meterWidth}%` }}></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 pt-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Your Take:</p>
                                    <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-lg p-1 border border-slate-200">
                                        <button onClick={() => handleVote('Bullish')} disabled={isVoteLoading} className={`p-1.5 rounded-md transition-all ${userVote === 'Bullish' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-emerald-500'}`} title="Bullish"><TrendUpIcon className="w-4 h-4" /></button>
                                        <div className="w-px h-4 bg-slate-300 dark:bg-white/10 mx-1"></div>
                                        <button onClick={() => handleVote('Bearish')} disabled={isVoteLoading} className={`p-1.5 rounded-md transition-all ${userVote === 'Bearish' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-rose-500'}`} title="Bearish"><TrendingDownIcon className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="h-24 relative w-full hidden xs:block">
                            <Sparkline data={sparklineData} isPositive={isPositive} className={`w-full h-full stroke-[2px] ${isPositive ? 'stroke-emerald-500' : 'stroke-rose-500'} fill-none`} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result, addToast }) => {
    return (
        <div className="w-full max-w-[1920px] mx-auto animate-fade-in">
            <StockHeader overview={result.overview} profile={result.company_profile} addToast={addToast} fullAnalysis={result} />
            <div className="mt-8"><TabbedAnalysis analysis={result} /></div>
        </div>
    );
};

export default AnalysisDisplay;
