import { useQuery } from '@tanstack/react-query';

import { fetchCoinCandles, fetchCoinLineChart } from '@/api/coingecko';
import { fetchYahooChart } from '@/api/yahooChart';
import type { ChartData, ChartRange } from '@/api/types';

/** id is the full Asset.id, e.g. "crypto:bitcoin" or "stock:AAPL" */
export function useChartData(id: string, range: ChartRange) {
  const [assetClass, key] = id.split(':') as ['crypto' | 'stock', string];

  return useQuery<ChartData>({
    queryKey: ['chart', id, range],
    queryFn: async () => {
      if (assetClass === 'crypto') {
        const [candles, line] = await Promise.all([fetchCoinCandles(key, range), fetchCoinLineChart(key, range)]);
        return { candles, line };
      }
      const { candles, line } = await fetchYahooChart(key, range);
      return { candles, line };
    },
    staleTime: 30_000,
    refetchInterval: range === '1D' ? 30_000 : false,
  });
}
