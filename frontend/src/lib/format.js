export const CURRENCIES = {
  INR: { code: 'INR', symbol: '\u20B9', label: 'Indian Rupee', scale: 1 },
  USD: { code: 'USD', symbol: '$', label: 'US Dollar', scale: 0.012 },
};

export function formatMoney(amount, currency = 'INR') {
  const c = CURRENCIES[currency] || CURRENCIES.INR;
  const value = Math.round(amount * c.scale);
  if (c.code === 'INR') {
    if (value >= 10000000) return `${c.symbol}${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000) return `${c.symbol}${(value / 100000).toFixed(2)} L`;
    return `${c.symbol}${value.toLocaleString('en-IN')}`;
  }
  if (value >= 1000) return `${c.symbol}${(value / 1000).toFixed(1)}k`;
  return `${c.symbol}${value.toLocaleString('en-US')}`;
}

export function formatMoneyFull(amount, currency = 'INR') {
  const c = CURRENCIES[currency] || CURRENCIES.INR;
  const value = Math.round(amount * c.scale);
  return `${c.symbol}${value.toLocaleString(c.code === 'INR' ? 'en-IN' : 'en-US')}`;
}

export function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function round(n, places = 0) {
  const f = 10 ** places;
  return Math.round(n * f) / f;
}

export function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

export function pct(n) {
  return `${Math.round(n)}%`;
}

export function initials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
