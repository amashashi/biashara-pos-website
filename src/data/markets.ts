export type Market = 'KE' | 'TZ' | 'GLOBAL';
export function marketFor(url: URL): Market {
  const segment = url.pathname.split('/')[1];
  return segment === 'ke' ? 'KE' : segment === 'tz' ? 'TZ' : 'GLOBAL';
}
export function marketPrefix(url: URL): string {
  const market = marketFor(url);
  return market === 'GLOBAL' ? '' : '/' + market.toLowerCase();
}
export const marketPrices = {
  KE: { currency: 'KES', prices: [2499, 4999, 9999], regularGrowth: null },
  TZ: { currency: 'TZS', prices: [60000, 60000, 150000], regularGrowth: 90000 },
} as const;
export function priceFor(market: Market, index: number): string {
  if (market === 'GLOBAL') return 'Choose country';
  const offer = marketPrices[market];
  return offer.currency + ' ' + offer.prices[index].toLocaleString('en-US');
}
export function pricingSummary(market: Market, sw = false): string {
  if (market === 'GLOBAL') return sw ? 'Kila kifurushi kina siku 30 bure. Chagua nchi kuona bei zinazotumika.' : 'Every plan starts with 30 days free. Choose your country to see local prices.';
  const prices = [0,1,2].map(i => priceFor(market, i));
  return sw
    ? `Siku 30 bure. Kisha Starter ${prices[0]}, Growth ${prices[1]} na Pro ${prices[2]} kwa mwezi.${market === 'TZ' ? ' Growth ina ofa; bei ya kawaida TZS 90,000/mwezi.' : ''}`
    : `30 days free. Then Starter ${prices[0]}, Growth ${prices[1]} and Pro ${prices[2]} per month.${market === 'TZ' ? ' Growth is on promotion; regular price TZS 90,000/month.' : ''}`;
}
