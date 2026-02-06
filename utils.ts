
import type { AnalysisResponse } from './types';

/**
 * Helper to dispatch a custom event for global notifications.
 */
export const triggerNotification = (title: string, type: 'success' | 'warning' | 'info' = 'info') => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('smartstock_notification', {
            detail: { title, type }
        }));
    }
};

/**
 * Checks if data is stale based on a 3 AM daily reset schedule.
 * @param lastFetchTimestamp Timestamp of the last successful fetch (ms)
 * @returns true if data needs refreshing, false if it is still valid
 */
export const isDataStale = (lastFetchTimestamp: number | null): boolean => {
    if (!lastFetchTimestamp) return true;

    const now = new Date();
    const last = new Date(lastFetchTimestamp);
    
    // Determine the relevant 3 AM cutoff point
    const cutoff = new Date();
    cutoff.setHours(3, 0, 0, 0); // Set to today 3:00 AM

    // If right now is before 3 AM (e.g., 2 AM), the relevant cutoff was Yesterday 3 AM.
    if (now.getHours() < 3) {
        cutoff.setDate(cutoff.getDate() - 1);
    }

    // If the last fetch was BEFORE the cutoff, it is stale.
    // Example: Now is Tues 10 AM (Cutoff Tues 3 AM). Last fetch Mon 4 PM. Mon < Tues. Stale.
    // Example: Now is Tues 2 AM (Cutoff Mon 3 AM). Last fetch Mon 4 PM. Mon 4 PM > Mon 3 AM. Valid.
    return last.getTime() < cutoff.getTime();
};

/**
 * Attempts to repair a truncated JSON string using a stack-based state machine.
 * Handles unterminated strings, missing closing braces/brackets, and trailing commas/colons.
 */
export const repairTruncatedJson = (json: string): string => {
    let repaired = json.trim();
    
    // 1. Scan for string state and structural stack to determine closure needs
    let inString = false;
    let isEscaped = false;
    const stack: string[] = []; // Stores expected closing chars: '}' or ']'
    
    for (let i = 0; i < repaired.length; i++) {
        const char = repaired[i];
        
        if (inString) {
            if (char === '\\') {
                isEscaped = !isEscaped;
            } else if (char === '"' && !isEscaped) {
                inString = false;
            } else {
                isEscaped = false;
            }
        } else {
            if (char === '"') {
                inString = true;
            } else if (char === '{') {
                stack.push('}');
            } else if (char === '[') {
                stack.push(']');
            } else if (char === '}' || char === ']') {
                if (stack.length > 0 && stack[stack.length - 1] === char) {
                    stack.pop();
                }
            }
        }
    }

    // 2. Close open string if necessary
    if (inString) {
        repaired += '"';
    }

    // 3. Clean up trailing structural characters that might be invalid at the end
    repaired = repaired.trim();

    // FIX: Handle "Unterminated fractional number" (e.g., "123." becomes "123.0")
    if (/\d\.$/.test(repaired)) {
        repaired += "0";
    }
    // Handle incomplete scientific notation (e.g. "1.2e" becomes "1.2e0")
    if (/\d\.?\d*e[+-]?$/.test(repaired)) {
        repaired += "0";
    }

    // Remove trailing comma
    if (repaired.endsWith(',')) {
        repaired = repaired.slice(0, -1);
    }
    // If it ends with a colon (e.g. {"key":), add null to complete the pair
    if (repaired.endsWith(':')) {
        repaired += ' null';
    }

    // 4. Close remaining structural elements in reverse order (LIFO)
    while (stack.length > 0) {
        repaired += stack.pop();
    }

    return repaired;
};

/**
 * Extracts a JSON string from text and repairs it if truncated.
 */
export const extractJson = (text: string): string => {
    if (!text) return "";

    let cleanedText = text;

    // 1. Try to find markdown JSON block first
    const jsonRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
    const match = text.match(jsonRegex);
    if (match && match[1]) {
        cleanedText = match[1].trim();
    } else {
        // 2. Fallback: Find first '{' or '['
        const firstBrace = text.indexOf('{');
        const firstBracket = text.indexOf('[');
        let start = -1;
        
        if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
            start = firstBrace;
        } else if (firstBracket !== -1) {
            start = firstBracket;
        }

        if (start !== -1) {
            // Take everything from the start. repairTruncatedJson will handle the end.
            cleanedText = text.substring(start).trim();
        }
    }

    try {
        JSON.parse(cleanedText);
        return cleanedText;
    } catch (e) {
        // If parsing fails, it's likely truncated or malformed. Attempt repair.
        const repaired = repairTruncatedJson(cleanedText);
        try {
            JSON.parse(repaired);
            return repaired;
        } catch (e2) {
            console.error("JSON Repair failed. Returning original segment.", e2);
            return cleanedText;
        }
    }
};

/**
 * Converts an ISO date string into a relative time format (e.g., "2 hours ago").
 */
export const timeAgo = (dateString: string): string => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return "just now";
    
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;

    const days = Math.round(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

/**
 * A type guard to validate the structure of the AI's analysis response.
 */
export const isValidAnalysisResponse = (data: any): data is AnalysisResponse => {
    if (!data || typeof data !== 'object') return false;
    if (!data.overview || typeof data.overview !== 'object') return false;
    if (!data.overview.ticker || !data.overview.company_name) return false;
    if (typeof data.ticker !== 'string' || data.ticker.length === 0) return false;
    return true;
};

/**
 * Converts a country name to its corresponding flag emoji.
 */
export const countryToFlag = (country?: string): string => {
    if (!country) return '';

    const countryMap: { [key: string]: string } = {
        'usa': '🇺🇸',
        'united states': '🇺🇸',
        'united states of america': '🇺🇸',
        'canada': '🇨🇦',
        'united kingdom': '🇬🇧',
        'uk': '🇬🇧',
        'germany': '🇩🇪',
        'france': '🇫🇷',
        'japan': '🇯🇵',
        'china': '🇨🇳',
        'india': '🇮🇳',
        'brazil': '🇧🇷',
        'australia': '🇦🇺',
        'south korea': '🇰🇷',
        'korea': '🇰🇷',
        'switzerland': '🇨🇭',
        'netherlands': '🇳🇱',
        'taiwan': '🇹🇼',
    };

    const lowerCountry = country.toLowerCase().trim();
    return countryMap[lowerCountry] || '🏳️';
};


/**
 * Calculates the Relative Strength Index (RSI).
 */
export const calculateRSI = (prices: number[], period = 14): number[] => {
    if (prices.length < period + 1) return Array(prices.length).fill(50);

    const rsiArray: number[] = [];
    const gains: number[] = [];
    const losses: number[] = [];

    for (let i = 1; i < prices.length; i++) {
        const change = prices[i] - prices[i - 1];
        gains.push(Math.max(0, change));
        losses.push(Math.max(0, -change));
    }

    let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
    let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

    for (let i = 0; i < period; i++) rsiArray.push(50);
    rsiArray.push(100 - (100 / (1 + avgGain / (avgLoss === 0 ? 1 : avgLoss))));

    for (let i = period; i < gains.length; i++) {
        avgGain = (avgGain * (period - 1) + gains[i]) / period;
        avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
        const rs = avgGain / (avgLoss === 0 ? 0.001 : avgLoss);
        rsiArray.push(100 - (100 / (1 + rs)));
    }

    return rsiArray;
};

/**
 * Calculates MACD (12, 26, 9).
 */
export const calculateMACD = (prices: number[]) => {
    if (prices.length < 2) return [];
    const ema = (data: number[], period: number): number[] => {
        const k = 2 / (period + 1);
        const emaArray: number[] = [data[0]];
        for (let i = 1; i < data.length; i++) {
            emaArray.push(data[i] * k + emaArray[i - 1] * (1 - k));
        }
        return emaArray;
    };

    const ema12 = ema(prices, 12);
    const ema26 = ema(prices, 26);
    
    const macdLine = prices.map((_, i) => ema12[i] - ema26[i]);
    const signalLine = ema(macdLine, 9);
    const histogram = prices.map((_, i) => macdLine[i] - signalLine[i]);

    return prices.map((_, i) => ({
        date: '',
        macd: macdLine[i],
        signal: signalLine[i],
        histogram: histogram[i]
    }));
};

/**
 * Extracts the domain from a given URL string.
 */
export const getDomainFromUrl = (url: string): string | null => {
    if (!url) return null;
    try {
        let cleanUrl = url;
        if (!cleanUrl.startsWith('http')) {
            cleanUrl = 'https://' + cleanUrl;
        }
        const hostname = new URL(cleanUrl).hostname;
        return hostname.replace(/^www\./, '');
    } catch {
        return null;
    }
};
