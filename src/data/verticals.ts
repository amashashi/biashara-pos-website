/**
 * Per-vertical landing-page content.
 * Used by:
 *  - src/pages/pos-for-[vertical].astro (page rendering + SEO meta)
 *  - src/components/Industries.astro (homepage cards + links)
 *  - src/layouts/Layout.astro (FAQPage JSON-LD per page)
 */
import type { ImageMetadata } from 'astro';
import clothing from '../assets/verticals/clothing.jpg';
import retail from '../assets/verticals/retail.jpg';
import restaurant from '../assets/verticals/restaurant.jpg';
import hospital from '../assets/verticals/hospital.jpg';
import pharmacy from '../assets/verticals/pharmacy.jpg';

export interface VerticalFAQ {
  q: string;
  a: string;
}

export interface VerticalFeature {
  /** Inline SVG path content for a 24×24 icon (stroke-only, no fill). */
  icon: string;
  title: string;
  desc: string;
}

export interface Vertical {
  slug: 'clothing' | 'retail' | 'restaurant' | 'hospital' | 'pharmacy';
  /** Used by Industries badge gradient (.v-cloth / .v-retail / etc.). */
  badgeKey: 'cloth' | 'retail' | 'resto' | 'hosp' | 'pharm';
  /** English + Swahili display names. */
  name: { en: string; sw: string };
  /** Headline that doubles as the page <h1>. */
  headline: { en: string; sw: string };
  /** SEO title (~55–60 chars, includes brand). */
  seoTitle: string;
  /** SEO description (~150 chars). */
  seoDescription: string;
  /** Short blurb used on the Industries card. */
  shortDesc: { en: string; sw: string };
  /** Hero subhead on the dedicated page (1–2 sentences). */
  heroSubhead: { en: string; sw: string };
  /** 4 industry-tailored feature cards. */
  features: VerticalFeature[];
  /** 4 industry-specific FAQs (also rendered as FAQPage JSON-LD). */
  faqs: VerticalFAQ[];
  /** Hero photo from src/assets/verticals/. */
  photo: ImageMetadata;
  /** Alt text for the hero photo. */
  alt: string;
  /** "Net profit" sample for the locked dashboard mock on this page. */
  sampleNet: string;
  sampleSales: string;
  sampleTx: string;
}

export const verticals: Record<Vertical['slug'], Vertical> = {
  clothing: {
    slug: 'clothing',
    badgeKey: 'cloth',
    name: { en: 'Clothing', sw: 'Nguo' },
    headline: { en: 'POS for clothing boutiques in Tanzania', sw: 'POS kwa maduka ya nguo Tanzania' },
    seoTitle: 'POS for Clothing Boutiques in Tanzania | BiasharaPOS',
    seoDescription:
      'BiasharaPOS — the POS for clothing & fashion boutiques in Tanzania. Size & color variants, fast checkout, M-Pesa, TRA-compliant receipts, real-time profit.',
    shortDesc: { en: 'Sizes, colors & variants, fast.', sw: 'Saizi, rangi na aina, haraka.' },
    heroSubhead: {
      en: 'Track every size, colour and style with one tap. Print TRA receipts, accept M-Pesa, and see your real profit on every sale.',
      sw: 'Fuatilia kila saizi, rangi na mtindo kwa mguso mmoja. Chapisha risiti za TRA, kubali M-Pesa, na uone faida halisi kwa kila mauzo.',
    },
    photo: clothing,
    alt: 'Tanzanian clothing boutique interior',
    sampleNet: '+TZS 6,800',
    sampleSales: 'TZS 612,000',
    sampleTx: '18',
    features: [
      { icon: '<path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/>', title: 'Sizes, colours & variants', desc: 'Unlimited variant options per product — XS to XXXL, every shade, every fit.' },
      { icon: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 6v12M11 6v12M15 6v12"/>', title: 'Barcode label printing', desc: 'Print your own barcode labels at the counter, or scan existing manufacturer barcodes.' },
      { icon: '<path d="M4 19V5M4 19h16M8 16l3-4 3 2 4-6"/>', title: 'Dead-stock report', desc: 'See which items are not moving so you can run promotions or return to suppliers.' },
      { icon: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>', title: 'M-Pesa, card & cash', desc: 'One receipt, every method — M-Pesa, Mixx by Yas, Airtel Money, Visa, Mastercard, cash.' },
    ],
    faqs: [
      { q: 'Can I track sizes and colours of each item?', a: 'Yes — every product can have unlimited variant options (size, colour, fit, fabric). Each variant has its own stock count and SKU.' },
      { q: 'Do you print barcode labels?', a: 'Yes — print barcode labels directly from BiasharaPOS, or scan existing manufacturer barcodes. Works with any USB or Bluetooth scanner.' },
      { q: 'Can I see which items are not selling?', a: 'Yes — the dead-stock report shows slow-moving items by category, so you can run promotions or return to suppliers.' },
      { q: 'Does it accept M-Pesa for boutique sales?', a: 'Yes — M-Pesa, Mixx by Yas, Airtel Money, Visa and Mastercard, all on one TRA-compliant receipt.' },
    ],
  },

  retail: {
    slug: 'retail',
    badgeKey: 'retail',
    name: { en: 'Retail', sw: 'Rejareja' },
    headline: { en: 'POS for retail shops & supermarkets in Tanzania', sw: 'POS kwa maduka ya rejareja na supermarket Tanzania' },
    seoTitle: 'POS for Retail Shops & Supermarkets in Tanzania | BiasharaPOS',
    seoDescription:
      'BiasharaPOS — the POS for retail and supermarkets in Tanzania. Barcode scanning, bulk import, low-stock alerts, M-Pesa, TRA-compliant. Real profit per sale.',
    shortDesc: { en: 'Barcodes, bulk import, stock.', sw: 'Misimbo, uingizaji wa wingi, stoki.' },
    heroSubhead: {
      en: 'Scan barcodes, import thousands of SKUs from Excel, get low-stock alerts and see your real profit margin on every basket.',
      sw: 'Skani misimbo, ingiza maelfu ya SKUs kutoka Excel, pata tahadhari za stoki ndogo, na uone faida halisi kwa kila kikapu.',
    },
    photo: retail,
    alt: 'Tanzanian retail supermarket',
    sampleNet: '+TZS 4,200',
    sampleSales: 'TZS 847,500',
    sampleTx: '24',
    features: [
      { icon: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 6v12M11 6v12M15 6v12"/>', title: 'Barcode scanning', desc: 'Works with any USB or Bluetooth scanner. Or scan with your phone camera — no extra hardware.' },
      { icon: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>', title: 'Bulk import from Excel', desc: 'Upload your whole catalog from an Excel sheet in seconds. Update prices in bulk anytime.' },
      { icon: '<path d="M5 13a10 10 0 0 1 14 0M8.5 16.5a5 5 0 0 1 7 0M12 20h.01M2 8.8a16 16 0 0 1 20 0"/>', title: 'Low-stock alerts', desc: 'Set a reorder point per item. Get notified the moment you fall below it.' },
      { icon: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>', title: 'Guided stock-take', desc: 'Run an in-person count on your phone. The system flags discrepancies and adjusts in one tap.' },
    ],
    faqs: [
      { q: 'Can I bulk-import all my products at once?', a: 'Yes — download our Excel template, paste your catalog, and import in seconds. Updates work the same way.' },
      { q: 'Does it work with my barcode scanner?', a: 'Yes — any USB or Bluetooth barcode scanner works out of the box. You can also scan with your phone camera.' },
      { q: 'Can I run a stock-take without closing the shop?', a: 'Yes — the guided stock-take lets staff count on their phones during slow hours, then approve adjustments at the end.' },
      { q: 'Do I get a notification when stock is low?', a: 'Yes — set a reorder point per product. You\'ll get an alert on your phone the moment stock dips below it.' },
    ],
  },

  restaurant: {
    slug: 'restaurant',
    badgeKey: 'resto',
    name: { en: 'Restaurant', sw: 'Mgahawa' },
    headline: { en: 'POS for restaurants & cafés in Tanzania', sw: 'POS kwa migahawa Tanzania' },
    seoTitle: 'POS for Restaurants & Cafés in Tanzania | BiasharaPOS',
    seoDescription:
      'BiasharaPOS — the POS for Tanzanian restaurants, cafés and bars. Table management, kitchen tickets, split bills, M-Pesa, TRA receipts, real-time profit per plate.',
    shortDesc: { en: 'Tables & kitchen tickets.', sw: 'Meza na tiketi za jikoni.' },
    heroSubhead: {
      en: 'Manage tables, send orders straight to the kitchen, split bills at the end of the night, and see the real margin on every plate.',
      sw: 'Simamia meza, tuma maagizo moja kwa moja jikoni, gawanya bili usiku, na uone faida halisi kwa kila sahani.',
    },
    photo: restaurant,
    alt: 'Restaurant interior with diners',
    sampleNet: '+TZS 3,400',
    sampleSales: 'TZS 528,000',
    sampleTx: '36',
    features: [
      { icon: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 12h16M12 4v16"/>', title: 'Table management', desc: 'Visual table layout. Assign orders to tables, move them, merge or split bills at the end.' },
      { icon: '<path d="M6 3v6a3 3 0 0 0 3 3M18 3v6a3 3 0 0 1-3 3M12 12v9"/>', title: 'Kitchen tickets', desc: 'Orders print instantly at the kitchen, hot kitchen, bar or dessert station — your choice.' },
      { icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 11h-6M19 8v6"/>', title: 'Modifiers & combos', desc: 'No onions, extra cheese, sauce on the side — capture every customisation cleanly.' },
      { icon: '<path d="M4 19V5M4 19h16M8 16l3-4 3 2 4-6"/>', title: 'Recipe costing', desc: 'Track ingredient cost per dish so you know your real margin — not just the menu price.' },
    ],
    faqs: [
      { q: 'Can I manage tables and split bills at the end?', a: 'Yes — assign every order to a table. At the end, split by item, by share or by guest — and merge tables if needed.' },
      { q: 'Do orders print at the kitchen automatically?', a: 'Yes — connect a kitchen printer (or multiple stations) and tickets print the moment the waiter sends the order.' },
      { q: 'Can I track the cost of ingredients per dish?', a: 'Yes — recipe costing lets you log ingredients per menu item, so you see your real profit margin per plate.' },
      { q: 'Does it support M-Pesa Lipa Namba for orders?', a: 'Yes — M-Pesa, Mixx by Yas, Airtel Money, Visa and Mastercard, all on one TRA-compliant receipt.' },
    ],
  },

  hospital: {
    slug: 'hospital',
    badgeKey: 'hosp',
    name: { en: 'Hospital', sw: 'Hospitali' },
    headline: { en: 'POS & billing for clinics and hospitals in Tanzania', sw: 'POS na bili kwa zahanati na hospitali Tanzania' },
    seoTitle: 'POS & Billing for Clinics & Hospitals in Tanzania | BiasharaPOS',
    seoDescription:
      'BiasharaPOS — billing for Tanzanian clinics, hospitals and pharmacies. Patient billing, NHIF claims, lab + pharmacy in one invoice, TRA-compliant receipts.',
    shortDesc: { en: 'Patient billing & records.', sw: 'Utozaji wa wagonjwa na kumbukumbu.' },
    heroSubhead: {
      en: 'Bill patients for consultation, lab and pharmacy on one invoice. Track NHIF and private insurance claims. TRA-compliant from day one.',
      sw: 'Toza wagonjwa kwa ushauri, maabara na duka la dawa kwa bili moja. Fuatilia madai ya NHIF na bima binafsi. Inakubalika TRA tangu siku ya kwanza.',
    },
    photo: hospital,
    alt: 'Hospital reception desk',
    sampleNet: '+TZS 12,500',
    sampleSales: 'TZS 1,240,000',
    sampleTx: '14',
    features: [
      { icon: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>', title: 'Patient profiles', desc: 'Full patient records — visits, prescriptions, lab results, balance owed — all in one place.' },
      { icon: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/>', title: 'Combined invoicing', desc: 'Bill consultation, labs, X-ray and pharmacy on a single TRA-compliant invoice.' },
      { icon: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/>', title: 'NHIF & insurance claims', desc: 'Track claim status, link to NHIF, and reconcile insurer payouts against patient visits.' },
      { icon: '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0M16 6a3 3 0 0 1 0 6M21 20a5 5 0 0 0-4-5"/>', title: 'Role-based access', desc: 'Doctors, nurses, cashiers and admins each see only what they should. Full audit trail.' },
    ],
    faqs: [
      { q: 'Can I bill a patient for consultation, labs and pharmacy in one invoice?', a: 'Yes — every charge added to a patient visit appears on a single TRA-compliant invoice at checkout.' },
      { q: 'Do you support NHIF and private insurance claims?', a: 'Yes — link visits to an NHIF or insurer claim, track status, and reconcile when the insurer pays out.' },
      { q: 'Is patient data kept private?', a: 'Yes — role-based access means each staff member sees only what they should. Every action is logged for audit.' },
      { q: 'Can it run in a rural clinic without internet?', a: 'Yes — full offline mode. Visits, charges and receipts queue locally and sync the moment connection is back.' },
    ],
  },

  pharmacy: {
    slug: 'pharmacy',
    badgeKey: 'pharm',
    name: { en: 'Pharmacy', sw: 'Duka la Dawa' },
    headline: { en: 'POS for pharmacies & drug stores in Tanzania', sw: 'POS kwa maduka ya dawa Tanzania' },
    seoTitle: 'POS for Pharmacies & Drug Stores in Tanzania | BiasharaPOS',
    seoDescription:
      'BiasharaPOS — the POS for Tanzanian pharmacies. Expiry alerts, batch tracking (FEFO), prescription logging, supplier management, TRA-compliant fiscal receipts.',
    shortDesc: { en: 'Expiry dates & batches.', sw: 'Tarehe za mwisho na bechi.' },
    heroSubhead: {
      en: 'Track expiry dates, batch numbers and prescriptions on every sale. First-expiry-first-out is automatic — no more wasted stock.',
      sw: 'Fuatilia tarehe za mwisho, namba za bechi na maagizo ya daktari kwa kila mauzo. FEFO ni otomatiki — hakuna stoki inayopotea tena.',
    },
    photo: pharmacy,
    alt: 'Pharmacy counter with dispenser',
    sampleNet: '+TZS 5,100',
    sampleSales: 'TZS 392,000',
    sampleTx: '29',
    features: [
      { icon: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', title: 'Expiry alerts', desc: '30 / 60 / 90 day warnings before each batch expires, so you can rotate stock or return it.' },
      { icon: '<rect x="3" y="8" width="18" height="11" rx="2"/><path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M12 11v5M9.5 13.5h5"/>', title: 'Batch tracking (FEFO)', desc: 'First-expiry-first-out picks the oldest batch automatically at checkout — no manual lookup.' },
      { icon: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>', title: 'Prescription log', desc: 'Link each sale to a prescription and patient. Useful for controlled substances and audit.' },
      { icon: '<path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/>', title: 'Supplier purchase orders', desc: 'Generate purchase orders to your wholesalers and reconcile deliveries against batches.' },
    ],
    faqs: [
      { q: 'Will it warn me about stock that is close to expiring?', a: 'Yes — set 30, 60 or 90 day thresholds. You\'ll get an alert per batch so you can rotate, discount or return.' },
      { q: 'Can I track batch numbers and expiry per product?', a: 'Yes — every receipt records the batch sold. FEFO (first-expiry-first-out) is automatic at checkout.' },
      { q: 'Can I log prescriptions against sales?', a: 'Yes — link any sale to a prescription and patient. Useful for controlled substances and audit reporting.' },
      { q: 'Does it generate purchase orders for my wholesalers?', a: 'Yes — auto-generate POs from your reorder points, then reconcile deliveries against incoming batches.' },
    ],
  },
};

export const verticalSlugs = Object.keys(verticals) as Vertical['slug'][];
