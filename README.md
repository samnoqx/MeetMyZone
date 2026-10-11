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

The build also applies a narrow compatibility fix for OpenNext 1.20.10 to inline Next.js 16.4's `preview-props.json`. It then executes the generated Worker's manifest loader to verify preview props and routing manifests are available without filesystem access. This prevents the runtime Error 1101 seen when the adapter omitted that manifest; review the fix when upgrading OpenNext.

The Cloudflare build uses the standard `.next` folder, separate from `.next-preview` used by the live development preview. The deploy artifact is `.open-next/worker.js`. After reviewing a preview and logging in to your own Cloudflare account, `npm run deploy:cloudflare` publishes the previously built artifact. No deployment or DNS change is performed by local development or build commands.

`wrangler.jsonc` enables `MMZ_STATIC_OG=1`: Cloudflare serves the shared branded preview image instead of rendering a custom PNG for each request. The regular local Next preview retains dynamic planner images. Regenerate the branded PNG with `npm run og:static` after changing its design.

After the adapter build, `scripts/prepare-static-cloudflare.cjs` renders the curated pages and their direct tool links on a temporary build server, saves their HTML and navigation payloads as assets, and stops that server. The final Worker routes requests to these assets without importing Next's server runtime. Shared meeting dates, locations and working hours restore from the browser URL. Additional valid city combinations use the same interactive page components in the browser and remain unindexed until explicitly included in the build.

The Cloudflare build publishes every fully rendered, indexable canonical page in `sitemap.xml`. It validates each page's canonical, title, description and heading before listing it. Alternate URLs marked `noindex`, private build templates and client-only fallback pages are excluded. Sitemap inclusion supports discovery; Google controls actual indexing and ranking.

Clocks, UTC/DST status, upcoming clock changes, FAQs and seasonal reference examples update in the browser. The first render uses the build timestamp for stable hydration; reference facts refresh when the day or a relevant UTC offset changes. Rebuild after changing content or updating timezone rules. Runtime ISR is not used by the asset Worker. `tests/static-cloudflare.cjs` verifies routing, navigation payloads, security headers, private assets, invalid cities and the AdSense ownership integration. Workers Free still has request and CPU limits: verify a version preview and its runtime logs before deploying, because local checks alone cannot prove hosted CPU usage.

References: https://opennext.js.org/cloudflare/get-started and https://developers.cloudflare.com/workers/platform/limits/.

## Analytics and privacy

The site's existing GA4 property is `G-W62TK5ME01`. Set `NEXT_PUBLIC_GA_ID` before building to override it; an empty or invalid value disables analytics. Google Analytics loads automatically after page hydration. Regional consent defaults apply in the EEA, UK and Switzerland before Google tags run; the Google-certified AdSense CMP interprets visitor choices for advertising and analytics when enabled in the publisher dashboard. Outside those regions, automatic collection remains unchanged. The footer exposes Google's consent revocation control only when its TCF API confirms that GDPR applies. The real AdSense publisher is `ca-pub-9430236853794521`; its site-review script and `ads.txt` are configured. AdSense approval and advertising consent settings are managed in Google's dashboard.

Shared planner links contain city labels, zones, reference location, working hours and date. Those URL parameters reach the hosting provider and can appear in logs or browsing history. Planner preferences are stored in the browser session; city searches use first-party static GeoNames data and do not send search text to a geocoding provider.

Development runs from the Desktop copy. `/shared/MeetMyZone` and `/shared/MeetMyZone-audited.zip` contain the reviewed source. `/shared/MeetMyZone.zip` remains the original downloaded recovery snapshot.

## City-search data and dependency security

The city dropdowns share `utils/citySearch.ts`: a lazy-loaded GeoNames cities1000 catalog covering 171,188 populated places and administrative seats, with native, ASCII and alternate names. This is a city catalog, not an exhaustive database of every settlement. Only the required static search shard and metadata load when searching; no runtime geocoding API, API key, or Worker-side search is required. Dataset attribution and CC BY 4.0 licence links appear in the privacy policy and catalog metadata. Source archive hashes are retained in metadata.

To refresh the catalog, download `cities1000.zip`, `countryInfo.txt`, and `admin1CodesASCII.txt` from <https://download.geonames.org/export/dump/>, then run `python3 scripts/build-city-catalog.py CITIES_ZIP COUNTRY_INFO ADMIN1_CODES VERSION`. Change the versioned asset path in `utils/citySearch.ts`, validate with `npm test`, and remove superseded tracked catalog assets in the same update. Catalog generation is deliberately separate from deploy builds.

The Next ESLint plugin's directory-glob dependency is scoped to the compatible `tinyglobby@0.2.15` implementation using an npm alias override. This removes the vulnerable braces dependency while preserving Next 16 and its lint rules. Regression checks exercise directory-root matching through the actual Next plugin. The Worker also sets a one-day HSTS policy for the current hostname (without preload or subdomain inheritance) and a CSP that blocks plugin objects, foreign base URLs and framing while preserving Google scripts and existing tools.
