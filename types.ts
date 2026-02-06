
export type RiskProfile = 'Aggressive' | 'Moderate' | 'Conservative';

export type TimeRange = '1D' | '5D' | '1M' | '3M' | '6M' | 'YTD' | '1Y' | '5Y' | 'MAX';
export type HistoricalDataPoint = { date: string; close: number; };

/** Defines the structure for a single forecast scenario data point. */
export interface ForecastScenario {
    target_price: number;
    percentage_change: number;
    confidence_score: number; // A score from 0 to 1
    rationale: string;
}

/** Configuration and results for an AI-powered price prediction with multiple scenarios. */
export interface PricePrediction {
    generated_at?: string; // ISO 8601 timestamp
    prediction_summary: string;
    bullish_scenario: {
        "7_day"?: ForecastScenario;
        "30_day": ForecastScenario;
        "90_day"?: ForecastScenario;
    };
    base_case_scenario: {
        "7_day"?: ForecastScenario;
        "30_day": ForecastScenario;
        "90_day"?: ForecastScenario;
    };
    bearish_scenario: {
        "7_day"?: ForecastScenario;
        "30_day": ForecastScenario;
        "90_day"?: ForecastScenario;
    };
}


/** Defines an automated annotation to be overlaid on a stock chart. */
export interface ChartAnnotation {
    /** The type of event being annotated. */
    type: 'SUPPORT' | 'RESISTANCE' | 'MOMENTUM_SHIFT' | 'BREAKOUT' | 'VOLUME_SPIKE' | 'MOVING_AVERAGE_CROSSOVER';
    /** The date of the event in ISO string format. */
    date: string;
    /** The price level at which the event occurred, for support/resistance lines. */
    price?: number;
    /** A concise description of the annotation for tooltips. */
    description: string;
    /** The perceived strength of a support or resistance level. */
    strength?: 'weak' | 'moderate' | 'strong';
    /** The direction of the trend shift or crossover. */
    direction?: 'bullish' | 'bearish';
}

export interface CompanyProfileData {
  symbol: string;
  market_cap: string;
  ipo_date: string;
  ceo: string;
  employees: string;
  sector: string;
  industry: string;
  country: string;
  exchange: string;
  description: string;
  trading_status: string;
  status_color: 'green' | 'red' | 'gray';
  website?: string;
}

export interface NewsTheme {
    theme: string;
    sentiment_score: number; // Score from -10 (very negative) to +10 (very positive)
    summary: string;
}

export interface NewsSentimentAnalysis {
    overall_sentiment_score: number; // Score from -10 to +10
    sentiment_summary: string;
    market_impact_summary: string;
    key_themes: NewsTheme[];
}

export interface AnalysisResponse {
  ticker: string;
  user_risk: RiskProfile;
  overview: StockOverview;
  individual_analysis: IndividualAnalysis;
  market_sentiment: MarketSentiment;
  expert_opinions: ExpertOpinions;
  news_sentiment_analysis: NewsSentimentAnalysis;
  historical_data?: { date: string; open: number; high: number; low: number; close: number; volume: number; }[];
  company_profile: CompanyProfileData;
  sma_50_day_series?: number[];
  sma_200_day_series?: number[];
  stock_90_day_performance?: number[];
  spy_90_day_performance?: number[];
  /** Optional AI-powered price prediction data. */
  price_prediction?: PricePrediction;
  /** Optional automated annotations for the stock chart. */
  chart_annotations?: ChartAnnotation[];
  /** A list of 3-5 key competitors or related stocks. */
  related_stocks: { ticker: string, name: string, domain?: string }[];
  /** A brief summary of the stock's sector performance. */
  sector_performance_summary: string;
  /** A list of recent news articles specifically related to the analyzed stock. */
  stock_specific_news: NewsArticle[];
}

export interface StockOverview {
    ticker: string;
    company_name: string;
    current_price: number;
    one_day_return: number;
    one_week_return: number;
    one_month_return: number;
    three_month_return: number;
    one_year_return: number;
    ytd_change_percent: number;
    sp500_ytd_change_percent: number;
    sp500_one_month_return: number;
    sp500_three_month_return: number;
    sp500_one_year_return: number;
    market_cap: string;
    rating: string;
    upside_potential: {
        percentage: number;
        timeframe: string;
    };
    signal: 'Bullish' | 'Bearish' | 'Neutral';
    signal_reasoning: string;
    /** A score from 1 (low) to 10 (high) representing the AI's confidence in its signal. */
    confidence_score: number;
    /** A brief explanation for the confidence score. */
    confidence_reasoning: string;
}

export type StockPerformance = Pick<StockOverview, 'one_day_return' | 'one_week_return' | 'one_month_return' | 'three_month_return' | 'one_year_return'>;

export interface Holder {
    name: string;
    shares: string;
    percentage: string;
}

export interface MajorHolders {
    institutional: Holder[];
    insiders: Holder[];
}

export interface TradeStrategy {
    entry_point: string;
    stop_loss: string;
    target_price: string;
    expected_return_percent: number;
    reasoning: {
        entry_rationale: string;
        stop_loss_rationale: string;
        target_rationale: string;
    };
}

export interface InvestmentRationale {
    investment_thesis: string;
    potential_catalysts: string[];
    key_risks: string[];
    risk_profile_fit_score: number;
    risk_profile_fit_analysis: string;
}

export interface IndividualAnalysis {
    quad_factor_scores: {
        technical_score: number;
        sentiment_score: number;
        risk_alignment_score: number;
    };
    quad_factor_score_rationale: {
        technical_summary: string;
        sentiment_summary: string;
        risk_alignment_summary: string;
    };
    key_levels: {
        "50_Day_SMA": number;
        "200_Day_SMA": number;
        "RSI_Value": number;
        "macd"?: {
            macd: number;
            signal: number;
            histogram: number;
        };
    };
    technical_interpretation: string;
    financial_highlights: {
        market_cap: string;
        pe_ratio: string;
        day_high: number;
        day_low: number;
        fifty_two_week_high: number;
        fifty_two_week_low: number;
        avg_volume: string;
        dividend_yield: string;
        gross_profit?: string;
        operating_income?: string;
        net_income?: string;
        eps?: string;
        ai_signal?: 'Bullish' | 'Bearish' | 'Neutral';
    };
    strengths: string[];
    weaknesses: string[];
    trade_strategy: TradeStrategy;
    investment_rationale: InvestmentRationale;
    major_holders: MajorHolders;
}

export interface MarketSentiment {
    key_news_highlights: string[];
    community_sentiment_summary: string;
    market_impact_summary: string;
    social_media_summary: SocialPost[];
    community_discussion_highlights: {
        topic: string;
        highlight: string;
    }[];
}

export interface AnalystRatingsBreakdown {
    buy: number;
    hold: number;
    sell: number;
}

export interface NewsSentimentItem {
    source: string;
    summary: string;
    prediction?: string; // Optional if not always present
}

export interface NewsSentimentBreakdown {
    positive: NewsSentimentItem[];
    negative: NewsSentimentItem[];
    neutral: NewsSentimentItem[];
}

export interface ExpertOpinions {
    expert_insights_summary: string;
    wall_street_consensus: {
        title: string;
        summary: string;
        consensus_tag: string;
        theme_icon: string;
    }[];
    recent_analyst_actions: {
        firm_action: string;
        details: string;
        price_target: string;
    }[];
    analyst_ratings_breakdown: AnalystRatingsBreakdown;
    news_sentiment_breakdown: NewsSentimentBreakdown;
    price_targets?: {
        high: number;
        low: number;
        median: number;
    };
}

export interface NewsArticle {
    title: string;
    summary: string;
    source: string;
    category: string;
    imageUrl: string;
    articleUrl: string;
    /** The publication date as an ISO 8601 string. */
    published_at: string;
    /** A simple sentiment tag for the article. */
    sentiment_tag: 'Positive' | 'Negative' | 'Neutral' | 'Bullish' | 'Bearish';
    /** A concise one-line takeaway or key insight from the article. */
    takeaway: string;
    /** URL to the logo of the news source */
    source_logo?: string;
}

export type AnalysisTab =
    | 'Overview'
    | 'Individual Analysis'
    | 'Market Sentiment'
    | 'Expert Opinions'
    | 'Company Profile'
    | 'AI News & Sentiment';

export type ChatMessage = {
    role: 'user' | 'model';
    text: string;
};

export interface DashboardData {
    sp500_performance: {
        value: string;
        isPositive: boolean;
    };
    market_sentiment: {
        us: { social_media: string; expert_opinion: string; };
        europe: { social_media: string; expert_opinion: string; };
        asia: { social_media: string; expert_opinion: string; };
    };
}

export interface AIPortfolio {
    risk_profile: RiskProfile;
    time_horizon: string;
    expected_annual_return: number;
    expected_return_rationale?: string;
    best_case_return: number;
    best_case_rationale?: string;
    worst_case_return: number;
    worst_case_rationale?: string;
    rationale: string;
    stocks: {
        ticker: string;
        allocation: number;
    }[];
}

export type SavedAnalysis = AnalysisResponse & { savedAt: string; };

export interface ComparisonInsight {
    overall_summary: string;
    winner_for_goals: {
        growth?: { ticker: string; reason: string };
        value?: { ticker: string; reason: string };
        dividends?: { ticker: string; reason: string };
    };
    key_metric_comparison: {
        metric: string;
        best_ticker?: string;
        values: Record<string, string | number>;
    }[];
    sector_performance_summary: string;
}

export interface MarketIndex {
    name: string;
    symbol: string;
    price: string;
    change: string;
    percent_change: string;
    is_positive: boolean;
    chart_data: number[];
}

export type Page =
    | 'dashboard'
    | 'analysis'
    | 'riskProfile'
    | 'marketPulse'
    | 'profileGenerator'
    | 'newsFeed'
    | 'comparison'
    | 'saved'
    | 'settings'
    | 'managePlan';

export interface TopMover {
    ticker: string;
    name: string;
    price: string;
    change: string;
    percent_change: string;
    is_positive: boolean;
    chart_data?: number[];
    domain?: string;
    market_cap?: string;
}

export interface SocialPost {
    source: string;
    author: string;
    sentiment: 'Bullish' | 'Bearish' | 'Neutral';
    content: string;
}

export interface ExpertTake {
    source: string;
    author: string;
    summary: string;
    prediction?: string;
}

export interface MarketPulseData {
    overall_summary: string;
    social_posts: SocialPost[];
    expert_takes: ExpertTake[];
}

export interface Sector {
    name: string;
    change_percent: number; // e.g. 1.52 or -0.78
    weight: number; // e.g. 28 (for 28%)
}

export interface EconomicEvent {
    date: string; // ISO 8601 string
    event_name: string;
    impact: 'High' | 'Medium' | 'Low';
    region: string; // e.g., "US", "EU", "Global"
}

export interface MarketAsset {
    name: string;
    price: string;
    change: string;
    trend: 'up' | 'down' | 'neutral';
    weekly_trend?: number[];
}

export interface MarketFundamentals {
    gold: MarketAsset;
    silver: MarketAsset;
    oil: MarketAsset;
    bitcoin: MarketAsset;
}

export interface FeaturedStock {
    ticker: string;
    name: string;
    price: string;
    change: string;
    percent_change: string;
    is_positive: boolean;
    signal: 'Bullish' | 'Bearish' | 'Neutral';
    analyst_rating?: string;
    brief_analysis: string;
    technical_indicators?: {
        rsi: number;
        macd_signal: 'Bullish' | 'Bearish' | 'Neutral';
        trend: 'Uptrend' | 'Downtrend' | 'Sideways';
    };
    technical_interpretation?: string;
}

export interface ETFPerformance {
    symbol: string;
    name: string;
    six_month_return: number;
    one_year_return: number;
    price: number;
}

export interface DashboardPageData {
    dashboardMetrics: DashboardData;
    marketIndices: MarketIndex[];
    topMovers: {
        top_gainers: TopMover[];
        top_losers: TopMover[];
        most_active: TopMover[];
    };
    headlines: NewsArticle[];
    sector_performance: Sector[];
    economic_calendar: EconomicEvent[];
    market_fundamentals?: MarketFundamentals;
    featured_stocks?: FeaturedStock[];
    etf_performance?: ETFPerformance[];
}

export type WidgetType = 
    | 'MARKET_GLANCE' 
    | 'SENTIMENT_BAR'
    | 'KEY_METRICS'
    | 'ECONOMIC_CALENDAR'
    | 'ETF_PERFORMANCE'
    | 'WATCHLIST' 
    | 'TOP_GAINERS' 
    | 'NEWS_FEED' 
    | 'SHORTCUT_COMPARISON'
    | 'SHORTCUT_ANALYSIS'
    | 'SHORTCUT_MARKET_PULSE'
    | 'SHORTCUT_PROFILE_GEN';

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title?: string;
}

// --- NEW PORTFOLIO ANALYSIS TYPES ---

export interface UserHolding {
    id: string; // Unique ID for list management
    ticker: string;
    shares: number;
    avgCost: number;
    purchaseDate: string;
    currentPrice?: number; // Fetched externally
}

export interface PortfolioAction {
    ticker: string;
    action: 'HOLD' | 'EXIT' | 'REDUCE' | 'BUY_MORE';
    rationale: string;
    suggested_replacement?: string;
}

export interface PortfolioAnalysisResult {
    overall_health_score: number; // 0-10
    health_summary: string;
    diversification_analysis: string;
    risk_assessment: string;
    holdings_analysis: PortfolioAction[];
    sector_allocation: { sector: string; percentage: number }[];
    rebalancing_suggestions: string[];
}
