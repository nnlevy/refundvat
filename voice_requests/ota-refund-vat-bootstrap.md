SUPERVISOR CLAIM ota-refund-vat-bootstrap
DOMAIN=refund.vat
REPO=/Users/nirlevy/.openclaw/workspace/refundvat
TYPE=ota_bootstrap LANE=revenue
MODEL=xai/grok-build-0.1 TASK_TYPE=revenue_or_high_consequence TIER=s_trusted
DIRECTIVE: Top traffic anchor: pick canonical among refund.vat / refundvat.info / refundvat.com with 301s; DNS; bootstrap product from Revenue OS template; free eligibility triage <2min; credit-cost deep reports/doc packets; publisher VAT guides; AdSense-ready. | Owner decisions recorded 2026-07-10: canonical=www.refundvat.info (refund.vat no DNS; refundvat.com Namefind). Product on refundvat.info.

Implement in this repo only. Build/test. Deploy if green via portfolio_deploy_controller.
=== COMPLETION CONTRACT (required — domains platform loop) ===
Work is NOT done until you close the claim. The platform will free the slot only when:
A) You run: portfolio-exec complete --id ota-refund-vat-bootstrap --notes 'what shipped'
B) Or leave PORTFOLIO_COMPLETE ota-refund-vat-bootstrap in voice_requests/ota-refund-vat-bootstrap.md
C) Or write a receipt under ~/.openclaw/workspace/state/receipts/ mentioning ota-refund-vat-bootstrap
While working, heartbeat every ~15m: portfolio-exec heartbeat --id ota-refund-vat-bootstrap
No heartbeat for 20m → claim released (prevents idle stuck claims).
AdSense-ready = live ads.txt+sitemap+content/delight+home 200 — NOT only dist/ads.txt thrash.
If you need Nir (AdSense console, secrets, brand), block with owner_steps (desk-only).
Use s_trusted Grok models only (already selected via model policy).
