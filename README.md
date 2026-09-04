# xboard-admin-rebuilt

Reverse-engineered, maintainable React/Vite reconstruction of the published XBoard Admin frontend.

## Source basis

The reconstruction uses the published `cedar2025/xboard-admin-dist` build artifacts together with the matching `cedar2025/Xboard` Laravel backend API contracts. The published admin is React + Shadcn UI + TailwindCSS; the main bundle is production React 18.3.1 and also includes Monaco editor workers.

## Current coverage

- React 18 + Vite + TypeScript application shell
- Runtime `base_url` and `secure_path` configuration
- XBoard `/api/v2` transport and `Authorization` access-token handling
- Login via `/passport/auth/login`, with `Xboard_access_token` persistence
- Grouped/collapsible administration sidebar matching the published navigation hierarchy
- Dashboard backed by statistics endpoints
- Server / machine management with real list/save/delete/detail/token/install-command/node APIs
- Generic resource management pages for notice, payment, knowledge, nodes, permission groups, routes, plans, orders, coupons, gift cards, users, tickets, themes, plugins, system configuration and traffic-reset logs
- Actual frontend route structure such as `/server/machine`, `/server/manage`, `/server/group`, `/server/route`, `/finance/*`, `/user/*`, and `/config/*`
- Dark mode and responsive layout
- Production build and TypeScript CI validation

## Run

```bash
npm install
npm run typecheck
npm run build
npm run dev
```

Set `window.settings` in `public/settings.js` for the target XBoard deployment when the frontend is hosted separately, for example:

```js
window.settings = {
  base_url: 'https://example.com',
  secure_path: '/your-admin-path'
};
```

## Reconstruction notes

The original compiled bundle does not preserve the author's exact source-file boundaries or all original names. This repository therefore reconstructs equivalent source structure and runtime behavior rather than claiming byte-for-byte recovery of the original TypeScript/TSX project.
