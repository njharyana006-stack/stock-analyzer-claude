
import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { RiskProfile } from '../types';
import { AnalyzeIcon, SearchIcon, ShieldIcon, RocketIcon, ScaleIcon, ArrowLongRightIcon } from './icons';
import { allStocks, getStockLogo } from '../constants/stocks';

interface StockSelectorProps {
  initialTicker: string;
  initialRiskProfile: RiskProfile;
  onAnalyze: (ticker: string, riskProfile: RiskProfile) => void;
  isLoading: boolean;
  hideRiskProfile?: boolean;
}

const StockSelector: React.FC<StockSelectorProps> = ({
  initialTicker,
  initialRiskProfile,
  onAnalyze,
  isLoading,
  hideRiskProfile = false,
}) => {
  const [ticker, setTicker] = useState(initialTicker);
  const [riskProfile, setRiskProfile] = useState(initialRiskProfile);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedStock = useMemo(() => {
    return allStocks.find(stock => stock.symbol === ticker) || { name: 'Custom Ticker', symbol: ticker, domain: '' };
  }, [ticker]);

  const filteredStocks = useMemo(() => {
      const term = searchTerm.toLowerCase();
      if (!term) return allStocks.slice(0, 8); // Top suggestions
      return allStocks.filter(stock => 
          stock.symbol.toLowerCase().includes(term) ||
          stock.name.toLowerCase().includes(term)
      ).slice(0, 20);
  }, [searchTerm]);

  const handleSelect = (stockSymbol: string) => {
      setTicker(stockSymbol);
      setIsOpen(false);
      setSearchTerm('');
      // Trigger analysis immediately on selection from list
      onAnalyze(stockSymbol, riskProfile);
  };

  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
              setIsOpen(false);
          }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
          document.removeEventListener("mousedown", handleClickOutside);
      };
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if(e) e.preventDefault();
    const finalTicker = searchTerm.trim() ? searchTerm.toUpperCase() : ticker;
    if (!finalTicker) return;
    onAnalyze(finalTicker, riskProfile);
    setIsOpen(false);
  };
  
  const riskProfiles: { id: RiskProfile, label: string, shortLabel: string, icon: React.ReactNode, color: string }[] = [
      { id: 'Conservative', label: 'Low', shortLabel: 'LOW', icon: <ShieldIcon className="w-3.5 h-3.5" />, color: 'text-emerald-700 bg-emerald-100 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20' },
      { id: 'Moderate', label: 'Mid', shortLabel: 'MID', icon: <ScaleIcon className="w-3.5 h-3.5" />, color: 'text-sky-700 bg-sky-100 border-sky-200 dark:text-sky-400 dark:bg-sky-500/10 dark:border-sky-500/20' },
      { id: 'Aggressive', label: 'High', shortLabel: 'HIGH', icon: <RocketIcon className="w-3.5 h-3.5" />, color: 'text-rose-700 bg-rose-100 border-rose-200 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/20' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto mb-8 relative z-[30]">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center">
            <div className="flex-grow w-full relative" ref={dropdownRef}>
                <div
                    className={`flex items-center w-full h-[56px] bg-white dark:bg-[#121214] border ${isOpen ? 'border-emerald-500 ring-4 ring-emerald-500/10 dark:border-indigo-500 dark:ring-indigo-500/10' : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'} rounded-[20px] shadow-sm hover:shadow-md transition-all duration-200 cursor-text px-5`}
                    onClick={() => setIsOpen(true)}
                >
                    <SearchIcon className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors duration-200 ${isOpen ? 'text-emerald-500 dark:text-indigo-500' : 'text-slate-400 dark:text-zinc-500'}`} />
                    <input
                        type="text"
                        placeholder={isOpen ? "Search by ticker or name..." : `${ticker} - ${selectedStock.name}`}
                        className="flex-grow bg-transparent border-none focus:ring-0 focus:outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 text-lg font-bold appearance-none min-w-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsOpen(true)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSubmit();
                            }
                        }}
                        aria-label="Search for stock ticker or company name"
                        aria-expanded={isOpen}
                        aria-autocomplete="list"
                    />
                    {!isOpen && (
                        <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 p-1 flex items-center justify-center flex-shrink-0">
                                <img src={getStockLogo(ticker)} alt="" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display='none'; }} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-widest hidden sm:block">Press to Change</span>
                        </div>
                    )}
                </div>

                {isOpen && (
                    <div
                        className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#18181B] border border-slate-200 dark:border-white/10 rounded-[24px] shadow-2xl overflow-hidden max-h-[360px] overflow-y-auto z-50 animate-scale-in ring-1 ring-black/5 custom-scrollbar"
                        role="listbox"
                        aria-label="Stock search results"
                    >
                        <div className="p-2 space-y-1">
                            {filteredStocks.map((stock) => {
                                const logoUrl = getStockLogo(stock.symbol, stock.name);
                                return (
                                <button
                                    key={stock.symbol}
                                    onClick={() => handleSelect(stock.symbol)}
                                    className="flex items-center justify-between w-full p-3 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-all duration-150 group active:scale-[0.98]"
                                    role="option"
                                    aria-label={`Select ${stock.name} (${stock.symbol})`}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-10 h-10 rounded-lg bg-white dark:bg-white/10 flex items-center justify-center border border-slate-200 dark:border-white/5 group-hover:border-slate-300 dark:group-hover:border-white/10 group-hover:shadow-md transition-all duration-150 p-1 flex-shrink-0">
                                            <img
                                                src={logoUrl}
                                                alt={`${stock.symbol} logo`}
                                                className="w-full h-full object-contain"
                                                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://ui-avatars.com/api/?name=${stock.symbol}&background=random&color=fff&bold=true`; }}
                                            />
                                        </div>
                                        <div className="text-left overflow-hidden">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate leading-none mb-1">{stock.symbol}</p>
                                            <p className="text-[10px] text-slate-400 dark:text-zinc-500 truncate font-semibold uppercase tracking-tight">{stock.name}</p>
                                        </div>
                                    </div>
                                    <ArrowLongRightIcon className="w-4 h-4 text-slate-300 dark:text-zinc-600 -ml-2 opacity-0 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                                </button>
                            )})}
                            {searchTerm && !filteredStocks.some(s => s.symbol === searchTerm.toUpperCase()) && (
                                <button
                                    onClick={() => handleSelect(searchTerm.toUpperCase())}
                                    className="flex items-center gap-3 w-full p-3 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all duration-150 text-left active:scale-[0.98]"
                                    role="option"
                                    aria-label={`Analyze custom ticker ${searchTerm.toUpperCase()}`}
                                >
                                    <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-xs">
                                        NEW
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Scan "{searchTerm.toUpperCase()}"</p>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Manual Ticker Entry</p>
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {!hideRiskProfile && (
                <div className="flex-shrink-0 bg-white dark:bg-[#121214] border border-slate-200 dark:border-white/10 rounded-[20px] p-1.5 flex items-center shadow-sm h-[56px]" role="radiogroup" aria-label="Select risk profile">
                    {riskProfiles.map((rp) => (
                        <button
                            key={rp.id}
                            onClick={() => setRiskProfile(rp.id)}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${
                                riskProfile === rp.id
                                ? `${rp.color} shadow-sm scale-105`
                                : 'text-slate-500 dark:text-zinc-500 hover:bg-slate-50 dark:hover:bg-white/5 hover:scale-102'
                            }`}
                            role="radio"
                            aria-checked={riskProfile === rp.id}
                            aria-label={`${rp.label} risk profile`}
                        >
                            {rp.icon}
                            <span className="hidden xl:inline">{rp.label}</span>
                            <span className="xl:hidden">{rp.shortLabel}</span>
                        </button>
                    ))}
                </div>
            )}

            <button
                onClick={() => handleSubmit()}
                disabled={isLoading}
                className="h-[56px] px-8 bg-slate-900 dark:bg-white text-white dark:text-black rounded-[20px] font-bold text-sm shadow-lg shadow-slate-900/20 dark:shadow-white/10 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg transition-all duration-200 flex-shrink-0 flex items-center justify-center gap-2 group"
                aria-label={isLoading ? "Analysis in progress" : "Run stock analysis"}
            >
                {isLoading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin"></div>
                        <span className="hidden sm:inline">Analyzing...</span>
                    </>
                ) : (
                    <>
                        <AnalyzeIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                        <span>Run Analysis</span>
                    </>
                )}
            </button>
        </div>
    </div>
  );
};

export default StockSelector;
