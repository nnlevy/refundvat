import { BUSINESS_SOURCE, COUNTRIES, PROCESS_SOURCE, RATES_SOURCE, formatMoney, parseAmount, vatInside } from "./vat.ts";

const esc = (s: string) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Visible FAQ; the FAQPage JSON-LD below is built from these same strings.
export const FAQ: { q: string; a: string }[] = [
  {
    q: "Who can get a VAT refund on shopping in the EU?",
    a: "People who live outside the EU can claim back VAT on goods they buy during a stay and take home with them. People who live in an EU country are not covered.",
  },
  {
    q: "How long do I have?",
    a: "Show the goods and your refund documents to customs when you leave the EU, within 3 months of buying them. Customs must validate every claim, digitally or with a stamp, before you leave.",
  },
  {
    q: "Is there a minimum amount I have to spend?",
    a: "There is no EU-wide minimum, but some countries set a minimum purchase value or other conditions. Ask the shop before you pay.",
  },
  {
    q: "Will I get all of the VAT back?",
    a: "Not always. The calculator shows the VAT inside your price at the standard rate. Some goods use a reduced rate, and if a refund company handles your claim, what it pays you can be lower. Ask at the shop how the refund is paid.",
  },
];

const STEPS = [
  { t: "At the shop", d: "Say you live outside the EU and ask for the VAT refund (tax-free) form before you pay. Keep the receipt with it." },
  { t: "At the airport or border", d: "Before check-in, show the unused goods, receipts and forms to customs. They validate the claim, digitally or with a stamp." },
  { t: "Get paid", d: "Send or scan the validated form the way the shop or refund company tells you. Leave the EU within 3 months of buying." },
];

function faqJsonLd(): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

const CSS = `
:root{--ink:#0f2a2a;--muted:#4a6261;--line:#d6e4e1;--bg:#f3f8f7;--card:#ffffff;--brand:#0b6b5c;--brand-ink:#ffffff;--soft:#e3f1ee;--accent:#b7791f;--focus:#0b6b5c;color-scheme:light}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;text-size-adjust:100%}
body{margin:0;font:16px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;color:var(--ink);background:var(--bg);overflow-wrap:break-word}
a{color:var(--brand)}
.wrap{max-width:960px;margin:0 auto;padding:0 16px}
.nav{background:var(--card);border-bottom:1px solid var(--line)}
.nav .wrap{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:60px}
.brand{display:inline-flex;align-items:center;gap:10px;font-weight:800;font-size:18px;color:var(--ink);text-decoration:none;min-height:44px}
.brand-mark{width:30px;height:30px;border-radius:8px;background:var(--brand);color:#fff;display:grid;place-items:center;font-size:14px;font-weight:800;letter-spacing:-.02em}
.nav-links{display:flex;gap:4px}
.nav-links a{display:inline-flex;align-items:center;min-height:44px;padding:0 10px;color:var(--muted);text-decoration:none;font-weight:600;font-size:15px}
.hero{padding:28px 0 8px}
.eyebrow{margin:0 0 8px;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--brand)}
h1{margin:0 0 10px;font-size:clamp(30px,6vw,44px);line-height:1.08;letter-spacing:-.02em}
.lede{margin:0;max-width:40rem;font-size:17px;color:var(--muted)}
.tool{margin:20px 0 8px;background:var(--card);border:1px solid var(--line);border-radius:18px;padding:18px;box-shadow:0 18px 40px rgba(15,42,42,.08)}
.tool h2{margin:0 0 12px;font-size:19px}
.q{margin:0 0 8px;font-weight:700;font-size:15px}
.chips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
.chip{min-height:44px;padding:8px 16px;border-radius:999px;border:1.5px solid var(--line);background:var(--card);color:var(--ink);font:700 15px/1 inherit;font-family:inherit;cursor:pointer}
.chip[aria-pressed="true"]{background:var(--ink);border-color:var(--ink);color:#fff}
.fields{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:10px}
label.f{display:grid;gap:4px;font-size:14px;font-weight:700;color:var(--muted);min-width:0}
select,input{min-height:48px;width:100%;min-width:0;padding:10px 12px;border:1.5px solid var(--line);border-radius:12px;background:#fff;color:var(--ink);font:16px inherit;font-family:inherit}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:10px 18px;border-radius:12px;border:0;background:var(--brand);color:var(--brand-ink);font:700 16px inherit;font-family:inherit;cursor:pointer;text-decoration:none}
.btn.secondary{background:var(--soft);color:var(--ink);border:1.5px solid var(--line)}
.go{margin-top:12px;width:100%}
:focus-visible{outline:3px solid var(--focus);outline-offset:2px}
.result{margin-top:16px;padding:16px;border-radius:14px;background:var(--soft);border:1px solid var(--line)}
.result[hidden]{display:none}
.big{margin:0;font-size:clamp(28px,7vw,38px);font-weight:800;letter-spacing:-.02em;color:var(--ink)}
.big-sub{margin:2px 0 10px;font-size:15px;color:var(--muted)}
.note{margin:0 0 12px;font-size:14px;color:var(--muted)}
.src{font-size:13px;color:var(--muted)}
.checklist{margin:12px 0;padding:0;list-style:none;counter-reset:s;display:grid;gap:8px}
.checklist li{counter-increment:s;display:grid;grid-template-columns:28px 1fr;gap:10px;align-items:start;font-size:15px}
.checklist li::before{content:counter(s);width:28px;height:28px;border-radius:50%;background:var(--brand);color:#fff;display:grid;place-items:center;font-weight:800;font-size:14px}
.row{display:flex;flex-wrap:wrap;gap:8px}
.status{min-height:1.3em;margin:8px 0 0;font-size:14px;font-weight:700;color:var(--brand)}
.not-eu{margin-top:14px;padding:14px;border-radius:12px;background:#fff8ec;border:1px solid #f1dcb4;font-size:15px}
.not-eu[hidden]{display:none}
section.block{padding:26px 0 6px}
section.block h2{margin:0 0 12px;font-size:22px;letter-spacing:-.01em}
.steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.step{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px}
.step b{display:block;margin-bottom:4px}
.step p{margin:0;font-size:15px;color:var(--muted)}
details{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:0 14px;margin-bottom:8px}
summary{min-height:48px;display:flex;align-items:center;font-weight:700;cursor:pointer}
details p{margin:0 0 14px;color:var(--muted)}
.biz{font-size:15px;color:var(--muted)}
footer{margin-top:28px;padding:20px 0 30px;border-top:1px solid var(--line);font-size:13px;color:var(--muted)}
footer a{display:inline-flex;align-items:center;min-height:44px;color:var(--muted)}
@media (max-width:640px){.fields{grid-template-columns:minmax(0,1fr)}.steps{grid-template-columns:minmax(0,1fr)}.nav-links a{padding:0 8px;font-size:14px}}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important;scroll-behavior:auto!important}}
`;

function clientScript(): string {
  const countries = JSON.stringify(COUNTRIES.map((c) => [c.code, c.name, c.rate, c.currency]));
  return `(function(){
var vatInside=${vatInside.toString()};
var parseAmount=${parseAmount.toString()};
var formatMoney=${formatMoney.toString()};
var C=${countries};
var $=function(id){return document.getElementById(id)};
var form=$('vat-form'),res=$('vat-result'),notEu=$('not-eu'),status=$('vat-status');
var outside=true,last=null;
document.querySelectorAll('[data-res]').forEach(function(b){b.addEventListener('click',function(){
  outside=b.getAttribute('data-res')==='outside';
  document.querySelectorAll('[data-res]').forEach(function(x){x.setAttribute('aria-pressed',String(x===b))});
  notEu.hidden=outside; if(!outside){res.hidden=true}
});});
form.addEventListener('submit',function(e){
  e.preventDefault();
  if(!outside){notEu.hidden=false;return}
  var code=$('vat-country').value,row=null;
  for(var i=0;i<C.length;i++){if(C[i][0]===code){row=C[i]}}
  var amount=parseAmount($('vat-amount').value);
  if(!row){status.textContent='Pick the country where you paid.';$('vat-country').focus();return}
  if(!amount){status.textContent='Type what you paid, VAT included, as on the receipt.';$('vat-amount').focus();return}
  var v=vatInside(amount,row[2]);
  if(v===null){status.textContent='That amount looks off. Type the receipt total.';return}
  status.textContent='';
  $('vat-big').textContent=formatMoney(v,row[3]);
  $('vat-sub').textContent='VAT inside '+formatMoney(amount,row[3])+' in '+row[1]+', at its standard rate of '+row[2]+'%.';
  last={country:row[1],vat:formatMoney(v,row[3]),paid:formatMoney(amount,row[3]),rate:row[2]};
  res.hidden=false;
  try{history.replaceState(null,'','#'+row[0].toLowerCase()+'-'+Math.round(amount))}catch(e){}
});
$('vat-share').addEventListener('click',function(){
  if(!last)return;
  var text='VAT inside '+last.paid+' in '+last.country+': '+last.vat+' (standard rate '+last.rate+'%).\\n1. At the shop: ask for the VAT refund form before you pay.\\n2. At the airport: show goods, receipts and forms to customs before check-in.\\n3. Leave the EU within 3 months of buying.';
  var url='https://refundvat.info/';
  if(navigator.share){navigator.share({title:'My VAT refund checklist',text:text,url:url}).catch(function(){})}
  else if(navigator.clipboard){navigator.clipboard.writeText(text+'\\n'+url).then(function(){status.textContent='Checklist copied.'},function(){status.textContent=url})}
});
var m=/^#([a-z]{2})-(\\d{1,7})$/.exec(location.hash||'');
if(m){var sel=$('vat-country');for(var j=0;j<C.length;j++){if(C[j][0].toLowerCase()===m[1]){sel.value=C[j][0];$('vat-amount').value=m[2];form.requestSubmit?form.requestSubmit():form.dispatchEvent(new Event('submit',{cancelable:true}))}}}
})();`;
}

export function renderHome(): string {
  const options = COUNTRIES.map((c) => `<option value="${c.code}">${esc(c.name)} (${c.rate}%)</option>`).join("");
  const steps = STEPS.map((s) => `<div class="step"><b>${esc(s.t)}</b><p>${esc(s.d)}</p></div>`).join("");
  const faq = FAQ.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("");
  return `<!DOCTYPE html><html lang="en" data-delight="calm"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>RefundVAT.info — VAT Refunds, Guides &amp; Automation for Business 2026</title>
<meta name="description" content="Shopping in the EU and live outside it? See how much VAT is inside your receipt at each country's standard rate, and the three steps to claim it back before you fly home.">
<link rel="canonical" href="https://refundvat.info/">
<link rel="sitemap" href="/sitemap.xml">
<style>${CSS}</style>
<script type="application/ld+json">${faqJsonLd()}</script>
</head><body>
<nav class="nav" aria-label="Primary"><div class="wrap"><a class="brand" href="/"><span class="brand-mark" aria-hidden="true">VAT</span>RefundVAT</a><div class="nav-links"><a href="#how">How it works</a><a href="#faq">FAQ</a></div></div></nav>
<main>
<header class="hero"><div class="wrap">
<p class="eyebrow">VAT refunds for visitors to the EU</p>
<h1>Refund VAT. Keep More.</h1>
<p class="lede">Live outside the EU and shopping here? See how much VAT is inside your receipt, then the three steps to claim it before you leave.</p>
<form class="tool" id="vat-form" novalidate>
<h2>How much VAT is in my receipt?</h2>
<p class="q" id="res-q">Where do you live?</p>
<div class="chips" role="group" aria-labelledby="res-q"><button type="button" class="chip" data-res="outside" aria-pressed="true">Outside the EU</button><button type="button" class="chip" data-res="inside" aria-pressed="false">In an EU country</button></div>
<div class="fields">
<label class="f">Country where you paid<select id="vat-country" required><option value="">Choose a country</option>${options}</select></label>
<label class="f">Receipt total, VAT included<input id="vat-amount" inputmode="decimal" autocomplete="off" placeholder="e.g. 1200" maxlength="16"></label>
</div>
<button type="submit" class="btn go">Show the VAT in it</button>
<p class="status" id="vat-status" role="status" aria-live="polite"></p>
<div class="not-eu" id="not-eu" hidden>This refund is for people who live outside the EU. If you live in an EU country, you can't claim VAT back on shopping in another EU country this way. <span class="src">Source: <a href="${PROCESS_SOURCE.url}" target="_blank" rel="noopener">${esc(PROCESS_SOURCE.label)}</a></span></div>
<div class="result" id="vat-result" hidden aria-live="polite">
<p class="big" id="vat-big"></p>
<p class="big-sub" id="vat-sub"></p>
<p class="note">That is the most VAT in this price at the standard rate. Some goods use a lower rate, some countries set a minimum spend, and a refund company may pay you less than this. Ask the shop how the refund is paid.</p>
<p class="q">Your checklist</p>
<ol class="checklist"><li>At the shop: ask for the VAT refund form before you pay.</li><li>At the airport or border: show the goods, receipts and forms to customs before check-in.</li><li>Leave the EU within 3 months of buying.</li></ol>
<div class="row"><button type="button" class="btn secondary" id="vat-share">Send me this checklist</button><a class="btn secondary" href="#how">How it works</a></div>
<p class="src">Rate: <a href="${RATES_SOURCE.url}" target="_blank" rel="noopener">${esc(RATES_SOURCE.label)}</a>. Steps: <a href="${PROCESS_SOURCE.url}" target="_blank" rel="noopener">${esc(PROCESS_SOURCE.label)}</a>.</p>
</div>
</form>
</div></header>
<section class="block" id="how"><div class="wrap">
<h2>How the refund works</h2>
<div class="steps">${steps}</div>
<p class="src">The process is not the same in every EU country, and the shop or a refund company may handle it. Source: <a href="${PROCESS_SOURCE.url}" target="_blank" rel="noopener">${esc(PROCESS_SOURCE.label)}</a>.</p>
</div></section>
<section class="block" id="faq"><div class="wrap">
<h2>Common questions</h2>
${faq}
<p class="src">Answers follow <a href="${PROCESS_SOURCE.url}" target="_blank" rel="noopener">${esc(PROCESS_SOURCE.label)}</a>. Rates as of ${esc(RATES_SOURCE.asOf)}: <a href="${RATES_SOURCE.url}" target="_blank" rel="noopener">EPRS</a>.</p>
<p class="biz">Buying for a business in another EU country? That is a different refund process: see <a href="${BUSINESS_SOURCE.url}" target="_blank" rel="noopener">${esc(BUSINESS_SOURCE.label)}</a>.</p>
</div></section>
</main>
<footer><div class="wrap">General information, not tax advice. © refundvat.info · <a href="https://growth.business">growth.business</a> · <a href="/ads.txt">ads.txt</a> · <a href="/sitemap.xml">Sitemap</a> · Network: <a href="https://watershortcut.com">watershortcut.com</a> · <a href="https://affordablehome.us">affordablehome.us</a></div></footer>
<script>${clientScript()}</script>
</body></html>`;
}
