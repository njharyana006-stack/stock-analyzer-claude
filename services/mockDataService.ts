
import type {
    AnalysisResponse, RiskProfile, NewsArticle, DashboardPageData,
    AIPortfolio, PortfolioAnalysisResult, MarketPulseData, UserHolding,
    MarketIndex, FeaturedStock, ETFPerformance, Sector, EconomicEvent,
    MarketFundamentals, DashboardData, TopMover
} from '../types';

// --- Helper to generate realistic historical price data ---
function generateHistoricalData(basePrice: number, days: number, volatility: number = 0.02) {
    const data = [];
    let price = basePrice * (1 - volatility * days * 0.3); // Start lower in the past
    const now = new Date();
    for (let i = days; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const change = (Math.random() - 0.45) * volatility * price; // Slight upward bias
        price = Math.max(price + change, price * 0.5);
        const dayVolatility = price * volatility * 0.5;
        data.push({
            date: date.toISOString().split('T')[0],
            open: +(price - dayVolatility * Math.random()).toFixed(2),
            high: +(price + dayVolatility * Math.random()).toFixed(2),
            low: +(price - dayVolatility * Math.random()).toFixed(2),
            close: +price.toFixed(2),
            volume: Math.floor(20000000 + Math.random() * 80000000)
        });
    }
    return data;
}

function generateSparkline(points: number = 7, trend: 'up' | 'down' | 'flat' = 'up'): number[] {
    const data: number[] = [];
    let val = 100;
    for (let i = 0; i < points; i++) {
        const drift = trend === 'up' ? 1.5 : trend === 'down' ? -1.5 : 0;
        val += drift + (Math.random() - 0.5) * 4;
        data.push(+val.toFixed(2));
    }
    return data;
}

// --- Stock Analysis Mock Data (by ticker) ---

const STOCK_DATABASE: Record<string, Partial<AnalysisResponse>> = {
    AAPL: {
        ticker: 'AAPL',
        overview: {
            ticker: 'AAPL', company_name: 'Apple Inc.', current_price: 227.63,
            one_day_return: 1.24, one_week_return: 3.15, one_month_return: 5.82,
            three_month_return: 8.47, one_year_return: 28.31, ytd_change_percent: 6.12,
            sp500_ytd_change_percent: 4.8, sp500_one_month_return: 2.1, sp500_three_month_return: 5.3, sp500_one_year_return: 22.4,
            market_cap: '$3.45T', rating: 'Buy',
            upside_potential: { percentage: 12.5, timeframe: '12 months' },
            signal: 'Bullish', signal_reasoning: 'Strong momentum with iPhone 16 cycle and services growth.',
            confidence_score: 8, confidence_reasoning: 'Dominant ecosystem with strong cash flows and expanding services revenue.'
        },
        company_profile: {
            symbol: 'AAPL', description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
            sector: 'Technology', industry: 'Consumer Electronics', ceo: 'Tim Cook',
            employees: '164,000', exchange: 'NASDAQ', market_cap: '$3.45T',
            ipo_date: '1980-12-12', country: 'United States',
            trading_status: 'Market Open', status_color: 'green'
        },
        individual_analysis: {
            quad_factor_scores: { technical_score: 8, sentiment_score: 7, risk_alignment_score: 8 },
            quad_factor_score_rationale: {
                technical_summary: 'Trading above 50-day and 200-day SMA with strong momentum indicators.',
                sentiment_summary: 'Positive sentiment driven by iPhone 16 sales and AI integration rumors.',
                risk_alignment_summary: 'Blue-chip stability with growth potential suits most risk profiles.'
            },
            key_levels: { "50_Day_SMA": 221.45, "200_Day_SMA": 208.32, "RSI_Value": 62.4, macd: { macd: 2.15, signal: 1.89, histogram: 0.26 } },
            technical_interpretation: 'Bullish trend with RSI in healthy territory. MACD showing positive momentum.',
            financial_highlights: {
                market_cap: '$3.45T', pe_ratio: '33.2', day_high: 229.10, day_low: 225.80,
                fifty_two_week_high: 237.49, fifty_two_week_low: 164.08,
                avg_volume: '56.2M', dividend_yield: '0.44%', gross_profit: '$170.8B',
                operating_income: '$114.3B', net_income: '$93.7B', eps: '$6.13'
            },
            strengths: ['World-class brand loyalty and ecosystem lock-in', 'Services revenue growing 15% YoY', 'Massive $162B cash position', 'Strong iPhone 16 upgrade cycle'],
            weaknesses: ['Premium valuation at 33x earnings', 'China market regulatory headwinds', 'AI capabilities lag behind competitors'],
            trade_strategy: {
                entry_point: '$224.00', stop_loss: '$215.00', target_price: '$255.00',
                expected_return_percent: 13.8,
                reasoning: { entry_rationale: 'Buy near 50-day SMA support.', stop_loss_rationale: 'Below recent consolidation zone.', target_rationale: 'Based on consensus analyst price targets.' }
            },
            investment_rationale: {
                investment_thesis: 'Apple remains a core holding driven by ecosystem expansion, services growth, and potential AI catalyst.',
                potential_catalysts: ['Apple Intelligence AI rollout', 'iPhone 16 super-cycle', 'India market expansion', 'Vision Pro enterprise adoption'],
                key_risks: ['Regulatory pressures in EU and China', 'Smartphone market saturation', 'Services growth deceleration'],
                risk_profile_fit_score: 8, risk_profile_fit_analysis: 'Excellent fit for moderate to aggressive profiles given growth trajectory and stability.'
            },
            major_holders: {
                institutional: [
                    { name: 'Vanguard Group', shares: '1.29B', percentage: '8.4%' },
                    { name: 'BlackRock Inc.', shares: '1.01B', percentage: '6.6%' },
                    { name: 'Berkshire Hathaway', shares: '905M', percentage: '5.9%' }
                ],
                insiders: [
                    { name: 'Tim Cook (CEO)', shares: '3.28M', percentage: '0.02%' },
                    { name: 'Jeff Williams (COO)', shares: '489K', percentage: '0.003%' }
                ]
            }
        },
        market_sentiment: {
            key_news_highlights: ['Apple Intelligence features rolling out globally', 'Services revenue hits record $24.2B', 'iPhone 16 sales beat expectations in Q1'],
            community_sentiment_summary: 'Overwhelmingly positive sentiment across retail and institutional investors.',
            market_impact_summary: 'Strong earnings and AI narrative driving renewed interest.',
            social_media_summary: [
                { source: 'Twitter/X', author: '@TechInvestor', sentiment: 'Bullish', content: 'AAPL services segment is an unstoppable cash machine. Adding more.' },
                { source: 'Reddit r/stocks', author: 'u/ValueHunter', sentiment: 'Bullish', content: 'Apple Intelligence could be the next major catalyst. Holding long.' },
                { source: 'StockTwits', author: '$AAPL_Bull', sentiment: 'Neutral', content: 'Great company but valuation is stretched at 33x PE.' }
            ],
            community_discussion_highlights: [
                { topic: 'AI Integration', highlight: 'Apple Intelligence expected to drive upgrade cycle.' },
                { topic: 'Services Growth', highlight: 'App Store and subscription services hitting new records.' }
            ]
        },
        expert_opinions: {
            expert_insights_summary: 'Wall Street remains largely bullish with 28 Buy ratings. Average price target of $248.',
            wall_street_consensus: [
                { title: 'AI Monetization Potential', summary: 'Apple Intelligence creates new revenue streams through premium features.', consensus_tag: 'Bullish', theme_icon: 'brain' },
                { title: 'Services Moat', summary: 'Recurring revenue from 1B+ subscribers provides stability.', consensus_tag: 'Strong Buy', theme_icon: 'shield' },
                { title: 'Valuation Concern', summary: 'Premium multiple may limit near-term upside.', consensus_tag: 'Neutral', theme_icon: 'scale' }
            ],
            recent_analyst_actions: [
                { firm_action: 'Morgan Stanley - Overweight', details: 'Raised PT citing AI tailwinds', price_target: '$260' },
                { firm_action: 'Goldman Sachs - Buy', details: 'Services growth exceeding expectations', price_target: '$255' },
                { firm_action: 'Barclays - Equal Weight', details: 'Valuation limits upside near-term', price_target: '$230' }
            ],
            analyst_ratings_breakdown: { buy: 28, hold: 8, sell: 2 },
            news_sentiment_breakdown: {
                positive: [{ source: 'Bloomberg', summary: 'Apple services revenue hits all-time high.' }, { source: 'CNBC', summary: 'iPhone 16 sales stronger than expected.' }],
                negative: [{ source: 'Reuters', summary: 'EU antitrust probe into App Store practices.' }],
                neutral: [{ source: 'WSJ', summary: 'Apple exploring new product categories.' }]
            },
            price_targets: { high: 275, low: 190, median: 248 }
        },
        news_sentiment_analysis: {
            overall_sentiment_score: 7.2,
            sentiment_summary: 'Strongly positive sentiment driven by AI integration and record services revenue.',
            market_impact_summary: 'AI narrative and services growth providing sustained buying pressure.',
            key_themes: [
                { theme: 'Apple Intelligence', sentiment_score: 8.5, summary: 'AI features driving upgrade cycle expectations.' },
                { theme: 'Services Growth', sentiment_score: 7.8, summary: 'Record revenue from subscriptions and App Store.' },
                { theme: 'Regulatory Risk', sentiment_score: -3.2, summary: 'EU and China regulatory challenges persist.' }
            ]
        },
        related_stocks: [
            { ticker: 'MSFT', name: 'Microsoft' }, { ticker: 'GOOGL', name: 'Alphabet' },
            { ticker: 'AMZN', name: 'Amazon' }, { ticker: 'META', name: 'Meta Platforms' }
        ],
        stock_specific_news: [
            { title: 'Apple Intelligence Now Available in 6 New Languages', summary: 'Expanding AI features globally.', source: 'TechCrunch', category: 'Technology', imageUrl: '', articleUrl: 'https://techcrunch.com', published_at: new Date().toISOString(), sentiment_tag: 'Positive', takeaway: 'Broader AI adoption could drive upgrade cycle.' },
            { title: 'Apple Services Revenue Hits $24.2B Record', summary: 'Subscription services continue to grow.', source: 'Bloomberg', category: 'Earnings', imageUrl: '', articleUrl: 'https://bloomberg.com', published_at: new Date(Date.now() - 86400000).toISOString(), sentiment_tag: 'Bullish', takeaway: 'Services now account for 25% of total revenue.' },
            { title: 'iPhone 16 Pro Demand Exceeds Supply in Key Markets', summary: 'Strong demand signals.', source: 'Reuters', category: 'Products', imageUrl: '', articleUrl: 'https://reuters.com', published_at: new Date(Date.now() - 172800000).toISOString(), sentiment_tag: 'Positive', takeaway: 'Supply constraints indicate robust demand.' },
            { title: 'EU Opens New Investigation into Apple Pay', summary: 'Regulatory scrutiny continues.', source: 'Financial Times', category: 'Regulation', imageUrl: '', articleUrl: 'https://ft.com', published_at: new Date(Date.now() - 259200000).toISOString(), sentiment_tag: 'Negative', takeaway: 'Potential fines but unlikely to impact long-term thesis.' },
            { title: 'Apple Expands India Manufacturing to Meet Growing Demand', summary: 'Strategic diversification.', source: 'WSJ', category: 'Operations', imageUrl: '', articleUrl: 'https://wsj.com', published_at: new Date(Date.now() - 345600000).toISOString(), sentiment_tag: 'Positive', takeaway: 'India expansion reduces China supply chain risk.' }
        ]
    },
    NVDA: {
        ticker: 'NVDA',
        overview: {
            ticker: 'NVDA', company_name: 'NVIDIA Corporation', current_price: 142.87,
            one_day_return: 2.84, one_week_return: 5.67, one_month_return: 12.43,
            three_month_return: 18.92, one_year_return: 178.54, ytd_change_percent: 15.3,
            sp500_ytd_change_percent: 4.8, sp500_one_month_return: 2.1, sp500_three_month_return: 5.3, sp500_one_year_return: 22.4,
            market_cap: '$3.5T', rating: 'Strong Buy',
            upside_potential: { percentage: 22.3, timeframe: '12 months' },
            signal: 'Bullish', signal_reasoning: 'AI infrastructure demand continues to accelerate with Blackwell platform.',
            confidence_score: 9, confidence_reasoning: 'Dominant AI chip position with massive backlog and expanding data center TAM.'
        },
        company_profile: {
            symbol: 'NVDA', description: 'NVIDIA Corporation provides graphics, compute, and networking solutions. The company operates through Graphics and Compute & Networking segments.',
            sector: 'Technology', industry: 'Semiconductors', ceo: 'Jensen Huang',
            employees: '29,600', exchange: 'NASDAQ', market_cap: '$3.5T',
            ipo_date: '1999-01-22', country: 'United States',
            trading_status: 'Market Open', status_color: 'green'
        },
        individual_analysis: {
            quad_factor_scores: { technical_score: 9, sentiment_score: 9, risk_alignment_score: 7 },
            quad_factor_score_rationale: {
                technical_summary: 'Strong uptrend with price well above all moving averages. Momentum indicators extremely bullish.',
                sentiment_summary: 'Peak AI hype cycle with institutional accumulation at record levels.',
                risk_alignment_summary: 'High beta stock suits aggressive profiles; volatility may concern conservative investors.'
            },
            key_levels: { "50_Day_SMA": 134.22, "200_Day_SMA": 118.50, "RSI_Value": 68.7, macd: { macd: 3.45, signal: 2.81, histogram: 0.64 } },
            technical_interpretation: 'Extremely bullish trend. RSI approaching overbought but strong momentum justifies continuation.',
            financial_highlights: {
                market_cap: '$3.5T', pe_ratio: '62.8', day_high: 144.50, day_low: 140.20,
                fifty_two_week_high: 152.89, fifty_two_week_low: 47.32,
                avg_volume: '312M', dividend_yield: '0.02%', gross_profit: '$44.8B',
                operating_income: '$32.97B', net_income: '$29.76B', eps: '$12.12'
            },
            strengths: ['Monopoly-like position in AI training chips', 'Blackwell architecture demand exceeding supply', 'Data center revenue growing 150%+ YoY', 'CUDA software ecosystem moat'],
            weaknesses: ['Extremely high valuation at 62x PE', 'Customer concentration risk (hyperscalers)', 'Potential competition from AMD and custom chips'],
            trade_strategy: {
                entry_point: '$138.00', stop_loss: '$125.00', target_price: '$175.00',
                expected_return_percent: 26.8,
                reasoning: { entry_rationale: 'Buy on pullbacks to 50-day SMA.', stop_loss_rationale: 'Below key technical support.', target_rationale: 'Based on forward PE expansion with Blackwell ramp.' }
            },
            investment_rationale: {
                investment_thesis: 'NVIDIA is the dominant platform for AI compute, with Blackwell creating a multi-year growth runway.',
                potential_catalysts: ['Blackwell GPU full production ramp', 'Sovereign AI infrastructure deals', 'Robotics and autonomous vehicle expansion', 'Enterprise AI adoption acceleration'],
                key_risks: ['Export restrictions to China', 'AMD MI300X competitive threat', 'Hyperscaler custom chip development', 'Multiple compression risk'],
                risk_profile_fit_score: 7, risk_profile_fit_analysis: 'Best suited for aggressive investors who can tolerate high volatility for exceptional growth.'
            },
            major_holders: {
                institutional: [
                    { name: 'Vanguard Group', shares: '1.89B', percentage: '7.7%' },
                    { name: 'BlackRock Inc.', shares: '1.67B', percentage: '6.8%' },
                    { name: 'FMR LLC', shares: '612M', percentage: '2.5%' }
                ],
                insiders: [
                    { name: 'Jensen Huang (CEO)', shares: '86.2M', percentage: '0.35%' },
                    { name: 'Colette Kress (CFO)', shares: '1.2M', percentage: '0.005%' }
                ]
            }
        },
        market_sentiment: {
            key_news_highlights: ['Blackwell GPUs shipping to major cloud providers', 'Data center revenue surpasses $30B quarterly', 'New sovereign AI deals with 15 countries'],
            community_sentiment_summary: 'Extremely bullish sentiment with retail and institutional investors alike.',
            market_impact_summary: 'NVDA remains the bellwether for AI trade momentum.',
            social_media_summary: [
                { source: 'Twitter/X', author: '@AIInvestor', sentiment: 'Bullish', content: 'Blackwell demand is insane. NVDA earnings will crush again.' },
                { source: 'Reddit r/wallstreetbets', author: 'u/NVDABull2024', sentiment: 'Bullish', content: '$200 by year end. AI spending just getting started.' },
                { source: 'StockTwits', author: '$NVDA_Bear', sentiment: 'Bearish', content: 'At 62x PE, any miss and this drops 20%. Be careful.' }
            ],
            community_discussion_highlights: [
                { topic: 'Blackwell Ramp', highlight: 'Production scaling faster than expected.' },
                { topic: 'Competition', highlight: 'AMD and custom chips remain distant threats.' }
            ]
        },
        expert_opinions: {
            expert_insights_summary: 'Near-universal Buy consensus with average PT of $175. AI infrastructure spend projected to double.',
            wall_street_consensus: [
                { title: 'AI Infrastructure Boom', summary: 'Multi-year capex cycle from hyperscalers benefits NVIDIA directly.', consensus_tag: 'Strong Buy', theme_icon: 'rocket' },
                { title: 'Blackwell Supercycle', summary: 'Next-gen architecture driving massive upgrade demand.', consensus_tag: 'Bullish', theme_icon: 'chip' },
                { title: 'Valuation Stretch', summary: 'Premium multiple requires continued execution perfection.', consensus_tag: 'Cautious', theme_icon: 'warning' }
            ],
            recent_analyst_actions: [
                { firm_action: 'Goldman Sachs - Buy', details: 'Raised PT on Blackwell demand', price_target: '$185' },
                { firm_action: 'Morgan Stanley - Overweight', details: 'AI capex cycle has years to run', price_target: '$180' },
                { firm_action: 'BofA - Buy', details: 'Sovereign AI deals expanding TAM', price_target: '$175' }
            ],
            analyst_ratings_breakdown: { buy: 42, hold: 5, sell: 1 },
            news_sentiment_breakdown: {
                positive: [{ source: 'Bloomberg', summary: 'NVIDIA data center revenue exceeds all expectations.' }, { source: 'CNBC', summary: 'Jensen Huang: AI demand is incredible.' }],
                negative: [{ source: 'Reuters', summary: 'US tightens chip export controls to China.' }],
                neutral: [{ source: 'WSJ', summary: 'NVIDIA expands into enterprise software.' }]
            },
            price_targets: { high: 220, low: 110, median: 175 }
        },
        news_sentiment_analysis: {
            overall_sentiment_score: 8.5,
            sentiment_summary: 'Extremely positive sentiment fueled by AI infrastructure spending boom.',
            market_impact_summary: 'NVDA remains the primary vehicle for AI investment exposure.',
            key_themes: [
                { theme: 'AI Infrastructure', sentiment_score: 9.2, summary: 'Unprecedented demand for GPU compute.' },
                { theme: 'Blackwell Platform', sentiment_score: 8.8, summary: 'Next-gen architecture exceeding expectations.' },
                { theme: 'Export Controls', sentiment_score: -4.1, summary: 'China restrictions limiting addressable market.' }
            ]
        },
        related_stocks: [
            { ticker: 'AMD', name: 'Advanced Micro Devices' }, { ticker: 'AVGO', name: 'Broadcom' },
            { ticker: 'TSM', name: 'Taiwan Semiconductor' }, { ticker: 'MRVL', name: 'Marvell Technology' }
        ],
        stock_specific_news: [
            { title: 'NVIDIA Blackwell GPUs Now Shipping at Scale', summary: 'Mass production ramp in full swing.', source: 'TechCrunch', category: 'Products', imageUrl: '', articleUrl: 'https://techcrunch.com', published_at: new Date().toISOString(), sentiment_tag: 'Bullish', takeaway: 'Supply finally catching up to massive demand backlog.' },
            { title: 'Data Center Revenue Hits $30.8B in Q4', summary: 'Record-breaking quarter for AI chips.', source: 'Bloomberg', category: 'Earnings', imageUrl: '', articleUrl: 'https://bloomberg.com', published_at: new Date(Date.now() - 86400000).toISOString(), sentiment_tag: 'Positive', takeaway: 'YoY growth of 150% in data center segment.' },
            { title: 'NVIDIA Partners with 15 Countries for Sovereign AI', summary: 'Government AI infrastructure deals.', source: 'Reuters', category: 'Partnerships', imageUrl: '', articleUrl: 'https://reuters.com', published_at: new Date(Date.now() - 172800000).toISOString(), sentiment_tag: 'Positive', takeaway: 'New TAM from government AI spending.' },
            { title: 'US Tightens AI Chip Export Restrictions', summary: 'New controls on China shipments.', source: 'Financial Times', category: 'Regulation', imageUrl: '', articleUrl: 'https://ft.com', published_at: new Date(Date.now() - 259200000).toISOString(), sentiment_tag: 'Negative', takeaway: 'Could reduce China revenue by $5-8B annually.' },
            { title: 'Jensen Huang Keynote: AI is the New Industrial Revolution', summary: 'CEO paints bold vision at GTC.', source: 'The Verge', category: 'Events', imageUrl: '', articleUrl: 'https://theverge.com', published_at: new Date(Date.now() - 345600000).toISOString(), sentiment_tag: 'Positive', takeaway: 'Strong narrative continues to attract institutional capital.' }
        ]
    },
    TSLA: {
        ticker: 'TSLA',
        overview: {
            ticker: 'TSLA', company_name: 'Tesla, Inc.', current_price: 394.52,
            one_day_return: -1.32, one_week_return: 2.41, one_month_return: 8.76,
            three_month_return: 45.23, one_year_return: 92.18, ytd_change_percent: 22.8,
            sp500_ytd_change_percent: 4.8, sp500_one_month_return: 2.1, sp500_three_month_return: 5.3, sp500_one_year_return: 22.4,
            market_cap: '$1.26T', rating: 'Outperform',
            upside_potential: { percentage: 15.0, timeframe: '12 months' },
            signal: 'Bullish', signal_reasoning: 'Robotaxi catalyst and energy storage growth driving re-rating.',
            confidence_score: 7, confidence_reasoning: 'High conviction on long-term AI/autonomy thesis but near-term delivery concerns.'
        },
        company_profile: {
            symbol: 'TSLA', description: 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems.',
            sector: 'Consumer Cyclical', industry: 'Auto Manufacturers', ceo: 'Elon Musk',
            employees: '140,473', exchange: 'NASDAQ', market_cap: '$1.26T',
            ipo_date: '2010-06-29', country: 'United States',
            trading_status: 'Market Open', status_color: 'green'
        },
        individual_analysis: {
            quad_factor_scores: { technical_score: 7, sentiment_score: 8, risk_alignment_score: 6 },
            quad_factor_score_rationale: {
                technical_summary: 'Strong recovery from lows with bullish momentum. Approaching resistance at $420.',
                sentiment_summary: 'Highly polarized sentiment. Robotaxi and FSD narrative driving bulls.',
                risk_alignment_summary: 'Very high volatility makes this unsuitable for conservative investors.'
            },
            key_levels: { "50_Day_SMA": 365.20, "200_Day_SMA": 298.75, "RSI_Value": 58.3, macd: { macd: 8.92, signal: 6.45, histogram: 2.47 } },
            technical_interpretation: 'Bullish above 200-day SMA. Consolidating near highs with positive MACD.',
            financial_highlights: {
                market_cap: '$1.26T', pe_ratio: '182.5', day_high: 398.20, day_low: 388.40,
                fifty_two_week_high: 424.88, fifty_two_week_low: 138.80,
                avg_volume: '98.5M', dividend_yield: '0%', gross_profit: '$17.9B',
                operating_income: '$8.9B', net_income: '$7.1B', eps: '$2.16'
            },
            strengths: ['Leading EV brand globally', 'FSD and robotaxi potential', 'Energy storage growing 150%+ YoY', 'Manufacturing cost advantages'],
            weaknesses: ['PE ratio of 182x is extremely stretched', 'Margin compression from price cuts', 'CEO distraction risk', 'Growing EV competition globally'],
            trade_strategy: {
                entry_point: '$375.00', stop_loss: '$340.00', target_price: '$450.00',
                expected_return_percent: 20.0,
                reasoning: { entry_rationale: 'Buy at 50-day SMA support.', stop_loss_rationale: 'Below key psychological support.', target_rationale: 'Robotaxi launch catalyst could drive re-rating.' }
            },
            investment_rationale: {
                investment_thesis: 'Tesla is transitioning from an EV company to an AI and robotics platform, with robotaxi as the key catalyst.',
                potential_catalysts: ['Robotaxi service launch', 'FSD licensing to other OEMs', 'Optimus robot commercialization', 'Energy storage mega-projects'],
                key_risks: ['Execution risk on robotaxi timeline', 'Margin pressure from competition', 'Regulatory hurdles for autonomous driving', 'Elon Musk concentration risk'],
                risk_profile_fit_score: 6, risk_profile_fit_analysis: 'Best for aggressive investors with high conviction in AI/autonomy thesis.'
            },
            major_holders: {
                institutional: [
                    { name: 'Vanguard Group', shares: '228M', percentage: '7.1%' },
                    { name: 'BlackRock Inc.', shares: '196M', percentage: '6.1%' },
                    { name: 'State Street', shares: '112M', percentage: '3.5%' }
                ],
                insiders: [
                    { name: 'Elon Musk (CEO)', shares: '411M', percentage: '12.8%' },
                    { name: 'Kimbal Musk (Board)', shares: '600K', percentage: '0.02%' }
                ]
            }
        },
        market_sentiment: {
            key_news_highlights: ['Robotaxi launch planned for Austin', 'Energy storage deployments triple YoY', 'FSD v13 showing major improvements'],
            community_sentiment_summary: 'Highly polarized. Bulls focused on AI/robotaxi, bears on auto fundamentals.',
            market_impact_summary: 'Tesla remains the most debated stock on Wall Street.',
            social_media_summary: [
                { source: 'Twitter/X', author: '@TeslaBull', sentiment: 'Bullish', content: 'Robotaxi is going to be bigger than the iPhone. $TSLA to $600.' },
                { source: 'Reddit r/stocks', author: 'u/SkepticalInvestor', sentiment: 'Bearish', content: 'At 182x PE, you need perfection. One miss and it drops 30%.' },
                { source: 'StockTwits', author: '$TSLA_Watcher', sentiment: 'Neutral', content: 'Waiting for robotaxi launch to confirm thesis before adding.' }
            ],
            community_discussion_highlights: [
                { topic: 'Robotaxi', highlight: 'Austin launch is the make-or-break catalyst.' },
                { topic: 'Competition', highlight: 'BYD and Chinese EVs eating into market share.' }
            ]
        },
        expert_opinions: {
            expert_insights_summary: 'Consensus is divided. Growth investors love the AI story, value investors see extreme overvaluation.',
            wall_street_consensus: [
                { title: 'Robotaxi Revolution', summary: 'Autonomous ride-hailing could be a $10T market by 2030.', consensus_tag: 'Bullish', theme_icon: 'car' },
                { title: 'Energy Storage', summary: 'Megapack business growing faster than EV segment.', consensus_tag: 'Bullish', theme_icon: 'battery' },
                { title: 'Valuation Risk', summary: 'Priced for perfection with limited margin of safety.', consensus_tag: 'Bearish', theme_icon: 'warning' }
            ],
            recent_analyst_actions: [
                { firm_action: 'ARK Invest - Buy', details: 'Robotaxi-driven long-term target', price_target: '$2,600' },
                { firm_action: 'Goldman Sachs - Neutral', details: 'Auto margins under pressure', price_target: '$345' },
                { firm_action: 'JP Morgan - Underweight', details: 'Fundamentals don\'t justify valuation', price_target: '$135' }
            ],
            analyst_ratings_breakdown: { buy: 18, hold: 15, sell: 12 },
            news_sentiment_breakdown: {
                positive: [{ source: 'Electrek', summary: 'Tesla FSD v13 impresses reviewers.' }],
                negative: [{ source: 'CNBC', summary: 'Tesla margins hit lowest level in 4 years.' }],
                neutral: [{ source: 'Reuters', summary: 'Tesla planning new affordable model for 2025.' }]
            },
            price_targets: { high: 2600, low: 85, median: 300 }
        },
        news_sentiment_analysis: {
            overall_sentiment_score: 5.8,
            sentiment_summary: 'Mixed sentiment reflecting polarized views on AI potential vs auto fundamentals.',
            market_impact_summary: 'Stock price driven more by narrative than fundamentals.',
            key_themes: [
                { theme: 'Robotaxi', sentiment_score: 8.0, summary: 'Potential game-changer if execution succeeds.' },
                { theme: 'EV Competition', sentiment_score: -2.5, summary: 'Chinese EVs gaining market share.' },
                { theme: 'Energy Storage', sentiment_score: 7.5, summary: 'Megapack growth is the under-appreciated story.' }
            ]
        },
        related_stocks: [
            { ticker: 'RIVN', name: 'Rivian' }, { ticker: 'NIO', name: 'NIO Inc.' },
            { ticker: 'F', name: 'Ford Motor' }, { ticker: 'GM', name: 'General Motors' }
        ],
        stock_specific_news: [
            { title: 'Tesla Robotaxi Service to Launch in Austin This Summer', summary: 'First commercial autonomous ride-hailing.', source: 'Bloomberg', category: 'Products', imageUrl: '', articleUrl: 'https://bloomberg.com', published_at: new Date().toISOString(), sentiment_tag: 'Bullish', takeaway: 'Key catalyst for re-rating if successful.' },
            { title: 'Tesla Q4 Deliveries Beat Estimates at 495K', summary: 'Stronger than expected demand.', source: 'CNBC', category: 'Earnings', imageUrl: '', articleUrl: 'https://cnbc.com', published_at: new Date(Date.now() - 86400000).toISOString(), sentiment_tag: 'Positive', takeaway: 'Delivery growth stabilizing after price cuts.' },
            { title: 'FSD v13 Achieves 10x Safety Improvement', summary: 'Major autonomous driving milestone.', source: 'Electrek', category: 'Technology', imageUrl: '', articleUrl: 'https://electrek.co', published_at: new Date(Date.now() - 172800000).toISOString(), sentiment_tag: 'Positive', takeaway: 'FSD safety data strengthens regulatory case.' },
            { title: 'Tesla Margins Drop to 17.6% as Price War Continues', summary: 'Profitability pressure.', source: 'Financial Times', category: 'Earnings', imageUrl: '', articleUrl: 'https://ft.com', published_at: new Date(Date.now() - 259200000).toISOString(), sentiment_tag: 'Negative', takeaway: 'Margin compression is the bear case risk.' },
            { title: 'Megapack Energy Storage Deployments Triple Year-Over-Year', summary: 'Energy segment surging.', source: 'Reuters', category: 'Operations', imageUrl: '', articleUrl: 'https://reuters.com', published_at: new Date(Date.now() - 345600000).toISOString(), sentiment_tag: 'Bullish', takeaway: 'Energy storage becoming a significant revenue driver.' }
        ]
    }
};

// Default fallback for any ticker not in database
function generateDefaultAnalysis(ticker: string, riskProfile: RiskProfile): AnalysisResponse {
    const basePrice = 50 + Math.random() * 200;
    const template = STOCK_DATABASE['AAPL'] as AnalysisResponse;

    return {
        ...template,
        ticker: ticker.toUpperCase(),
        user_risk: riskProfile,
        overview: {
            ...template.overview,
            ticker: ticker.toUpperCase(),
            company_name: `${ticker.toUpperCase()} Corp`,
            current_price: +basePrice.toFixed(2),
            one_day_return: +(Math.random() * 4 - 1).toFixed(2),
            one_week_return: +(Math.random() * 6 - 1).toFixed(2),
            one_month_return: +(Math.random() * 12 - 2).toFixed(2),
            three_month_return: +(Math.random() * 20 - 5).toFixed(2),
            one_year_return: +(Math.random() * 40 - 5).toFixed(2),
            ytd_change_percent: +(Math.random() * 15 - 3).toFixed(2),
        },
        individual_analysis: {
            ...template.individual_analysis,
            financial_highlights: {
                ...template.individual_analysis.financial_highlights,
                market_cap: `$${(Math.random() * 500 + 10).toFixed(0)}B`,
            }
        },
        company_profile: {
            ...template.company_profile,
            symbol: ticker.toUpperCase(),
            description: `${ticker.toUpperCase()} Corp is a publicly traded company operating in its sector.`,
            ceo: 'John Smith',
        },
        historical_data: generateHistoricalData(basePrice, 30),
    };
}

// --- Dashboard Mock Data ---

const MOCK_MARKET_INDICES: MarketIndex[] = [
    { name: 'S&P 500', symbol: 'SPX', price: '5,892.45', change: '+42.31', percent_change: '+0.72%', is_positive: true, chart_data: generateSparkline(7, 'up') },
    { name: 'Nasdaq 100', symbol: 'NDX', price: '21,234.67', change: '+185.42', percent_change: '+0.88%', is_positive: true, chart_data: generateSparkline(7, 'up') },
    { name: 'Dow Jones', symbol: 'DJI', price: '43,567.89', change: '-56.23', percent_change: '-0.13%', is_positive: false, chart_data: generateSparkline(7, 'flat') },
    { name: 'VIX', symbol: 'VIX', price: '14.82', change: '-0.45', percent_change: '-2.95%', is_positive: true, chart_data: generateSparkline(7, 'down') }
];

const MOCK_FUNDAMENTALS: MarketFundamentals = {
    gold: { name: 'Gold', price: '$2,784.30', change: '+18.50', trend: 'up', weekly_trend: generateSparkline(7, 'up') },
    silver: { name: 'Silver', price: '$31.42', change: '+0.67', trend: 'up', weekly_trend: generateSparkline(7, 'up') },
    oil: { name: 'Crude Oil', price: '$71.23', change: '-0.89', trend: 'down', weekly_trend: generateSparkline(7, 'down') },
    bitcoin: { name: 'Bitcoin', price: '$104,521', change: '+2,341', trend: 'up', weekly_trend: generateSparkline(7, 'up') }
};

const MOCK_FEATURED_STOCKS: FeaturedStock[] = [
    { ticker: 'NVDA', name: 'NVIDIA', price: '$142.87', change: '+$3.95', percent_change: '+2.84%', is_positive: true, signal: 'Bullish', brief_analysis: 'AI chip demand driving record revenue growth.', technical_indicators: { rsi: 68.7, macd_signal: 'Bullish', trend: 'Uptrend' } },
    { ticker: 'TSLA', name: 'Tesla', price: '$394.52', change: '-$5.28', percent_change: '-1.32%', is_positive: false, signal: 'Neutral', brief_analysis: 'Robotaxi expectations priced in. Watching margins.', technical_indicators: { rsi: 58.3, macd_signal: 'Bullish', trend: 'Uptrend' } },
    { ticker: 'PLTR', name: 'Palantir', price: '$78.43', change: '+$2.12', percent_change: '+2.78%', is_positive: true, signal: 'Bullish', brief_analysis: 'Government AI contracts accelerating growth.', technical_indicators: { rsi: 72.1, macd_signal: 'Bullish', trend: 'Uptrend' } },
    { ticker: 'AMD', name: 'AMD', price: '$118.76', change: '+$1.45', percent_change: '+1.24%', is_positive: true, signal: 'Neutral', brief_analysis: 'MI300X gaining traction but NVIDIA still dominates.', technical_indicators: { rsi: 55.2, macd_signal: 'Neutral', trend: 'Sideways' } }
];

const MOCK_ETF_PERFORMANCE: ETFPerformance[] = [
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF', six_month_return: 12.4, one_year_return: 24.8, price: 587.23 },
    { symbol: 'QQQ', name: 'Invesco QQQ Trust', six_month_return: 15.2, one_year_return: 31.5, price: 518.67 },
    { symbol: 'IWM', name: 'iShares Russell 2000', six_month_return: 5.8, one_year_return: 12.3, price: 224.56 },
    { symbol: 'GLD', name: 'SPDR Gold Shares', six_month_return: 14.6, one_year_return: 28.2, price: 258.34 },
    { symbol: 'USO', name: 'United States Oil Fund', six_month_return: -8.3, one_year_return: -5.1, price: 72.18 }
];

const MOCK_SECTORS: Sector[] = [
    { name: 'Technology', change_percent: 1.52, weight: 32 },
    { name: 'Healthcare', change_percent: 0.84, weight: 13 },
    { name: 'Financials', change_percent: 0.43, weight: 12 },
    { name: 'Consumer Discretionary', change_percent: -0.21, weight: 11 },
    { name: 'Communication Services', change_percent: 1.12, weight: 9 },
    { name: 'Industrials', change_percent: 0.35, weight: 8 },
    { name: 'Energy', change_percent: -0.78, weight: 4 },
    { name: 'Utilities', change_percent: 0.15, weight: 3 }
];

const MOCK_ECONOMIC_CALENDAR: EconomicEvent[] = [
    { date: getUpcomingDate(2), event_name: 'Federal Reserve Interest Rate Decision', impact: 'High', region: 'US' },
    { date: getUpcomingDate(5), event_name: 'Consumer Price Index (CPI)', impact: 'High', region: 'US' },
    { date: getUpcomingDate(8), event_name: 'Non-Farm Payrolls', impact: 'High', region: 'US' },
    { date: getUpcomingDate(10), event_name: 'ECB Interest Rate Decision', impact: 'Medium', region: 'EU' },
    { date: getUpcomingDate(14), event_name: 'Retail Sales Data', impact: 'Medium', region: 'US' }
];

const MOCK_HEADLINES: NewsArticle[] = [
    { title: 'Fed Signals Potential Rate Cut as Inflation Cools', summary: 'Federal Reserve hints at easing monetary policy.', source: 'Bloomberg', category: 'Economy', imageUrl: '', articleUrl: 'https://bloomberg.com', published_at: new Date().toISOString(), sentiment_tag: 'Positive', takeaway: 'Rate cuts would boost equity valuations.', source_logo: 'https://logo.clearbit.com/bloomberg.com' },
    { title: 'AI Spending to Hit $500B in 2025, Report Says', summary: 'Enterprise AI budgets expanding rapidly.', source: 'CNBC', category: 'Technology', imageUrl: '', articleUrl: 'https://cnbc.com', published_at: new Date(Date.now() - 3600000).toISOString(), sentiment_tag: 'Bullish', takeaway: 'AI infrastructure spend accelerating across sectors.', source_logo: 'https://logo.clearbit.com/cnbc.com' },
    { title: 'Bitcoin Surges Past $100K on ETF Inflows', summary: 'Institutional adoption driving crypto rally.', source: 'CoinDesk', category: 'Crypto', imageUrl: '', articleUrl: 'https://coindesk.com', published_at: new Date(Date.now() - 7200000).toISOString(), sentiment_tag: 'Bullish', takeaway: 'ETF approval creating sustained institutional demand.', source_logo: 'https://logo.clearbit.com/coindesk.com' },
    { title: 'US-China Trade Tensions Ease After Diplomatic Meeting', summary: 'Both sides agree to resume talks.', source: 'Reuters', category: 'Geopolitics', imageUrl: '', articleUrl: 'https://reuters.com', published_at: new Date(Date.now() - 14400000).toISOString(), sentiment_tag: 'Positive', takeaway: 'Reduced geopolitical risk supports market sentiment.', source_logo: 'https://logo.clearbit.com/reuters.com' },
    { title: 'European Markets Rally on Strong PMI Data', summary: 'Manufacturing recovery signals economic rebound.', source: 'Financial Times', category: 'Markets', imageUrl: '', articleUrl: 'https://ft.com', published_at: new Date(Date.now() - 28800000).toISOString(), sentiment_tag: 'Positive', takeaway: 'Euro area economy showing signs of recovery.', source_logo: 'https://logo.clearbit.com/ft.com' },
    { title: 'Oil Prices Fall as OPEC+ Considers Output Increase', summary: 'Supply concerns weigh on crude.', source: 'WSJ', category: 'Commodities', imageUrl: '', articleUrl: 'https://wsj.com', published_at: new Date(Date.now() - 43200000).toISOString(), sentiment_tag: 'Negative', takeaway: 'Potential supply increase could pressure oil prices.', source_logo: 'https://logo.clearbit.com/wsj.com' }
];

const MOCK_DASHBOARD_METRICS: DashboardData = {
    sp500_performance: { value: '+0.72%', isPositive: true },
    market_sentiment: {
        us: { social_media: 'Bullish', expert_opinion: 'Moderately Bullish' },
        europe: { social_media: 'Neutral', expert_opinion: 'Cautiously Optimistic' },
        asia: { social_media: 'Bullish', expert_opinion: 'Bullish' }
    }
};

function getUpcomingDate(daysFromNow: number): string {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d.toISOString().split('T')[0];
}

// --- Public API (matches geminiService signatures) ---

export async function getMockStockAnalysis(ticker: string, riskProfile: RiskProfile): Promise<string> {
    await delay(1500); // Simulate API latency

    const upperTicker = ticker.toUpperCase();
    const stockData = STOCK_DATABASE[upperTicker];

    let result: AnalysisResponse;
    if (stockData) {
        result = {
            ...stockData,
            user_risk: riskProfile,
            historical_data: generateHistoricalData(stockData.overview!.current_price, 30),
        } as AnalysisResponse;
    } else {
        result = generateDefaultAnalysis(upperTicker, riskProfile);
    }

    return JSON.stringify(result);
}

export async function getMockDashboardPageData(): Promise<string> {
    await delay(1200);

    const data: DashboardPageData = {
        dashboardMetrics: MOCK_DASHBOARD_METRICS,
        marketIndices: MOCK_MARKET_INDICES,
        topMovers: {
            top_gainers: [
                { ticker: 'SMCI', name: 'Super Micro Computer', price: '$42.56', change: '+$5.23', percent_change: '+14.02%', is_positive: true, chart_data: generateSparkline(7, 'up') },
                { ticker: 'PLTR', name: 'Palantir Technologies', price: '$78.43', change: '+$4.12', percent_change: '+5.54%', is_positive: true, chart_data: generateSparkline(7, 'up') },
                { ticker: 'MSTR', name: 'MicroStrategy', price: '$387.21', change: '+$18.45', percent_change: '+5.01%', is_positive: true, chart_data: generateSparkline(7, 'up') }
            ],
            top_losers: [
                { ticker: 'PFE', name: 'Pfizer Inc.', price: '$25.12', change: '-$1.34', percent_change: '-5.07%', is_positive: false, chart_data: generateSparkline(7, 'down') },
                { ticker: 'BA', name: 'Boeing Co.', price: '$172.45', change: '-$6.78', percent_change: '-3.78%', is_positive: false, chart_data: generateSparkline(7, 'down') },
                { ticker: 'NKE', name: 'Nike Inc.', price: '$71.23', change: '-$2.15', percent_change: '-2.93%', is_positive: false, chart_data: generateSparkline(7, 'down') }
            ],
            most_active: [
                { ticker: 'NVDA', name: 'NVIDIA Corp.', price: '$142.87', change: '+$3.95', percent_change: '+2.84%', is_positive: true, chart_data: generateSparkline(7, 'up') },
                { ticker: 'TSLA', name: 'Tesla Inc.', price: '$394.52', change: '-$5.28', percent_change: '-1.32%', is_positive: false, chart_data: generateSparkline(7, 'flat') },
                { ticker: 'AAPL', name: 'Apple Inc.', price: '$227.63', change: '+$2.79', percent_change: '+1.24%', is_positive: true, chart_data: generateSparkline(7, 'up') }
            ]
        },
        headlines: MOCK_HEADLINES,
        sector_performance: MOCK_SECTORS,
        economic_calendar: MOCK_ECONOMIC_CALENDAR,
        market_fundamentals: MOCK_FUNDAMENTALS,
        featured_stocks: MOCK_FEATURED_STOCKS,
        etf_performance: MOCK_ETF_PERFORMANCE
    };

    return JSON.stringify(data);
}

export async function getMockMarketNews(): Promise<string> {
    await delay(800);
    return JSON.stringify(MOCK_HEADLINES);
}

export async function getMockCurrentStockPrice(ticker: string): Promise<number> {
    await delay(300);
    const prices: Record<string, number> = {
        'AAPL': 227.63, 'NVDA': 142.87, 'TSLA': 394.52, 'MSFT': 441.28,
        'GOOGL': 178.92, 'AMZN': 213.45, 'META': 612.34, 'AMD': 118.76,
        'PLTR': 78.43, 'AVGO': 198.56, 'NFLX': 912.34, 'CRM': 312.45,
        'SPY': 587.23, 'QQQ': 518.67, 'IWM': 224.56,
        'SMCI': 42.56, 'MSTR': 387.21, 'COIN': 267.89,
    };
    return prices[ticker.toUpperCase()] || +(50 + Math.random() * 200).toFixed(2);
}

export async function getMockBatchStockPrices(tickers: string[]): Promise<Record<string, number>> {
    await delay(500);
    const result: Record<string, number> = {};
    for (const t of tickers) {
        result[t] = await getMockCurrentStockPrice(t);
    }
    return result;
}

export async function getMockAIPortfolio(riskProfile: RiskProfile, timeHorizon: string, numStocks: number): Promise<string> {
    await delay(1500);

    const portfolios: Record<RiskProfile, AIPortfolio> = {
        Aggressive: {
            risk_profile: 'Aggressive',
            time_horizon: timeHorizon,
            expected_annual_return: 18.5,
            expected_return_rationale: 'High-growth tech and disruptive sectors provide above-market returns.',
            best_case_return: 35.0,
            best_case_rationale: 'AI boom continues with accelerating enterprise adoption.',
            worst_case_return: -15.0,
            worst_case_rationale: 'Tech correction or recession pulls growth stocks down significantly.',
            rationale: 'This aggressive portfolio targets high-growth sectors with emphasis on AI infrastructure and disruptive technology.',
            stocks: [
                { ticker: 'NVDA', allocation: 25 },
                { ticker: 'TSLA', allocation: 20 },
                { ticker: 'PLTR', allocation: 15 },
                { ticker: 'AMD', allocation: 15 },
                { ticker: 'COIN', allocation: 10 },
                { ticker: 'SMCI', allocation: 10 },
                { ticker: 'MSTR', allocation: 5 }
            ].slice(0, numStocks)
        },
        Moderate: {
            risk_profile: 'Moderate',
            time_horizon: timeHorizon,
            expected_annual_return: 12.0,
            expected_return_rationale: 'Balanced mix of growth and value provides steady risk-adjusted returns.',
            best_case_return: 22.0,
            best_case_rationale: 'Broad market rally with tech and healthcare outperformance.',
            worst_case_return: -8.0,
            worst_case_rationale: 'Mild correction with flight to quality supporting blue-chips.',
            rationale: 'A balanced portfolio combining blue-chip growth with defensive positions for steady returns.',
            stocks: [
                { ticker: 'AAPL', allocation: 20 },
                { ticker: 'MSFT', allocation: 20 },
                { ticker: 'NVDA', allocation: 15 },
                { ticker: 'GOOGL', allocation: 15 },
                { ticker: 'JPM', allocation: 10 },
                { ticker: 'JNJ', allocation: 10 },
                { ticker: 'SPY', allocation: 10 }
            ].slice(0, numStocks)
        },
        Conservative: {
            risk_profile: 'Conservative',
            time_horizon: timeHorizon,
            expected_annual_return: 7.5,
            expected_return_rationale: 'Dividend-focused blue chips with defensive allocation provide stable returns.',
            best_case_return: 14.0,
            best_case_rationale: 'Rate cuts boost dividend stocks and bond proxies.',
            worst_case_return: -3.0,
            worst_case_rationale: 'Defensive positioning limits downside in market selloffs.',
            rationale: 'A conservative income-focused portfolio prioritizing capital preservation and dividend income.',
            stocks: [
                { ticker: 'JNJ', allocation: 20 },
                { ticker: 'PG', allocation: 15 },
                { ticker: 'KO', allocation: 15 },
                { ticker: 'MSFT', allocation: 15 },
                { ticker: 'SPY', allocation: 15 },
                { ticker: 'GLD', allocation: 10 },
                { ticker: 'VZ', allocation: 10 }
            ].slice(0, numStocks)
        }
    };

    return JSON.stringify(portfolios[riskProfile] || portfolios.Moderate);
}

export async function getMockPortfolioAnalysis(holdings: UserHolding[], riskProfile: RiskProfile): Promise<string> {
    await delay(1500);

    const result: PortfolioAnalysisResult = {
        overall_health_score: 7,
        health_summary: 'Your portfolio shows solid diversification with a moderate risk profile. The tech weighting is slightly high but aligned with current market trends.',
        diversification_analysis: 'Portfolio is moderately diversified across 3 sectors. Consider adding healthcare and consumer staples exposure for better risk management.',
        risk_assessment: `For a ${riskProfile} investor, the portfolio carries appropriate risk. Beta is approximately 1.2, suggesting slightly higher volatility than the market.`,
        holdings_analysis: holdings.map(h => ({
            ticker: h.ticker,
            action: h.ticker === 'NVDA' ? 'HOLD' as const : h.ticker === 'TSLA' ? 'REDUCE' as const : 'HOLD' as const,
            rationale: `${h.ticker} is performing in line with expectations. Current position size is appropriate.`,
            suggested_replacement: undefined
        })),
        sector_allocation: [
            { sector: 'Technology', percentage: 55 },
            { sector: 'Consumer Cyclical', percentage: 20 },
            { sector: 'Healthcare', percentage: 10 },
            { sector: 'Financials', percentage: 10 },
            { sector: 'Energy', percentage: 5 }
        ],
        rebalancing_suggestions: [
            'Consider reducing Technology allocation from 55% to 45% for better diversification.',
            'Add 10% allocation to Healthcare sector via a broad ETF like XLV.',
            'Consider adding international exposure through VXUS or similar.',
            'Review individual position sizes - no single holding should exceed 25% of portfolio.'
        ]
    };

    return JSON.stringify(result);
}

export async function getMockMarketPulseData(ticker: string): Promise<string> {
    await delay(800);

    const data: MarketPulseData = {
        overall_summary: `${ticker.toUpperCase()} is showing mixed signals with bullish technical momentum but cautious fundamental outlook. Social sentiment leans positive.`,
        social_posts: [
            { source: 'Twitter/X', author: '@MarketWatcher', sentiment: 'Bullish', content: `${ticker} looking strong here. Technical breakout incoming.` },
            { source: 'Reddit', author: 'u/StockAnalyst99', sentiment: 'Neutral', content: `${ticker} is fairly valued. Not adding but not selling either.` },
            { source: 'StockTwits', author: `$${ticker}_Fan`, sentiment: 'Bullish', content: `Loaded up on ${ticker} dip. This is going higher.` }
        ],
        expert_takes: [
            { source: 'Morgan Stanley', author: 'Adam Jonas', summary: `Maintains Overweight rating on ${ticker}.`, prediction: 'Price target $280' },
            { source: 'Goldman Sachs', author: 'Mark Delaney', summary: `${ticker} well-positioned for growth.`, prediction: 'Buy rating' }
        ]
    };

    return JSON.stringify(data);
}

export async function getMockStockPerformanceData(ticker: string): Promise<string> {
    await delay(500);
    return JSON.stringify({
        one_day_return: +(Math.random() * 4 - 1).toFixed(2),
        one_week_return: +(Math.random() * 6 - 1).toFixed(2),
        one_month_return: +(Math.random() * 10 - 2).toFixed(2),
        one_year_return: +(Math.random() * 40 - 5).toFixed(2)
    });
}

export async function getMockComparisonAnalysis(tickers: string[]): Promise<string> {
    await delay(1000);
    return JSON.stringify({
        overall_summary: `Comparing ${tickers.join(', ')}: Each offers unique risk/reward. Technology leaders show strongest momentum.`,
        winner_for_goals: {
            growth: { ticker: tickers[0], reason: 'Strongest revenue growth trajectory.' },
            value: { ticker: tickers[1] || tickers[0], reason: 'Most attractive valuation metrics.' },
            dividends: { ticker: tickers[tickers.length - 1], reason: 'Highest dividend yield and payout consistency.' }
        },
        key_metric_comparison: [
            { metric: 'P/E Ratio', values: Object.fromEntries(tickers.map((t, i) => [t, 20 + i * 10])) },
            { metric: 'Revenue Growth', values: Object.fromEntries(tickers.map((t, i) => [t, `${15 + i * 5}%`])) },
            { metric: '1Y Return', values: Object.fromEntries(tickers.map((t, i) => [t, `${20 + i * 8}%`])) }
        ],
        sector_performance_summary: 'Technology sector leads with 1.52% gain today.'
    });
}

export async function getMockImageAnalysis(_data: string, _mime: string, prompt: string): Promise<string> {
    await delay(1000);
    return `Mock Analysis: Based on the image provided, here's a simulated analysis response for your prompt: "${prompt}". This is mock data for demonstration purposes. In production, this would be powered by Gemini AI vision capabilities.`;
}

export async function getMockImageEdit(_data: string, _mime: string, _prompt: string): Promise<string> {
    await delay(1000);
    // Return empty string to indicate no image generated (mock mode)
    return '';
}

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
