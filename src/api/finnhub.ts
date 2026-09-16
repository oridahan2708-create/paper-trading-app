import type { Asset, ChartRange } from './types';

const BASE_URL = 'https://finnhub.io/api/v1';
const API_KEY = process.env.EXPO_PUBLIC_FINNHUB_API_KEY;

export class MissingApiKeyError extends Error {
  constructor(provider: string) {
    super(`Missing API key for ${provider}. Add it to your .env file — see README setup instructions.`);
    this.name = 'MissingApiKeyError';
  }
}

function requireKey(): string {
  if (!API_KEY) throw new MissingApiKeyError('Finnhub');
  return API_KEY;
}

async function finnhubFetch<T>(path: string): Promise<T> {
  const key = requireKey();
  const sep = path.includes('?') ? '&' : '?';
  const res = await fetch(`${BASE_URL}${path}${sep}token=${key}`);
  if (!res.ok) {
    if (res.status === 429) throw new Error('Finnhub rate limit hit — please wait a moment and try again.');
    throw new Error(`Finnhub request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export interface StockSymbol {
  symbol: string;
  displaySymbol: string;
  description: string;
  type: string;
}

/** Full US exchange symbol list — thousands of tickers, not a shortlist. */
export async function fetchUSStockSymbols(): Promise<StockSymbol[]> {
  const raw = await finnhubFetch<
    { symbol: string; displaySymbol: string; description: string; type: string }[]
  >('/stock/symbol?exchange=US');
  return raw
    .filter((s) => s.symbol && s.description)
    .map((s) => ({ symbol: s.symbol, displaySymbol: s.displaySymbol, description: s.description, type: s.type }));
}

export async function searchStocks(query: string): Promise<StockSymbol[]> {
  if (!query.trim()) return [];
  const raw = await finnhubFetch<{ result: { symbol: string; displaySymbol: string; description: string; type: string }[] }>(
    `/search?q=${encodeURIComponent(query)}`
  );
  return raw.result
    .filter((s) => !s.symbol.includes('.'))
    .map((s) => ({ symbol: s.symbol, displaySymbol: s.displaySymbol, description: s.description, type: s.type }));
}

export interface FinnhubQuote {
  c: number; // current price
  d: number; // change
  dp: number; // percent change
  h: number;
  l: number;
  o: number;
  pc: number; // previous close
  t: number;
}

export async function fetchQuote(symbol: string): Promise<FinnhubQuote> {
  return finnhubFetch<FinnhubQuote>(`/quote?symbol=${encodeURIComponent(symbol)}`);
}

const RANGE_TO_DAYS: Record<ChartRange, number> = {
  '1D': 1,
  '1W': 7,
  '1M': 30,
  '3M': 90,
  '1Y': 365,
};

export function rangeToDays(range: ChartRange): number {
  return RANGE_TO_DAYS[range];
}

export function quoteToAsset(symbol: string, description: string, quote: FinnhubQuote): Asset {
  return {
    id: `stock:${symbol}`,
    symbol,
    name: description,
    assetClass: 'stock',
    price: quote.c,
    change24h: quote.pc ? ((quote.c - quote.pc) / quote.pc) * 100 : quote.dp ?? null,
    change7d: null,
    change30d: null,
    marketCap: null,
    volume24h: null,
    image: null,
    rank: null,
  };
}
