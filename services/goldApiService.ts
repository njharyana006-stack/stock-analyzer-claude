
// goldApiService.ts - Mock Mode (API key removed)
// All price data now served from mockDataService.ts

export async function getMetalPrice(_symbol: 'XAU' | 'XAG'): Promise<{ price: number, change: number, chp: number } | null> {
    return null;
}
