import { useQueries, useQuery } from '@tanstack/react-query';

import { fetchCoinsByIds } from '@/api/coingecko';
import { fetchQuote } from '@/api/finnhub';
import type { Asset } from '@/api/types';

/**
 * Given a list of full Asset ids ("crypto:bitcoin" | "stock:AAPL"), returns a
 * map of id -> latest live price, polling continuously. Used to value
 * portfolio positions against real, moving market prices.
 */
export function useLivePrices(ids: string[]) {
  const cryptoIds = ids.filter((id) => id.startsWith('crypto:')).map((id) => id.slice('crypto:'.length));
  const stockSymbols = ids.filter((id) => id.startsWith('stock:')).map((id) => id.slice('stock:'.length));

  const cryptoQuery = useQuery({
    queryKey: ['livePrices', 'crypto', cryptoIds.sort().join(',')],
    queryFn: () => fetchCoinsByIds(cryptoIds),
    enabled: cryptoIds.length > 0,
    refetchInterval: 20_000,
  });

  const stockQueries = useQueries({
    queries: stockSymbols.map((symbol) => ({
      queryKey: ['livePrices', 'stock', symbol],
      queryFn: () => fetchQuote(symbol),
      refetchInterval: 15_000,
      staleTime: 10_000,
    })),
  });

  const prices: Record<string, { price: number; change24h: number | null }> = {};
  (cryptoQuery.data ?? []).forEach((asset: Asset) => {
    prices[asset.id] = { price: asset.price, change24h: asset.change24h };
  });
  stockSymbols.forEach((symbol, i) => {
    const q = stockQueries[i]?.data;
    if (q) {
      prices[`stock:${symbol}`] = { price: q.c, change24h: q.pc ? ((q.c - q.pc) / q.pc) * 100 : null };
    }
  });

  const isLoading = cryptoQuery.isLoading || stockQueries.some((q) => q.isLoading);

  return { prices, isLoading };
}
