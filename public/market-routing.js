/* Marketing-market selection only; this does not change an account's billing country. */
(function () {
  'use strict';
  var KEY = 'biashara-country';
  var CACHE = 'biashara-detected-country';
  var valid = function (value) { return ['KE', 'TZ', 'GLOBAL'].indexOf(value) !== -1; };
  var current = /^\/(ke|tz)(?:\/|$)/.exec(location.pathname);
  var currentMarket = current ? current[1].toUpperCase() : 'GLOBAL';
  var basePath = location.pathname.replace(/^\/(ke|tz)(?=\/|$)/, '') || '/';
  var interacted = false;
  function read(key) { try { return localStorage.getItem(key); } catch (_) { return null; } }
  function write(key, value) { try { localStorage.setItem(key, value); } catch (_) {} }
  function go(market) {
    if (!valid(market) || market === currentMarket) return;
    var prefix = market === 'GLOBAL' ? '' : '/' + market.toLowerCase();
    location.replace(prefix + basePath + location.search + location.hash);
  }
  document.addEventListener('DOMContentLoaded', function () {
    var select = document.getElementById('countrySelector');
    if (select) select.addEventListener('change', function () {
      interacted = true;
      if (select.value === 'AUTO') {
        try { localStorage.removeItem(KEY); localStorage.removeItem(CACHE); } catch (_) {}
        location.replace(basePath + location.search + location.hash);
        return;
      }
      write(KEY, select.value);
      go(select.value);
    });
    // Do not navigate away after someone starts reading, typing, or using the page.
    ['pointerdown','keydown','touchstart','scroll'].forEach(function (event) {
      window.addEventListener(event, function () { interacted = true; }, {once:true, passive:true});
    });
    // Explicit country URLs remain shareable, even on a VPN or while travelling.
    if (current) return;
    var saved = read(KEY);
    if (valid(saved)) { go(saved); return; }
    try {
      var cached = JSON.parse(read(CACHE) || 'null');
      if (cached && valid(cached.country) && Date.now() - cached.time < 86400000) { go(cached.country); return; }
    } catch (_) {}
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, 2500);
    fetch('https://api.country.is/', {signal:controller.signal, credentials:'omit', referrerPolicy:'no-referrer'})
      .then(function (response) { if (!response.ok) throw new Error('Country lookup unavailable'); return response.json(); })
      .then(function (data) {
        var country = data.country === 'KE' || data.country === 'TZ' ? data.country : 'GLOBAL';
        write(CACHE, JSON.stringify({country:country,time:Date.now()}));
        // A choice made while the request was in flight always wins.
        if (!interacted && !valid(read(KEY))) go(country);
      })
      .catch(function () { /* Network failure leaves the international site usable. */ })
      .finally(function () { clearTimeout(timer); });
  });
})();
