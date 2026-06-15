# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

## Warning: Non-standard Next.js

This project uses **Next.js 16** with **React 19**, which has breaking changes from prior versions. Before writing any Next.js-specific code, read `node_modules/next/dist/docs/` for the relevant guide. Do not rely on training-data patterns for routing, data fetching, or config APIs.

## Commands

```bash
npm run dev          # Start dev server at localhost:3000
npm run build        # Production build (output: standalone)
npm start            # Serve production build
npm test             # Run all tests once (vitest)
npm run test:watch   # Vitest in watch mode

# Run a single test file
npx vitest run src/lib/simulation/engine.test.ts

# Docker
docker-compose up --build
```

## Architecture

### Simulation engine (`src/lib/simulation/`)

Pure TypeScript, no runtime dependencies. The entry point is `engine.ts`, which exposes `runSimulation(config)` and `runComparison(configA, configB)`. Each simulation step: transactions → demurrage → commons redistribution → snapshot. Types are all in `types.ts`.

The engine runs in a **Web Worker** (`src/app/simulate/simulation.worker.ts`) to keep the UI unblocked. `SimulatorClient.tsx` posts to the worker and falls back to a dynamic import if `Worker` is unavailable.

Caps are **dynamic**: soft cap and hard cap are recomputed from the current mean balance each step (`mean × multiplier`), not fixed values.

### Content / docs (`src/content/docs/`)

MDX files with gray-matter frontmatter (`title`, `description`, `order`). `src/lib/mdx.ts` reads them from disk at build time (Node.js `fs`). The `[[...slug]]` catch-all route at `src/app/docs/` renders them with `next-mdx-remote`. Add a new doc by dropping an `.mdx` file — no route registration needed.

### Routing

- `src/app/(public)/` — whitepaper pages (problem, how-it-works, governance, roadmap, references)
- `src/app/docs/` — developer wiki driven by MDX files
- `src/app/simulate/` — interactive simulator (client component + worker)
- `src/app/api/health/` — health check endpoint

### Simulator URL state

`SimulatorClient.tsx` serialises the full `SimulationConfig` into URL search params on every config change (`configToParams` / `paramsToConfig`). All params are clamped/validated on read, so direct URL manipulation is safe.

### Styling

Tailwind CSS v4 via PostCSS. shadcn/ui primitives live in `src/components/ui/`. The CSP in `next.config.ts` is tight — no third-party scripts or remote fonts are permitted.

### MDX pipeline

`next.config.ts` does **not** enable `@next/mdx` for page routes (the `pageExtensions` list excludes `.mdx`). MDX is rendered at runtime via `next-mdx-remote` only inside the docs route. Custom MDX component mappings are in `mdx-components.tsx` at the root.

## Testing

Tests live alongside source in `src/lib/simulation/*.test.ts`. `vitest.config.ts` resolves `@/` to `src/`. The test environment is `node` (no browser APIs).

## Deployment

Standalone Next.js output inside Docker, behind an Nginx reverse proxy. See `docs/vps-setup.md` for VPS provisioning, SSL (Let's Encrypt), and Certbot auto-renewal. Certificate paths expected by `docker/nginx.conf` must exist before `docker-compose up`.
