import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { fetchCoinMarketsPage, searchCoins, fetchCoinsByIds } from '@/api/coingecko';
import type { Asset } from '@/api/types';

export function useCryptoMarkets() {
  return useInfiniteQuery({
    queryKey: ['crypto', 'markets'],
    queryFn: ({ pageParam }) => fetchCoinMarketsPage(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => (lastPage.length === 0 ? undefined : pages.length + 1),
    refetchInterval: 30_000,
    select: (data) => data.pages.flat(),
  });
}

export function useCryptoSearch(query: string) {
  return useQuery({
    queryKey: ['crypto', 'search', query],
    queryFn: async (): Promise<Asset[]> => {
      const results = await searchCoins(query);
      const ids = results.slice(0, 25).map((r) => r.id);
      return fetchCoinsByIds(ids);
    },
    enabled: query.trim().length > 0,
    staleTime: 15_000,
  });
}
