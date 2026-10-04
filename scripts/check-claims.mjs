#!/usr/bin/env node
/**
 * Marketing claim guard.
 *
 * BiasharaPOS does not hold the TRA VFD, NF525, ISO 27001 or PCI DSS
 * certifications, does not process payments, and is only offline-capable at the
 * retail counter. Claims to the contrary have been removed from the site twice
 * now — they came back the second time because someone reworking the pricing
 * copy had no way to know which phrases were unsupported.
 *
 * This script is that way. It fails the build on phrases we cannot stand behind,
 * and prints why, so the fix is obvious at review time rather than after launch.
 *
 * Adding a rule: only add one you can point at the source for. Removing a rule
 * means the product changed — say so in the commit message.
 *
 * Run: node scripts/check-claims.mjs
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const ROOT = process.cwd();
const SCAN_DIRS = ['src', 'whatsapp-agent/src'];
const SCAN_EXT = new Set(['.astro', '.ts', '.tsx', '.js', '.mjs', '.md', '.html']);

/**
 * `pattern` is matched case-insensitively against each line.
 * `why` says what is untrue. `instead` gives the wording that is defensible.
 */
const RULES = [
  {
    pattern: /TRA[-\s]?compliant|accepted by TRA|approved by TRA|recognis(?:ed|ed) by (?:the )?TRA|recognized by Tanzania Revenue|registered with TRA/i,
    why: 'We are not certified, approved or recognised by the TRA.',
    instead: '"built to the TRA VFD specification" / "audit-ready fiscal receipts"',
  },
  {
    pattern: /NF525 certified|ISO ?27001 certified|PCI[- ]?DSS compliant|PCI compliant/i,
    why: 'We hold none of these certifications.',
    instead: '"NF525-style receipt chain" / "ISO 27001 practices" / "PCI DSS practices"',
  },
  {
    pattern: /fully offline|works fully offline|100% functionality without internet|\bworks offline\b/i,
    why: 'Only the retail counter sale works offline. Restaurant ordering, the kitchen screen and settlement all need the network.',
    instead: '"the counter keeps selling when the network drops"',
  },
  {
    pattern: /Tanzania'?s only|only POS in Tanzania|Tanzania'?s leading|the leading POS/i,
    why: 'Unverifiable comparative claim.',
    instead: 'a specific, checkable statement about what the product does',
  },
  {
    pattern: /universal payments|accepts? M-Pesa.*(?:Visa|Mastercard)|automatic reconciliation of payments/i,
    why: 'We do not process payments. These are tender types recorded at the till; money moves through the merchant’s own account.',
    instead: '"record M-Pesa, Mixx, Airtel, cash or card against the sale"',
  },
  {
    pattern: /RCTVNUM/i,
    why: 'Implies a live, certified TRA fiscalisation link we do not have.',
    instead: '"fiscal receipt number"',
  },
  {
    pattern: /NHIF/i,
    why: 'NHIF claims tracking does not exist. `nhif_claims` is a legacy table with no controller, route or UI.',
    instead: 'remove the claim',
  },
  {
    pattern: /modifiers? (?:&|and) combos|option groups/i,
    why: 'The modifier handler returns an empty array; there is no modifier UI.',
    instead: 'remove the claim',
  },
  {
    pattern: /merge tables|move (?:and|or) merge|merge or split bills/i,
    why: 'There is no move/merge table endpoint or UI anywhere in the app.',
    instead: '"split the bill for a table item by item"',
  },
  {
    pattern: /size (?:&|and|x|×) colou?r variants?|variant matrix/i,
    why: 'product_variants is a flat single free-text label, not a two-axis matrix.',
    instead: '"an option per size and shade, each with its own SKU and stock"',
  },
  {
    pattern: /courier partners?|delivery partners?|third[- ]party couriers?/i,
    why: 'Only a mock courier adapter exists; no real courier is integrated.',
    instead: '"your own riders"',
  },
  {
    pattern: /live (?:GPS|map) tracking|track (?:the )?rider on a map/i,
    why: 'There is no map or GPS anywhere in the product.',
    instead: '"tracked by delivery stage and arrival time"',
  },
  {
    pattern: /pay online (?:now|today)|customers? can pay online/i,
    why: 'No payment provider is configured in production; the only working adapter is a mock.',
    instead: '"pickup or pay on delivery"',
  },
];

/**
 * Exemptions, for text that names a banned phrase in order to deny it — an
 * honest negation, or a note telling the next author not to claim something.
 *
 *   claims-guard-allow        on the offending line
 *   claims-guard-allow-start  … claims-guard-allow-end   around a block
 */
const ALLOW = 'claims-guard-allow';
const ALLOW_START = 'claims-guard-allow-start';
const ALLOW_END = 'claims-guard-allow-end';

function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    if (name === 'node_modules' || name === 'dist' || name.startsWith('.')) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (SCAN_EXT.has(extname(full))) out.push(full);
  }
  return out;
}

const findings = [];
for (const base of SCAN_DIRS) {
  for (const file of walk(join(ROOT, base))) {
    const lines = readFileSync(file, 'utf8').split(/\r?\n/);
    let inAllowBlock = false;
    lines.forEach((line, i) => {
      if (line.includes(ALLOW_START)) { inAllowBlock = true; return; }
      if (line.includes(ALLOW_END)) { inAllowBlock = false; return; }
      if (inAllowBlock || line.includes(ALLOW)) return;
      for (const rule of RULES) {
        const m = line.match(rule.pattern);
        if (m) findings.push({ file: relative(ROOT, file), line: i + 1, match: m[0], rule });
      }
    });
  }
}

if (findings.length === 0) {
  console.log('Claim guard: clean — no unsupported marketing claims found.');
  process.exit(0);
}

console.error(`\nClaim guard: ${findings.length} unsupported claim${findings.length === 1 ? '' : 's'} found.\n`);
for (const f of findings) {
  console.error(`  ${f.file}:${f.line}`);
  console.error(`    found    "${f.match}"`);
  console.error(`    why      ${f.rule.why}`);
  console.error(`    instead  ${f.rule.instead}\n`);
}
console.error('If the product has genuinely changed, update scripts/check-claims.mjs and say so in');
console.error(`the commit message. To exempt one line (e.g. an honest negation), add: ${ALLOW}\n`);
process.exit(1);
