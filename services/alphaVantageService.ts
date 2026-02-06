
// alphaVantageService.ts - Mock Mode (API key removed)
// All price data now served from mockDataService.ts

export async function getAlphaVantagePrice(_symbol: string): Promise<number | null> {
    return null;
}

export async function getAlphaVantageCommodity(_type: 'GOLD' | 'SILVER' | 'CRUDE_OIL'): Promise<{ price: number } | null> {
    return null;
}
