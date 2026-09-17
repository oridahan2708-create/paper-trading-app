import { cachedProxyFetch, isSafePathSegment } from '@/server/proxyCache';

// Same reasoning as app/api/coingecko/[...path]+api.ts: keeps the Finnhub key
// server-side (never shipped in the public web JS bundle) and gives the web
// build a same-origin endpoint so it isn't subject to browser CORS rules.
const UPSTREAM_BASE = 'https://finnhub.io/api/v1';
const API_KEY = process.env.FINNHUB_API_KEY;

export async function GET(request: Request) {
  if (!API_KEY) {
    return Response.json(
      { error: 'Server is missing FINNHUB_API_KEY. See README setup instructions.' },
      { status: 500 }
    );
  }

  const url = new URL(request.url);
  const prefix = '/api/finnhub/';
  const idx = url.pathname.indexOf(prefix);
  const rawPath = idx >= 0 ? url.pathname.slice(idx + prefix.length) : '';
  const segments = rawPath.split('/').filter(Boolean);

  if (segments.length === 0 || !segments.every(isSafePathSegment)) {
    return Response.json({ error: 'Invalid path' }, { status: 400 });
  }

  const search = new URLSearchParams(url.search);
  search.delete('token'); // never trust a client-supplied token
  search.set('token', API_KEY);
  const query = search.toString();
  const upstreamUrl = `${UPSTREAM_BASE}/${segments.join('/')}${query ? `?${query}` : ''}`;

  return cachedProxyFetch(`finnhub:${segments.join('/')}:${query}`, 8_000, upstreamUrl);
}
