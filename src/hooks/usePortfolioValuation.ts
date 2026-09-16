import { useMemo } from 'react';

import { useLivePrices } from './useLivePrices';
import { usePortfolioStore } from '@/store/portfolioStore';

export interface ValuedPosition {
  assetId: string;
  symbol: string;
  name: string;
  image: string | null;
  quantity: number;
  avgCost: number;
  currentPrice: number;
  change24h: number | null;
  marketValue: number;
  costValue: number;
  unrealizedPnl: number;
  unrealizedPnlPct: number;
}

export function usePortfolioValuation() {
  const positions = usePortfolioStore((s) => s.positions);
  const cashBalance = usePortfolioStore((s) => s.cashBalance);
  const costBasisCash = usePortfolioStore((s) => s.costBasisCash);

  const positionList = useMemo(() => Object.values(positions), [positions]);
  const ids = useMemo(() => positionList.map((p) => p.assetId), [positionList]);
  const { prices, isLoading } = useLivePrices(ids);

  const valuedPositions = useMemo((): ValuedPosition[] => {
    return positionList.map((p) => {
      const live = prices[p.assetId];
      const currentPrice = live?.price ?? p.avgCost;
      const marketValue = currentPrice * p.quantity;
      const costValue = p.avgCost * p.quantity;
      const unrealizedPnl = marketValue - costValue;
      return {
        assetId: p.assetId,
        symbol: p.symbol,
        name: p.name,
        image: p.image,
        quantity: p.quantity,
        avgCost: p.avgCost,
        currentPrice,
        change24h: live?.change24h ?? null,
        marketValue,
        costValue,
        unrealizedPnl,
        unrealizedPnlPct: costValue > 0 ? (unrealizedPnl / costValue) * 100 : 0,
      };
    });
  }, [positionList, prices]);

  const positionsValue = valuedPositions.reduce((sum, p) => sum + p.marketValue, 0);
  const totalValue = cashBalance + positionsValue;
  const totalReturn = totalValue - costBasisCash;
  const totalReturnPct = costBasisCash > 0 ? (totalReturn / costBasisCash) * 100 : 0;

  return {
    valuedPositions,
    positionsValue,
    cashBalance,
    totalValue,
    totalReturn,
    totalReturnPct,
    isPricesLoading: isLoading,
  };
}
