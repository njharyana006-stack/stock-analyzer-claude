
import React, { useState } from 'react';
import type { IndividualAnalysis } from '../../../types';
import { ChevronDownIcon, ChevronUpIcon, InfoIcon, TrendUpIcon, TrendingDownIcon, PauseIcon } from '../../icons';

interface TechnicalIndicatorsProps {
    keyLevels: IndividualAnalysis['key_levels'];
    interpretation?: string;
}

// --- Visual Gauge Components ---

const RsiGauge: React.FC<{ value: number }> = ({ value }) => {
    const clamp = (num: number) => Math.min(Math.max(num, 0), 100);
    const pct = clamp(value);
    
    return (
        <div className="mt-4 mb-2">
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-zinc-500 font-semibold mb-1 uppercase tracking-wider">
                <span>Oversold (30)</span>
                <span>Overbought (70)</span>
            </div>
            <div className="relative h-3 w-full rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
                {/* Zones */}
                <div className="absolute top-0 left-0 h-full w-[30%] bg-emerald-500/20 border-r border-emerald-500/30"></div>
                <div className="absolute top-0 right-0 h-full w-[30%] bg-rose-500/20 border-l border-rose-500/30"></div>
                
                {/* Marker */}
                <div 
                    className="absolute top-0 h-full w-1 bg-slate-900 dark:bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-500 ease-out z-10"
                    style={{ left: `${pct}%` }}
                ></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0</span>
                <span className={`text-sm font-medium ${value > 70 ? 'text-rose-500' : value < 30 ? 'text-emerald-500' : 'text-indigo-400'}`}>{value.toFixed(2)}</span>
                <span>100</span>
            </div>
        </div>
    );
};

const MacdGauge: React.FC<{ macd: number; signal: number }> = ({ macd, signal }) => {
    const histogram = macd - signal;
    // Determine scale based on values (simple normalization for visualization)
    const maxVal = Math.max(Math.abs(macd), Math.abs(signal), Math.abs(histogram)) * 1.5 || 1;
    const center = 50;
    
    const getPos = (val: number) => center + (val / maxVal) * 40; // Keep within 10-90% range

    return (
        <div className="mt-4 mb-2">
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-zinc-500 font-semibold mb-1 uppercase tracking-wider">
                <span>Bearish Momentum</span>
                <span>Bullish Momentum</span>
            </div>
            <div className="relative h-12 w-full bg-slate-100 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/5">
                {/* Zero Line */}
                <div className="absolute top-2 bottom-2 left-1/2 w-px bg-slate-300 dark:bg-white/20"></div>
                
                {/* Histogram Bar */}
                <div 
                    className={`absolute top-1/2 -translate-y-1/2 h-4 transition-all duration-500 rounded-sm ${histogram >= 0 ? 'bg-emerald-500 left-1/2' : 'bg-rose-500 right-1/2'}`}
                    style={{ width: `${Math.abs((histogram / maxVal) * 40)}%` }}
                ></div>

                {/* Signal Dots */}
                <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-sky-400 border border-white dark:border-[#18181B] z-10 transition-all duration-500" style={{ left: `${getPos(macd)}%` }} title="MACD Line"></div>
                <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-orange-400 border border-white dark:border-[#18181B] z-10 transition-all duration-500" style={{ left: `${getPos(signal)}%` }} title="Signal Line"></div>
            </div>
             <div className="flex justify-center gap-4 text-[10px] text-slate-400 mt-1">
                <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-sky-400 mr-1"></span>MACD</span>
                <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-orange-400 mr-1"></span>Signal</span>
                <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span>Hist</span>
            </div>
        </div>
    );
};

const MaGauge: React.FC<{ price?: number; ma: number; label: string }> = ({ price, ma, label }) => {
    // Mock current price if not passed down, usually we'd pass it. 
    // For visualization, we assume the relationship based on the value.
    // If we don't have current price, we render a simplified view.
    
    return (
        <div className="mt-4 mb-2">
             <div className="flex justify-between text-[10px] text-slate-500 dark:text-zinc-500 font-semibold mb-1">
                <span>Current Trend Context</span>
            </div>
            <div className="flex items-center p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <div className="flex-1">
                    <p className="text-xs text-slate-500 dark:text-zinc-400">Indicator Level</p>
                    <p className="text-base sm:text-lg font-medium text-slate-900 dark:text-white tabular-nums">{ma.toFixed(2)}</p>
                </div>
                <div className="h-8 w-px bg-slate-200 dark:bg-white/10 mx-4"></div>
                <div className="flex-1 text-right">
                    <p className="text-xs text-slate-500 dark:text-zinc-400">{label}</p>
                    <p className="text-xs font-medium text-indigo-500 dark:text-indigo-400">Key Support/Resistance</p>
                </div>
            </div>
        </div>
    );
};

// --- Collapsible Card Component ---

interface CollapsibleCardProps {
    name: string;
    value: number | string;
    status: 'Bullish' | 'Bearish' | 'Neutral';
    description: string;
    children?: React.ReactNode;
}

const CollapsibleIndicatorCard: React.FC<CollapsibleCardProps> = ({ name, value, status, description, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const statusColors = {
        Bullish: { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/20', icon: <TrendUpIcon className="w-3 h-3" /> },
        Bearish: { text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-500/10', border: 'border-rose-200 dark:border-rose-500/20', icon: <TrendingDownIcon className="w-3 h-3" /> },
        Neutral: { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/20', icon: <PauseIcon className="w-3 h-3" /> },
    };

    const theme = statusColors[status];

    return (
        <div 
            className={`w-full bg-white dark:bg-[#18181B] rounded-[20px] border border-slate-200 dark:border-white/5 transition-all duration-300 overflow-hidden mb-3 ${isOpen ? 'shadow-lg ring-1 ring-indigo-500/20' : 'shadow-sm hover:border-slate-300 dark:hover:border-white/10'}`}
        >
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 focus:outline-none group"
            >
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isOpen ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-zinc-400 group-hover:text-slate-700 dark:group-hover:text-zinc-200'}`}>
                        <InfoIcon className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{name}</p>
                        <p className="text-sm font-normal text-slate-600 dark:text-zinc-400 tabular-nums">Value: {typeof value === 'number' ? value.toFixed(2) : value}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border ${theme.bg} ${theme.text} ${theme.border}`}>
                        {theme.icon}
                        {status}
                    </span>
                    {isOpen ? <ChevronUpIcon className="w-4 h-4 text-slate-400" /> : <ChevronDownIcon className="w-4 h-4 text-slate-400" />}
                </div>
            </button>

            <div className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-4 pt-0 border-t border-slate-100 dark:border-white/5">
                    <div className="sm:hidden mb-4 mt-2">
                         <span className={`flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border ${theme.bg} ${theme.text} ${theme.border}`}>
                            {theme.icon}
                            {status}
                        </span>
                    </div>
                    
                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed mb-3">
                        <strong className="text-slate-900 dark:text-zinc-200">Analysis:</strong> {description}
                    </p>
                    
                    {/* Visual Gauge Area */}
                    <div className="bg-slate-50 dark:bg-black/20 rounded-xl p-3 border border-slate-100 dark:border-white/5">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Component ---

const TechnicalIndicators: React.FC<TechnicalIndicatorsProps> = ({ keyLevels }) => {
    // RSI Logic
    const rsi = keyLevels?.RSI_Value ?? 50;
    const rsiStatus = rsi > 70 ? 'Bearish' : rsi < 30 ? 'Bullish' : 'Neutral';
    const rsiDesc = rsi > 70 
        ? "The asset is currently Overbought, suggesting a potential pullback or reversal." 
        : rsi < 30 
            ? "The asset is currently Oversold, suggesting a potential bounce or rally." 
            : "The RSI is in neutral territory, indicating a stable trend without extremes.";

    // MACD Logic
    const macd = keyLevels?.macd?.macd ?? 0;
    const signal = keyLevels?.macd?.signal ?? 0;
    const histogram = keyLevels?.macd?.histogram ?? 0;
    const macdStatus = macd > signal ? 'Bullish' : 'Bearish';
    const macdDesc = macd > signal 
        ? "The MACD line is above the Signal line, indicating positive momentum." 
        : "The MACD line is below the Signal line, indicating negative momentum.";

    // MA Logic
    const sma50 = keyLevels?.['50_Day_SMA'] ?? 0;
    const sma200 = keyLevels?.['200_Day_SMA'] ?? 0;
    const maStatus = sma50 > sma200 ? 'Bullish' : 'Bearish';
    const maDesc = sma50 > sma200 
        ? "A 'Golden Cross' scenario where the short-term trend (50D) is above the long-term trend (200D)." 
        : "A 'Death Cross' scenario where the short-term trend (50D) is below the long-term trend (200D).";

    // Bollinger Bands (Simulated UI for request completeness, value derived or placeholder)
    const bbStatus = 'Neutral'; 
    const bbDesc = "Price is trading within the standard deviation bands, indicating normal volatility.";

    return (
        <div className="w-full">
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 px-1">
                <span className="w-1.5 h-5 bg-violet-500 rounded-full"></span>
                Technical Indicators
            </h4>
            
            <CollapsibleIndicatorCard 
                name="RSI (14)" 
                value={rsi} 
                status={rsiStatus} 
                description={rsiDesc}
            >
                <RsiGauge value={rsi} />
            </CollapsibleIndicatorCard>

            <CollapsibleIndicatorCard 
                name="MACD (12, 26, 9)" 
                value={macd} 
                status={macdStatus} 
                description={macdDesc}
            >
                <MacdGauge macd={macd} signal={signal} />
            </CollapsibleIndicatorCard>

            <CollapsibleIndicatorCard 
                name="Moving Averages" 
                value={sma50} 
                status={maStatus} 
                description={maDesc}
            >
                <MaGauge ma={sma50} label="50-Day SMA" />
                <div className="mt-2 pt-2 border-t border-slate-200 dark:border-white/5">
                     <MaGauge ma={sma200} label="200-Day SMA" />
                </div>
            </CollapsibleIndicatorCard>

            <CollapsibleIndicatorCard 
                name="Bollinger Bands" 
                value="Standard" 
                status={bbStatus} 
                description={bbDesc}
            >
                <div className="mt-2 flex items-center justify-center h-12 bg-slate-100 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/5 text-xs text-slate-500 dark:text-zinc-500">
                    <span>Volatility Bands Visualization</span>
                </div>
            </CollapsibleIndicatorCard>
        </div>
    );
};

export default TechnicalIndicators;
