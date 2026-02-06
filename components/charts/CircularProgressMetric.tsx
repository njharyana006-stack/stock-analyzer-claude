
import React, { useState, useEffect } from 'react';

interface CircularProgressMetricProps {
    value: number; // 0-100
    label: string;
    subtitle?: string;
    color?: 'purple' | 'teal' | 'indigo' | 'emerald';
    size?: 'sm' | 'md' | 'lg';
    showPercentage?: boolean;
    animate?: boolean;
}

const CircularProgressMetric: React.FC<CircularProgressMetricProps> = ({
    value,
    label,
    subtitle,
    color = 'purple',
    size = 'lg',
    showPercentage = true,
    animate = true,
}) => {
    const [displayValue, setDisplayValue] = useState(0);

    // Animate the value on mount
    useEffect(() => {
        if (!animate) {
            setDisplayValue(value);
            return;
        }

        const duration = 1800; // 1.8s
        const steps = 60;
        const stepDuration = duration / steps;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setDisplayValue(value);
                clearInterval(timer);
            } else {
                setDisplayValue(current);
            }
        }, stepDuration);

        return () => clearInterval(timer);
    }, [value, animate]);

    // Size configurations
    const sizeConfig = {
        sm: { diameter: 100, strokeWidth: 8, fontSize: 'text-xl', labelSize: 'text-[9px]' },
        md: { diameter: 150, strokeWidth: 10, fontSize: 'text-3xl', labelSize: 'text-[10px]' },
        lg: { diameter: 180, strokeWidth: 12, fontSize: 'text-4xl', labelSize: 'text-xs' },
    };

    const config = sizeConfig[size];
    const radius = (config.diameter - config.strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (displayValue / 100) * circumference;

    // Color configurations
    const colorConfig = {
        purple: {
            stroke: '#8B5CF6',
            glow: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.4))',
            text: 'text-purple-500 dark:text-purple-400',
            bg: 'from-purple-500/20 to-purple-500/5',
        },
        teal: {
            stroke: '#14B8A6',
            glow: 'drop-shadow(0 0 8px rgba(20, 184, 166, 0.4))',
            text: 'text-teal-500 dark:text-teal-400',
            bg: 'from-teal-500/20 to-teal-500/5',
        },
        indigo: {
            stroke: '#6366F1',
            glow: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.4))',
            text: 'text-indigo-500 dark:text-indigo-400',
            bg: 'from-indigo-500/20 to-indigo-500/5',
        },
        emerald: {
            stroke: '#10B981',
            glow: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))',
            text: 'text-emerald-500 dark:text-emerald-400',
            bg: 'from-emerald-500/20 to-emerald-500/5',
        },
    };

    const colors = colorConfig[color];

    return (
        <div className="flex flex-col items-center gap-3">
            {/* Circular Progress */}
            <div
                className="relative flex items-center justify-center"
                style={{ width: config.diameter, height: config.diameter }}
            >
                {/* Background glow */}
                <div
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${colors.bg} blur-xl opacity-50`}
                    aria-hidden="true"
                />

                {/* SVG Circle */}
                <svg
                    className="transform -rotate-90"
                    width={config.diameter}
                    height={config.diameter}
                >
                    {/* Background circle */}
                    <circle
                        cx={config.diameter / 2}
                        cy={config.diameter / 2}
                        r={radius}
                        stroke="currentColor"
                        strokeWidth={config.strokeWidth}
                        fill="none"
                        className="text-slate-200 dark:text-slate-800"
                    />

                    {/* Progress circle */}
                    <circle
                        cx={config.diameter / 2}
                        cy={config.diameter / 2}
                        r={radius}
                        stroke={colors.stroke}
                        strokeWidth={config.strokeWidth}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-300"
                        style={{
                            filter: colors.glow,
                        }}
                    />
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {showPercentage && (
                        <span className={`${config.fontSize} font-black ${colors.text} tabular-nums tracking-tight leading-none`}>
                            {Math.round(displayValue)}
                            <span className="text-lg">%</span>
                        </span>
                    )}
                </div>
            </div>

            {/* Labels */}
            <div className="text-center">
                <p className={`${config.labelSize} font-black uppercase tracking-wider text-slate-700 dark:text-zinc-300`}>
                    {label}
                </p>
                {subtitle && (
                    <p className="text-[9px] font-semibold text-slate-500 dark:text-zinc-500 mt-0.5">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
};

export default React.memo(CircularProgressMetric);
