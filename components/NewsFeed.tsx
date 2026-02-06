
import React from 'react';
import type { NewsArticle } from '../types';
import { NewspaperIcon, SparklesIcon, ExternalLinkIcon, ArrowLongRightIcon } from './icons';
import { timeAgo } from '../utils';

interface NewsFeedProps {
    articles: NewsArticle[];
    title?: string;
    variant?: 'list' | 'scroll' | 'compact' | 'magazine';
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
    if (sourceToDomainMap[lowerSource]) {
        return sourceToDomainMap[lowerSource];
    }
    return `${lowerSource.replace(/[^a-z0-9]/g, '')}.com`;
};

/* ─── Featured Article Card (Large - for magazine hero) ─── */
const FeaturedArticle: React.FC<{ article: NewsArticle }> = ({ article }) => {
    const [imageError, setImageError] = React.useState(false);
    const domain = getDomainFromSource(article.source);
    const logoUrl = article.source_logo || `https://logo.clearbit.com/${domain}`;
    const showImage = article.imageUrl && !imageError;

    return (
        <a
            href={article.articleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col rounded-3xl overflow-hidden bg-slate-900 dark:bg-[#111113] border border-slate-200/10 dark:border-white/[0.06] shadow-xl hover:shadow-2xl transition-all duration-500 min-h-[360px]"
        >
            {/* Background image */}
            <div className="absolute inset-0">
                {showImage ? (
                    <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-slate-900"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20"></div>
            </div>

            {/* Content overlay */}
            <div className="relative z-10 mt-auto p-7 md:p-8 flex flex-col">
                {/* Source badge */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-xl rounded-lg border border-white/10">
                        <img
                            src={logoUrl}
                            alt=""
                            className="w-4 h-4 rounded-sm object-contain bg-white"
                            onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${article.source}&background=random&color=fff&bold=true`;
                            }}
                        />
                        <span className="text-[11px] font-bold text-white/90 uppercase tracking-wider">{article.source}</span>
                    </div>
                    <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider">{timeAgo(article.published_at)}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-black text-white leading-tight tracking-tight mb-3 group-hover:text-indigo-200 transition-colors line-clamp-3">
                    {article.title}
                </h3>

                {/* Summary */}
                <p className="text-sm text-white/50 leading-relaxed line-clamp-2 mb-5 font-medium">
                    {article.summary || article.takeaway || "Click to read full coverage of this developing market story."}
                </p>

                {/* Read more */}
                <div className="flex items-center gap-2 text-indigo-300 group-hover:text-indigo-200 transition-colors">
                    <span className="text-xs font-bold uppercase tracking-widest">Read Full Story</span>
                    <ArrowLongRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </a>
    );
};

/* ─── Magazine Grid Article Card ─── */
const MagazineCard: React.FC<{ article: NewsArticle }> = ({ article }) => {
    const [imageError, setImageError] = React.useState(false);
    const domain = getDomainFromSource(article.source);
    const logoUrl = article.source_logo || `https://logo.clearbit.com/${domain}`;
    const showImage = article.imageUrl && !imageError;

    return (
        <a
            href={article.articleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col bg-white dark:bg-[#111113] rounded-2xl border border-slate-200/80 dark:border-white/[0.06] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
        >
            {/* Image */}
            <div className="h-44 w-full relative bg-slate-100 dark:bg-white/[0.03] overflow-hidden">
                {showImage ? (
                    <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#151517] dark:to-[#111113] relative">
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                        <NewspaperIcon className="w-10 h-10 text-slate-300 dark:text-zinc-700 relative z-10" />
                    </div>
                )}

                {/* Source chip overlay */}
                <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1.5 bg-white/90 dark:bg-[#111113]/90 backdrop-blur-md rounded-lg border border-slate-200/50 dark:border-white/10 shadow-sm z-10">
                    <img
                        src={logoUrl}
                        alt=""
                        className="w-3.5 h-3.5 rounded-sm object-contain bg-white"
                        onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${article.source}&background=random&color=fff&bold=true`;
                        }}
                    />
                    <span className="text-[10px] font-bold text-slate-800 dark:text-white uppercase tracking-wider truncate max-w-[120px]">{article.source}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-500/20 uppercase tracking-wider">
                        {timeAgo(article.published_at)}
                    </span>
                    <ExternalLinkIcon className="w-3.5 h-3.5 text-slate-300 dark:text-zinc-700 group-hover:text-indigo-500 transition-colors" />
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100 leading-snug line-clamp-3 mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight">
                    {article.title}
                </h4>

                {article.takeaway && (
                    <p className="text-[11px] text-slate-500 dark:text-zinc-500 font-medium line-clamp-2 mt-auto leading-relaxed">
                        {article.takeaway}
                    </p>
                )}
            </div>
        </a>
    );
};

/* ─── Scroll Card ─── */
const NewsCard: React.FC<{ article: NewsArticle }> = ({ article }) => {
    const [imageError, setImageError] = React.useState(false);
    const domain = getDomainFromSource(article.source);
    const logoUrl = article.source_logo || `https://logo.clearbit.com/${domain}`;
    const showImage = article.imageUrl && !imageError;

    return (
        <a
            href={article.articleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-[280px] md:w-[320px] bg-white dark:bg-[#111113] rounded-2xl border border-slate-200/80 dark:border-white/[0.06] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group snap-center flex flex-col h-full min-h-[280px]"
        >
            <div className="h-40 w-full relative bg-slate-100 dark:bg-white/[0.03] overflow-hidden">
                {showImage ? (
                    <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-[#151517] relative">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
                        <NewspaperIcon className="w-10 h-10 text-slate-300 dark:text-zinc-700 relative z-10" />
                    </div>
                )}
                <div className="absolute top-3 left-3 bg-white/90 dark:bg-[#111113]/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200/50 dark:border-white/10 shadow-sm flex items-center gap-2 z-10">
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
            <div className="p-5 flex flex-col flex-1">
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

/* ─── List Item ─── */
const NewsItem: React.FC<{ article: NewsArticle }> = ({ article }) => {
    const [imageError, setImageError] = React.useState(false);
    const [logoError, setLogoError] = React.useState(false);
    const domain = getDomainFromSource(article.source);
    const logoUrl = article.source_logo || `https://logo.clearbit.com/${domain}`;
    const showMainImage = article.imageUrl && !imageError;
    const showLogo = !showMainImage && !logoError;

    return (
        <a
            href={article.articleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-5 p-5 bg-white dark:bg-[#111113] border border-slate-200/80 dark:border-white/[0.06] rounded-2xl hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:shadow-xl transition-all duration-400 group mb-4 last:mb-0 shadow-sm"
        >
            <div className="w-[80px] h-[80px] rounded-2xl bg-slate-50 dark:bg-zinc-800 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-white/[0.06] relative group-hover:scale-105 transition-transform duration-300">
                {showMainImage ? (
                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" onError={() => setImageError(true)} />
                ) : showLogo ? (
                    <img src={logoUrl} alt={article.source} className="w-12 h-12 object-contain" onError={() => setLogoError(true)} />
                ) : (
                    <NewspaperIcon className="w-8 h-8 text-slate-400 dark:text-zinc-600" />
                )}
            </div>
            <div className="flex flex-col flex-1 min-w-0 justify-center">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-100 dark:border-indigo-500/20">
                        {article.source}
                    </span>
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

/* ─── Compact Row ─── */
const NewsCompactRow: React.FC<{ article: NewsArticle }> = ({ article }) => {
    const domain = getDomainFromSource(article.source);
    const logoUrl = article.source_logo || `https://logo.clearbit.com/${domain}`;

    return (
        <a
            href={article.articleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 p-4 hover:bg-slate-50 dark:hover:bg-white/[0.03] rounded-xl transition-colors group border-b border-slate-100 dark:border-white/[0.04] last:border-0"
        >
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10 mt-0.5">
                <img
                    src={logoUrl}
                    alt={article.source}
                    className="w-6 h-6 object-contain rounded-sm opacity-80 group-hover:opacity-100 transition-opacity"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
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

/* ─── Main NewsFeed Component ─── */
const NewsFeed: React.FC<NewsFeedProps> = ({ articles, title, variant = 'list' }) => {
    const validArticles = Array.isArray(articles) ? articles : [];

    let limit = 4;
    if (variant === 'scroll') limit = 6;
    if (variant === 'compact') limit = 5;
    if (variant === 'magazine') limit = 5;

    const displayArticles = validArticles.length > 0 ? validArticles.slice(0, limit) : [];

    if (displayArticles.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-10 text-center border-2 border-dashed border-slate-200/50 dark:border-white/[0.06] rounded-2xl bg-white/50 dark:bg-white/[0.02]">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-3 border border-slate-200 dark:border-white/[0.06]">
                    <NewspaperIcon className="w-6 h-6 text-slate-300 dark:text-zinc-600" />
                </div>
                <p className="text-slate-400 dark:text-zinc-600 font-bold uppercase tracking-widest text-[10px]">Awaiting market news feed...</p>
            </div>
        );
    }

    /* ─── Magazine variant: Featured hero + grid ─── */
    if (variant === 'magazine') {
        const [featured, ...rest] = displayArticles;
        return (
            <div className="w-full space-y-6">
                {title && <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 px-1">{title}</h3>}
                {/* Featured article (full width) */}
                <FeaturedArticle article={featured} />
                {/* Grid of remaining articles */}
                {rest.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {rest.map((article, idx) => (
                            <MagazineCard key={idx} article={article} />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    /* ─── Scroll variant ─── */
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

    /* ─── Compact variant ─── */
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

    /* ─── Default list variant ─── */
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
