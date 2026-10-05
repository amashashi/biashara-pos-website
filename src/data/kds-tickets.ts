/**
 * Kitchen-display tickets for the FLEX 3 mock-ups.
 *
 * One list, sliced per surface, because the "N live" counter next to the tabs
 * has to agree with the number of cards drawn. It was hand-written in four
 * components and already said "4 live" over a grid that no longer held four.
 *
 * Decorative only — aria-hidden wherever it is rendered.
 */
export interface KdsTicket {
  state: 'ok' | 'warn' | 'late';
  table: string;
  items: string[];
  elapsed: string;
}

export const kdsTickets: KdsTicket[] = [
  { state: 'ok',   table: 'Meza D5',       items: ['Nyama Choma ×2', 'Chips Mayai'],        elapsed: '02:10' },
  { state: 'warn', table: 'Meza A3',       items: ['Pilau ×2', 'Chapati ×4'],               elapsed: '06:48' },
  { state: 'late', table: 'Takeaway 114',  items: ['Mishkaki ×3'],                          elapsed: '11:25' },
  { state: 'ok',   table: 'Meza C2',       items: ['Samaki wa Kupaka'],                     elapsed: '01:04' },
  { state: 'ok',   table: 'Meza B3',       items: ['Supu ya Ndizi ×2'],                     elapsed: '02:55' },
  { state: 'warn', table: 'Meza C8',       items: ['Kuku wa Kupaka', 'Wali'],               elapsed: '05:12' },
  { state: 'late', table: 'Delivery 0042', items: ['Pilau ×4', 'Kachumbari'],               elapsed: '14:06' },
  { state: 'ok',   table: 'Meza D2',       items: ['Ugali Nyama'],                          elapsed: '00:42' },
  { state: 'ok',   table: 'Meza A1',       items: ['Chipsi Kuku', 'Soda ×3'],               elapsed: '03:18' },
  { state: 'warn', table: 'Meza B7',       items: ['Wali Nyama ×2', 'Mchuzi wa Samaki'],    elapsed: '07:32' },
  { state: 'ok',   table: 'Takeaway 118',  items: ['Chipsi Mayai ×2'],                      elapsed: '01:38' },
  { state: 'late', table: 'Meza A6',       items: ['Mbuzi Choma ×3', 'Kachumbari'],         elapsed: '12:40' },
  { state: 'ok',   table: 'Meza D1',       items: ['Ndizi Nyama'],                          elapsed: '04:05' },
  { state: 'warn', table: 'Delivery 0043', items: ['Biriani ×2', 'Soda'],                   elapsed: '08:20' },
  { state: 'ok',   table: 'Meza C5',       items: ['Samaki wa Nazi'],                       elapsed: '00:58' },
  { state: 'ok',   table: 'Meza B2',       items: ['Mishkaki ×4', 'Chipsi'],                elapsed: '03:44' },
];

/**
 * How many tickets fill the screen. One number, not one per surface: every
 * size inside .flex-screen is derived from the drawing's width (--fu in
 * landing.css), so the same count fills the hero, the Devices stage and the
 * Industries strip alike.
 */
export const kdsVisible = 12;
