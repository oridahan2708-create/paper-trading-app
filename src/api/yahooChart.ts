import { Platform } from 'react-native';

import { YAHOO_RANGE_TO_PARAMS as RANGE_TO_PARAMS } from './chartRanges';
import type { CandlePoint, ChartRange, LinePoint } from './types';

// Yahoo Finance's public chart endpoint. No API key required. Used as the
// historical price source for stocks (candles, line chart, and to derive
// 7d/30d % change), since Finnhub's free tier restricts historical candles.
//
// This endpoint sends no CORS headers, so a browser blocks it outright —
// unlike React Native's native fetch, which isn't subject to CORS. On web,
// requests go through the same-origin proxy at app/api/yahoo-chart+api.ts.
const BASE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart';

interface YahooChartResponse {
  chart: {
    result: [
      {
        meta: { regularMarketPrice: number; previousClose?: number; chartPreviousClose?: number };
        timestamp: number[];
        indicators: {
          quote: [{ open: number[]; high: number[]; low: number[]; close: number[] }];
        };
      },
    ] | null;
    error: { code: string; description: string } | null;
  };
}

export interface YahooChartResult {
  candles: CandlePoint[];
  line: LinePoint[];
  latestPrice: number | null;
  previousClose: number | null;
}

export async function fetchYahooChart(symbol: string, range: ChartRange): Promise<YahooChartResult> {
  let url: string;
  if (Platform.OS === 'web') {
    const params = new URLSearchParams({ symbol, range });
    url = `/api/yahoo-chart?${params.toString()}`;
  } else {
    const { range: r, interval } = RANGE_TO_PARAMS[range];
    const params = new URLSearchParams({ range: r, interval, includePrePost: 'false' });
    url = `${BASE_URL}/${encodeURIComponent(symbol)}?${params.toString()}`;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Yahoo Finance chart request failed (${res.status})`);
  const data = (await res.json()) as YahooChartResponse;
  const result = data.chart.result?.[0];
  if (!result) throw new Error(data.chart.error?.description ?? 'No chart data returned');

  const { timestamp, indicators } = result;
  const q = indicators.quote[0];
  const candles: CandlePoint[] = [];
  const line: LinePoint[] = [];
  for (let i = 0; i < timestamp.length; i++) {
    const close = q.close[i];
    if (close == null) continue;
    const time = timestamp[i] * 1000;
    candles.push({ time, open: q.open[i] ?? close, high: q.high[i] ?? close, low: q.low[i] ?? close, close });
    line.push({ time, value: close });
  }

  return {
    candles,
    line,
    latestPrice: result.meta.regularMarketPrice ?? null,
    previousClose: result.meta.previousClose ?? result.meta.chartPreviousClose ?? null,
  };
}

/** Derives 24h/7d/30d % change from ~35 daily closes (one request covers all three). */
export async function fetchStockChangeStats(symbol: string): Promise<{
  change24h: number | null;
  change7d: number | null;
  change30d: number | null;
}> {
  const { candles, latestPrice } = await fetchYahooChart(symbol, '3M');
  if (candles.length === 0) return { change24h: null, change7d: null, change30d: null };

  const last = latestPrice ?? candles[candles.length - 1].close;
  const closeNDaysAgo = (n: number) => {
    const idx = candles.length - 1 - n;
    return idx >= 0 ? candles[idx].close : null;
  };
  const pctChange = (from: number | null) => (from ? ((last - from) / from) * 100 : null);

  return {
    change24h: pctChange(closeNDaysAgo(1)),
    change7d: pctChange(closeNDaysAgo(5)), // ~5 trading days
    change30d: pctChange(closeNDaysAgo(21)), // ~21 trading days
  };
}
