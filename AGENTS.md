<!-- CODEX-ENV:START -->
## Codex environment (portfolio)

- Prefer worktree isolation for customer-triggered adaptations.
- Never edit wrangler binding IDs, shared D1/KV IDs, or production secrets.
- Allowed: product UI/copy/SEO under src/, public/, content/, docs/ (non-secret).
- Run checks: `npm run check` when present, else `npm run typecheck` / `npm test`.
- Deploy is out of band (portfolio deploy controller). Ship a real product PR only.
- Map: `state/codex_domain_environments.json` + `state/domain_github_map.json`.
<!-- CODEX-ENV:END -->
