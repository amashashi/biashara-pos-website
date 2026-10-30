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
  assert.ok(section.includes(price), name + ' price differs from public pricing');
}
const growth = prompt.split('## Growth — ')[1].split('\n## ')[0];
for (const feature of ['Unlimited staff', 'unlimited products', 'unlimited transactions', 'Basket analysis', 'Loyalty program', 'credit sales', 'partial payments']) {
  assert.ok(growth.includes(feature), 'Growth knowledge missing ' + feature);
}
for (const fact of ['30-day free trial', 'TZS 90,000/month', 'TRA VFD integration is coming, not live', 'merchant-managed customer credit', 'not exclusive to Pro']) {
  assert.ok(prompt.includes(fact), 'Missing customer-answer boundary: ' + fact);
}
console.log('Bot knowledge checks passed: current prices, Growth entitlements, trial, promotion and capability boundaries.');
