
// polygonService.ts - Mock Mode (API key removed)
// All price data now served from mockDataService.ts

export async function getPolygonPrice(_ticker: string): Promise<number | null> {
    return null;
}

export async function getBatchPolygonPrices(_tickers: string[]): Promise<Record<string, number>> {
    return {};
}
