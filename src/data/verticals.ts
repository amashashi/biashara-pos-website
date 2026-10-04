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
import barbershop from '../assets/verticals/barbershop.jpg';

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
  slug: 'clothing' | 'retail' | 'restaurant' | 'hospital' | 'pharmacy' | 'barbershop';
  /** Used by Industries badge gradient (.v-cloth / .v-retail / etc.). */
  badgeKey: 'cloth' | 'retail' | 'resto' | 'hosp' | 'pharm' | 'barber';
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
  /** Three sample till lines, shown on the device screens for this vertical. */
  tillItems: { label: string; price: string }[];
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
      'BiasharaPOS — the POS for clothing & fashion boutiques in Tanzania. Per-variant stock and SKUs, a Boutique online shop with delivery, fast checkout, real profit per sale.',
    shortDesc: { en: 'Variants, and a shop online.', sw: 'Aina za bidhaa, na duka mtandaoni.' },
    heroSubhead: {
      en: 'Give every size and colour its own stock count and SKU, then put the same rail online in a Boutique shopfront your customers can order from. Real profit on every sale, in store or online.',
      sw: 'Mpe kila saizi na rangi hesabu yake ya stoki na SKU, kisha weka bidhaa hizo hizo mtandaoni kwenye duka la Boutique ambalo wateja wanaweza kuagiza. Faida halisi kwa kila mauzo, dukani au mtandaoni.',
    },
    photo: clothing,
    alt: 'Tanzanian clothing boutique interior',
    tillItems: [
      { label: 'Kitenge Dress', price: '48,000' },
      { label: 'Linen Shirt × 2', price: '64,000' },
      { label: 'Leather Sandals', price: '28,000' },
    ],
    sampleNet: '+TZS 6,800',
    sampleSales: 'TZS 612,000',
    sampleTx: '18',
    features: [
      { icon: '<path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/>', title: 'A variant per size and shade', desc: 'Add as many options as a product needs — each with its own SKU, stock count and price difference.' },
      { icon: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 6v12M11 6v12M15 6v12"/>', title: 'Barcode label printing', desc: 'Print your own barcode labels at the counter, or scan existing manufacturer barcodes.' },
      { icon: '<path d="M4 19V5M4 19h16M8 16l3-4 3 2 4-6"/>', title: 'Dead-stock report', desc: 'See which items are not moving so you can run promotions or return to suppliers.' },
      { icon: '<path d="M3 9l1-5h16l1 5"/><path d="M4 9h16v11H4z"/><path d="M9 13h6"/>', title: 'A Boutique shop online', desc: 'Open a lookbook storefront on the same stock as the till. Customers browse and order with no account, and pick up or get it delivered.' },
    ],
    faqs: [
      { q: 'Can I track sizes and colours of each item?', a: 'Yes — add an option for each one you stock, such as "Blue / L". Every option carries its own SKU, its own stock count and its own price difference, and sells down independently at the till and online.' },
      { q: 'Do you print barcode labels?', a: 'Yes — print barcode labels directly from BiasharaPOS, or scan existing manufacturer barcodes. Works with any USB or Bluetooth scanner.' },
      { q: 'Can I see which items are not selling?', a: 'Yes — the dead-stock report shows slow-moving items by category, so you can run promotions or return to suppliers.' },
      { q: 'Does it accept M-Pesa for boutique sales?', a: 'Yes. You take payment on your own M-Pesa, Mixx by Yas or Airtel till as you do today, then record it against the sale with its confirmation code. Cash and card go on the same receipt.' },
      { q: 'Can my customers buy online?', a: 'Yes — open a Boutique storefront and share the link or a product QR on WhatsApp or Instagram. Customers order without creating an account, choose pickup or delivery, and follow the order on a tracking page in Swahili or English. Online orders reserve stock from the same inventory as the till.' },
    ],
  },

  retail: {
    slug: 'retail',
    badgeKey: 'retail',
    name: { en: 'Retail', sw: 'Rejareja' },
    headline: { en: 'POS for retail shops & supermarkets in Tanzania', sw: 'POS kwa maduka ya rejareja na supermarket Tanzania' },
    seoTitle: 'POS for Retail Shops & Supermarkets in Tanzania | BiasharaPOS',
    seoDescription:
      'BiasharaPOS — the POS for retail and supermarkets in Tanzania. Barcode scanning, bulk import, low-stock alerts, M-Pesa, audit-ready. Real profit per sale.',
    shortDesc: { en: 'Barcodes, bulk import, stock.', sw: 'Misimbo, uingizaji wa wingi, stoki.' },
    heroSubhead: {
      en: 'Scan barcodes, import thousands of SKUs from Excel, get low-stock alerts and see your real profit margin on every basket.',
      sw: 'Skani misimbo, ingiza maelfu ya SKUs kutoka Excel, pata tahadhari za stoki ndogo, na uone faida halisi kwa kila kikapu.',
    },
    photo: retail,
    alt: 'Tanzanian retail supermarket',
    tillItems: [
      { label: 'Sukari 1kg × 2', price: '6,400' },
      { label: 'Mafuta 2L', price: '9,500' },
      { label: 'Mchele 5kg', price: '22,000' },
    ],
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
      'BiasharaPOS — the POS for Tanzanian restaurants, cafés and bars. Table management, kitchen display, split bills, recipe costing and real margin per plate.',
    shortDesc: { en: 'Tables & kitchen tickets.', sw: 'Meza na tiketi za jikoni.' },
    heroSubhead: {
      en: 'Manage tables, send orders straight to the kitchen, split bills at the end of the night, and see the real margin on every plate.',
      sw: 'Simamia meza, tuma maagizo moja kwa moja jikoni, gawanya bili usiku, na uone faida halisi kwa kila sahani.',
    },
    photo: restaurant,
    alt: 'Restaurant interior with diners',
    tillItems: [
      { label: 'Nyama Choma × 2', price: '36,000' },
      { label: 'Pilau', price: '9,000' },
      { label: 'Soda × 3', price: '4,500' },
    ],
    sampleNet: '+TZS 3,400',
    sampleSales: 'TZS 528,000',
    sampleTx: '36',
    features: [
      { icon: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 12h16M12 4v16"/>', title: 'Tables and covers', desc: 'Sections and tables with live state, covers and the waiter assigned — each table with its own QR for the diners sitting at it.' },
      { icon: '<path d="M6 3v6a3 3 0 0 0 3 3M18 3v6a3 3 0 0 1-3 3M12 12v9"/>', title: 'Kitchen tickets', desc: 'The order prints in the kitchen the moment the waiter fires it, and the bill and receipt at the cashier, over an ordinary thermal printer.' },
      { icon: '<path d="M4 7h16M4 12h10M4 17h7"/><circle cx="18" cy="16" r="3"/>', title: 'A kitchen screen that nags', desc: 'Tickets by station with prep timers that turn amber, then red, against your own target times — with a chime when one is late.' },
      { icon: '<path d="M4 19V5M4 19h16M8 16l3-4 3 2 4-6"/>', title: 'Recipe costing', desc: 'Track ingredient cost per dish so you know your real margin — not just the menu price.' },
    ],
    faqs: [
      { q: 'Can I split a bill between guests?', a: 'Yes — split the bill for a table item by item into separate bills so each guest pays their own, and take a single bill across cash, M-Pesa and card together.' },
      { q: 'Do orders print at the kitchen automatically?', a: 'Yes — connect a thermal printer on your shop network and the kitchen ticket prints the moment the waiter fires the order. The bill and fiscal receipt print at the cashier.' },
      { q: 'Can I track the cost of ingredients per dish?', a: 'Yes — recipe costing lets you log ingredients per menu item, so you see your real profit margin per plate.' },
      { q: 'Does it support M-Pesa Lipa Namba for orders?', a: 'Yes. You take payment on your own M-Pesa, Mixx by Yas or Airtel till as you do today, then record it against the sale with its confirmation code. Cash and card go on the same receipt.' },
    ],
  },

  hospital: {
    slug: 'hospital',
    badgeKey: 'hosp',
    name: { en: 'Hospital', sw: 'Hospitali' },
    headline: { en: 'POS & billing for clinics and hospitals in Tanzania', sw: 'POS na bili kwa zahanati na hospitali Tanzania' },
    seoTitle: 'POS & Billing for Clinics & Hospitals in Tanzania | BiasharaPOS',
    seoDescription:
      'BiasharaPOS — billing for Tanzanian clinics, hospitals and pharmacies. Patient billing, lab + pharmacy on one invoice, role-based access, a counter that keeps selling offline, audit-ready fiscal receipts.',
    shortDesc: { en: 'Patient billing & records.', sw: 'Utozaji wa wagonjwa na kumbukumbu.' },
    heroSubhead: {
      en: 'Bill patients for consultation, lab and pharmacy on one invoice. Role-based access keeps records private, and the whole thing keeps working when the line goes down.',
      sw: 'Toza wagonjwa kwa ushauri, maabara na duka la dawa kwa bili moja. Udhibiti wa ufikiaji unalinda kumbukumbu, na mfumo unaendelea kufanya kazi mtandao ukikatika.',
    },
    photo: hospital,
    alt: 'Hospital reception desk',
    tillItems: [
      { label: 'Ushauri wa daktari', price: '20,000' },
      { label: 'Kipimo cha malaria', price: '8,000' },
      { label: 'Dawa', price: '12,500' },
    ],
    sampleNet: '+TZS 12,500',
    sampleSales: 'TZS 1,240,000',
    sampleTx: '14',
    features: [
      { icon: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>', title: 'Patient profiles', desc: 'Full patient records — visits, prescriptions, lab results, balance owed — all in one place.' },
      { icon: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/>', title: 'Combined invoicing', desc: 'Bill consultation, labs, X-ray and pharmacy on a single audit-ready invoice.' },
      { icon: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/>', title: 'Tamper-evident records', desc: 'Every invoice is chained to the one before it, so an altered or deleted charge shows up in the audit trail.' },
      { icon: '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0M16 6a3 3 0 0 1 0 6M21 20a5 5 0 0 0-4-5"/>', title: 'Role-based access', desc: 'Doctors, nurses, cashiers and admins each see only what they should. Full audit trail.' },
    ],
    faqs: [
      { q: 'Can I bill a patient for consultation, labs and pharmacy in one invoice?', a: 'Yes — every charge added to a patient visit appears on a single audit-ready invoice at checkout.' },
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
      'BiasharaPOS — the POS for Tanzanian pharmacies. Expiry alerts, batch tracking (FEFO), prescription logging, supplier management, audit-ready fiscal receipts.',
    shortDesc: { en: 'Expiry dates & batches.', sw: 'Tarehe za mwisho na bechi.' },
    heroSubhead: {
      en: 'Track expiry dates, batch numbers and prescriptions on every sale. First-expiry-first-out is automatic — no more wasted stock.',
      sw: 'Fuatilia tarehe za mwisho, namba za bechi na maagizo ya daktari kwa kila mauzo. FEFO ni otomatiki — hakuna stoki inayopotea tena.',
    },
    photo: pharmacy,
    alt: 'Pharmacy counter with dispenser',
    tillItems: [
      { label: 'Paracetamol × 2', price: '5,000' },
      { label: 'Amoxicillin', price: '7,000' },
      { label: 'ORS Sachet × 3', price: '3,600' },
    ],
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

  barbershop: {
    slug: 'barbershop',
    badgeKey: 'barber',
    name: { en: 'Barbershop', sw: 'Kinyozi' },
    headline: { en: 'POS for barbershops & salons in Tanzania', sw: 'POS kwa vinyozi na saluni Tanzania' },
    seoTitle: 'POS for Barbershops & Salons in Tanzania | BiasharaPOS',
    seoDescription:
      'BiasharaPOS — the POS for Tanzanian barbershops & salons. Walk-in queue, barber commissions & tips, appointments, product retail, M-Pesa, audit-ready fiscal receipts.',
    shortDesc: { en: 'Queue, chairs & commissions.', sw: 'Foleni, viti na kamisheni.' },
    heroSubhead: {
      en: 'Manage the walk-in queue, book appointments, split commissions and tips per barber, and sell products at the counter — with real profit on every cut.',
      sw: 'Simamia foleni ya wateja, weka miadi, gawanya kamisheni na bahashishi kwa kila kinyozi, na uze bidhaa kaunta — na faida halisi kwa kila mkato.',
    },
    photo: barbershop,
    alt: 'Barbers cutting hair in a modern Tanzanian barbershop',
    tillItems: [
      { label: 'Kunyoa nywele', price: '5,000' },
      { label: 'Kunyoa ndevu', price: '3,000' },
      { label: 'Mafuta ya nywele', price: '8,000' },
    ],
    sampleNet: '+TZS 2,800',
    sampleSales: 'TZS 265,000',
    sampleTx: '21',
    features: [
      { icon: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.5 8.5L20 20M8.5 15.5L20 4"/>', title: 'Walk-in queue', desc: 'Customers join the queue at the door. Barbers call the next client from their chair — no shouting, no lost turns.' },
      { icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 11h-6M19 8v6"/>', title: 'Commissions & tips', desc: 'Set a commission rate per barber. Every sale and tip is split automatically — payday takes minutes, not hours.' },
      { icon: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>', title: 'Appointments & reminders', desc: 'Book regulars in advance, color-coded per barber. SMS reminders cut no-shows.' },
      { icon: '<path d="M6 7h12l-1 13H7L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/>', title: 'Services + product retail', desc: 'Ring up a fade and a pomade on one receipt. Track stock of oils, waxes and shampoos with low-stock alerts.' },
    ],
    faqs: [
      { q: 'Can barbers see their own queue and earnings?', a: 'Yes — each barber has a PIN login showing their queue, completed cuts, commission and tips for the day. Admins see everyone.' },
      { q: 'How are commissions and tips calculated?', a: 'Set a commission percentage per barber. Every service sale is split automatically between shop and barber, and tips are tracked separately per barber.' },
      { q: 'Can I sell products like pomade and beard oil too?', a: 'Yes — services and retail products go on the same audit-ready receipt, and product stock is tracked with low-stock alerts.' },
      { q: 'Does it handle walk-ins and appointments together?', a: 'Yes — walk-ins join the live queue while booked appointments hold their slot. The queue reorders automatically so nobody loses their place.' },
    ],
  },
};

export const verticalSlugs = Object.keys(verticals) as Vertical['slug'][];
