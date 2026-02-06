
/**
 * This file contains constant data used throughout the application,
 * such as lists of stocks for dropdowns and dashboards.
 */

type StockInfo = { symbol: string; name: string; domain: string; };

export const popularStocks: StockInfo[] = [
    { symbol: 'AAPL', name: 'Apple Inc.', domain: 'apple.com' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', domain: 'microsoft.com' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', domain: 'abc.xyz' },
    { symbol: 'AMZN', name: 'Amazon.com, Inc.', domain: 'amazon.com' },
    { symbol: 'TSLA', name: 'Tesla, Inc.', domain: 'tesla.com' },
    { symbol: 'META', name: 'Meta Platforms, Inc.', domain: 'meta.com' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', domain: 'nvidia.com' },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.', domain: 'jpmorganchase.com' },
    { symbol: 'V', name: 'Visa Inc.', domain: 'visa.com' },
    { symbol: 'WMT', name: 'Walmart Inc.', domain: 'walmart.com' },
];

export const mostOwnedStocks: StockInfo[] = [
    { symbol: 'AAPL', name: 'Apple Inc.', domain: 'apple.com' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', domain: 'microsoft.com' },
    { symbol: 'AMZN', name: 'Amazon.com, Inc.', domain: 'amazon.com' },
    { symbol: 'TSLA', name: 'Tesla, Inc.', domain: 'tesla.com' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', domain: 'abc.xyz' },
    { symbol: 'META', name: 'Meta Platforms, Inc.', domain: 'meta.com' },
    { symbol: 'BRK-B', name: 'Berkshire Hathaway Inc.', domain: 'berkshirehathaway.com' },
    { symbol: 'JNJ', name: 'Johnson & Johnson', domain: 'jnj.com' },
    { symbol: 'V', name: 'Visa Inc.', domain: 'visa.com' },
    { symbol: 'UNH', name: 'UnitedHealth Group Inc.', domain: 'unh.com' },
];

export const mostTradedStocks: StockInfo[] = [
    { symbol: 'TSLA', name: 'Tesla, Inc.', domain: 'tesla.com' },
    { symbol: 'AAPL', name: 'Apple Inc.', domain: 'apple.com' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', domain: 'nvidia.com' },
    { symbol: 'AMD', name: 'Advanced Micro Devices, Inc.', domain: 'amd.com' },
    { symbol: 'AMZN', name: 'Amazon.com, Inc.', domain: 'amazon.com' },
    { symbol: 'META', name: 'Meta Platforms, Inc.', domain: 'meta.com' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', domain: 'abc.xyz' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', domain: 'microsoft.com' },
    { symbol: 'F', name: 'Ford Motor Company', domain: 'ford.com' },
    { symbol: 'PLTR', name: 'Palantir Technologies Inc.', domain: 'palantir.com' },
];

const newAIStocks: StockInfo[] = [
    { symbol: 'PLTR', name: 'Palantir Technologies', domain: 'palantir.com' },
    { symbol: 'AI', name: 'C3.ai Inc.', domain: 'c3.ai' },
    { symbol: 'PATH', name: 'UiPath Inc.', domain: 'uipath.com' },
    { symbol: 'SNOW', name: 'Snowflake Inc.', domain: 'snowflake.com' },
];

export const allStocks: StockInfo[] = [
    ...popularStocks, ...mostOwnedStocks, ...mostTradedStocks, ...newAIStocks,
    { symbol: 'ADBE', name: 'Adobe Inc.', domain: 'adobe.com' },
    { symbol: 'AVGO', name: 'Broadcom Inc.', domain: 'broadcom.com' },
    { symbol: 'BAC', name: 'Bank of America Corp.', domain: 'bankofamerica.com' },
    { symbol: 'CRM', name: 'Salesforce, Inc.', domain: 'salesforce.com' },
    { symbol: 'CSCO', name: 'Cisco Systems, Inc.', domain: 'cisco.com' },
    { symbol: 'CVX', name: 'Chevron Corp.', domain: 'chevron.com' },
    { symbol: 'DIS', name: 'The Walt Disney Co.', domain: 'thewaltdisneycompany.com' },
    { symbol: 'HD', name: 'The Home Depot, Inc.', domain: 'homedepot.com' },
    { symbol: 'IBM', name: 'IBM Corp.', domain: 'ibm.com' },
    { symbol: 'INTC', name: 'Intel Corporation', domain: 'intel.com' },
    { symbol: 'KO', name: 'The Coca-Cola Co.', domain: 'coca-colacompany.com' },
    { symbol: 'LLY', name: 'Eli Lilly and Company', domain: 'lilly.com' },
    { symbol: 'MA', name: 'Mastercard Inc.', domain: 'mastercard.com' },
    { symbol: 'MRK', name: 'Merck & Co., Inc.', domain: 'merck.com' },
    { symbol: 'NFLX', name: 'Netflix, Inc.', domain: 'netflix.com' },
    { symbol: 'NOW', name: 'ServiceNow, Inc.', domain: 'servicenow.com' },
    { symbol: 'ORCL', name: 'Oracle Corp.', domain: 'oracle.com' },
    { symbol: 'PEP', name: 'PepsiCo, Inc.', domain: 'pepsico.com' },
    { symbol: 'PFE', name: 'Pfizer Inc.', domain: 'pfizer.com' },
    { symbol: 'PG', name: 'Procter & Gamble Co.', domain: 'pg.com' },
    { symbol: 'PYPL', name: 'PayPal Holdings, Inc.', domain: 'paypal.com' },
    { symbol: 'QCOM', name: 'QUALCOMM Inc.', domain: 'qualcomm.com' },
    { symbol: 'SBUX', name: 'Starbucks Corporation', domain: 'starbucks.com' },
    { symbol: 'SOFI', name: 'SoFi Technologies, Inc.', domain: 'sofi.com' },
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', domain: 'ssga.com' },
    { symbol: 'T', name: 'AT&T Inc.', domain: 'att.com' },
    { symbol: 'TMUS', name: 'T-Mobile US, Inc.', domain: 't-mobile.com' },
    { symbol: 'TSM', name: 'Taiwan Semiconductor', domain: 'tsmc.com' },
    { symbol: 'VZ', name: 'Verizon Communications Inc.', domain: 'verizon.com' },
    { symbol: 'XOM', name: 'Exxon Mobil Corp.', domain: 'exxonmobil.com' },
    { symbol: 'NKE', name: 'Nike, Inc.', domain: 'nike.com' },
    { symbol: 'UBER', name: 'Uber Technologies, Inc.', domain: 'uber.com' },
    { symbol: 'ABNB', name: 'Airbnb, Inc.', domain: 'airbnb.com' },
    { symbol: 'SHOP', name: 'Shopify Inc.', domain: 'shopify.com' },
    { symbol: 'SPOT', name: 'Spotify Technology S.A.', domain: 'spotify.com' },
    { symbol: 'SQ', name: 'Block, Inc.', domain: 'block.xyz' },
    { symbol: 'CRWD', name: 'CrowdStrike Holdings, Inc.', domain: 'crowdstrike.com' },
    { symbol: 'PANW', name: 'Palo Alto Networks', domain: 'paloaltonetworks.com' },
].sort((a, b) => a.symbol.localeCompare(b.symbol))
 .filter((stock, index, self) => index === self.findIndex((s) => s.symbol === stock.symbol));

 /**
  * Returns a valid URL for a stock logo.
  * Uses parqet.com which is specialized in ticker-to-logo mapping.
  */
 export const getStockLogo = (ticker: string, name?: string): string => {
    if (!ticker) return 'https://ui-avatars.com/api/?name=Stock&background=random';
    
    const cleanTicker = ticker.toUpperCase().replace(/[^A-Z]/g, '');
    // assets.parqet.com is very reliable for stock ticker logos
    return `https://assets.parqet.com/logos/symbol/${cleanTicker}`;
 };
