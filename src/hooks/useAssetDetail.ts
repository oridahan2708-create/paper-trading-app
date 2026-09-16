import { useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchCoinsByIds } from '@/api/coingecko';
import type { StockSymbol } from '@/api/finnhub';
import { fetchQuote, quoteToAsset } from '@/api/finnhub';
import { fetchStockChangeStats } from '@/api/yahooChart';
import type { Asset } from '@/api/types';

export function useAssetDetail(id: string | undefined) {
  const [assetClass, key] = (id ?? '').split(':') as ['crypto' | 'stock', string];
  const queryClient = useQueryClient();

  return useQuery<Asset>({
    queryKey: ['assetDetail', id],
    queryFn: async () => {
      if (assetClass === 'crypto') {
        const [asset] = await fetchCoinsByIds([key]);
        if (!asset) throw new Error('Coin not found');
        return asset;
      }
      const cachedSymbols = queryClient.getQueryData<StockSymbol[]>(['stocks', 'symbols']);
      const description = cachedSymbols?.find((s) => s.symbol === key)?.description ?? key;

      const [quote, stats] = await Promise.all([fetchQuote(key), fetchStockChangeStats(key)]);
      const asset = quoteToAsset(key, description, quote);
      return { ...asset, change24h: stats.change24h ?? asset.change24h, change7d: stats.change7d, change30d: stats.change30d };
    },
    enabled: Boolean(id),
    refetchInterval: 15_000,
  });
}
