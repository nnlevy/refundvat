// EU standard VAT rates and the tourist-refund maths behind the refundvat.info home page.
// Every rate below is from one source, shown on the page next to the result:
//   European Parliamentary Research Service, "Highs and lows: VAT rate-setting in the
//   European Union" (2026), Table 3: standard rates as of 1 July 2025, plus its note that
//   Romania raised its standard rate to 21% on 1 August 2025.
// Code computes every number the visitor sees; nothing here comes from AI.

export const RATES_SOURCE = {
  label: "European Parliament (EPRS), VAT rate-setting in the EU, 2026: standard rates as of 1 July 2025",
  url: "https://www.europarl.europa.eu/RegData/etudes/BRIE/2026/782613/EPRS_BRI(2026)782613_EN.pdf",
  asOf: "1 July 2025 (Romania: 1 August 2025)",
};

export const PROCESS_SOURCE = {
  label: "Your Europe (European Union): VAT refunds when you leave the EU",
  url: "https://europa.eu/youreurope/citizens/consumers/shopping/vat/index_en.htm",
};

export const BUSINESS_SOURCE = {
  label: "European Commission: VAT refunds",
  url: "https://taxation-customs.ec.europa.eu/taxation/vat/vat-directive/vat-refunds_en",
};

export type Country = { code: string; name: string; rate: number; currency: string };

// currency = the currency prices are usually shown in, so the result reads naturally.
export const COUNTRIES: Country[] = [
  { code: "AT", name: "Austria", rate: 20, currency: "EUR" },
  { code: "BE", name: "Belgium", rate: 21, currency: "EUR" },
  { code: "BG", name: "Bulgaria", rate: 20, currency: "EUR" },
  { code: "HR", name: "Croatia", rate: 25, currency: "EUR" },
  { code: "CY", name: "Cyprus", rate: 19, currency: "EUR" },
  { code: "CZ", name: "Czechia", rate: 21, currency: "CZK" },
  { code: "DK", name: "Denmark", rate: 25, currency: "DKK" },
  { code: "EE", name: "Estonia", rate: 24, currency: "EUR" },
  { code: "FI", name: "Finland", rate: 25.5, currency: "EUR" },
  { code: "FR", name: "France", rate: 20, currency: "EUR" },
  { code: "DE", name: "Germany", rate: 19, currency: "EUR" },
  { code: "GR", name: "Greece", rate: 24, currency: "EUR" },
  { code: "HU", name: "Hungary", rate: 27, currency: "HUF" },
  { code: "IE", name: "Ireland", rate: 23, currency: "EUR" },
  { code: "IT", name: "Italy", rate: 22, currency: "EUR" },
  { code: "LV", name: "Latvia", rate: 21, currency: "EUR" },
  { code: "LT", name: "Lithuania", rate: 21, currency: "EUR" },
  { code: "LU", name: "Luxembourg", rate: 17, currency: "EUR" },
  { code: "MT", name: "Malta", rate: 18, currency: "EUR" },
  { code: "NL", name: "Netherlands", rate: 21, currency: "EUR" },
  { code: "PL", name: "Poland", rate: 23, currency: "PLN" },
  { code: "PT", name: "Portugal", rate: 23, currency: "EUR" },
  { code: "RO", name: "Romania", rate: 21, currency: "RON" },
  { code: "SK", name: "Slovakia", rate: 23, currency: "EUR" },
  { code: "SI", name: "Slovenia", rate: 22, currency: "EUR" },
  { code: "ES", name: "Spain", rate: 21, currency: "EUR" },
  { code: "SE", name: "Sweden", rate: 25, currency: "SEK" },
];

/** VAT contained in a VAT-inclusive price: price × rate / (100 + rate), rounded to cents. */
export function vatInside(price: number, rate: number): number | null {
  if (!Number.isFinite(price) || !Number.isFinite(rate) || price <= 0 || price > 10_000_000 || rate <= 0 || rate >= 100) return null;
  return Math.round(((price * rate) / (100 + rate)) * 100) / 100;
}

/** Reads "1.200,50", "1,200.50", "€ 1200" or "1200" as a number. */
export function parseAmount(raw: string): number | null {
  let s = String(raw || "").replace(/[^\d.,]/g, "");
  if (!s) return null;
  const lastDot = s.lastIndexOf(".");
  const lastComma = s.lastIndexOf(",");
  const dec = Math.max(lastDot, lastComma);
  // A separator followed by exactly 1–2 digits at the end is the decimal point.
  if (dec !== -1 && s.length - dec - 1 >= 1 && s.length - dec - 1 <= 2) {
    s = s.slice(0, dec).replace(/[.,]/g, "") + "." + s.slice(dec + 1);
  } else {
    s = s.replace(/[.,]/g, "");
  }
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function formatMoney(n: number, currency: string): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(n);
}
