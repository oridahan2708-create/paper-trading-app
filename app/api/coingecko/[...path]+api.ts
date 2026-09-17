import { cachedProxyFetch, isSafePathSegment } from '@/server/proxyCache';

// Browser builds can't call api.coingecko.com directly for every endpoint
// without risking CORS/rate-limit issues shared across every visitor, so the
// website routes crypto requests through this same-origin proxy instead.
// Native (iOS/Android) keeps calling CoinGecko directly — see src/api/coingecko.ts.
const UPSTREAM_BASE = 'https://api.coingecko.com/api/v3';
const API_KEY = process.env.COINGECKO_API_KEY;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const prefix = '/api/coingecko/';
  const idx = url.pathname.indexOf(prefix);
  const rawPath = idx >= 0 ? url.pathname.slice(idx + prefix.length) : '';
  const segments = rawPath.split('/').filter(Boolean);

  if (segments.length === 0 || !segments.every(isSafePathSegment)) {
    return Response.json({ error: 'Invalid path' }, { status: 400 });
  }

  const search = new URLSearchParams(url.search);
  if (API_KEY) search.set('x_cg_demo_api_key', API_KEY);
  const query = search.toString();
  const upstreamUrl = `${UPSTREAM_BASE}/${segments.join('/')}${query ? `?${query}` : ''}`;

  // Market lists/search change slowly enough that a short cache meaningfully
  // reduces upstream calls without making prices feel stale.
  return cachedProxyFetch(`coingecko:${segments.join('/')}:${query}`, 10_000, upstreamUrl);
}
