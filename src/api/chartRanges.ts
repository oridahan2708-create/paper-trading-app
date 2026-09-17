import type { ChartRange } from './types';

/** Shared by the client-side Yahoo fetch (native) and the /api/yahoo-chart proxy (web). */
export const YAHOO_RANGE_TO_PARAMS: Record<ChartRange, { range: string; interval: string }> = {
  '1D': { range: '1d', interval: '5m' },
  '1W': { range: '5d', interval: '30m' },
  '1M': { range: '1mo', interval: '1d' },
  '3M': { range: '3mo', interval: '1d' },
  '1Y': { range: '1y', interval: '1wk' },
};

/** Stock ticker symbols are short and made of letters/digits/.- (e.g. BRK.B) — reject anything else. */
export function isSafeStockSymbol(symbol: string): boolean {
  return /^[A-Z0-9.-]{1,10}$/.test(symbol);
}
