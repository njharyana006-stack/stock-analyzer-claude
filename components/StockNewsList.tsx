
import React from 'react';
import type { NewsArticle } from '../types';
import { timeAgo } from '../utils';
import { ExternalLinkIcon } from './icons';

interface StockNewsListProps {
    articles: NewsArticle[];
}

const sourceToDomainMap: { [key: string]: string } = {
    'reuters': 'reuters.com', 
    'bloomberg': 'bloomberg.com', 
    'cnbc': 'cnbc.com', 
    'marketwatch': 'marketwatch.com',
    'wall street journal': 'wsj.com', 
    'the wall street journal': 'wsj.com', 
    'wsj': 'wsj.com',
    'associated press': 'ap.org', 
    'ap news': 'apnews.com',
    'forbes': 'forbes.com',
    'business insider': 'businessinsider.com', 
    'yahoo finance': 'finance.yahoo.com', 
    'the motley fool': 'fool.com',
    "investor's business daily": 'investors.com', 
    'financial times': 'ft.com', 
    'barron\'s': 'barrons.com',
    'seeking alpha': 'seekingalpha.com', 
    'morningstar': 'morningstar.com', 
    'benzinga': 'benzinga.com', 
    'techcrunch': 'techcrunch.com',
    'the economist': 'economist.com', 
    'fortune': 'fortune.com', 
    'nasdaq': 'nasdaq.com', 
    'investopedia': 'investopedia.com',
    'fox business': 'foxbusiness.com', 
    'cnn business': 'cnn.com/business', 
    'bbc news': 'bbc.com/news/business',
    'the verge': 'theverge.com',
    'engadget': 'engadget.com',
    'marketbeat': 'marketbeat.com',
    'tipranks': 'tipranks.com',
    'zacks': 'zacks.com',
    'the street': 'thestreet.com',
    'quartz': 'qz.com',
    'venturebeat': 'venturebeat.com',
    'axios': 'axios.com'
};

const getDomainFromSource = (source: string): string => {
    if (!source) return 'a.com'; // Default fallback
    const lowerSource = source.toLowerCase().trim();
    if (sourceToDomainMap[lowerSource]) {
        return sourceToDomainMap[lowerSource];
    }
    return `${lowerSource.replace(/\s+/g, '').replace(/[.'&]/g, '')}.com`;
};

const StockNewsList: React.FC<StockNewsListProps> = ({ articles }) => {
    if (!articles || articles.length === 0) {
        return <p className="text-sm text-slate-500 text-center">No recent news found for this stock.</p>;
    }
    
    return (
        <div className="space-y-3">
            {articles.map((article, index) => (
                <a 
                    key={index} 
                    href={article.articleUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block p-3 hover:bg-slate-50 rounded-lg transition-colors group"
                >
                    <div className="flex items-center space-x-3 text-xs text-slate-500 mb-1">
                         <img
                            src={`https://logo.clearbit.com/${getDomainFromSource(article.source)}`}
                            alt={`${article.source} logo`}
                            className="w-4 h-4 rounded-full bg-white object-contain border border-slate-200"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <span className="font-semibold">{article.source}</span>
                        <span>&bull;</span>
                        <span>{timeAgo(article.published_at)}</span>
                    </div>
                    <p className="font-semibold text-sm text-slate-800 group-hover:text-indigo-600">
                        {article.title}
                    </p>
                </a>
            ))}
        </div>
    );
};

export default StockNewsList;
