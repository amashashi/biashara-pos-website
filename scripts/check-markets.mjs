import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const source = readFileSync('public/market-routing.js', 'utf8');
async function visit({path='/',saved=null,cache=null,country='KE',offline=false,storageBlocked=false,choose=null,interaction=false}={}) {
 const values=new Map(); if(saved) values.set('biashara-country',saved); if(cache)values.set('biashara-detected-country',JSON.stringify(cache));
 const routes=[];let requests=0;const events={};const select={value:'GLOBAL',addEventListener:(_,f)=>{events.change=f}};
 const location={pathname:path,search:'?ref=partner',hash:'#pricing',replace:url=>routes.push(url)};
 const storage={getItem:k=>{if(storageBlocked)throw Error('blocked');return values.get(k)||null},setItem:(k,v)=>{if(storageBlocked)throw Error('blocked');values.set(k,v)},removeItem:k=>values.delete(k)};
 vm.runInNewContext(source,{location,localStorage:storage,AbortController,setTimeout,clearTimeout,Date,fetch:()=>{requests++;return offline?Promise.reject(Error('offline')):Promise.resolve({ok:true,json:async()=>({country})})},document:{addEventListener:(_,f)=>{events.ready=f},getElementById:()=>select},window:{addEventListener:(name,f)=>{events[name]=f}}});
 events.ready();if(choose){select.value=choose;events.change()}if(interaction)events.pointerdown();
 await new Promise(resolve=>setImmediate(resolve));return {routes,requests,values};
}
assert.deepEqual((await visit()).routes,['/ke/?ref=partner#pricing']);
assert.deepEqual((await visit({country:'TZ',path:'/pos-for-retail/'})).routes,['/tz/pos-for-retail/?ref=partner#pricing']);
assert.deepEqual((await visit({saved:'TZ',country:'KE'})).routes,['/tz/?ref=partner#pricing']);
assert.equal((await visit({saved:'GLOBAL'})).requests,0);
assert.deepEqual((await visit({path:'/ke/',saved:'TZ'})).routes,[]);
assert.equal((await visit({path:'/tz/'})).requests,0);
assert.deepEqual((await visit({country:'GB'})).routes,[]);
assert.deepEqual((await visit({offline:true})).routes,[]);
assert.deepEqual((await visit({country:'KE',interaction:true})).routes,[]);
assert.deepEqual((await visit({choose:'TZ'})).routes,['/tz/?ref=partner#pricing']);
assert.deepEqual((await visit({path:'/ke/terms/',choose:'GLOBAL'})).routes,['/terms/?ref=partner#pricing']);
assert.deepEqual((await visit({storageBlocked:true,choose:'TZ'})).routes,['/tz/?ref=partner#pricing']);
assert.deepEqual((await visit({cache:{country:'TZ',time:Date.now()}})).routes,['/tz/?ref=partner#pricing']);
assert.deepEqual((await visit({cache:{country:'TZ',time:0},country:'KE'})).routes,['/ke/?ref=partner#pricing']);
assert.deepEqual((await visit({path:'/ke/',saved:'KE',choose:'AUTO'})).routes,['/?ref=partner#pricing']);
console.log('Country selection: 15 checks passed (detection, override, travel URLs, storage, races, failure and reset).');
// Validate rendered country pages, including invisible SEO/FAQ data that can expose stale pricing.
for(const [path,market,prices] of [['ke','KE',['KES 2,499','KES 4,999','KES 10,000']],['tz','TZ',['TZS 60,000','TZS 150,000','TZS 90,000']],['','GLOBAL',[]]]){
 const html=readFileSync(`dist/${path ? path+'/' : ''}index.html`,'utf8');
 assert.ok(html.includes(`data-market="${market}"`));
 for(const price of prices)assert.ok(html.includes(price),`Missing ${market} price ${price}`);
 if(market!=='TZ'){
  assert.ok(!/TZS (?:60,000|90,000|150,000)/.test(html),'Tanzania prices leaked into '+market);
  assert.ok(!html.includes('Save 33%'),'Tanzania promotion leaked into '+market);
 }
 assert.ok(!html.includes('TRA VFD')&&!html.includes('Mixx by Yas'));
 if(market==='KE'){
  assert.ok(html.includes('BUILT FOR BUSINESS IN KENYA'));
  assert.ok(html.includes('KRA eTIMS integration is not currently available'));
  assert.ok(html.includes('https://biashara-pos.com/ke/'));
  assert.ok(html.includes('priceCurrency":"KES"'));
 }else if(market==='GLOBAL')assert.ok(!html.includes('priceCurrency'));
}
for(const market of ['ke','tz'])for(const page of ['terms','privacy','cookies','pos-for-retail','pos-for-restaurant']){
 const html=readFileSync(`dist/${market}/${page}/index.html`,'utf8');
 assert.ok(html.includes(`data-market="${market.toUpperCase()}"`));
 assert.ok(html.includes(`href="/${market}/#pricing"`),'Navigation loses market');
 assert.ok(!html.includes('TRA VFD')&&!html.includes('Tanzania Revenue Authority'));
}
console.log('Rendered markets: pricing, promotions, bot market context, neutral copy, legal pages and SEO passed.');
