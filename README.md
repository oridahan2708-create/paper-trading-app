# SocialTrade — Social Crypto & Stock Paper Trading (Mobile)

A real cross-platform **mobile app** (iOS + Android, via Expo/React Native — not a website) for social-first paper trading, inspired by apps like Fomo. Dark theme throughout, live market data, and demo-mode social/copy-trading features.

> ⚠️ This app is for education and practice only. It trades **virtual, simulated money** against real live market prices. No real money, brokerage account, or exchange is ever connected. Social feed, leaderboard, and copy-trading traders are **simulated demo profiles**, clearly labeled as such throughout the app.

## What's included

- **Market dashboard** — full CoinGecko crypto list (thousands of coins, including meme coins and losers, not just a trending shortlist) and the full Finnhub US stock/ETF symbol list, both searchable. Live prices, 24h/7d/30d % change, and a candlestick/line chart toggle for every asset.
- **Paper trading** — set your virtual balance to anything from $0 up, buy/sell any listed stock or coin at live market prices, track positions, unrealized P&L, and a full trade history log.
- **Social feed & leaderboard** — simulated trader profiles post real-looking trades on real assets; follow traders, browse a leaderboard (by gains, win rate, or volume), and see a demo leaderboard comparing your own paper portfolio to the simulated traders.
- **Copy trading** — view a trader's recent trades, current (simulated) holdings, and performance chart. Copy a single trade or turn on "Copy Trader" to mirror their whole portfolio proportionally, all executed in your demo account at live prices.
- **Learn & Discover** — live "top movers" spotlight, beginner education on volume/market cap/volatility/copy trading/investing basics, and a curated list of well-known real investors/educators to follow (with a note to verify official accounts yourself, since impersonation scams are common).

## Tech stack

- [Expo](https://expo.dev) + React Native + TypeScript, [Expo Router](https://docs.expo.dev/router/introduction/) for navigation
- [Zustand](https://github.com/pmndrs/zustand) + AsyncStorage for the persisted paper-trading portfolio
- [TanStack Query](https://tanstack.com/query) for live data fetching/polling/caching
- Custom `react-native-svg` line & candlestick charts (no paid charting SDK)
- **Crypto data:** [CoinGecko](https://www.coingecko.com/en/api) public API — full market list, search, and OHLC/line chart history
- **Stock data:** [Finnhub](https://finnhub.io/) — full US symbol list, search, and live quotes; [Yahoo Finance's public chart endpoint](https://query1.finance.yahoo.com) for historical candles/line data and 7d/30d change (no key required)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Get free API keys

| Provider | Required? | Get a key |
|---|---|---|
| Finnhub | **Yes** — powers the full stock list, search, and live stock quotes | Sign up free at https://finnhub.io/register, copy your API key from the dashboard |
| CoinGecko | Optional — crypto works without a key at a lower rate limit | Free "Demo" key at https://www.coingecko.com/en/developers/dashboard |

Copy the example env file and fill in your key(s):

```bash
cp .env.example .env
```

```
EXPO_PUBLIC_FINNHUB_API_KEY=your_finnhub_key_here
EXPO_PUBLIC_COINGECKO_API_KEY=   # optional
```

### 3. Run the app

```bash
npx expo start
```

Then:
- **On your phone:** install the free **Expo Go** app ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)), then scan the QR code shown in the terminal.
- **iOS Simulator** (macOS only, requires Xcode): press `i` in the terminal.
- **Android Emulator** (requires Android Studio): press `a` in the terminal.

No backend server is required — the app talks directly to CoinGecko/Finnhub/Yahoo Finance from your device.

## Notes & limitations

- Finnhub's free tier is rate-limited (60 requests/min); the stock list screen only fetches live quotes for rows currently on/near screen to stay within that limit, and polls each visible row every ~15s.
- 7d/30d % change for stocks is derived from Yahoo Finance's public daily-candle history (no key needed), since Finnhub's free tier restricts historical candles. This is an unofficial-but-widely-used endpoint; if Yahoo changes it, that fallback may need updating.
- All social feed, leaderboard, and copy-trading data (trader names, bios, trades, follower counts) is fictional demo data generated for this app — it is not real trading activity. It's labeled "demo" in the UI wherever it appears.
- The "People to Follow" list in Learn names real, well-known public investors/educators using only general public facts (no performance claims). No social handles are hardcoded — search for each name and confirm you're following their official/verified account.
