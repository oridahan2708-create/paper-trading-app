export function formatPrice(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '—';
  if (value >= 1000) return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
  if (value >= 1) return `$${value.toFixed(2)}`;
  if (value >= 0.01) return `$${value.toFixed(4)}`;
  return `$${value.toFixed(8)}`;
}

export function formatPercent(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatCompactNumber(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '—';
  const abs = Math.abs(value);
  if (abs >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}

export function formatRelativeMinutes(minutesAgo: number): string {
  if (minutesAgo < 1) return 'just now';
  if (minutesAgo < 60) return `${Math.round(minutesAgo)}m ago`;
  const hours = minutesAgo / 60;
  if (hours < 24) return `${Math.round(hours)}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function formatCompactCount(value: number): string {
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return String(value);
}

export function formatQuantity(value: number): string {
  if (value === 0) return '0';
  const abs = Math.abs(value);
  const decimals = abs >= 1 ? 4 : 8;
  return value.toFixed(decimals).replace(/\.?0+$/, '') || '0';
}
