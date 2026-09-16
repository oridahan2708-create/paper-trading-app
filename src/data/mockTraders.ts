import type { AssetClass } from '@/api/types';

// All trader profiles, trades, and stats below are simulated demo data for
// showcasing the social/copy-trading UI. They are not real people or real
// trading records.

export interface MockHolding {
  assetId: string; // "crypto:bitcoin" | "stock:AAPL"
  symbol: string;
  name: string;
  assetClass: AssetClass;
  image: string | null;
  weightPct: number; // portfolio allocation weight, sums to ~100 per trader
}

export interface MockTrade {
  id: string;
  traderId: string;
  assetId: string;
  symbol: string;
  name: string;
  assetClass: AssetClass;
  image: string | null;
  side: 'buy' | 'sell';
  price: number;
  quantity: number;
  minutesAgo: number;
  note?: string;
}

export interface MockTrader {
  id: string;
  name: string;
  handle: string;
  initials: string;
  avatarColor: string;
  bio: string;
  focus: string[];
  verified: boolean;
  followers: number;
  winRate: number;
  totalReturnPct: number;
  return30dPct: number;
  volumeTraded: number;
  equityCurve: number[]; // normalized 0-100 index for sparkline, 60 points
}

function makeCoinRef(id: string, symbol: string, name: string) {
  return {
    assetId: `crypto:${id}`,
    symbol: symbol.toUpperCase(),
    name,
    assetClass: 'crypto' as AssetClass,
    image: null as string | null,
  };
}

function makeStockRef(symbol: string, name: string) {
  return {
    assetId: `stock:${symbol}`,
    symbol,
    name,
    assetClass: 'stock' as AssetClass,
    image: null as string | null,
  };
}

const ASSETS = {
  btc: makeCoinRef('bitcoin', 'BTC', 'Bitcoin'),
  eth: makeCoinRef('ethereum', 'ETH', 'Ethereum'),
  sol: makeCoinRef('solana', 'SOL', 'Solana'),
  doge: makeCoinRef('dogecoin', 'DOGE', 'Dogecoin'),
  shib: makeCoinRef('shiba-inu', 'SHIB', 'Shiba Inu'),
  pepe: makeCoinRef('pepe', 'PEPE', 'Pepe'),
  xrp: makeCoinRef('ripple', 'XRP', 'XRP'),
  ada: makeCoinRef('cardano', 'ADA', 'Cardano'),
  link: makeCoinRef('chainlink', 'LINK', 'Chainlink'),
  ltc: makeCoinRef('litecoin', 'LTC', 'Litecoin'),
  aapl: makeStockRef('AAPL', 'Apple Inc.'),
  tsla: makeStockRef('TSLA', 'Tesla Inc.'),
  nvda: makeStockRef('NVDA', 'NVIDIA Corp.'),
  msft: makeStockRef('MSFT', 'Microsoft Corp.'),
  amzn: makeStockRef('AMZN', 'Amazon.com Inc.'),
  googl: makeStockRef('GOOGL', 'Alphabet Inc.'),
  meta: makeStockRef('META', 'Meta Platforms Inc.'),
  amd: makeStockRef('AMD', 'Advanced Micro Devices'),
  coin: makeStockRef('COIN', 'Coinbase Global'),
  pltr: makeStockRef('PLTR', 'Palantir Technologies'),
};

function buildEquityCurve(totalReturnPct: number, points = 60, volatility = 3): number[] {
  const curve: number[] = [100];
  const growthPerStep = totalReturnPct / points;
  let seed = totalReturnPct * 97 + points; // deterministic pseudo-random
  for (let i = 1; i < points; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    const noise = (seed / 233280 - 0.5) * volatility;
    const prev = curve[i - 1];
    curve.push(Math.max(5, prev * (1 + growthPerStep / 100) + noise));
  }
  return curve;
}

export const MOCK_TRADERS: MockTrader[] = [
  {
    id: 'trader-nova',
    name: 'Nova Reyes',
    handle: '@novatrades',
    initials: 'NR',
    avatarColor: '#6E5BFF',
    bio: 'Momentum swing trader focused on large-cap tech and AI names. 6 years trading, ex-analyst.',
    focus: ['Stocks', 'AI', 'Momentum'],
    verified: true,
    followers: 48200,
    winRate: 68,
    totalReturnPct: 142.5,
    return30dPct: 18.2,
    volumeTraded: 2_450_000,
    equityCurve: buildEquityCurve(142.5),
  },
  {
    id: 'trader-crypto-kai',
    name: 'Kai Lindqvist',
    handle: '@kaicrypto',
    initials: 'KL',
    avatarColor: '#00D1FF',
    bio: 'Full-time crypto trader. Loves majors + high-conviction meme coin runs. DYOR always.',
    focus: ['Crypto', 'Meme Coins'],
    verified: true,
    followers: 91300,
    winRate: 54,
    totalReturnPct: 310.8,
    return30dPct: -6.4,
    volumeTraded: 5_120_000,
    equityCurve: buildEquityCurve(310.8, 60, 6),
  },
  {
    id: 'trader-priya',
    name: 'Priya Chandran',
    handle: '@priyainvests',
    initials: 'PC',
    avatarColor: '#1FD97C',
    bio: 'Long-term value investor. Dividend growth + blue chips. Slow and steady.',
    focus: ['Stocks', 'Value', 'Dividends'],
    verified: true,
    followers: 27600,
    winRate: 71,
    totalReturnPct: 44.2,
    return30dPct: 3.1,
    volumeTraded: 610_000,
    equityCurve: buildEquityCurve(44.2, 60, 1.2),
  },
  {
    id: 'trader-marcus',
    name: 'Marcus Webb',
    handle: '@webbtrades',
    initials: 'MW',
    avatarColor: '#FFB13D',
    bio: 'Options + swing trader. High risk, high reward plays on volatile names.',
    focus: ['Stocks', 'Options', 'Volatility'],
    verified: false,
    followers: 15400,
    winRate: 46,
    totalReturnPct: -12.3,
    return30dPct: -9.8,
    volumeTraded: 1_870_000,
    equityCurve: buildEquityCurve(-12.3, 60, 5),
  },
  {
    id: 'trader-sana',
    name: 'Sana Okafor',
    handle: '@sanatrades',
    initials: 'SO',
    avatarColor: '#FF4D67',
    bio: 'Degen by night, risk manager by day. Meme coins with strict stop losses.',
    focus: ['Crypto', 'Meme Coins', 'Risk Management'],
    verified: false,
    followers: 33800,
    winRate: 51,
    totalReturnPct: 89.6,
    return30dPct: 22.7,
    volumeTraded: 980_000,
    equityCurve: buildEquityCurve(89.6, 60, 7),
  },
  {
    id: 'trader-devon',
    name: 'Devon Park',
    handle: '@devonp',
    initials: 'DP',
    avatarColor: '#C9CDDB',
    bio: 'Index-plus strategy: core ETFs with satellite bets on semiconductors.',
    focus: ['Stocks', 'ETFs', 'Semiconductors'],
    verified: true,
    followers: 19200,
    winRate: 63,
    totalReturnPct: 37.9,
    return30dPct: 5.4,
    volumeTraded: 720_000,
    equityCurve: buildEquityCurve(37.9, 60, 1.6),
  },
  {
    id: 'trader-luz',
    name: 'Luz Fernandez',
    handle: '@luzf',
    initials: 'LF',
    avatarColor: '#E08B4E',
    bio: 'Solana ecosystem trader. Early on new launches, disciplined exits.',
    focus: ['Crypto', 'Solana'],
    verified: false,
    followers: 22900,
    winRate: 58,
    totalReturnPct: 205.4,
    return30dPct: 41.3,
    volumeTraded: 1_340_000,
    equityCurve: buildEquityCurve(205.4, 60, 8),
  },
  {
    id: 'trader-omar',
    name: 'Omar Haddad',
    handle: '@omarh',
    initials: 'OH',
    avatarColor: '#6E5BFF',
    bio: 'Macro-driven trades across mega caps. Watches rates and earnings closely.',
    focus: ['Stocks', 'Macro'],
    verified: true,
    followers: 41000,
    winRate: 60,
    totalReturnPct: 28.1,
    return30dPct: -2.2,
    volumeTraded: 1_050_000,
    equityCurve: buildEquityCurve(28.1, 60, 2.4),
  },
];

const TRADE_TEMPLATES: { traderId: string; asset: ReturnType<typeof makeStockRef>; side: 'buy' | 'sell'; note?: string }[] = [
  { traderId: 'trader-nova', asset: ASSETS.nvda, side: 'buy', note: 'Loading up before earnings' },
  { traderId: 'trader-nova', asset: ASSETS.msft, side: 'buy' },
  { traderId: 'trader-nova', asset: ASSETS.amd, side: 'sell', note: 'Taking profit here' },
  { traderId: 'trader-crypto-kai', asset: ASSETS.btc, side: 'buy' },
  { traderId: 'trader-crypto-kai', asset: ASSETS.pepe, side: 'buy', note: 'Small size, high risk' },
  { traderId: 'trader-crypto-kai', asset: ASSETS.eth, side: 'sell' },
  { traderId: 'trader-priya', asset: ASSETS.aapl, side: 'buy', note: 'Adding to core position' },
  { traderId: 'trader-priya', asset: ASSETS.msft, side: 'buy' },
  { traderId: 'trader-marcus', asset: ASSETS.tsla, side: 'buy' },
  { traderId: 'trader-marcus', asset: ASSETS.coin, side: 'sell', note: 'Cutting losses' },
  { traderId: 'trader-sana', asset: ASSETS.doge, side: 'buy' },
  { traderId: 'trader-sana', asset: ASSETS.shib, side: 'sell', note: 'Locked in gains' },
  { traderId: 'trader-devon', asset: ASSETS.amd, side: 'buy' },
  { traderId: 'trader-devon', asset: ASSETS.googl, side: 'buy' },
  { traderId: 'trader-luz', asset: ASSETS.sol, side: 'buy', note: 'New ecosystem play forming' },
  { traderId: 'trader-luz', asset: ASSETS.link, side: 'buy' },
  { traderId: 'trader-omar', asset: ASSETS.amzn, side: 'buy' },
  { traderId: 'trader-omar', asset: ASSETS.meta, side: 'sell' },
  { traderId: 'trader-nova', asset: ASSETS.pltr, side: 'buy', note: 'New position, watching closely' },
  { traderId: 'trader-crypto-kai', asset: ASSETS.xrp, side: 'buy' },
  { traderId: 'trader-sana', asset: ASSETS.ada, side: 'buy' },
  { traderId: 'trader-luz', asset: ASSETS.ltc, side: 'sell' },
];

function pseudoPrice(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
  return 1 + (hash % 5000) / 10;
}

export const MOCK_TRADES: MockTrade[] = TRADE_TEMPLATES.map((t, i) => ({
  id: `mocktrade-${i}`,
  traderId: t.traderId,
  assetId: t.asset.assetId,
  symbol: t.asset.symbol,
  name: t.asset.name,
  assetClass: t.asset.assetClass,
  image: t.asset.image,
  side: t.side,
  price: pseudoPrice(t.asset.symbol + i),
  quantity: Math.round((5 + (i * 13) % 40) * 10) / 10,
  minutesAgo: (i * 17 + 3) % (60 * 30), // spread across the last ~30 hours
  note: t.note,
}));

export function getTraderTrades(traderId: string): MockTrade[] {
  return MOCK_TRADES.filter((t) => t.traderId === traderId).sort((a, b) => a.minutesAgo - b.minutesAgo);
}

export function getTraderById(traderId: string): MockTrader | undefined {
  return MOCK_TRADERS.find((t) => t.id === traderId);
}

const HOLDINGS_TEMPLATE: Record<string, { asset: ReturnType<typeof makeStockRef>; weightPct: number }[]> = {
  'trader-nova': [
    { asset: ASSETS.nvda, weightPct: 35 },
    { asset: ASSETS.msft, weightPct: 25 },
    { asset: ASSETS.pltr, weightPct: 20 },
    { asset: ASSETS.amd, weightPct: 20 },
  ],
  'trader-crypto-kai': [
    { asset: ASSETS.btc, weightPct: 45 },
    { asset: ASSETS.eth, weightPct: 30 },
    { asset: ASSETS.pepe, weightPct: 15 },
    { asset: ASSETS.xrp, weightPct: 10 },
  ],
  'trader-priya': [
    { asset: ASSETS.aapl, weightPct: 40 },
    { asset: ASSETS.msft, weightPct: 35 },
    { asset: ASSETS.amzn, weightPct: 25 },
  ],
  'trader-marcus': [
    { asset: ASSETS.tsla, weightPct: 50 },
    { asset: ASSETS.coin, weightPct: 30 },
    { asset: ASSETS.amd, weightPct: 20 },
  ],
  'trader-sana': [
    { asset: ASSETS.doge, weightPct: 40 },
    { asset: ASSETS.shib, weightPct: 30 },
    { asset: ASSETS.ada, weightPct: 30 },
  ],
  'trader-devon': [
    { asset: ASSETS.amd, weightPct: 30 },
    { asset: ASSETS.googl, weightPct: 40 },
    { asset: ASSETS.msft, weightPct: 30 },
  ],
  'trader-luz': [
    { asset: ASSETS.sol, weightPct: 50 },
    { asset: ASSETS.link, weightPct: 30 },
    { asset: ASSETS.ltc, weightPct: 20 },
  ],
  'trader-omar': [
    { asset: ASSETS.amzn, weightPct: 40 },
    { asset: ASSETS.meta, weightPct: 30 },
    { asset: ASSETS.googl, weightPct: 30 },
  ],
};

export function getTraderHoldings(traderId: string): MockHolding[] {
  return (HOLDINGS_TEMPLATE[traderId] ?? []).map((h) => ({ ...h.asset, weightPct: h.weightPct }));
}
