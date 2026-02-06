
import React from 'react';
import type { NewsArticle } from '../types';
import { NewspaperIcon, SparklesIcon, ExternalLinkIcon } from './icons';
import { timeAgo } from '../utils';

interface NewsFeedProps {
    articles: NewsArticle[];
    title?: string;
    variant?: 'list' | 'scroll' | 'compact';
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
    if (!source) return 'google.com';
    const lowerSource = source.toLowerCase().trim();
    // Check exact map matches first
    if (sourceToDomainMap[lowerSource]) {
        return sourceToDomainMap[lowerSource];
    }
    // Heuristic: remove spaces and special chars to guess domain
    return `${lowerSource.replace(/[^a-z0-9]/g, '')}.com`;
};

const NewsCard: React.FC<{ article: NewsArticle }> = ({ article }) => {
    const [imageError, setImageError] = React.useState(false);
    
    // Prefer source_logo from API, fallback to Clearbit guessing
    const domain = getDomainFromSource(article.source);
    const logoUrl = article.source_logo || `https://logo.clearbit.com/${domain}`;
    
    const showImage = article.imageUrl && !imageError;

    return (
        <a 
            href={article.articleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-[280px] md:w-[320px] bg-white dark:bg-[#121214] rounded-[24px] border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm card-hover transition-all duration-300 group snap-center flex flex-col h-full min-h-[280px]"
        >
            {/* Image Area */}
            <div className="h-40 w-full relative bg-slate-100 dark:bg-white/5 overflow-hidden">
                {showImage ? (
                    <img 
                        src={article.imageUrl} 
                        alt={article.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-[#18181B] relative">
                        {/* Abstract pattern for missing images */}
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
                        <NewspaperIcon className="w-10 h-10 text-slate-300 dark:text-zinc-700 relative z-10" />
                    </div>
                )}
                
                {/* Badge Overlay */}
                <div className="absolute top-3 left-3 bg-white/90 dark:bg-[#18181B]/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200/50 dark:border-white/10 shadow-sm flex items-center gap-2 z-10">
                     <img 
                        src={logoUrl} 
                        alt="" 
                        className="w-3.5 h-3.5 rounded-full object-contain bg-white"
                        onError={(e) => { 
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${article.source}&background=random&color=fff&bold=true`;
                        }}
                    />
                    <span className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-wider truncate max-w-[150px]">{article.source}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1 bg-gradient-to-b from-white to-slate-50 dark:from-[#121214] dark:to-[#09090B]">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-500/20 uppercase tracking-wider">
                        {timeAgo(article.published_at)}
                    </span>
                    <ExternalLinkIcon className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                </div>
                
                <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100 leading-snug line-clamp-3 mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight">
                    {article.title}
                </h4>
                
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed line-clamp-3 mt-auto min-h-[3em]">
                    {article.summary || article.takeaway || "Click to read full coverage of this developing market story."}
                </p>
            </div>
        </a>
    );
};

const NewsItem: React.FC<{ article: NewsArticle }> = ({ article }) => {
    const [imageError, setImageError] = React.useState(false);
    const [logoError, setLogoError] = React.useState(false);
    
    // Prefer source_logo from API, fallback to Clearbit guessing
    const domain = getDomainFromSource(article.source);
    const logoUrl = article.source_logo || `https://logo.clearbit.com/${domain}`;
    
    const showMainImage = article.imageUrl && !imageError;
    const showLogo = !showMainImage && !logoError;

    return (
        <a 
            href={article.articleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-5 p-5 bg-white dark:bg-[#121214] border border-slate-200 dark:border-white/5 rounded-[32px] hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:shadow-xl transition-all duration-400 group mb-4 last:mb-0 shadow-sm card-hover"
        >
            <div className="w-[80px] h-[80px] rounded-2xl bg-slate-50 dark:bg-zinc-800 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-white/5 relative group-hover:scale-105 transition-transform duration-300">
                 {showMainImage ? (
                    <img 
                        src={article.imageUrl} 
                        alt={article.title} 
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                        onError={() => setImageError(true)} 
                    />
                 ) : showLogo ? (
                    <img 
                        src={logoUrl} 
                        alt={article.source} 
                        className="w-12 h-12 object-contain opacity-90 group-hover:opacity-100 transition-opacity" 
                        onError={() => setLogoError(true)} 
                    />
                 ) : (
                    <NewspaperIcon className="w-8 h-8 text-slate-400 dark:text-zinc-600" />
                 )}
            </div>
            <div className="flex flex-col flex-1 min-w-0 justify-center">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-100 dark:border-indigo-500/20">
                            {article.source}
                        </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-600 tabular-nums uppercase">{timeAgo(article.published_at)}</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-zinc-100 leading-snug line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight">
                    {article.title}
                </h4>
                {article.takeaway && (
                    <p className="text-[11px] text-slate-500 dark:text-zinc-500 font-medium mt-2 line-clamp-1 italic">
                        Key Point: {article.takeaway}
                    </p>
                )}
            </div>
            <div className="hidden sm:flex items-center text-slate-300 group-hover:text-indigo-500 dark:text-zinc-600 dark:group-hover:text-indigo-400 transition-colors">
                <ExternalLinkIcon className="w-5 h-5" />
            </div>
        </a>
    );
};

const NewsCompactRow: React.FC<{ article: NewsArticle }> = ({ article }) => {
    // Prefer source_logo from API, fallback to Clearbit guessing
    const domain = getDomainFromSource(article.source);
    const logoUrl = article.source_logo || `https://logo.clearbit.com/${domain}`;

    return (
        <a 
            href={article.articleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 p-4 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors group border-b border-slate-50 dark:border-white/5 last:border-0"
        >
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10 mt-0.5">
                <img 
                    src={logoUrl} 
                    alt={article.source} 
                    className="w-6 h-6 object-contain rounded-sm opacity-80 group-hover:opacity-100 transition-opacity"
                    onError={(e) => { 
                        e.currentTarget.onerror = null; // prevent infinite loop
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${article.source}&background=random&color=fff&bold=true`;
                    }}
                />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                    <span className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-wide truncate max-w-[120px]">
                        {article.source}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-600 whitespace-nowrap uppercase tracking-wide">
                        {timeAgo(article.published_at)}
                    </span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200 leading-snug line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {article.title}
                </h4>
            </div>
        </a>
    );
};

const NewsFeed: React.FC<NewsFeedProps> = ({ articles, title, variant = 'list' }) => {
    // Robust check: Ensure articles is an array and has content
    const validArticles = Array.isArray(articles) ? articles : [];
    
    // Determine limit based on variant
    let limit = 4;
    if (variant === 'scroll') limit = 6;
    if (variant === 'compact') limit = 5;

    const displayArticles = validArticles.length > 0 ? validArticles.slice(0, limit) : [];

    if (displayArticles.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-100 dark:border-white/5 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-2">
                    <NewspaperIcon className="w-5 h-5 text-slate-300 dark:text-zinc-600" />
                </div>
                <p className="text-slate-400 dark:text-zinc-600 font-bold uppercase tracking-widest text-[10px]">Awaiting market news feed...</p>
            </div>
        );
    }

    if (variant === 'scroll') {
        return (
            <div className="w-full">
                {title && <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 px-1">{title}</h3>}
                <div className="flex gap-4 overflow-x-auto pb-6 pt-1 snap-x snap-mandatory scrollbar-none -mx-1 px-1">
                    {displayArticles.map((article, idx) => (
                        <NewsCard key={idx} article={article} />
                    ))}
                </div>
            </div>
        );
    }

    if (variant === 'compact') {
        return (
            <div className="w-full h-full flex flex-col">
                {title && <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 px-1">{title}</h3>}
                <div className="flex-grow overflow-y-auto custom-scrollbar -mr-2 pr-2">
                    {displayArticles.map((article, idx) => (
                        <NewsCompactRow key={idx} article={article} />
                    ))}
                </div>
            </div>
        );
    }

    // Default 'list' variant
    return (
        <div className="w-full flex flex-col">
            {title && <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{title}</h3>}
            {displayArticles.map((article, idx) => (
                <NewsItem key={idx} article={article} />
            ))}
        </div>
    );
};

export default NewsFeed;
