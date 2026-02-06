
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLongRightIcon, BellIcon, SparklesIcon, GrowthIcon, TrendingDownIcon, InfoIcon, BookmarkIcon } from './icons';
import AnimatedNumber from './AnimatedNumber';
import { getSavedStocks, getAlerts } from '../services/dbService';
import { useAuth } from '../contexts/AuthContext';

interface DashboardHeroProps {
    userName?: string;
}

interface AlertItem {
    id?: number;
    symbol: string;
}

interface SavedStockItem {
    id: number;
    symbol: string;
}

const DashboardHero: React.FC<DashboardHeroProps> = ({ userName = "John" }) => {
    const { user } = useAuth();
    const [activePopup, setActivePopup] = useState<'notifications' | 'watchlist' | null>(null);
    const [stats, setStats] = useState({ savedCount: 0, alertsCount: 0 });
    const [alertStocks, setAlertStocks] = useState<AlertItem[]>([]);
    const [savedStocksList, setSavedStocksList] = useState<SavedStockItem[]>([]);
    const heroRef = useRef<HTMLDivElement>(null);

    const fetchUserStats = async () => {
        if (user) {
            try {
                const saved = await getSavedStocks(user.id);
                const alerts = await getAlerts(user.id);
                setStats({
                    savedCount: saved ? saved.length : 0,
                    alertsCount: alerts ? alerts.length : 0
                });
                setAlertStocks(alerts || []);
                setSavedStocksList(saved || []);
            } catch (e) {
                console.error("Failed to load user dashboard stats", e);
            }
        } else {
            // Guest defaults
            const guestSaved = localStorage.getItem('guest_saved_stocks');
            const guestAlerts = localStorage.getItem('guest_stock_alerts');
            const parsedAlerts = guestAlerts ? JSON.parse(guestAlerts) : [];
            const parsedSaved = guestSaved ? JSON.parse(guestSaved) : [];
            setStats({
                savedCount: parsedSaved.length,
                alertsCount: parsedAlerts.length
            });
            setAlertStocks(parsedAlerts);
            setSavedStocksList(parsedSaved);
        }
    };

    useEffect(() => {
        fetchUserStats();

        // Listen for global event triggered by dbService
        const handleActivityChange = () => {
            fetchUserStats();
        };
        window.addEventListener('stock_activity_changed', handleActivityChange);

        return () => {
            window.removeEventListener('stock_activity_changed', handleActivityChange);
        };
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (heroRef.current && !heroRef.current.contains(event.target as Node)) {
                setActivePopup(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const hasActivity = stats.savedCount > 0 || stats.alertsCount > 0;

    return (
        <div ref={heroRef} className="relative w-full z-10 mb-8 md:mb-12 group">
            {/* Background & Decoration Container */}
            <div className="absolute inset-0 rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl shadow-emerald-500/30 dark:shadow-emerald-900/30 transition-all duration-500 border border-white/10 dark:border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-indigo-800 dark:from-emerald-900 dark:via-teal-900 dark:to-[#022c22] animate-gradient"></div>
                <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none opacity-20 mix-blend-overlay">
                    <svg className="absolute -top-12 -right-12 w-64 h-64 text-white opacity-20 transform rotate-12 animate-float" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
                    </svg>
                </div>
                <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between p-6 md:p-10 lg:p-14 gap-8 text-white">
                
                {/* Left: Brand & Welcome */}
                <div className="flex flex-col justify-center gap-3 md:gap-4 max-w-2xl">
                    <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] md:text-xs font-black tracking-widest uppercase mb-3 border border-white/10 shadow-sm">
                            Portfolio Optimized
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] drop-shadow-xl text-white">
                            Good morning, <br className="hidden sm:block" /> {userName}.
                        </h1>
                    </div>
                    <p className="text-emerald-50/90 text-base md:text-lg leading-relaxed font-medium max-w-md tracking-wide animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        {hasActivity ? (
                            <>
                                You have <span className="font-bold text-white">{stats.savedCount}</span> assets in your watchlist and <span className="font-bold text-white">{stats.alertsCount}</span> active alerts tracking the market.
                            </>
                        ) : (
                            <>
                                Start by searching for a ticker to build your AI-powered watchlist and set price alerts.
                            </>
                        )}
                    </p>
                </div>

                {/* Right: Interactive Stats */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:flex lg:flex-col gap-3 md:gap-4 w-full lg:w-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    
                    {/* Alerts Stat */}
                    <button 
                        onClick={() => setActivePopup(activePopup === 'notifications' ? null : 'notifications')}
                        className={`relative group/card w-full lg:w-60 text-left focus:outline-none transition-all ${activePopup === 'notifications' ? 'z-50' : 'z-auto'}`}
                    >
                        <div className={`bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-[24px] p-5 md:p-6 w-full border border-white/20 hover:bg-white transition-all duration-300 shadow-xl hover:shadow-emerald-500/20 transform hover:-translate-y-1 active:scale-95 ${activePopup === 'notifications' ? 'ring-2 ring-emerald-400' : ''}`}>
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Active Alerts</p>
                                <div className={`w-2 h-2 rounded-full ${stats.alertsCount > 0 ? 'bg-emerald-500 animate-pulse shadow-glow' : 'bg-slate-300'}`}></div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tabular-nums">
                                    <AnimatedNumber value={stats.alertsCount} decimals={0} />
                                </p>
                                {stats.alertsCount > 0 && <span className="text-[10px] md:text-[11px] font-bold text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/20 px-1.5 py-0.5 rounded-md border border-emerald-200/50">ON</span>}
                            </div>
                        </div>

                        {activePopup === 'notifications' && (
                            <div className="absolute top-full right-0 mt-3 w-[85vw] max-w-[320px] md:w-80 bg-white dark:bg-zinc-900 rounded-[24px] shadow-2xl border border-slate-100 dark:border-white/10 overflow-hidden animate-scale-in z-[100] origin-top-left md:origin-top-right text-left">
                                <div className="p-4 border-b border-slate-50 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
                                    <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Tracking Assets</span>
                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-500/20 px-2 py-0.5 rounded-full">{alertStocks.length}</span>
                                </div>
                                <div className="divide-y divide-slate-50 dark:divide-white/5 max-h-60 overflow-y-auto custom-scrollbar">
                                    {alertStocks.length > 0 ? (
                                        alertStocks.map(item => (
                                            <div key={item.id || item.symbol} className="p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex gap-3 items-center">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-slate-900 dark:text-white">{item.symbol}</p>
                                                    <p className="text-[10px] font-medium text-slate-400 dark:text-zinc-500">Price alert active</p>
                                                </div>
                                                <BellIcon className="w-4 h-4 text-emerald-500" />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-6 text-center text-xs text-slate-500">No active alerts set.</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </button>

                    {/* Watchlist Stat */}
                    <button 
                        onClick={() => setActivePopup(activePopup === 'watchlist' ? null : 'watchlist')}
                        className={`relative group/card w-full lg:w-60 text-left focus:outline-none transition-all ${activePopup === 'watchlist' ? 'z-50' : 'z-auto'}`}
                    >
                        <div className={`bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-[24px] p-5 md:p-6 w-full border border-white/20 hover:bg-white transition-all duration-300 shadow-xl hover:shadow-emerald-500/20 transform hover:-translate-y-1 active:scale-95 ${activePopup === 'watchlist' ? 'ring-2 ring-emerald-400' : ''}`}>
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Saved Assets</p>
                                <SparklesIcon className="w-4 h-4 text-emerald-500" />
                            </div>
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tabular-nums">
                                    <AnimatedNumber value={stats.savedCount} decimals={0} />
                                </p>
                            </div>
                        </div>

                        {activePopup === 'watchlist' && (
                            <div className="absolute top-full right-0 mt-3 w-[85vw] max-w-[320px] md:w-80 bg-white dark:bg-zinc-900 rounded-[24px] shadow-2xl border border-slate-100 dark:border-white/10 overflow-hidden animate-scale-in z-[100] origin-top-left md:origin-top-right text-left">
                                <div className="p-4 border-b border-slate-50 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
                                    <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Your Vault</span>
                                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 dark:bg-indigo-500/20 px-2 py-0.5 rounded-full">{savedStocksList.length}</span>
                                </div>
                                <div className="divide-y divide-slate-50 dark:divide-white/5 max-h-60 overflow-y-auto custom-scrollbar">
                                    {savedStocksList.length > 0 ? (
                                        savedStocksList.map(item => (
                                            <div key={item.id || item.symbol} className="p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex gap-3 items-center">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0"></div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-slate-900 dark:text-white">{item.symbol}</p>
                                                    <p className="text-[10px] font-medium text-slate-400 dark:text-zinc-500">Report Saved</p>
                                                </div>
                                                <BookmarkIcon className="w-4 h-4 text-indigo-500" />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-6 text-center text-xs text-slate-500">No saved stocks yet.</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardHero;
