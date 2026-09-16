import type { Asset, CandlePoint, ChartRange, LinePoint } from './types';

const BASE_URL = 'https://api.coingecko.com/api/v3';

// Optional free CoinGecko "Demo" API key. Unauthenticated requests work too,
// just with a lower rate limit. See README for how to get one.
const API_KEY = process.env.EXPO_PUBLIC_COINGECKO_API_KEY;

function withKey(url: string): string {
  if (!API_KEY) return url;
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}x_cg_demo_api_key=${API_KEY}`;
}

async function cgFetch<T>(path: string): Promise<T> {
  const res = await fetch(withKey(`${BASE_URL}${path}`));
  if (!res.ok) {
    if (res.status === 429) {
      throw new Error('CoinGecko rate limit hit — please wait a moment and try again.');
    }
    throw new Error(`CoinGecko request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

interface CoinMarketRaw {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number | null;
  total_volume: number;
  price_change_percentage_24h_in_currency: number | null;
  price_change_percentage_7d_in_currency: number | null;
  price_change_percentage_30d_in_currency: number | null;
}

function mapCoin(raw: CoinMarketRaw): Asset {
  return {
    id: `crypto:${raw.id}`,
    symbol: raw.symbol.toUpperCase(),
    name: raw.name,
    assetClass: 'crypto',
    price: raw.current_price,
    change24h: raw.price_change_percentage_24h_in_currency ?? null,
    change7d: raw.price_change_percentage_7d_in_currency ?? null,
    change30d: raw.price_change_percentage_30d_in_currency ?? null,
    marketCap: raw.market_cap ?? null,
    volume24h: raw.total_volume ?? null,
    image: raw.image ?? null,
    rank: raw.market_cap_rank ?? null,
  };
}

/**
 * Fetches one page of the full CoinGecko market list (up to 250 per page),
 * ordered by market cap. Covers major coins and long-tail meme coins alike —
 * not a curated shortlist.
 */
export async function fetchCoinMarketsPage(page: number, perPage = 250): Promise<Asset[]> {
  const params = new URLSearchParams({
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: String(perPage),
    page: String(page),
    sparkline: 'false',
    price_change_percentage: '24h,7d,30d',
  });
  const raw = await cgFetch<CoinMarketRaw[]>(`/coins/markets?${params.toString()}`);
  return raw.map(mapCoin);
}

export async function searchCoins(query: string): Promise<{ id: string; symbol: string; name: string; thumb: string }[]> {
  if (!query.trim()) return [];
  const raw = await cgFetch<{ coins: { id: string; symbol: string; name: string; thumb: string }[] }>(
    `/search?query=${encodeURIComponent(query)}`
  );
  return raw.coins;
}

export async function fetchCoinsByIds(ids: string[]): Promise<Asset[]> {
  if (ids.length === 0) return [];
  const params = new URLSearchParams({
    vs_currency: 'usd',
    ids: ids.join(','),
    order: 'market_cap_desc',
    per_page: String(ids.length),
    page: '1',
    sparkline: 'false',
    price_change_percentage: '24h,7d,30d',
  });
  const raw = await cgFetch<CoinMarketRaw[]>(`/coins/markets?${params.toString()}`);
  return raw.map(mapCoin);
}

const RANGE_TO_DAYS: Record<ChartRange, number> = {
  '1D': 1,
  '1W': 7,
  '1M': 30,
  '3M': 90,
  '1Y': 365,
};

export async function fetchCoinLineChart(coinId: string, range: ChartRange): Promise<LinePoint[]> {
  const days = RANGE_TO_DAYS[range];
  const raw = await cgFetch<{ prices: [number, number][] }>(
    `/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
  );
  return raw.prices.map(([time, value]) => ({ time, value }));
}

export async function fetchCoinCandles(coinId: string, range: ChartRange): Promise<CandlePoint[]> {
  const days = RANGE_TO_DAYS[range];
  const raw = await cgFetch<[number, number, number, number, number][]>(
    `/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`
  );
  return raw.map(([time, open, high, low, close]) => ({ time, open, high, low, close }));
}
