
/**
 * geminiService.ts - Mock Mode
 *
 * All external API calls (Gemini, Polygon, AlphaVantage, GoldAPI) have been replaced
 * with mock data for local development and demonstration purposes.
 * Supabase auth/database remains connected.
 */

import type { RiskProfile, AnalysisResponse, UserHolding } from '../types';
import {
    getMockStockAnalysis,
    getMockDashboardPageData,
    getMockMarketNews,
    getMockCurrentStockPrice,
    getMockBatchStockPrices,
    getMockAIPortfolio,
    getMockPortfolioAnalysis,
    getMockComparisonAnalysis,
    getMockMarketPulseData,
    getMockStockPerformanceData,
    getMockImageAnalysis,
    getMockImageEdit
} from './mockDataService';

export async function getStockAnalysis(ticker: string, riskProfile: RiskProfile): Promise<string> {
    return getMockStockAnalysis(ticker, riskProfile);
}

export async function getDashboardPageData(): Promise<string> {
    return getMockDashboardPageData();
}

export async function getAIPortfolioForProfile(riskProfile: RiskProfile, timeHorizon: string, numStocks: number): Promise<string> {
    return getMockAIPortfolio(riskProfile, timeHorizon, numStocks);
}

export async function getCurrentStockPrice(ticker: string): Promise<number> {
    return getMockCurrentStockPrice(ticker);
}

export async function getBatchStockPrices(tickers: string[]): Promise<Record<string, number>> {
    return getMockBatchStockPrices(tickers);
}

export async function getMarketNews(): Promise<string> {
    return getMockMarketNews();
}

export async function analyzeUserPortfolio(holdings: UserHolding[], riskProfile: RiskProfile): Promise<string> {
    return getMockPortfolioAnalysis(holdings, riskProfile);
}

export async function getComparisonAnalysis(analyses: AnalysisResponse[]): Promise<string> {
    return getMockComparisonAnalysis(analyses.map(a => a.ticker));
}

export async function getMarketPulseData(ticker: string): Promise<string> {
    return getMockMarketPulseData(ticker);
}

export async function getStockPerformanceData(ticker: string): Promise<string> {
    return getMockStockPerformanceData(ticker);
}

export async function analyzeImage(data: string, mime: string, prompt: string): Promise<string> {
    return getMockImageAnalysis(data, mime, prompt);
}

export async function editImage(data: string, mime: string, prompt: string): Promise<string> {
    return getMockImageEdit(data, mime, prompt);
}
