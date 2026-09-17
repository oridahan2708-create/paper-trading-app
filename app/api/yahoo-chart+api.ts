import { YAHOO_RANGE_TO_PARAMS, isSafeStockSymbol } from '@/api/chartRanges';
import { cachedProxyFetch } from '@/server/proxyCache';
import type { ChartRange } from '@/api/types';

// Yahoo Finance's public chart endpoint does not send CORS headers, so a
// browser blocks it when called directly (unlike React Native's fetch on
// iOS/Android, which isn't subject to CORS). This route re-fetches it
// server-side and hands the JSON back same-origin. See src/api/yahooChart.ts.
const UPSTREAM_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const symbol = (url.searchParams.get('symbol') ?? '').toUpperCase();
  const range = url.searchParams.get('range') as ChartRange | null;

  if (!isSafeStockSymbol(symbol)) {
    return Response.json({ error: 'Invalid symbol' }, { status: 400 });
  }
  if (!range || !(range in YAHOO_RANGE_TO_PARAMS)) {
    return Response.json({ error: 'Invalid range' }, { status: 400 });
  }

  const { range: r, interval } = YAHOO_RANGE_TO_PARAMS[range];
  const params = new URLSearchParams({ range: r, interval, includePrePost: 'false' });
  const upstreamUrl = `${UPSTREAM_BASE}/${encodeURIComponent(symbol)}?${params.toString()}`;

  return cachedProxyFetch(`yahoo:${symbol}:${range}`, 30_000, upstreamUrl);
}
