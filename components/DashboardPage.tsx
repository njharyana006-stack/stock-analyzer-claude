
import React, { useState } from 'react';
import type { DashboardWidget, Page, FeaturedStock, NewsArticle } from '../types';
import MarketGlance from './MarketFutures';
import SentimentBar from './SentimentBar';
import KeyMetricsWidget from './KeyMetricsWidget';
import NewsFeed from './NewsFeed';
import DashboardHero from './DashboardHero';
import ETFPerformanceWidget from './ETFPerformanceWidget';
import { PlusIcon, TrashIcon, CompareIcon, AnalyzeIcon, SentimentIcon, PieChartIcon, SettingsIcon, XIcon, FinancialsIcon, SparklesIcon, NewspaperIcon, GrowthIcon, TrendingDownIcon, PauseIcon, BotIcon, TechnicalIcon, TrendUpIcon, ChevronUpIcon, ChevronDownIcon, ReloadIcon, CalendarIcon, InfoIcon } from './icons';
import { useDashboard } from '../contexts/DashboardContext';
import EconomicCalendar from './EconomicCalendar';
import { getStockLogo } from '../constants/stocks';

interface DashboardPageProps {
    onSelectTicker: (ticker: string) => void;
    onNavigate: (page: Page) => void;
    userName?: string;
}

const colorStyles: Record<string, string> = {
    teal: 'bg-teal-50 hover:bg-teal-100 text-teal-700 border-teal-200 hover:shadow-teal-100 dark:bg-teal-500/10 dark:text-teal-400 dark:hover:bg-teal-500/20 dark:border-teal-500/20 dark:hover:shadow-none',
    emerald: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 hover:shadow-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 dark:border-emerald-500/20 dark:hover:shadow-none',
    yellow: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200 hover:shadow-yellow-100 dark:bg-yellow-500/10 dark:text-yellow-400 dark:hover:bg-yellow-500/20 dark:border-yellow-500/20 dark:hover:shadow-none',
    indigo: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200 hover:shadow-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 dark:border-indigo-500/20 dark:hover:shadow-none',
};

const ShortcutButton: React.FC<{ title: string; icon: React.ReactElement<React.SVGProps<SVGSVGElement>>; onClick: () => void; color: string; fullWidth?: boolean }> = ({ title, icon, onClick, color, fullWidth }) => {
    const style = colorStyles[color] || colorStyles.emerald;

    return (
        <button
            onClick={onClick}
            className={`rounded-[20px] p-5 flex flex-col items-center justify-center gap-3.5 transition-all duration-200 ${fullWidth ? 'w-full min-h-[100px]' : 'w-full min-h-[120px]'} group bg-white dark:bg-[#121214] border border-slate-100 dark:border-white/5 hover:shadow-md active:scale-[0.98] touch-manipulation`}
            aria-label={title}
        >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-active:scale-95 border ${style} shadow-sm`}>
                {React.cloneElement(icon, { className: "w-6 h-6", "aria-hidden": "true" })}
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-zinc-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-200 text-center leading-tight">{title}</span>
        </button>
    );
};

const FeaturedStockCard: React.FC<{ stock: FeaturedStock; onSelect: (ticker: string) => void }> = ({ stock, onSelect }) => {
    const isPositive = stock.is_positive;
    const signalStyles = {
        Bullish: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30',
        Bearish: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30',
        Neutral: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-white/10 dark:text-zinc-300 dark:border-white/10'
    };
    const pillStyle = signalStyles[stock.signal] || signalStyles.Neutral;
    
    return (
        <button
            onClick={() => onSelect(stock.ticker)}
            className="group bg-white dark:bg-[#1C1C1E] p-5 rounded-[24px] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-lg cursor-pointer flex flex-col h-full min-h-[280px] w-full text-left active:scale-[0.98] transition-all duration-200 touch-manipulation"
            aria-label={`View analysis for ${stock.name} (${stock.ticker})`}
        >
            {/* Header with Logo and Signal */}
            <div className="flex justify-between items-start mb-4 gap-2">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-11 h-11 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center p-1.5 border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
                        <img src={getStockLogo(stock.ticker)} alt={`${stock.ticker} logo`} className="w-full h-full object-contain" onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${stock.ticker}&background=random&color=fff&bold=true`; }} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h4 className="font-black text-base text-slate-900 dark:text-white leading-tight truncate">{stock.ticker}</h4>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase truncate mt-0.5">{stock.name}</p>
                    </div>
                </div>
                <div className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wide border ${pillStyle} flex-shrink-0`}>{stock.signal}</div>
            </div>

            {/* Analysis Text */}
            <div className="flex-grow mb-4">
                <p className="text-[13px] text-slate-600 dark:text-zinc-400 font-medium leading-relaxed line-clamp-3">{stock.brief_analysis}</p>
            </div>

            {/* Price and Change */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-white/5 mt-auto gap-3">
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase font-bold tracking-wide mb-0.5">Price</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">{stock.price}</span>
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-black px-3 py-2 rounded-lg flex-shrink-0 ${isPositive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'}`}>
                    {isPositive ? <TrendUpIcon className="w-3.5 h-3.5" aria-hidden="true" /> : <TrendingDownIcon className="w-3.5 h-3.5" aria-hidden="true" />}
                    <span className="tabular-nums">{stock.percent_change}</span>
                </div>
            </div>
        </button>
    );
};

const DashboardPage: React.FC<DashboardPageProps> = ({ onSelectTicker, onNavigate, userName }) => {
    const { dashboardData, isDashboardLoading, widgets, addWidget, removeWidget, moveWidget, resetWidgets, isEditMode, refreshDashboard, refreshNews, marketNews } = useDashboard();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleSync = () => {
        refreshDashboard();
        refreshNews();
    };

    const renderWidgetContent = (widget: DashboardWidget) => {
        switch (widget.type) {
            case 'MARKET_GLANCE':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <TrendUpIcon className="w-6 h-6 text-emerald-500" />
                                Live Indices
                            </h3>
                            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Stream Active</span>
                            </span>
                        </div>
                        <MarketGlance indices={dashboardData?.marketIndices} isLoading={isDashboardLoading} />
                    </div>
                );
            case 'SENTIMENT_BAR':
                return <div className="px-1 h-full flex flex-col justify-center"><SentimentBar /></div>;
            case 'ECONOMIC_CALENDAR':
                return <EconomicCalendar events={dashboardData?.economic_calendar} isLoading={isDashboardLoading} />;
            case 'KEY_METRICS':
                return <div className="px-1 h-full"><KeyMetricsWidget data={dashboardData?.market_fundamentals} /></div>;
            case 'ETF_PERFORMANCE':
                return <div className="h-full flex flex-col"><ETFPerformanceWidget data={dashboardData?.etf_performance} isLoading={isDashboardLoading} /></div>;
            case 'NEWS_FEED':
                return (
                    <div className="h-full flex flex-col">
                        <div className="flex justify-between items-center mb-6 px-2">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <NewspaperIcon className="w-6 h-6 text-blue-500" />
                                Market Intel
                            </h3>
                            <button onClick={() => onNavigate('newsFeed')} className="text-xs font-bold text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 uppercase transition-colors active:scale-95">See All</button>
                        </div>
                        <div className="bg-white dark:bg-[#121214] rounded-[24px] border border-slate-100 dark:border-white/5 p-4 shadow-sm flex-shrink-0"><NewsFeed articles={marketNews.length > 0 ? marketNews : dashboardData?.headlines || []} variant="compact" /></div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="pt-6 md:pt-10 px-4 md:px-6 lg:px-8 xl:px-10 space-y-10 md:space-y-12 pb-40 max-w-[1600px] mx-auto animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <DashboardHero userName={userName} />
            </div>

            <div className="space-y-8">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3"><SparklesIcon className="w-6 h-6 text-indigo-500" />AI Trending Highlights</h3>
                    {isDashboardLoading && <div className="flex items-center gap-2"><span className="text-[10px] font-bold text-indigo-500 animate-pulse uppercase">Searching Global Data</span></div>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {isDashboardLoading && (!dashboardData?.featured_stocks) ? [...Array(4)].map((_, i) => <div key={i} className="h-72 bg-white dark:bg-[#121214] rounded-[24px] border border-slate-100 dark:border-white/5 animate-pulse"></div>) :
                     dashboardData?.featured_stocks?.map(stock => <FeaturedStockCard key={stock.ticker} stock={stock} onSelect={onSelectTicker} />)}
                </div>
            </div>

            <div id="tour-widgets" className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
                {widgets.map((widget, index) => (
                    <div key={widget.id} className={`${widget.type === 'MARKET_GLANCE' ? 'lg:col-span-12' : 'lg:col-span-6'} ${isEditMode ? 'ring-2 ring-indigo-500/20 rounded-[32px] p-1' : ''} relative flex`}>
                        {isEditMode && <button onClick={() => removeWidget(widget.id)} className="absolute -top-3 -right-3 z-50 p-2 bg-rose-500 text-white rounded-xl shadow-lg hover:scale-110 transition-transform"><TrashIcon className="w-4 h-4"/></button>}
                        <div className="flex-1">
                            {renderWidgetContent(widget)}
                        </div>
                    </div>
                ))}
            </div>

            <footer className="mt-20 py-12 border-t border-slate-200 dark:border-white/5 text-center px-6">
                <p className="text-[11px] leading-relaxed text-slate-400 dark:text-zinc-500 italic max-w-2xl mx-auto">
                    SmartStock AI is an analytical terminal providing synthesized market data. It does not constitute financial advice. All investments involve risk. v3.1.2.
                </p>
            </footer>

            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in" onClick={() => setIsAddModalOpen(false)}>
                    <div className="bg-white dark:bg-[#18181B] w-full max-w-2xl rounded-[40px] p-8 md:p-12 shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-10">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Add Module</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl"><XIcon className="w-6 h-6" /></button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <button onClick={() => {addWidget('SENTIMENT_BAR'); setIsAddModalOpen(false)}} className="p-6 bg-slate-50 dark:bg-white/5 rounded-[32px] border border-slate-100 flex items-center gap-5 hover:bg-white transition-all"><SentimentIcon className="w-8 h-8 text-emerald-500" /> <span className="font-bold">Market Mood</span></button>
                            <button onClick={() => {addWidget('ECONOMIC_CALENDAR'); setIsAddModalOpen(false)}} className="p-6 bg-slate-50 dark:bg-white/5 rounded-[32px] border border-slate-100 flex items-center gap-5 hover:bg-white transition-all"><CalendarIcon className="w-8 h-8 text-indigo-500" /> <span className="font-bold">Economic Events</span></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
