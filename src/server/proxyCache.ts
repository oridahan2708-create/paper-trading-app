// Tiny in-memory TTL cache shared by the web API route proxies (src/server,
// app/api/**/+api.ts). Smooths bursts from multiple open browser tabs polling
// the same endpoint so the free-tier upstream rate limits aren't burned
// faster on the web than they would be by a single mobile app instance.
interface CacheEntry {
  expiresAt: number;
  status: number;
  body: string;
  contentType: string;
}

const cache = new Map<string, CacheEntry>();

export async function cachedProxyFetch(cacheKey: string, ttlMs: number, url: string): Promise<Response> {
  const now = Date.now();
  const hit = cache.get(cacheKey);
  if (hit && hit.expiresAt > now) {
    return new Response(hit.body, { status: hit.status, headers: { 'content-type': hit.contentType } });
  }

  const upstream = await fetch(url);
  const body = await upstream.text();
  const contentType = upstream.headers.get('content-type') ?? 'application/json';

  if (upstream.ok) {
    cache.set(cacheKey, { expiresAt: now + ttlMs, status: upstream.status, body, contentType });
  }

  return new Response(body, { status: upstream.status, headers: { 'content-type': contentType } });
}

/** Only allow path segments that can't be used to break out of the upstream API's URL structure. */
export function isSafePathSegment(segment: string): boolean {
  return /^[a-zA-Z0-9_.-]+$/.test(segment);
}
