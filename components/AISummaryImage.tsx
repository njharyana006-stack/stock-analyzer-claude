
import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import type { AnalysisResponse } from '../types';
import { popularStocks } from '../constants/stocks';
import { GrowthIcon, PauseIcon, QuadFactorIcon, TrendingDownIcon, XIcon } from './icons';
import Sparkline from './charts/Sparkline';

interface AISummaryImageProps {
    analysis: AnalysisResponse;
    onClose: () => void;
}

/**
 * A component that renders a shareable infographic summary of a stock analysis.
 * It is displayed inside a modal and includes an export button.
 * The export functionality itself would require a library like html-to-image.
 * @param {AISummaryImageProps} props The component props.
 * @returns {JSX.Element | null} The rendered summary image modal.
 */
const AISummaryImage: React.FC<AISummaryImageProps> = ({ analysis, onClose }) => {
    const summaryRef = useRef<HTMLDivElement>(null);
    const { overview, individual_analysis } = analysis;
    
    const stockInfo = popularStocks.find(s => s.symbol === overview.ticker);
    const logoUrl = stockInfo ? `https://logo.clearbit.com/${stockInfo.domain}` : `https://ui-avatars.com/api/?name=${overview.ticker}`;
    
    const safeYTD = overview.ytd_change_percent ?? 0;
    const safePrice = overview.current_price ?? 0;

    const getSignalInfo = () => {
        switch (overview.signal) {
            case 'Bullish': return { color: 'bg-green-600', icon: <GrowthIcon className="w-5 h-5"/> };
            case 'Bearish': return { color: 'bg-red-600', icon: <TrendingDownIcon className="w-5 h-5"/> };
            default: return { color: 'bg-slate-600', icon: <PauseIcon className="w-5 h-5"/> };
        }
    };
    const signalInfo = getSignalInfo();

    const renderScore = (label: string, score: number) => {
        const color = score >= 7 ? 'text-green-600' : score >= 4 ? 'text-amber-600' : 'text-red-600';
        return (
            <div className="text-center">
                <p className="text-sm font-semibold text-slate-600">{label}</p>
                <p className={`text-4xl font-extrabold ${color}`}>{score}</p>
            </div>
        )
    }

    const modalContent = (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
            <div className="bg-slate-50 rounded-2xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="p-4 flex justify-between items-center border-b border-slate-200">
                    <h3 className="font-bold text-slate-800">AI Analysis Summary</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200">
                        <XIcon className="w-5 h-5 text-slate-600"/>
                    </button>
                </div>
                <div className="p-2">
                    {/* This is the element that would be captured for export */}
                    <div ref={summaryRef} className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white rounded-xl shadow-2xl">
                        {/* Header */}
                        <div className="flex justify-between items-center pb-4 border-b border-slate-700">
                            <div className="flex items-center space-x-4">
                                <img src={logoUrl} alt="logo" className="w-12 h-12 rounded-lg bg-white p-1" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://ui-avatars.com/api/?name=${overview.ticker}&background=e5e7eb&color=4b5563&bold=true`; }}/>
                                <div>
                                    <h2 className="text-2xl font-bold">{overview.ticker}</h2>
                                    <p className="text-sm text-slate-400 -mt-1">{overview.company_name}</p>
                                </div>
                            </div>
                            <div className={`px-3 py-1.5 rounded-md text-sm font-bold flex items-center space-x-2 ${signalInfo.color}`}>
                                {signalInfo.icon}
                                <span>{overview.signal.toUpperCase()}</span>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="mt-4 grid grid-cols-3 gap-4">
                            <div className="col-span-1 space-y-3">
                                <div className="text-center">
                                    <p className="text-xs text-slate-400">Current Price</p>
                                    <p className="text-2xl font-bold">${safePrice.toFixed(2)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-slate-400">YTD Change</p>
                                    <p className={`text-lg font-bold ${safeYTD >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {safeYTD >= 0 ? '+' : ''}{safeYTD.toFixed(2)}%
                                    </p>
                                </div>
                            </div>
                             <div className="col-span-2">
                                <Sparkline data={analysis.stock_90_day_performance || []} isPositive={(analysis.stock_90_day_performance?.slice(-1)[0] || 0) >= 0} />
                                <p className="text-center text-xs text-slate-500 -mt-2">90-Day Performance</p>
                            </div>
                        </div>

                        {/* Scores */}
                        <div className="mt-4 bg-slate-800/50 p-4 rounded-lg">
                             <h4 className="text-sm font-bold text-center text-indigo-400 mb-2 flex items-center justify-center"><QuadFactorIcon className="w-4 h-4 mr-2"/>AI Quad-Factor Scores</h4>
                             <div className="grid grid-cols-3 gap-2">
                                {renderScore("Technical", individual_analysis.quad_factor_scores.technical_score)}
                                {renderScore("Sentiment", individual_analysis.quad_factor_scores.sentiment_score)}
                                {renderScore("Risk-Align", individual_analysis.quad_factor_scores.risk_alignment_score)}
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const modalRoot = document.getElementById('modal-root');
    return modalRoot ? createPortal(modalContent, modalRoot) : null;
};

export default AISummaryImage;
