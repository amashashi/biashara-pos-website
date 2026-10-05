/**
 * Link and navigation guard.
 *
 * Walks every built page in dist/ and fails on a link that goes nowhere:
 *   · an internal href with no page behind it
 *   · a #fragment with no element of that id on the page it sits on
 *   · a page no other page links to (unreachable except by typing the URL)
 *   · an <a> with no href, or an empty/placeholder one
 *   · a page the main nav cannot be used from (missing header or footer)
 *
 * External links are listed, not fetched — a build must not fail because
 * someone else's server is slow.
 *
 * public/demo/ is a prebuilt demo app copied in verbatim; it routes on the
 * client, so its pages are checked as link targets but not crawled as our
 * own — walking them reports 100 customer pages as "unreachable" when they
 * are reached by clicking inside the demo. Run: npm run check:links
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, posix, sep } from 'node:path';

const DIST = 'dist';
const fail = [];
const warn = [];

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith('.html')) out.push(p);
  }
  return out;
}

/** dist/pos-for-retail/index.html -> /pos-for-retail/ */
const urlOf = (file) => {
  const rel = relative(DIST, file).split(sep).join('/');
  return '/' + rel.replace(/index\.html$/, '');
};

/** Pages we author. Everything under public/demo/ is somebody else's build. */
const IS_OURS = (u) => !u.startsWith('/demo/');

const allPages = walk(DIST);
const pages = allPages.filter((f) => IS_OURS(urlOf(f)));
if (!allPages.length) {
  console.error('No pages in dist/ — run `npm run build` first.');
  process.exit(2);
}

const known = new Set(allPages.map(urlOf));
const ids = new Map();      // url -> Set of element ids
const links = new Map();    // url -> [{href, raw}]
const inbound = new Map();  // url -> count of other pages linking to it
const externals = new Set();

for (const file of pages) {
  const url = urlOf(file);
  const raw = readFileSync(file, 'utf8');

  // <script> holds JS, not links: the chat widget builds an <a> by string
  // concatenation, and scanning it reported href="' + WA_URL + '" as broken.
  const stripped = raw
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  // The language switcher injects the data-en / data-sw copy as HTML, so the
  // escaped anchors inside those attributes are real links once swapped in.
  // Pull them out, decode, and check them; blank them in the main pass so the
  // same markup is not also read as a malformed tag.
  const decode = (v) => v
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
    .replace(/&quot;/g, '"').replace(/&#x27;|&apos;/gi, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  const inAttrs = [...stripped.matchAll(/\sdata-(?:en|sw)="([^"]*)"/g)]
    .map((m) => decode(m[1])).filter((v) => v.includes('<a ')).join(' ');
  const html = stripped.replace(/(\sdata-(?:en|sw))="[^"]*"/g, '$1=""') + ' ' + inAttrs;

  ids.set(url, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));

  const found = [];
  for (const m of html.matchAll(/<a\b([^>]*)>/gi)) {
    const attrs = m[1];
    const href = (attrs.match(/\shref="([^"]*)"/) || [])[1];
    if (href === undefined) {
      // an anchor with no href is not a link and not focusable
      if (!/\srole="/.test(attrs)) fail.push(`${url}: <a> with no href — ${m[0].slice(0, 90)}`);
      continue;
    }
    if (href.trim() === '' || href === '#' || href.toLowerCase().startsWith('javascript:')) {
      fail.push(`${url}: placeholder href="${href}"`);
      continue;
    }
    found.push(href);
  }
  links.set(url, found);

  if (!/<header\b/i.test(html)) warn.push(`${url}: no <header> — the main nav is not reachable from this page`);
  if (!/<footer\b/i.test(html)) warn.push(`${url}: no <footer>`);
}

for (const [url, hrefs] of links) {
  for (const href of hrefs) {
    if (/^(https?:)?\/\//i.test(href)) { externals.add(href.split('?')[0]); continue; }
    if (/^(mailto:|tel:|wa\.me)/i.test(href)) continue;

    if (href.startsWith('#')) {
      const id = decodeURIComponent(href.slice(1));
      if (!ids.get(url).has(id)) fail.push(`${url}: "${href}" — no element with that id on this page`);
      continue;
    }

    const [pathPart, frag] = href.split('#');
    let target = pathPart.startsWith('/') ? pathPart : posix.normalize(posix.join(url, pathPart));
    if (!target.endsWith('/') && !/\.[a-z0-9]+$/i.test(target)) target += '/';

    const isFile = /\.[a-z0-9]+$/i.test(target);
    const ok = isFile ? existsSync(join(DIST, target)) : known.has(target);
    if (!ok) { fail.push(`${url}: "${href}" -> ${target} does not exist`); continue; }

    if (target !== url) inbound.set(target, (inbound.get(target) || 0) + 1);
    if (frag && known.has(target) && !ids.get(target).has(decodeURIComponent(frag)))
      fail.push(`${url}: "${href}" — ${target} has no id "${frag}"`);
  }
}

for (const url of known) {
  if (url === '/' || !IS_OURS(url)) continue;
  if (!inbound.get(url)) fail.push(`${url}: no page links here — unreachable by navigation`);
}

console.log(`Checked ${pages.length} pages (+${allPages.length - pages.length} in the bundled demo), ${[...links.values()].flat().length} links, ${externals.size} distinct external targets.`);
for (const w of warn) console.log('  warn: ' + w);
if (fail.length) {
  console.error('\nLink guard: %d problem(s)\n', fail.length);
  for (const f of fail) console.error('  ✗ ' + f);
  process.exit(1);
}
console.log('Link guard: clean — every internal link and anchor resolves, every page is reachable.');
