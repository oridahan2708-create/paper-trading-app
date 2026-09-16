import { useQueries } from '@tanstack/react-query';

import { fetchQuote, quoteToAsset } from '@/api/finnhub';
import { SPOTLIGHT_STOCK_SYMBOLS } from '@/data/spotlightStocks';
import type { Asset } from '@/api/types';

export function useSpotlightStocks() {
  const queries = useQueries({
    queries: SPOTLIGHT_STOCK_SYMBOLS.map((symbol) => ({
      queryKey: ['stocks', 'quote', symbol],
      queryFn: () => fetchQuote(symbol),
      refetchInterval: 30_000,
      staleTime: 15_000,
    })),
  });

  const assets: Asset[] = SPOTLIGHT_STOCK_SYMBOLS.map((symbol, i) => {
    const quote = queries[i]?.data;
    if (!quote) return null;
    return quoteToAsset(symbol, symbol, quote);
  }).filter((a): a is Asset => a !== null);

  const isLoading = queries.some((q) => q.isLoading);

  return { assets, isLoading };
}
