import { renderHome } from "./page.ts";

export interface Env {
  DB?: D1Database;
  ASSETS: Fetcher;
}

// Home page: VAT-inside calculator + refund checklist (src/worker/page.ts).
const HTML = renderHome();

// Pulse 2026-07-29: CTA soft-home false green — /go SPA/shell 200 same title, no Location.
const CTA: Record<string, string> = {
  "/go": "/",
  "/launch": "/",
  "/start": "/",
  "/app": "/",
  "/try": "/",
  "/get-started": "/",
  "/getstarted": "/",
};

export default {
  async fetch(req: Request, env: Env) {
    const u = new URL(req.url);
    const raw = u.pathname.replace(/\/$/, "") || "/";

    if (u.pathname === "/ads.txt") {
      return new Response("google.com, pub-1860356577073395, DIRECT, f08c47fec0942fa0\n", {
        headers: { "Content-Type": "text/plain" },
      });
    }
    if (u.pathname === "/sitemap.xml") {
      return new Response(
        '<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://refundvat.info/</loc></url></urlset>',
        { headers: { "Content-Type": "application/xml" } },
      );
    }
    if (u.pathname === "/robots.txt") {
      return new Response("User-agent: *\nAllow: /\nSitemap: https://refundvat.info/sitemap.xml");
    }

    if (Object.prototype.hasOwnProperty.call(CTA, raw) && (req.method === "GET" || req.method === "HEAD")) {
      const dest = new URL(req.url);
      dest.pathname = CTA[raw];
      dest.search = "";
      return new Response(null, {
        status: 301,
        headers: {
          Location: dest.toString(),
          "Cache-Control": "no-store",
        },
      });
    }

    try {
      const a = await env.ASSETS.fetch(req);
      if (a.status != 404) return a;
    } catch {}
    return new Response(HTML, { headers: { "Content-Type": "text/html; charset=utf-8" } });
  },
};
