# Website markets

The international marketing site is `/`. Country-specific, statically rendered pages live at `/ke/` and `/tz/`, including industry, privacy, cookies and terms pages. GitHub Pages remains the production host.

## Commercial content

`src/data/markets.ts` defines monthly prices. Kenya: Starter KES 2,499; Growth KES 4,999; Pro KES 10,000. Tanzania retains Starter TZS 60,000; promotional Growth TZS 60,000 (regular TZS 90,000); Pro TZS 150,000. The international site asks visitors to choose a country and publishes no assumed currency. Features and the 30-day trial are shared. Tanzania's promotion never appears on the Kenya site.

Keep `whatsapp-agent/src/knowledge.ts` consistent when changing prices. `check-bot-knowledge.mjs` verifies both offers. The website sends its selected market to the web-chat endpoint. Histories are isolated by session and market; unknown-market conversations ask for a country before quoting. WhatsApp does not infer market from a phone number. Subscription payment instructions remain private.

No live eTIMS, tax-authority submission, Coinbox integration, or offline-first synchronisation is advertised. Confirm these capabilities before changing the wording.

## Selection rules

1. Explicit `/ke/` and `/tz/` URLs show the requested country and remain shareable.
2. On unprefixed pages, a valid manual choice in `biashara-country` local storage wins, including International.
3. Otherwise a country.is lookup determines KE/TZ; other countries stay International. Results are cached for 24 hours, storing country and timestamp only. No GPS is requested. Requests omit credentials and referrer; the provider receives the visitor's IP as part of the request.
4. A 2.5-second timeout, lookup failure or blocked storage leaves a usable international page. Do not navigate away once the visitor has begun interacting. A manual choice during a lookup always wins.
5. Country is visible in the header at mobile and desktop widths. Automatic clears the manual override and cached detection.

Country changes preserve the corresponding page, query and hash. This changes marketing presentation only, not a merchant account's billing country, currency, tax settings or eligibility. Existing support contact details remain the company's contact; no Kenyan office or phone number is invented.

## Validation

Run `npm run build`, `node scripts/check-claims.mjs`, `node scripts/check-bot-knowledge.mjs`, `node scripts/check-markets.mjs`, and `node scripts/check-links.mjs`. Build the agent with `npm run build` in `whatsapp-agent/`. Market tests exercise detection, manual overrides, explicit URLs, storage failure, in-flight races and rendered prices/SEO. The Content guards workflow runs the market checks after building.
