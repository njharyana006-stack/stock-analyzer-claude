
import React, { useState, useEffect } from 'react';
import type { AnalysisResponse } from '../types';
import { TrashIcon, AnalyzeIcon, BookmarkIcon, CheckCircleIcon, TrendingDownIcon, GrowthIcon, ReloadIcon } from './icons';
import { getSavedStocks, deleteSavedStock } from '../services/dbService';
import { getBatchStockPrices } from '../services/geminiService';
import { useAuth } from '../contexts/AuthContext';
import { allStocks, getStockLogo } from '../constants/stocks';

interface SavedPageProps {
    onLoadAnalysis: (analysis: AnalysisResponse) => void;
    onRescan: (ticker: string) => void;
    addToast: (message: string, type: 'info' | 'success' | 'error') => void;
}

interface SavedStockItem {
    id: number;
    symbol: string;
    stock_name: string;
    price: number; // Price at time of saving
    added_date: string;
    analysis_data?: AnalysisResponse; // Cached full analysis
}

const SavedPage: React.FC<SavedPageProps> = ({ onLoadAnalysis, onRescan, addToast }) => {
    const { user } = useAuth();
    const [savedStocks, setSavedStocks] = useState<SavedStockItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPrices, setCurrentPrices] = useState<Record<string, number>>({});
    const [pricesLoading, setPricesLoading] = useState(false);

    useEffect(() => {
        const fetchStocks = async () => {
            if (!user) return;
            try {
                const data = await getSavedStocks(user.id);
                setSavedStocks(data || []);
                
                // Fetch current prices after loading list
                if (data && data.length > 0) {
                    fetchCurrentPrices(data);
                }
            } catch (e) {
                console.error(e);
                addToast("Failed to load saved stocks", 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchStocks();
    }, [user, addToast]);

    const fetchCurrentPrices = async (stocks: SavedStockItem[]) => {
        setPricesLoading(true);
        // Only fetch top 5 most important (recent) stocks to avoid API limits
        const uniqueTickers = [...new Set(stocks.map(s => s.symbol))].slice(0, 5);
        
        try {
            const newPrices = await getBatchStockPrices(uniqueTickers);
            setCurrentPrices(prev => ({ ...prev, ...newPrices }));
        } catch (e) {
            console.warn("Could not batch fetch prices, some prices may be outdated.");
        } finally {
            setPricesLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteSavedStock(id);
            setSavedStocks(prev => prev.filter(s => s.id !== id));
            addToast("Stock removed from favorites.", "info");
        } catch (e) {
            addToast("Failed to delete stock.", "error");
        }
    };

    const handleLoadCached = (item: SavedStockItem) => {
        if (item.analysis_data) {
            onLoadAnalysis(item.analysis_data);
            addToast(`Loaded saved analysis for ${item.symbol}.`, 'success');
        } else {
            addToast(`No cached report found for ${item.symbol}. Starting new scan.`, 'info');
            onRescan(item.symbol);
        }
    };

    const handleRescan = (symbol: string) => {
        onRescan(symbol);
    };

    const handleRefreshPrices = () => {
        fetchCurrentPrices(savedStocks);
        addToast("Updating top stock prices...", "info");
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading your vault...</div>;
    }

    if (savedStocks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 animate-fade-in">
                <div className="relative mb-8 group">
                    <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-50"></div>
                    <div className="relative w-24 h-24 rounded-[2rem] bg-gradient-to-br from-white to-slate-100 dark:from-[#18181B] dark:to-[#121214] flex items-center justify-center shadow-2xl border border-slate-200 dark:border-white/10 group-hover:scale-105 transition-transform duration-500">
                        <BookmarkIcon className="w-10 h-10 text-slate-400 dark:text-zinc-600 group-hover:text-indigo-500 transition-colors duration-300" />
                    </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
                    Your Research Vault
                </h3>
                <p className="text-slate-500 dark:text-zinc-400 max-w-sm mx-auto text-sm md:text-base leading-relaxed font-medium">
                    Stocks you save will appear here. Build your personal library of institutional-grade market intelligence.
                </p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-8 pb-32 pt-4">
            <div className="flex justify-between items-center px-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Saved Assets</h2>
                <button 
                    onClick={handleRefreshPrices} 
                    disabled={pricesLoading}
                    className="flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                >
                    <ReloadIcon className={`w-4 h-4 ${pricesLoading ? 'animate-spin' : ''}`} />
                    <span>{pricesLoading ? 'Updating...' : 'Update Prices'}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {savedStocks.map((stock) => {
                    const currentPrice = currentPrices[stock.symbol];
                    const savedPrice = stock.price;
                    
                    let changePercent = 0;
                    let isPositive = false;
                    let hasCurrentPrice = !!currentPrice;

                    if (hasCurrentPrice && savedPrice > 0) {
                        changePercent = ((currentPrice - savedPrice) / savedPrice) * 100;
                        isPositive = changePercent >= 0;
                    }

                    const logoUrl = getStockLogo(stock.symbol, stock.stock_name);

                    return (
                        <div 
                            key={stock.id} 
                            className="g-card p-6 md:p-8 flex flex-col group relative overflow-hidden bg-white dark:bg-[#121214] hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                        >
                            <div className="flex justify-between items-start mb-6 z-10">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 p-1.5 flex-shrink-0">
                                        <img 
                                            src={logoUrl} 
                                            alt={stock.symbol} 
                                            className="w-full h-full object-contain rounded-lg"
                                            onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${stock.symbol}&background=random&color=fff&bold=true`; }}
                                        />
                                    </div>
                                    <div className="overflow-hidden">
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{stock.symbol}</h3>
                                        <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 truncate mt-1.5 uppercase tracking-widest">{stock.stock_name}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleDelete(stock.id)}
                                    className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-500/20"
                                    title="Remove from vault"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4 mb-8 z-10">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Saved At</p>
                                        <p className="text-lg font-bold text-slate-500 dark:text-zinc-400">${savedPrice?.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current</p>
                                        {hasCurrentPrice ? (
                                            <p className={`text-lg font-black tracking-tight ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                ${currentPrice.toFixed(2)}
                                            </p>
                                        ) : (
                                            <p className="text-lg font-bold text-slate-300 dark:text-zinc-600 animate-pulse">---</p>
                                        )}
                                    </div>
                                </div>

                                {hasCurrentPrice && (
                                    <div className={`flex items-center gap-2 text-sm font-bold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                        {isPositive ? <GrowthIcon className="w-4 h-4" /> : <TrendingDownIcon className="w-4 h-4" />}
                                        <span>{changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}% since saved</span>
                                    </div>
                                )}
                                
                                <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                                    <span className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest flex items-center">
                                        <CheckCircleIcon className="w-3 h-3 mr-1.5 text-slate-300 dark:text-zinc-700" />
                                        Added: {new Date(stock.added_date).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-auto flex gap-3">
                                <button
                                    onClick={() => handleLoadCached(stock)}
                                    className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-[11px] uppercase tracking-wider transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <AnalyzeIcon className="w-4 h-4" />
                                    View Report
                                </button>
                                <button
                                    onClick={() => handleRescan(stock.symbol)}
                                    className="px-4 py-4 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-zinc-300 rounded-2xl transition-all border border-transparent hover:border-slate-300 dark:hover:border-white/10 active:scale-[0.98]"
                                    title="Refresh Data"
                                >
                                    <ReloadIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SavedPage;
