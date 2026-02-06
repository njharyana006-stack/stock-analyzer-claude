
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { PlusIcon, SearchIcon } from '../icons';
import { allStocks, getStockLogo } from '../../constants/stocks';

interface StockSelectorForCompareProps {
  onSelect: (ticker: string) => void;
  disabledTickers: string[];
}

const StockSelectorForCompare: React.FC<StockSelectorForCompareProps> = ({ onSelect, disabledTickers }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (stockSymbol: string) => {
      onSelect(stockSymbol);
      setIsOpen(false);
      setSearchTerm('');
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
  }, [dropdownRef]);

  useEffect(() => {
      if (isOpen && inputRef.current) {
          inputRef.current.focus();
      }
  }, [isOpen]);

  const filteredStocks = useMemo(() => {
      if (!searchTerm) return allStocks.slice(0, 20); // Show top 20 default
      return allStocks.filter(stock => 
          stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 50); // Limit results for performance
  }, [searchTerm]);

  return (
    <div className="relative w-full h-full" ref={dropdownRef}>
        <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full h-full flex flex-col items-center justify-center space-y-3 p-3 bg-[#121214] border border-dashed border-white/10 rounded-[24px] text-zinc-500 font-semibold hover:bg-white/5 hover:border-white/20 hover:text-white transition-all duration-300 group"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
        >
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform border border-white/5">
                <PlusIcon className="w-6 h-6" />
            </div>
            <span>Add Stock</span>
        </button>
        {isOpen && (
            <div className="absolute z-20 top-0 left-0 w-full bg-[#18181B] rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-scale-in ring-1 ring-black/50">
                <div className="p-3 border-b border-white/5 sticky top-0 bg-[#18181B] z-10">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                        {/* text-base prevents iOS zoom */}
                        <input
                            ref={inputRef}
                            type="text"
                            className="w-full pl-9 pr-3 py-2 text-base bg-black/20 text-white border border-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder-zinc-600"
                            placeholder="Search ticker..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <ul role="listbox" className="max-h-60 overflow-y-auto py-1 bg-[#18181B] custom-scrollbar overscroll-contain">
                    {filteredStocks.map(stock => {
                        const isDisabled = disabledTickers.includes(stock.symbol);
                        const logoUrl = getStockLogo(stock.symbol, stock.name);
                        return (
                             <li
                                key={stock.symbol}
                                onClick={() => !isDisabled && handleSelect(stock.symbol)}
                                className={`flex items-center space-x-3 px-4 py-3 text-sm transition-colors border-b border-white/5 last:border-0 ${
                                    isDisabled 
                                    ? 'opacity-50 cursor-not-allowed' 
                                    : 'hover:bg-white/5 cursor-pointer'
                                }`}
                                role="option"
                                aria-disabled={isDisabled}
                            >
                                <div className="w-8 h-8 rounded-lg bg-[#27272A] p-1 flex items-center justify-center flex-shrink-0 border border-white/5">
                                    <img
                                        src={logoUrl}
                                        alt=""
                                        className="w-full h-full object-contain opacity-80"
                                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://ui-avatars.com/api/?name=${stock.symbol}&background=random&color=fff&bold=true`; }}
                                    />
                                </div>
                                 <div className="flex-grow min-w-0">
                                    <div className="flex justify-between items-baseline">
                                        <span className={`font-bold truncate text-white`}>{stock.symbol}</span>
                                    </div>
                                    <p className="text-xs text-zinc-500 truncate">{stock.name}</p>
                                 </div>
                            </li>
                        )
                    })}
                    {filteredStocks.length === 0 && (
                        <li className="px-4 py-3 text-sm text-zinc-500 text-center">No stocks found</li>
                    )}
                </ul>
            </div>
        )}
    </div>
  );
};

export default StockSelectorForCompare;
