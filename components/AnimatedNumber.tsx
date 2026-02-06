
import React, { useEffect, useState } from 'react';

interface AnimatedNumberProps {
    value: number;
    duration?: number;
    decimals?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ 
    value, 
    duration = 1500, 
    decimals = 2, 
    prefix = '', 
    suffix = '', 
    className = '' 
}) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        const startValue = displayValue;
        const endValue = value;

        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            // Ease out quart function for smoother, more premium feel
            const easeOutQuart = (x: number): number => 1 - Math.pow(1 - x, 4);
            const easedProgress = easeOutQuart(progress);

            const currentValue = startValue + (endValue - startValue) * easedProgress;
            setDisplayValue(currentValue);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    }, [value, duration]);

    // Format the number with locale string to add commas
    const formattedValue = displayValue.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });

    return (
        <span className={`tabular-nums tracking-tight ${className}`}>
            {prefix}{formattedValue}{suffix}
        </span>
    );
};

export default AnimatedNumber;
