import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchUSStockSymbols, fetchQuote, quoteToAsset, searchStocks, type StockSymbol } from '@/api/finnhub';
import { fetchStockChangeStats } from '@/api/yahooChart';
import type { Asset } from '@/api/types';

/** Full US symbol list (thousands of tickers). Cached for a day — the list itself rarely changes. */
export function useStockSymbols() {
  return useQuery({
    queryKey: ['stocks', 'symbols'],
    queryFn: fetchUSStockSymbols,
    staleTime: 24 * 60 * 60_000,
    gcTime: 24 * 60 * 60_000,
  });
}

export function useStockSearch(query: string) {
  return useQuery({
    queryKey: ['stocks', 'search', query],
    queryFn: () => searchStocks(query),
    enabled: query.trim().length > 0,
    staleTime: 30_000,
  });
}

/** Live quote for a single stock symbol, polled while the row is mounted (visible). */
export function useStockQuote(symbol: string, description: string, enabled = true) {
  return useQuery({
    queryKey: ['stocks', 'quote', symbol],
    queryFn: async (): Promise<Asset> => {
      const quote = await fetchQuote(symbol);
      return quoteToAsset(symbol, description, quote);
    },
    enabled,
    refetchInterval: 15_000,
    staleTime: 10_000,
  });
}

/** 24h/7d/30d % change history for a stock, derived from daily closes. Changes slowly — cached longer. */
export function useStockChangeStats(symbol: string, enabled = true) {
  return useQuery({
    queryKey: ['stocks', 'changeStats', symbol],
    queryFn: () => fetchStockChangeStats(symbol),
    enabled,
    staleTime: 5 * 60_000,
  });
}

export function useEnrichedStockAsset(stock: StockSymbol, enabled = true) {
  const quote = useStockQuote(stock.symbol, stock.description, enabled);
  const stats = useStockChangeStats(stock.symbol, enabled);

  const asset = useMemo((): Asset | undefined => {
    if (!quote.data) return undefined;
    return {
      ...quote.data,
      change24h: stats.data?.change24h ?? quote.data.change24h,
      change7d: stats.data?.change7d ?? null,
      change30d: stats.data?.change30d ?? null,
    };
  }, [quote.data, stats.data]);

  return { asset, isLoading: quote.isLoading, error: quote.error };
}
