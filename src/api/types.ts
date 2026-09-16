export type AssetClass = 'crypto' | 'stock';

export interface Asset {
  id: string; // "crypto:bitcoin" | "stock:AAPL"
  symbol: string;
  name: string;
  assetClass: AssetClass;
  price: number;
  change24h: number | null;
  change7d: number | null;
  change30d: number | null;
  marketCap: number | null;
  volume24h: number | null;
  image: string | null;
  rank: number | null;
}

export interface CandlePoint {
  time: number; // unix ms
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface LinePoint {
  time: number; // unix ms
  value: number;
}

export interface ChartData {
  candles: CandlePoint[];
  line: LinePoint[];
}

export type ChartRange = '1D' | '1W' | '1M' | '3M' | '1Y';
