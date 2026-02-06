
import React, { useState } from 'react';
import type { PricePrediction, ForecastScenario } from '../types';
import { GrowthIcon, TrendingDownIcon, ArrowLongRightIcon, InfoIcon } from './icons';
import InfoTooltip from './InfoTooltip';

interface ForecastScenariosProps {
    prediction?: PricePrediction;
    currentPrice: number;
}
type TimeframeKey = '7_day' | '30_day' | '90_day';

const ScenarioCard: React.FC<{
    title: string;
    scenario?: ForecastScenario;
    icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
    color: 'green' | 'sky' | 'red';
}> = ({ title, scenario, icon, color }) => {
    
    if (!scenario) {
        return (
            <div className={`p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 h-full flex flex-col items-center justify-center text-center opacity-60`}>
                <p className="text-sm font-semibold text-slate-500 dark:text-zinc-500">{title} data not available</p>
            </div>
        );
    }

    const colors = {
        green: { bg: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20', border: 'border-green-300 dark:border-green-700/50', text: 'text-green-700 dark:text-green-300', iconBg: 'bg-green-100 dark:bg-green-500/10', progress: 'bg-green-500' },
        sky: { bg: 'bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-900/20 dark:to-sky-800/20', border: 'border-sky-300 dark:border-sky-700/50', text: 'text-sky-700 dark:text-sky-300', iconBg: 'bg-sky-100 dark:bg-sky-500/10', progress: 'bg-sky-500' },
        red: { bg: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20', border: 'border-red-300 dark:border-red-700/50', text: 'text-red-700 dark:text-red-300', iconBg: 'bg-red-100 dark:bg-red-500/10', progress: 'bg-red-500' },
    };
    const { bg, border, text, iconBg, progress } = colors[color];
    
    // Safe values
    const percentageChange = scenario.percentage_change ?? 0;
    const targetPrice = scenario.target_price ?? 0;
    const confidenceScore = scenario.confidence_score ?? 0;
    const rationale = scenario.rationale || '';

    return (
        <div className={`p-5 rounded-2xl shadow-sm border ${bg} ${border} h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-px`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <h4 className={`text-lg font-bold ${text}`}>{title}</h4>
                    {rationale && <InfoTooltip text={rationale} />}
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
                    {React.cloneElement(icon, { className: `w-6 h-6 ${text}`})}
                </div>
            </div>
            <div className="mt-4 text-center tabular-nums">
                <p className={`text-sm font-semibold ${text}`}>{percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(1)}%</p>
                <p className="text-4xl font-extrabold text-[var(--card-foreground)]">${targetPrice.toFixed(2)}</p>
                <p className="text-xs text-[var(--muted-foreground)]">Target Price</p>
            </div>
             <div className="mt-auto pt-4 space-y-1">
                <div className="flex justify-between items-baseline tabular-nums">
                    <p className="text-xs text-[var(--muted-foreground)]">AI Confidence</p>
                    <p className="text-sm font-semibold text-[var(--card-foreground)]">{(confidenceScore * 100).toFixed(0)}%</p>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${progress}`} style={{ width: `${confidenceScore * 100}%` }}></div>
                </div>
            </div>
        </div>
    );
};


const ForecastScenarios: React.FC<ForecastScenariosProps> = ({ prediction, currentPrice }) => {
    const [activeTimeframe, setActiveTimeframe] = useState<TimeframeKey>('30_day');

    if (!prediction) {
        return <div className="p-4 text-center text-sm text-slate-500">AI price forecast is not available for this stock.</div>;
    }

    const availableTimeframes: { key: TimeframeKey, label: string }[] = [];
    if (prediction.base_case_scenario["7_day"]) availableTimeframes.push({ key: '7_day', label: '7 Day' });
    if (prediction.base_case_scenario["30_day"]) availableTimeframes.push({ key: '30_day', label: '30 Day' });
    if (prediction.base_case_scenario["90_day"]) availableTimeframes.push({ key: '90_day', label: '90 Day' });

    // Fallback if no timeframes are found (should not happen with 30_day required)
    if (availableTimeframes.length === 0) availableTimeframes.push({ key: '30_day', label: '30 Day' });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">{prediction.prediction_summary}</p>
                <div className="flex-shrink-0 flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-full">
                    {availableTimeframes.map(tf => (
                        <button
                            key={tf.key}
                            onClick={() => setActiveTimeframe(tf.key)}
                            className={`px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                                activeTimeframe === tf.key ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
                            }`}
                        >
                            {tf.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <ScenarioCard title="Bullish Case" scenario={prediction.bullish_scenario?.[activeTimeframe]} icon={<GrowthIcon />} color="green" />
                <ScenarioCard title="Base Case" scenario={prediction.base_case_scenario?.[activeTimeframe]} icon={<ArrowLongRightIcon />} color="sky" />
                <ScenarioCard title="Bearish Case" scenario={prediction.bearish_scenario?.[activeTimeframe]} icon={<TrendingDownIcon />} color="red" />
            </div>

             <div className="p-4 bg-amber-50/80 dark:bg-amber-900/20 border-l-4 border-amber-400 dark:border-amber-600 rounded-r-lg text-sm text-amber-900 dark:text-amber-200">
                <h4 className="font-bold flex items-center"><InfoIcon className="w-5 h-5 mr-2"/>Disclaimer</h4>
                <p className="mt-1">
                    AI-powered price predictions are speculative and not financial advice. They should not be the sole basis for any investment decision.
                </p>
            </div>
        </div>
    )
};

export default ForecastScenarios;
