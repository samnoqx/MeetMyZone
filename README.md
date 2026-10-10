# MeetMyZone

Time zone conversion, world clocks and a shareable international meeting planner built with Next.js.

## Local preview

Use Node 22 or newer. On a normal machine:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. On this Android/proot environment, keep the project under `/root/Desktop/MeetMyZone` and use `npm run dev:local`. Android shared storage does not support all dependency symlinks or native executable files. `dev:local` uses Webpack and disables only Next's unsupported directory-lock syscall. Do not run two development servers against the same output folder.

The active preview writes logs to `/root/Desktop/MeetMyZone-local.log`.

## Validation

```sh
npm run typecheck
npm test
npm run lint
npm audit --omit=dev
```

Regression checks cover planner query parsing, labels containing commas, invalid zones/routes, reference dates across DST, calendar text injection and UTF-8 line folding, and inaccessible browser storage. Lint reports existing image/performance and unused-code warnings.

## Cloudflare Workers

This project uses the OpenNext Cloudflare adapter, rather than the retired Next-on-Pages integration. No R2, database or paid image binding is configured.

```sh
npm run build:cloudflare
npm run preview:cloudflare -- --port 3001
```

The default `npm run build` produces the complete Cloudflare Worker using OpenNext. The adapter calls `npm run build:next` through `open-next.config.ts`, avoiding recursion while applying its required standalone build settings. Cloudflare Workers Builds can keep build command `npm run build` and deploy command `npx wrangler deploy`.

The Cloudflare build uses the standard `.next` folder, separate from `.next-preview` used by the live development preview. The deploy artifact is `.open-next/worker.js`. After reviewing a preview and logging in to your own Cloudflare account, `npm run deploy:cloudflare` publishes the previously built artifact. No deployment or DNS change is performed by local development or build commands.

`wrangler.jsonc` enables `MMZ_STATIC_OG=1`: Cloudflare serves the shared branded preview image instead of rendering a custom PNG for each request. The regular local Next preview retains dynamic planner images. Regenerate the branded PNG with `npm run og:static` after changing its design.

Workers Free has request and CPU limits. A successful local build cannot establish that every dynamic Next.js request fits the hosted CPU budget. Test the actual deployed Worker and inspect its CPU usage before treating the Free plan as production-ready. ISR caching across instances is not configured; add and review a cache binding if required later.

References: https://opennext.js.org/cloudflare/get-started and https://developers.cloudflare.com/workers/platform/limits/.

## Analytics and privacy

Tracking is disabled by default. Optionally set `NEXT_PUBLIC_GA_ID=G-YOURID` before building. The analytics component loads Google scripts only after an explicit visitor opt-in and remembers the choice for the browser session. Placeholder AdSense integration is removed. Advertising requires a real publisher configuration and an appropriate consent platform before enabling it.

Shared planner links contain city labels, zones, reference location, working hours and date. Those URL parameters reach the hosting provider and can appear in logs or browsing history. Planner preferences are stored in the browser session; location searches are sent directly to Open-Meteo.

Development runs from the Desktop copy. `/shared/MeetMyZone` and `/shared/MeetMyZone-audited.zip` contain the reviewed source. `/shared/MeetMyZone.zip` remains the original downloaded recovery snapshot.
