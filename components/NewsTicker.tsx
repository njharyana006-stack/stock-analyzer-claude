
import React from 'react';

interface NewsTickerProps {
    headlines: string[];
}

const NewsTicker: React.FC<NewsTickerProps> = ({ headlines }) => {
    if (!headlines || headlines.length === 0) {
        return null;
    }
    
    // Duplicate headlines to create a seamless loop, ensuring there's enough content to scroll smoothly
    const tickerContent = [...headlines, ...headlines, ...headlines, ...headlines];

    return (
        <div className="bg-white/60 w-full overflow-hidden whitespace-nowrap py-2 border-b border-[var(--border)]">
            <div className="inline-block animate-ticker">
                {tickerContent.map((headline, index) => (
                    <span key={index} className="text-slate-600 mx-6 text-sm font-medium">
                        <span className="text-slate-400 mr-3">&bull;</span> {headline}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default React.memo(NewsTicker);