import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AssetClass } from '@/api/types';

export interface Position {
  assetId: string;
  symbol: string;
  name: string;
  assetClass: AssetClass;
  image: string | null;
  quantity: number;
  avgCost: number;
}

export interface TradeRecord {
  id: string;
  assetId: string;
  symbol: string;
  name: string;
  assetClass: AssetClass;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  total: number;
  timestamp: number;
  realizedPnl: number | null; // set on sells
  source: 'manual' | 'copy';
  copiedFromTraderId?: string;
  copiedFromTraderName?: string;
}

interface AssetRef {
  id: string;
  symbol: string;
  name: string;
  assetClass: AssetClass;
  image: string | null;
}

interface PortfolioState {
  cashBalance: number;
  costBasisCash: number; // cumulative virtual cash ever injected (for return %)
  positions: Record<string, Position>;
  history: TradeRecord[];
  followedTraders: string[];
  copyingTraders: string[];
  hasHydrated: boolean;

  setHasHydrated: (v: boolean) => void;
  setCashBalance: (amount: number) => void;
  resetPortfolio: (startingBalance: number) => void;
  buy: (asset: AssetRef, quantity: number, price: number, source?: 'manual' | 'copy', copiedFrom?: { id: string; name: string }) => { ok: boolean; error?: string };
  sell: (assetId: string, quantity: number, price: number, source?: 'manual' | 'copy', copiedFrom?: { id: string; name: string }) => { ok: boolean; error?: string };
  followTrader: (traderId: string) => void;
  unfollowTrader: (traderId: string) => void;
  toggleCopyTrader: (traderId: string) => void;
}

function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      cashBalance: 100_000,
      costBasisCash: 100_000,
      positions: {},
      history: [],
      followedTraders: [],
      copyingTraders: [],
      hasHydrated: false,

      setHasHydrated: (v) => set({ hasHydrated: v }),

      setCashBalance: (amount) => {
        const clamped = Math.max(0, amount);
        const current = get().cashBalance;
        const delta = clamped - current;
        set({ cashBalance: clamped, costBasisCash: Math.max(0, get().costBasisCash + delta) });
      },

      resetPortfolio: (startingBalance) => {
        const clamped = Math.max(0, startingBalance);
        set({ cashBalance: clamped, costBasisCash: clamped, positions: {}, history: [], copyingTraders: [] });
      },

      buy: (asset, quantity, price, source = 'manual', copiedFrom) => {
        if (quantity <= 0 || price <= 0) return { ok: false, error: 'Invalid quantity or price' };
        const cost = quantity * price;
        const { cashBalance, positions } = get();
        if (cost > cashBalance) return { ok: false, error: 'Insufficient virtual balance' };

        const existing = positions[asset.id];
        const newQuantity = (existing?.quantity ?? 0) + quantity;
        const newAvgCost = existing
          ? (existing.avgCost * existing.quantity + cost) / newQuantity
          : price;

        const trade: TradeRecord = {
          id: genId(),
          assetId: asset.id,
          symbol: asset.symbol,
          name: asset.name,
          assetClass: asset.assetClass,
          side: 'buy',
          quantity,
          price,
          total: cost,
          timestamp: Date.now(),
          realizedPnl: null,
          source,
          copiedFromTraderId: copiedFrom?.id,
          copiedFromTraderName: copiedFrom?.name,
        };

        set({
          cashBalance: cashBalance - cost,
          positions: {
            ...positions,
            [asset.id]: {
              assetId: asset.id,
              symbol: asset.symbol,
              name: asset.name,
              assetClass: asset.assetClass,
              image: asset.image,
              quantity: newQuantity,
              avgCost: newAvgCost,
            },
          },
          history: [trade, ...get().history],
        });
        return { ok: true };
      },

      sell: (assetId, quantity, price, source = 'manual', copiedFrom) => {
        const { positions, cashBalance } = get();
        const existing = positions[assetId];
        if (!existing || quantity <= 0) return { ok: false, error: 'No position to sell' };
        if (quantity > existing.quantity + 1e-9) return { ok: false, error: 'Cannot sell more than you hold' };

        const proceeds = quantity * price;
        const realizedPnl = (price - existing.avgCost) * quantity;
        const remainingQuantity = existing.quantity - quantity;

        const trade: TradeRecord = {
          id: genId(),
          assetId,
          symbol: existing.symbol,
          name: existing.name,
          assetClass: existing.assetClass,
          side: 'sell',
          quantity,
          price,
          total: proceeds,
          timestamp: Date.now(),
          realizedPnl,
          source,
          copiedFromTraderId: copiedFrom?.id,
          copiedFromTraderName: copiedFrom?.name,
        };

        const newPositions = { ...positions };
        if (remainingQuantity <= 1e-9) {
          delete newPositions[assetId];
        } else {
          newPositions[assetId] = { ...existing, quantity: remainingQuantity };
        }

        set({
          cashBalance: cashBalance + proceeds,
          positions: newPositions,
          history: [trade, ...get().history],
        });
        return { ok: true };
      },

      followTrader: (traderId) => {
        const { followedTraders } = get();
        if (followedTraders.includes(traderId)) return;
        set({ followedTraders: [...followedTraders, traderId] });
      },
      unfollowTrader: (traderId) => {
        set({
          followedTraders: get().followedTraders.filter((id) => id !== traderId),
          copyingTraders: get().copyingTraders.filter((id) => id !== traderId),
        });
      },
      toggleCopyTrader: (traderId) => {
        const { copyingTraders } = get();
        set({
          copyingTraders: copyingTraders.includes(traderId)
            ? copyingTraders.filter((id) => id !== traderId)
            : [...copyingTraders, traderId],
        });
      },
    }),
    {
      name: 'portfolio-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
