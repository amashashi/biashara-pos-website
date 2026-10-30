import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const knowledge = readFileSync(new URL('../whatsapp-agent/src/knowledge.ts', import.meta.url), 'utf8');
const prompt = JSON.parse(knowledge.match(/export const SYSTEM_PROMPT = (.+);/)?.[1] ?? 'null');
assert.equal(typeof prompt, 'string', 'Knowledge must export a text prompt');
const pricing = readFileSync(new URL('../src/components/Pricing.astro', import.meta.url), 'utf8');
const plans = JSON.parse(pricing.match(/const plans = (.*);/)?.[1] ?? 'null');
for (const plan of plans) {
  const {name, price} = plan.en;
  const section = prompt.split('## ' + name + ' — ')[1]?.split('\n## ')[0];
  assert.ok(section, 'Missing knowledge section for ' + name);
  assert.ok(prompt.includes(price), name + ' price missing from country pricing');
}
const growth = prompt.split('## Growth — ')[1].split('\n## ')[0];
for (const feature of ['Unlimited staff', 'unlimited products', 'unlimited transactions', 'Basket analysis', 'Loyalty program', 'credit sales', 'partial payments']) {
  assert.ok(growth.includes(feature), 'Growth knowledge missing ' + feature);
}
for (const fact of ['30-day free trial', 'KES 2,499/month', 'KES 4,999/month', 'KES 10,000/month', 'KRA eTIMS integration is not currently available', 'TZS 90,000/month', 'TRA VFD integration is coming, not live', 'merchant-managed customer credit', 'not exclusive to Pro']) {
  assert.ok(prompt.includes(fact), 'Missing customer-answer boundary: ' + fact);
}
console.log('Bot knowledge checks passed: current prices, Growth entitlements, trial, promotion and capability boundaries.');

const markets = readFileSync(new URL('../src/data/markets.ts', import.meta.url), 'utf8');
for (const market of ['KE', 'TZ']) {
  const line = markets.split('\n').find(line => line.trim().startsWith(market + ':'));
  const currency = line.match(/currency: '([^']+)'/)[1];
  const prices = JSON.parse('[' + line.match(/prices: \[([^\]]+)\]/)[1] + ']');
  for (const price of prices) assert.ok(prompt.includes(currency + ' ' + price.toLocaleString('en-US') + '/month'), market + ' bot price differs from website');
}
console.log('Bot country pricing matches both website offers.');
