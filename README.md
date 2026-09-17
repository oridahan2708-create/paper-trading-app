# SocialTrade — Social Crypto & Stock Paper Trading

A social-first paper trading app inspired by Fomo — dark theme throughout, live market data, and demo-mode social/copy-trading features. Built with Expo + React Native + Expo Router, which means **one codebase ships as both a real website and a real iOS/Android app.**

> ⚠️ This app is for education and practice only. It trades **virtual, simulated money** against real live market prices. No real money, brokerage account, or exchange is ever connected. Social feed, leaderboard, and copy-trading traders are **simulated demo profiles**, clearly labeled as such throughout the app.

## What's included

- **Market dashboard** — full CoinGecko crypto list (thousands of coins, including meme coins and losers, not just a trending shortlist) and the full Finnhub US stock/ETF symbol list, both searchable. Live prices, 24h/7d/30d % change, and a candlestick/line chart toggle for every asset.
- **Paper trading** — set your virtual balance to anything from $0 up, buy/sell any listed stock or coin at live market prices, track positions, unrealized P&L, and a full trade history log.
- **Social feed & leaderboard** — simulated trader profiles post real-looking trades on real assets; follow traders, browse a leaderboard (by gains, win rate, or volume), and see a demo leaderboard comparing your own paper portfolio to the simulated traders.
- **Copy trading** — view a trader's recent trades, current (simulated) holdings, and performance chart. Copy a single trade or turn on "Copy Trader" to mirror their whole portfolio proportionally, all executed in your demo account at live prices.
- **Learn & Discover** — live "top movers" spotlight, beginner education on volume/market cap/volatility/copy trading/investing basics, and a curated list of well-known real investors/educators to follow (with a note to verify official accounts yourself, since impersonation scams are common).

## Tech stack

- [Expo](https://expo.dev) + React Native + TypeScript, [Expo Router](https://docs.expo.dev/router/introduction/) for navigation, screens, **and** the website's server (server output + [API routes](https://docs.expo.dev/router/web/api-routes/))
- [Zustand](https://github.com/pmndrs/zustand) + AsyncStorage for the persisted paper-trading portfolio (uses `localStorage` under the hood on web)
- [TanStack Query](https://tanstack.com/query) for live data fetching/polling/caching
- Custom `react-native-svg` line & candlestick charts (no paid charting SDK)
- **Crypto data:** [CoinGecko](https://www.coingecko.com/en/api) public API — full market list, search, and OHLC/line chart history
- **Stock data:** [Finnhub](https://finnhub.io/) — full US symbol list, search, and live quotes; [Yahoo Finance's public chart endpoint](https://query1.finance.yahoo.com) for historical candles/line data and 7d/30d change (no key required)

### How the website differs from the native app

A browser enforces **CORS** and exposes the entire public JS bundle to anyone who opens dev tools — a native app faces neither restriction. Yahoo Finance's chart endpoint in particular sends no CORS headers at all, so calling it directly from a browser is simply blocked. To handle this, the web build routes all three data sources through same-origin proxy endpoints instead of calling them directly:

| | Native (iOS/Android) | Website |
|---|---|---|
| CoinGecko / Finnhub / Yahoo calls | Directly from the device | Through `app/api/coingecko/[...path]+api.ts`, `app/api/finnhub/[...path]+api.ts`, `app/api/yahoo-chart+api.ts` |
| API keys | Embedded in the app via `EXPO_PUBLIC_*` env vars | Kept server-side only (`FINNHUB_API_KEY`, `COINGECKO_API_KEY`), never sent to the browser |
| Why | No CORS restriction; embedding is the normal RN pattern | Avoids CORS entirely and keeps keys out of view-source |

This is why the website needs a small Node server running (see below) rather than being pure static HTML — the proxy routes need somewhere to run.

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

`.env.example` has two sections — one for the native app (`EXPO_PUBLIC_*` vars) and one for the website (plain vars, no prefix). Fill in whichever you're running; they can hold the same key values.

### 3. Run the mobile app

```bash
npx expo start
```

Then:
- **On your phone:** install the free **Expo Go** app ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)), then scan the QR code shown in the terminal.
- **iOS Simulator** (macOS only, requires Xcode): press `i` in the terminal.
- **Android Emulator** (requires Android Studio): press `a` in the terminal.

### 4. Run the website locally

For day-to-day development (hot reload, no build step):

```bash
npx expo start --web
```

To run it the way it'll behave in production (built + served by the real Node server, including the `/api/*` proxy routes):

```bash
npm run build:web   # expo export -p web -> dist/client + dist/server
npm run serve:web    # node server.js, serves dist/ on http://localhost:3000
```

## Deploying the website

The website is a small Node server (`server.js`), not static files, because of the `/api/*` proxy routes described above. Any host that runs a persistent Node process works:

1. **[EAS Hosting](https://docs.expo.dev/eas/hosting/introduction/)** — Expo's own hosting, built for exactly this (Expo Router server output). Simplest option if you're already using EAS.
2. **Render / Railway / Fly.io** (all have free tiers) — point them at this repo, build command `npm install && npm run build:web`, start command `npm run serve:web`. Set `FINNHUB_API_KEY` and `COINGECKO_API_KEY` as environment variables in their dashboard (not in a committed `.env` file).
3. **Your own VPS / Docker** — `npm ci && npm run build:web`, then run `npm run serve:web` (or `node server.js`) behind your reverse proxy of choice. `PORT` is configurable via env var.

Whichever host you pick, set `FINNHUB_API_KEY` / `COINGECKO_API_KEY` as real server environment variables there — never commit real keys to `.env`.

## Notes & limitations

- Finnhub's free tier is rate-limited (60 requests/min); the stock list screen only fetches live quotes for rows currently on/near screen to stay within that limit, and polls each visible row every ~15s. The web proxy also adds a short shared cache (~8s) so multiple open browser tabs don't multiply upstream calls.
- 7d/30d % change for stocks is derived from Yahoo Finance's public daily-candle history (no key needed), since Finnhub's free tier restricts historical candles. This is an unofficial-but-widely-used endpoint; if Yahoo changes it, that fallback may need updating.
- All social feed, leaderboard, and copy-trading data (trader names, bios, trades, follower counts) is fictional demo data generated for this app — it is not real trading activity. It's labeled "demo" in the UI wherever it appears.
- The "People to Follow" list in Learn names real, well-known public investors/educators using only general public facts (no performance claims). No social handles are hardcoded — search for each name and confirm you're following their official/verified account.
- **Free-tier stock coverage is US exchanges only** (Finnhub's free plan doesn't include international exchanges), and it's request-quota-limited rather than a true unlimited real-time firehose — see the in-app rate-limit note above.
