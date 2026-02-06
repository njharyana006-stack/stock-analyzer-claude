
import React from 'react';
import { getStockLogo } from '../constants/stocks';

interface RelatedStock {
    ticker: string;
    name: string;
    domain?: string;
}

interface RelatedStocksProps {
    stocks: RelatedStock[];
}

const RelatedStocks: React.FC<RelatedStocksProps> = ({ stocks }) => {
    if (!stocks || stocks.length === 0) {
        return <p className="text-sm text-slate-500 text-center">No related stocks found.</p>;
    }
    
    return (
        <div className="space-y-3">
            {stocks.map(stock => {
                 const name = stock.name || '';
                 const logoUrl = getStockLogo(stock.ticker, name);
                 return (
                 <a 
                    key={stock.ticker}
                    href={`https://finance.yahoo.com/quote/${stock.ticker}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded-lg transition-colors"
                >
                    <img
                        src={logoUrl}
                        alt={`${stock.name} logo`}
                        className="w-8 h-8 rounded-full object-contain bg-white border border-slate-200"
                        onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${stock.ticker}&background=e2e8f0&color=64748b&bold=true`; }}
                    />
                    <div>
                        <p className="font-semibold text-sm text-slate-800">{stock.ticker}</p>
                        <p className="text-xs text-slate-500 truncate">{stock.name}</p>
                    </div>
                 </a>
            )})}
        </div>
    );
};

export default RelatedStocks;
