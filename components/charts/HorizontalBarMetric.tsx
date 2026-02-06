
import React, { useState, useEffect } from 'react';

interface HorizontalBarMetricProps {
    label: string;
    value: number; // 0-100 normalized percentage
    displayValue?: string; // Optional custom display (e.g., "$2.5T" for market cap)
    color?: 'purple' | 'teal' | 'indigo' | 'emerald' | 'blue';
    showPercentage?: boolean;
    tooltip?: string;
    animate?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const HorizontalBarMetric: React.FC<HorizontalBarMetricProps> = ({
    label,
    value,
    displayValue,
    color = 'indigo',
    showPercentage = true,
    tooltip,
    animate = true,
    size = 'md',
}) => {
    const [animatedValue, setAnimatedValue] = useState(0);
    const [showTooltip, setShowTooltip] = useState(false);

    // Animate the bar on mount
    useEffect(() => {
        if (!animate) {
            setAnimatedValue(value);
            return;
        }

        const duration = 1200;
        const steps = 60;
        const stepDuration = duration / steps;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setAnimatedValue(value);
                clearInterval(timer);
            } else {
                setAnimatedValue(current);
            }
        }, stepDuration);

        return () => clearInterval(timer);
    }, [value, animate]);

    // Size configurations
    const sizeConfig = {
        sm: { height: 'h-2', labelSize: 'text-[9px]', valueSize: 'text-xs' },
        md: { height: 'h-3', labelSize: 'text-[10px]', valueSize: 'text-sm' },
        lg: { height: 'h-4', labelSize: 'text-xs', valueSize: 'text-base' },
    };

    const config = sizeConfig[size];

    // Color configurations
    const colorConfig = {
        purple: {
            bg: 'bg-purple-500/20 dark:bg-purple-500/10',
            bar: 'bg-gradient-to-r from-purple-500 to-purple-600',
            glow: 'shadow-lg shadow-purple-500/20',
            text: 'text-purple-600 dark:text-purple-400',
        },
        teal: {
            bg: 'bg-teal-500/20 dark:bg-teal-500/10',
            bar: 'bg-gradient-to-r from-teal-500 to-teal-600',
            glow: 'shadow-lg shadow-teal-500/20',
            text: 'text-teal-600 dark:text-teal-400',
        },
        indigo: {
            bg: 'bg-indigo-500/20 dark:bg-indigo-500/10',
            bar: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
            glow: 'shadow-lg shadow-indigo-500/20',
            text: 'text-indigo-600 dark:text-indigo-400',
        },
        emerald: {
            bg: 'bg-emerald-500/20 dark:bg-emerald-500/10',
            bar: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
            glow: 'shadow-lg shadow-emerald-500/20',
            text: 'text-emerald-600 dark:text-emerald-400',
        },
        blue: {
            bg: 'bg-blue-500/20 dark:bg-blue-500/10',
            bar: 'bg-gradient-to-r from-blue-500 to-blue-600',
            glow: 'shadow-lg shadow-blue-500/20',
            text: 'text-blue-600 dark:text-blue-400',
        },
    };

    const colors = colorConfig[color];

    return (
        <div
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            {/* Label and Value Row */}
            <div className="flex items-center justify-between mb-2">
                <span className={`${config.labelSize} font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300`}>
                    {label}
                </span>
                <span className={`${config.valueSize} font-black tabular-nums tracking-tight ${colors.text}`}>
                    {displayValue || (showPercentage ? `${Math.round(value)}%` : Math.round(value))}
                </span>
            </div>

            {/* Progress Bar Container */}
            <div className={`relative w-full ${config.height} ${colors.bg} rounded-full overflow-hidden`}>
                {/* Animated Bar */}
                <div
                    className={`${config.height} ${colors.bar} ${colors.glow} rounded-full transition-all duration-300 ease-out`}
                    style={{ width: `${animatedValue}%` }}
                    role="progressbar"
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${label}: ${displayValue || value}%`}
                />
            </div>

            {/* Tooltip */}
            {tooltip && showTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xl z-10 whitespace-nowrap animate-fade-in">
                    {tooltip}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900 dark:border-t-slate-800" />
                </div>
            )}
        </div>
    );
};

export default React.memo(HorizontalBarMetric);
