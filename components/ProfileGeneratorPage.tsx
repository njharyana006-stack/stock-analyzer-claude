
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { AIPortfolio, RiskProfile, UserHolding, PortfolioAnalysisResult } from '../types';
import PortfolioPieChart from './charts/PortfolioPieChart';
import { BotIcon, GrowthIcon, ReloadIcon, PieChartIcon, ExternalLinkIcon, InfoIcon, ShieldIcon, ScaleIcon, RocketIcon, TrendingDownIcon, SearchIcon, PlusIcon, TrashIcon, CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, FinancialsIcon, SparklesIcon } from './icons';
import { analyzeUserPortfolio, getCurrentStockPrice } from '../services/geminiService';
import { extractJson, triggerNotification } from '../utils';
import { allStocks, getStockLogo } from '../constants/stocks';
import DonutChart from './charts/DonutChart';
import RadialProgress from './charts/RadialProgress';

interface ProfileGeneratorPageProps {
    riskProfile: RiskProfile;
    addToast: (message: string, type: 'info' | 'success' | 'error') => void;
    portfolio: AIPortfolio | null;
    isLoading: boolean;
    error: string | null;
    onGenerate: (horizon: string, count: number) => Promise<void>;
}

const COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#f43f5e', '#64748b', '#f43f5e', '#14b8a6', '#f97316', '#65a30d', '#2563eb', '#c026d3', '#be185d'];

const MetricCard: React.FC<{ label: string; value: string; icon: React.ReactElement; className?: string; rationale?: string; }> = ({ label, value, icon, className, rationale }) => (
    <div className={`g-card !p-5 text-center relative group border-l-4 shadow-sm hover:shadow-md transition-all ${className}`}>
        <div className="flex items-center justify-center space-x-2 mb-2">
            {icon}
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">{label}</p>
             {rationale && (
                <div className="absolute top-2 right-2">
                    <InfoIcon className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 cursor-help hover:text-slate-600 dark:hover:text-zinc-300" />
                     <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 dark:bg-zinc-900 text-white text-xs rounded-lg shadow-xl border border-slate-700 dark:border-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 font-medium leading-relaxed">
                        {rationale}
                    </div>
                </div>
            )}
        </div>
        <p className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">{value}</p>
    </div>
);

const timeHorizons = ['3 Months', '6 Months', '1 Year'];
const stockCounts = [4, 8, 12];

const riskIcons: { [key in RiskProfile]: React.ReactElement } = {
    Conservative: <ShieldIcon className="w-5 h-5" />,
    Moderate: <ScaleIcon className="w-5 h-5" />,
    Aggressive: <RocketIcon className="w-5 h-5" />,
};

const PortfolioInputRow: React.FC<{ onAdd: (holding: Omit<UserHolding, 'id' | 'currentPrice'>) => void }> = ({ onAdd }) => {
    const [ticker, setTicker] = useState('');
    const [shares, setShares] = useState('');
    const [cost, setCost] = useState('');
    const [date, setDate] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setDate(today);
    }, []);

    const filteredStocks = useMemo(() => {
        if (!ticker) return [];
        return allStocks.filter(s => 
            s.symbol.toLowerCase().includes(ticker.toLowerCase()) || 
            s.name.toLowerCase().includes(ticker.toLowerCase())
        ).slice(0, 10);
    }, [ticker]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAddClick = () => {
        if (ticker && shares && cost) {
            onAdd({
                ticker: ticker.toUpperCase(),
                shares: parseFloat(shares),
                avgCost: parseFloat(cost),
                purchaseDate: date
            });
            setTicker('');
            setShares('');
            setCost('');
        }
    };

    return (
        <div className="g-card !p-6 mb-8 bg-white dark:bg-[#121214] border border-slate-200 dark:border-white/10 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wide flex items-center">
                <span className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mr-3 text-indigo-500 border border-indigo-100 dark:border-indigo-500/20">
                    <PlusIcon className="w-5 h-5" />
                </span>
                Add Asset to Portfolio
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="relative md:col-span-1" ref={dropdownRef}>
                    <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-2 ml-1 uppercase tracking-wider">Asset Symbol</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#18181B] text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-400"
                            placeholder="Search ticker..."
                            value={ticker}
                            onChange={(e) => { setTicker(e.target.value); setShowDropdown(true); }}
                            onFocus={() => setShowDropdown(true)}
                        />
                        <SearchIcon className="absolute right-4 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
                        {showDropdown && filteredStocks.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#202023] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto custom-scrollbar animate-scale-in">
                                {filteredStocks.map(stock => (
                                    <button
                                        key={stock.symbol}
                                        onClick={() => { setTicker(stock.symbol); setShowDropdown(false); }}
                                        className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 flex justify-between items-center group border-b border-slate-100 dark:border-white/5 last:border-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 p-1 flex items-center justify-center">
                                                <img src={getStockLogo(stock.symbol)} alt="" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display='none'; }} />
                                            </div>
                                            <span className="font-bold text-slate-700 dark:text-zinc-200">{stock.symbol}</span>
                                        </div>
                                        <span className="text-xs text-slate-400 group-hover:text-slate-500">{stock.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-full md:col-span-1">
                    <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-2 ml-1 uppercase tracking-wider">Shares Owned</label>
                    <input 
                        type="number" 
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#18181B] text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                        placeholder="0"
                        value={shares}
                        onChange={(e) => setShares(e.target.value)}
                    />
                </div>
                <div className="w-full md:col-span-1">
                    <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-2 ml-1 uppercase tracking-wider">Avg Cost</label>
                    <input 
                        type="number" 
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#18181B] text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                        placeholder="$0.00"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                    />
                </div>
                <button 
                    onClick={handleAddClick}
                    disabled={!ticker || !shares || !cost}
                    className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-white/10 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2 md:col-span-1"
                >
                    <PlusIcon className="w-4 h-4" /> Add Asset
                </button>
            </div>
        </div>
    );
};

const ActionBadge: React.FC<{ action: 'HOLD' | 'EXIT' | 'REDUCE' | 'BUY_MORE' }> = ({ action }) => {
    const config = {
        'HOLD': { color: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20', icon: '✋' },
        'EXIT': { color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20', icon: '🚪' },
        'REDUCE': { color: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20', icon: '📉' },
        'BUY_MORE': { color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20', icon: '🚀' },
    };
    const style = config[action] || config['HOLD'];
    const displayAction = action ? action.replace('_', ' ') : 'HOLD';
    
    return (
        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${style.color} flex items-center gap-1.5 shadow-sm uppercase tracking-wide`}>
            <span>{style.icon}</span> {displayAction}
        </span>
    );
};

const ProfileGeneratorPage: React.FC<ProfileGeneratorPageProps> = ({ riskProfile, addToast, portfolio, isLoading, error, onGenerate }) => {
    const [activeTab, setActiveTab] = useState<'generator' | 'analyzer'>('generator');
    const [timeHorizon, setTimeHorizon] = useState<string>('1 Year');
    const [numStocks, setNumStocks] = useState<number>(8);

    const [holdings, setHoldings] = useState<UserHolding[]>([]);
    const [analysisResult, setAnalysisResult] = useState<PortfolioAnalysisResult | null>(null);
    const [isAnalzying, setIsAnalyzing] = useState(false);

    const handleAddHolding = async (holdingData: Omit<UserHolding, 'id' | 'currentPrice'>) => {
        const tempId = Date.now().toString();
        const newHolding: UserHolding = { ...holdingData, id: tempId, currentPrice: 0 };
        setHoldings(prev => [...prev, newHolding]);
        
        try {
            const price = await getCurrentStockPrice(holdingData.ticker);
            setHoldings(prev => prev.map(h => h.id === tempId ? { ...h, currentPrice: price } : h));
        } catch (e) {
            console.error("Failed to fetch price", e);
        }
    };

    const handleRemoveHolding = (id: string) => {
        setHoldings(prev => prev.filter(h => h.id !== id));
    };

    const runPortfolioAnalysis = async () => {
        if (holdings.length === 0) {
            addToast("Add some assets to your portfolio first!", "info");
            return;
        }
        setIsAnalyzing(true);
        setAnalysisResult(null);
        addToast("AI Chief Strategist is auditing your portfolio...", 'info');
        try {
            const resultText = await analyzeUserPortfolio(holdings, riskProfile);
            const result: PortfolioAnalysisResult = JSON.parse(extractJson(resultText));
            setAnalysisResult(result);
            addToast("Portfolio analysis complete!", 'success');
            triggerNotification('Portfolio Analysis Completed', 'success');
        } catch (e) {
            console.error(e);
            addToast("Failed to analyze portfolio. Please try again.", 'error');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const totalValue = holdings.reduce((sum, h) => sum + (h.currentPrice || 0) * h.shares, 0);
    const totalCost = holdings.reduce((sum, h) => sum + h.avgCost * h.shares, 0);
    const totalGain = totalValue - totalCost;
    const totalGainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

    const renderGeneratorContent = () => {
        if (isLoading) {
             return (
                <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-slate-50/50 dark:bg-[#121214]/50 rounded-[32px] border border-dashed border-slate-200 dark:border-white/10 animate-fade-in">
                    <div className="relative flex items-center justify-center w-24 h-24 mb-6">
                        <div className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/20 opacity-75 animate-ping"></div>
                        <div className="relative inline-flex rounded-full h-24 w-24 bg-white dark:bg-[#18181B] items-center justify-center shadow-lg border border-emerald-100 dark:border-emerald-500/20">
                            <PieChartIcon className="w-10 h-10 text-emerald-500 dark:text-emerald-400 animate-pulse" />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Constructing Portfolio</h3>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 max-w-xs mx-auto font-medium">
                        AI is analyzing market data to match your {riskProfile} profile and {timeHorizon} horizon...
                    </p>
                </div>
            );
        }
        
        if (error) {
             return (
                <div className="flex flex-col items-center justify-center min-h-[400px] g-card bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-500/20 text-center animate-fade-in">
                    <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mb-4">
                        <InfoIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-red-800 dark:text-red-400">Generation Failed</h3>
                    <p className="mt-2 text-red-700 dark:text-red-300 max-w-md px-4">{error}</p>
                    <button onClick={() => onGenerate(timeHorizon, numStocks)} className="mt-6 px-6 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-full flex items-center space-x-2 shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95">
                        <ReloadIcon className="w-4 h-4" />
                        <span>Try Again</span>
                    </button>
                </div>
            );
        }

        if (!portfolio) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-slate-50 dark:bg-[#18181B] rounded-[32px] border border-dashed border-slate-200 dark:border-white/10 shadow-inner animate-fade-in group hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-default">
                    <div className="w-20 h-20 rounded-3xl bg-white dark:bg-white/5 flex items-center justify-center mb-6 text-slate-300 dark:text-zinc-600 shadow-sm border border-slate-100 dark:border-white/5 group-hover:scale-110 transition-transform duration-500">
                        <PieChartIcon className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-200">Ready to Build</h3>
                    <p className="text-slate-500 dark:text-zinc-500 mt-2 max-w-sm mx-auto leading-relaxed text-sm font-medium">
                        Configure your preferences above and click "Generate Portfolio" to harness AI strategy.
                    </p>
                </div>
            );
        }

        const stocks = portfolio.stocks || [];

        return (
            <div className="space-y-6 animate-slide-up">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     <MetricCard 
                        label="Expected Return" 
                        value={`${(portfolio.expected_annual_return ?? 0).toFixed(1)}%`} 
                        icon={<GrowthIcon className="w-5 h-5 text-green-500" />} 
                        className="bg-green-50/50 dark:bg-green-900/10 border-green-500 dark:border-green-500/50" 
                        rationale={portfolio.expected_return_rationale} 
                    />
                     <MetricCard 
                        label="Best Case" 
                        value={`+${(portfolio.best_case_return ?? 0).toFixed(1)}%`} 
                        icon={<GrowthIcon className="w-5 h-5 text-sky-500" />} 
                        className="bg-sky-50/50 dark:bg-sky-900/10 border-sky-500 dark:border-sky-500/50" 
                        rationale={portfolio.best_case_rationale}
                    />
                     <MetricCard 
                        label="Worst Case" 
                        value={`${(portfolio.worst_case_return ?? 0).toFixed(1)}%`} 
                        icon={<TrendingDownIcon className="w-5 h-5 text-rose-500" />} 
                        className="bg-rose-50/50 dark:bg-rose-900/10 border-rose-500 dark:border-rose-500/50" 
                        rationale={portfolio.worst_case_rationale} 
                    />
                     <MetricCard 
                        label="Time Horizon" 
                        value={portfolio.time_horizon} 
                        icon={<div className="text-slate-500 dark:text-zinc-400">{riskIcons[portfolio.risk_profile]}</div>}
                        className="bg-slate-50/50 dark:bg-white/5 border-slate-400 dark:border-zinc-600" 
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 g-card !p-6 bg-white dark:bg-[#121214]">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-shrink-0">
                                <PortfolioPieChart portfolio={portfolio} />
                            </div>
                            <div className="w-full flex-1">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-bold text-slate-900 dark:text-white">Asset Allocation</h4>
                                    <span className="text-xs font-bold text-slate-500 dark:text-zinc-500 bg-slate-100 dark:bg-white/10 px-2 py-1 rounded-full">{stocks.length} Assets</span>
                                </div>
                                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {stocks.map((stock, index) => (
                                        <div key={stock.ticker} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-colors group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 p-1 flex items-center justify-center shadow-sm">
                                                    <img src={getStockLogo(stock.ticker)} alt="" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display='none'; }} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-slate-700 dark:text-zinc-200">{stock.ticker}</span>
                                                        <a href={`https://finviz.com/quote.ashx?t=${stock.ticker}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-500 transition-colors">
                                                            <ExternalLinkIcon className="w-3.5 h-3.5" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-24 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden hidden sm:block">
                                                    <div className="h-full rounded-full" style={{ width: `${stock.allocation}%`, backgroundColor: COLORS[index % COLORS.length] }}></div>
                                                </div>
                                                <span className="font-mono font-bold text-slate-700 dark:text-zinc-300 w-12 text-right">{stock.allocation}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="g-card !p-6 bg-white dark:bg-[#121214] flex flex-col">
                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100 dark:border-white/5">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <BotIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white">AI Investment Thesis</h4>
                                <p className="text-xs text-slate-500 dark:text-zinc-500">Strategy Rationale</p>
                            </div>
                        </div>
                        <div className="flex-grow">
                            <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed font-medium">
                                {portfolio.rationale}
                            </p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-500">
                                <ShieldIcon className="w-4 h-4" />
                                <span>Risk Profile: <strong className="text-slate-700 dark:text-zinc-300">{portfolio.risk_profile}</strong></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderAnalyzerContent = () => {
        return (
            <div className="animate-fade-in space-y-8">
                <PortfolioInputRow onAdd={handleAddHolding} />

                {holdings.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
                        <MetricCard 
                            label="Total Value" 
                            value={`$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
                            icon={<FinancialsIcon className="w-5 h-5 text-emerald-500" />}
                            className="bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-500/20"
                        />
                        <MetricCard 
                            label="Total Cost" 
                            value={`$${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
                            icon={<ScaleIcon className="w-5 h-5 text-slate-500" />}
                            className="bg-slate-50/50 dark:bg-white/5 border-slate-200 dark:border-white/10"
                        />
                        <MetricCard 
                            label="Total Gain/Loss" 
                            value={`${totalGain >= 0 ? '+' : ''}$${totalGain.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
                            icon={totalGain >= 0 ? <GrowthIcon className="w-5 h-5 text-emerald-500" /> : <TrendingDownIcon className="w-5 h-5 text-rose-500" />}
                            className={`${totalGain >= 0 ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200' : 'bg-rose-50/50 dark:bg-rose-900/10 border-rose-200'} dark:border-opacity-20`}
                        />
                         <MetricCard 
                            label="Return %" 
                            value={`${totalGain >= 0 ? '+' : ''}${totalGainPercent.toFixed(2)}%`} 
                            icon={<PieChartIcon className="w-5 h-5 text-indigo-500" />}
                            className="bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-500/20"
                        />
                    </div>
                )}

                {holdings.length > 0 && (
                    <div className="g-card !p-0 overflow-hidden bg-white dark:bg-[#121214] shadow-sm border border-slate-200 dark:border-white/5 animate-slide-up">
                        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/30 dark:bg-white/5">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <ScaleIcon className="w-5 h-5 text-slate-500" /> Current Holdings
                            </h3>
                            <button 
                                onClick={runPortfolioAnalysis}
                                disabled={isAnalzying}
                                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                            >
                                <BotIcon className={`w-4 h-4 ${isAnalzying ? 'animate-spin' : ''}`} />
                                {isAnalzying ? 'Analyzing...' : 'Analyze Portfolio'}
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-zinc-400 font-bold border-b border-slate-200 dark:border-white/5 uppercase tracking-wide text-xs">
                                    <tr>
                                        <th className="p-4 pl-6">Asset</th>
                                        <th className="p-4 text-center">Shares</th>
                                        <th className="p-4 text-right">Avg Cost</th>
                                        <th className="p-4 text-right">Current</th>
                                        <th className="p-4 text-right">Value</th>
                                        <th className="p-4 text-right">Gain/Loss</th>
                                        <th className="p-4 text-center pr-6">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
                                    {holdings.map(h => {
                                        const val = (h.currentPrice || 0) * h.shares;
                                        const gl = val - (h.avgCost * h.shares);
                                        const glP = h.avgCost > 0 ? (gl / (h.avgCost * h.shares)) * 100 : 0;
                                        return (
                                            <tr key={h.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                                <td className="p-4 pl-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 p-1 flex items-center justify-center">
                                                            <img src={getStockLogo(h.ticker)} alt="" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display='none'; }} />
                                                        </div>
                                                        <span className="font-bold text-slate-900 dark:text-white">{h.ticker}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center text-slate-600 dark:text-zinc-300">{h.shares}</td>
                                                <td className="p-4 text-right text-slate-600 dark:text-zinc-300">${h.avgCost.toFixed(2)}</td>
                                                <td className="p-4 text-right font-medium text-slate-900 dark:text-white">${h.currentPrice?.toFixed(2) || '---'}</td>
                                                <td className="p-4 text-right font-bold text-slate-900 dark:text-white">${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                                <td className={`p-4 text-right font-semibold ${gl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {gl >= 0 ? '+' : ''}{glP.toFixed(2)}%
                                                </td>
                                                <td className="p-4 pr-6 text-center">
                                                    <button onClick={() => handleRemoveHolding(h.id)} className="p-2 text-slate-400 hover:text-rose-500 rounded-full hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {analysisResult && (
                    <div className="space-y-8 animate-slide-up">
                        <div className="g-card !p-0 bg-white dark:bg-[#121214] border border-slate-200 dark:border-white/10 overflow-hidden shadow-lg group">
                            <div className="flex flex-col md:flex-row min-h-[320px]">
                                <div className="md:w-1/3 p-8 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                                     <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/5 to-transparent dark:from-indigo-500/10 pointer-events-none"></div>
                                     <RadialProgress 
                                        title="AI Health Score" 
                                        score={analysisResult.overall_health_score} 
                                        rationale={`Risk alignment: ${riskProfile}`}
                                    />
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border shadow-sm ${
                                            analysisResult.overall_health_score >= 8 ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' :
                                            analysisResult.overall_health_score >= 5 ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' :
                                            'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                                        }`}>
                                            {analysisResult.overall_health_score >= 8 ? 'Optimized' : 
                                             analysisResult.overall_health_score >= 5 ? 'Average' : 'At Risk'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-white dark:bg-[#121214]">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shadow-sm border border-indigo-100 dark:border-indigo-500/20">
                                            <BotIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">AI Portfolio Assessment</h3>
                                    </div>
                                    <div className="relative">
                                        <p className="text-lg text-slate-700 dark:text-zinc-300 leading-relaxed font-medium italic border-l-4 border-indigo-500 pl-6 py-2">
                                            "{analysisResult.health_summary}"
                                        </p>
                                    </div>
                                    <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-100 dark:border-white/5">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Analysis Type</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-zinc-200">Quad-Factor Synthesis</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Risk Profile</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-zinc-200">{riskProfile}</p>
                                        </div>
                                        <div className="space-y-1 col-span-2 sm:col-span-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</p>
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-zinc-200">Market Live</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 g-card !p-6 bg-white dark:bg-[#121214] shadow-sm">
                                <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center">
                                    <PieChartIcon className="w-5 h-5 mr-2 text-indigo-500" /> Sector Exposure
                                </h4>
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    <div className="h-64 w-64 flex-shrink-0">
                                        <DonutChart 
                                            data={analysisResult.sector_allocation.map((s, i) => ({
                                                label: s.sector,
                                                value: s.percentage,
                                                color: COLORS[i % COLORS.length]
                                            }))} 
                                        />
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Diversification Analysis</h5>
                                        <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed font-medium bg-slate-50/50 dark:bg-white/5 p-5 rounded-2xl border border-slate-100 dark:border-white/5">
                                            {analysisResult.diversification_analysis}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="g-card !p-6 bg-indigo-600 text-white relative overflow-hidden shadow-xl shadow-indigo-500/20">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                <h4 className="text-lg font-bold mb-6 flex items-center tracking-tight">
                                    <SparklesIcon className="w-5 h-5 mr-2 text-indigo-200" /> Strategic Alignment
                                </h4>
                                <ul className="space-y-4">
                                    {analysisResult.rebalancing_suggestions.map((suggestion, i) => (
                                        <li key={i} className="flex items-start gap-3 group">
                                            <div className="mt-1 w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                                <span className="text-[10px] font-black">{i + 1}</span>
                                            </div>
                                            <span className="text-sm font-medium leading-snug opacity-90 group-hover:opacity-100 transition-opacity">{suggestion}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-8 pt-6 border-t border-white/10">
                                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-200 mb-2">Risk Note</p>
                                    <p className="text-xs leading-relaxed opacity-80">{analysisResult.risk_assessment}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white px-2 tracking-tight">AI Asset Recommendations</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {analysisResult.holdings_analysis.map((item) => (
                                    <div key={item.ticker} className="g-card p-6 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-slate-100/50 dark:from-white/5 to-transparent pointer-events-none"></div>
                                        <div className="flex flex-col gap-4 relative z-10">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 p-1 flex items-center justify-center shadow-sm">
                                                        <img src={getStockLogo(item.ticker)} alt="" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display='none'; }} />
                                                    </div>
                                                    <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{item.ticker}</span>
                                                </div>
                                                <ActionBadge action={item.action} />
                                            </div>
                                            <div className="space-y-3">
                                                <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed font-medium">
                                                    {item.rationale}
                                                </p>
                                                {item.suggested_replacement && (
                                                    <div className="mt-4 flex items-center gap-2.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-100 dark:border-indigo-500/20 w-fit shadow-sm">
                                                        <ReloadIcon className="w-3.5 h-3.5" />
                                                        <span>Alternative Idea: {item.suggested_replacement}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="animate-fade-in max-w-7xl mx-auto pb-20 px-4 md:px-0 pt-8">
             <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
                        <div className="p-2.5 bg-emerald-100 dark:bg-emerald-500/10 rounded-2xl border border-emerald-200 dark:border-emerald-500/20">
                            <PieChartIcon className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        Strategy & Portfolio
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 ml-14 font-medium max-w-md leading-relaxed">
                        Construct AI-optimized portfolios or analyze your current holdings for efficiency.
                    </p>
                </div>
                
                <div className="bg-slate-100 dark:bg-[#18181B] p-1.5 rounded-xl flex items-center border border-slate-200 dark:border-white/5 w-full md:w-auto">
                    <button 
                        onClick={() => setActiveTab('generator')}
                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'generator' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300'}`}
                    >
                        Generator
                    </button>
                    <button 
                        onClick={() => setActiveTab('analyzer')}
                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'analyzer' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300'}`}
                    >
                        Portfolio Analysis
                    </button>
                </div>
            </div>
            
            {activeTab === 'generator' ? (
                <div className="g-card !p-6 md:!p-8 mb-8 bg-white dark:bg-[#121214] border border-slate-200 dark:border-white/5 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-3 uppercase tracking-wide ml-1">Time Horizon</label>
                             <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-black/20 p-1.5 rounded-xl border border-slate-200 dark:border-white/5">
                                {timeHorizons.map(h => (
                                    <button 
                                        key={h} 
                                        onClick={() => setTimeHorizon(h)} 
                                        disabled={isLoading}
                                        className={`px-2 py-2.5 text-[10px] sm:text-xs font-bold rounded-lg transition-all duration-200 ${
                                            timeHorizon === h 
                                            ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10' 
                                            : 'text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300'
                                        }`}
                                    >
                                        {h}
                                    </button>
                                ))}
                            </div>
                        </div>

                         <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-zinc-400 mb-3 uppercase tracking-wide ml-1">Asset Count</label>
                             <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-black/20 p-1.5 rounded-xl border border-slate-200 dark:border-white/5">
                                {stockCounts.map(c => (
                                    <button 
                                        key={c} 
                                        onClick={() => setNumStocks(c)} 
                                        disabled={isLoading}
                                        className={`px-2 py-2.5 text-[10px] sm:text-xs font-bold rounded-lg transition-all duration-200 ${
                                            numStocks === c 
                                            ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10' 
                                            : 'text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300'
                                        }`}
                                    >
                                        {c} Assets
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button 
                            onClick={() => onGenerate(timeHorizon, numStocks)} 
                            disabled={isLoading}
                            className="h-[58px] w-full flex items-center justify-center space-x-2 px-6 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 disabled:bg-slate-300 dark:disabled:bg-white/10 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] rounded-xl border border-indigo-500/20"
                        >
                            <ReloadIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                            <span>{isLoading ? 'Building Strategy...' : 'Generate AI Portfolio'}</span>
                        </button>
                    </div>
                </div>
            ) : null}
             
             {activeTab === 'generator' ? renderGeneratorContent() : renderAnalyzerContent()}
        </div>
    );
};

export default ProfileGeneratorPage;
