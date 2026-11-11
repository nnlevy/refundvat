import test from 'node:test';
import assert from 'node:assert/strict';
import { COUNTRIES, vatInside, parseAmount, formatMoney } from '../src/worker/vat.ts';
import { renderHome, FAQ } from '../src/worker/page.ts';

test('27 EU countries, unique codes, rates within the EU floor and today\'s highest', () => {
  assert.equal(COUNTRIES.length, 27);
  assert.equal(new Set(COUNTRIES.map((c) => c.code)).size, 27);
  for (const c of COUNTRIES) assert.ok(c.rate >= 15 && c.rate <= 27, c.code);
  const r = Object.fromEntries(COUNTRIES.map((c) => [c.code, c.rate]));
  // Spot checks against EPRS 2026 Table 3 (1 July 2025) and its Romania note.
  assert.equal(r.DE, 19); assert.equal(r.FI, 25.5); assert.equal(r.HU, 27); assert.equal(r.LU, 17); assert.equal(r.RO, 21); assert.equal(r.SK, 23); assert.equal(r.EE, 24);
});

test('vatInside = price × rate / (100 + rate), to the cent', () => {
  assert.equal(vatInside(1200, 19), 191.6);
  assert.equal(vatInside(100, 20), 16.67);
  assert.equal(vatInside(99.99, 25.5), 20.32);
  assert.equal(vatInside(0, 20), null);
  assert.equal(vatInside(-5, 20), null);
  assert.equal(vatInside(NaN, 20), null);
  assert.equal(vatInside(100, 0), null);
});

test('parseAmount reads EU and US number styles', () => {
  assert.equal(parseAmount('1200'), 1200);
  assert.equal(parseAmount('1.200,50'), 1200.5);
  assert.equal(parseAmount('1,200.50'), 1200.5);
  assert.equal(parseAmount('€ 1 200'), 1200);
  assert.equal(parseAmount('1.200'), 1200);
  assert.equal(parseAmount('12,5'), 12.5);
  assert.equal(parseAmount(''), null);
  assert.equal(parseAmount('abc'), null);
});

test('formatMoney uses the country currency', () => {
  assert.equal(formatMoney(191.6, 'EUR'), '€191.60');
  assert.match(formatMoney(10, 'SEK'), /^SEK\s10\.00$/); // Intl uses a no-break space
});

test('page: no external scripts, no old placeholder numbers, every rate cited, FAQ JSON-LD matches visible FAQ', () => {
  const html = renderHome();
  assert.doesNotMatch(html, /<script[^>]+src=/i);
  assert.doesNotMatch(html, /local-sim|€180|240|Publisher:/);
  assert.match(html, /<h1>Refund VAT\. Keep More\.<\/h1>/);
  assert.match(html, /<title>RefundVAT\.info — VAT Refunds, Guides &amp; Automation for Business 2026<\/title>/);
  assert.match(html, /europarl\.europa\.eu\/RegData\/etudes\/BRIE\/2026\/782613/);
  for (const c of COUNTRIES) assert.ok(html.includes(`(${c.rate}%)`), c.code);
  const ld = JSON.parse(/<script type="application\/ld\+json">(.*?)<\/script>/s.exec(html)[1]);
  assert.equal(ld.mainEntity.length, FAQ.length);
  for (const f of FAQ) {
    assert.ok(html.includes(`<summary>${f.q}</summary>`), f.q);
    assert.ok(ld.mainEntity.some((m) => m.name === f.q && m.acceptedAnswer.text === f.a));
  }
});
