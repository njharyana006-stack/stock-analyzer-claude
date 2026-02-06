
import React, { useState, useEffect } from 'react';
import type { TradeStrategy } from '../../types';
import { TargetIcon, StopLossIcon } from '../icons';

interface TradeStrategyChartProps {
  strategy: TradeStrategy;
  currentPrice: number;
}

const parsePrice = (priceString: string): number | null => {
    if (!priceString || typeof priceString !== 'string' || priceString.toLowerCase() === 'n/a') {
        return null;
    }
    const num = parseFloat(priceString.replace('$', '').replace(',', ''));
    return isNaN(num) ? null : num;
};

const TradeStrategyChart: React.FC<TradeStrategyChartProps> = ({ strategy, currentPrice }) => {
    const [animatedRisk, setAnimatedRisk] = useState(0);
    const [animatedReward, setAnimatedReward] = useState(0);
    const [markerPos, setMarkerPos] = useState(0);

    const entryPrice = parsePrice(strategy.entry_point);
    const targetPrice = parsePrice(strategy.target_price);
    const stopLossPrice = parsePrice(strategy.stop_loss);

    useEffect(() => {
        if (entryPrice !== null && targetPrice !== null && stopLossPrice !== null && targetPrice > stopLossPrice) {
            const totalRange = targetPrice - stopLossPrice;
            const potentialLoss = entryPrice - stopLossPrice;
            const potentialGain = targetPrice - entryPrice;
            
            const riskP = (potentialLoss / totalRange) * 100;
            const rewardP = (potentialGain / totalRange) * 100;
            
            // Calculate marker position relative to total range (0% is stop loss, 100% is target)
            const currentPricePosition = Math.max(0, Math.min(100, ((currentPrice - stopLossPrice) / totalRange) * 100));

            // Trigger animations
            const timer = setTimeout(() => {
                setAnimatedRisk(riskP);
                setAnimatedReward(rewardP);
                setMarkerPos(currentPricePosition);
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [strategy, currentPrice]);

    if (entryPrice === null || targetPrice === null || stopLossPrice === null || targetPrice <= stopLossPrice) {
        return (
            <div className="text-center text-slate-500">
                Invalid trade strategy data provided for visualization.
            </div>
        );
    }

    const potentialGain = targetPrice - entryPrice;
    const potentialLoss = entryPrice - stopLossPrice;
    const riskRewardRatio = potentialLoss > 0 ? potentialGain / potentialLoss : 0;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-white">Trade Strategy: Risk/Reward</h4>
                <div className="text-right">
                    <p className="font-bold text-indigo-400 text-xl">
                        1 : {riskRewardRatio.toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-400">Risk / Reward Ratio</p>
                </div>
            </div>

            <div className="relative pt-8 pb-10">
                {/* Main Bar */}
                <div className="w-full h-4 flex rounded-full overflow-hidden bg-slate-700">
                    <div className="bg-red-500 transition-all duration-1000 ease-out" style={{ width: `${animatedRisk}%` }}></div>
                    <div className="bg-green-500 transition-all duration-1000 ease-out" style={{ width: `${animatedReward}%` }}></div>
                </div>

                {/* Entry Point Line */}
                <div className="absolute top-4 bottom-4 border-l-2 border-dashed border-slate-400 transition-all duration-1000" style={{ left: `${animatedRisk}%` }}>
                    <span className="absolute -top-6 -translate-x-1/2 text-xs font-bold text-slate-300 bg-slate-800 px-1 rounded border border-slate-600">Entry</span>
                </div>

                {/* Current Price Marker */}
                <div 
                    className="absolute top-2 transition-all duration-1000 ease-out z-10"
                    style={{ left: `calc(${markerPos}% - 12px)`}}
                >
                    <div className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-lg animate-pop-in">
                       <span className="text-[9px]">NOW</span>
                    </div>
                </div>

                {/* Labels */}
                <div className="absolute top-full w-full mt-2 flex justify-between text-xs text-slate-400">
                    <div className="text-left flex items-center gap-1">
                        <StopLossIcon className="w-3 h-3 text-red-400" />
                        <p className="font-bold text-red-400">${stopLossPrice.toFixed(2)}</p>
                        <p>Stop-Loss</p>
                    </div>
                    <div className="text-right flex items-center gap-1 justify-end">
                        <p>Target</p>
                        <p className="font-bold text-green-400">${targetPrice.toFixed(2)}</p>
                        <TargetIcon className="w-3 h-3 text-green-400" />
                    </div>
                </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                 <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg">
                    <p className="text-sm text-green-400 font-semibold">Potential Gain</p>
                    <p className="text-lg font-bold text-green-500">
                        +${potentialGain.toFixed(2)}
                        <span className="text-xs ml-1 opacity-80">({((potentialGain / entryPrice) * 100).toFixed(1)}%)</span>
                    </p>
                 </div>
                 <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
                    <p className="text-sm text-red-400 font-semibold">Potential Risk</p>
                    <p className="text-lg font-bold text-red-500">
                        -${potentialLoss.toFixed(2)}
                        <span className="text-xs ml-1 opacity-80">({((potentialLoss / entryPrice) * 100).toFixed(1)}%)</span>
                    </p>
                 </div>
            </div>
        </div>
    );
};

export default TradeStrategyChart;
