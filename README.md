# TPT Flow

A programmable complementary currency with built-in demurrage and accumulation limits that make wealth concentration economically self-correcting.

## What It Is

TPT Flow is a concept-stage currency protocol designed to address structural problems in modern monetary systems: velocity collapse, wealth concentration, and advice asymmetry. It does this through three core mechanics:

- **Demurrage** — a holding cost on idle balances that incentivises circulation
- **Accumulation limits** — soft and hard caps that prevent runaway concentration
- **Commons redistribution** — demurrage proceeds flow back to participants proportional to their economic activity

## This Repository

This monorepo contains:

| Path | Contents |
|------|----------|
| `src/app/(public)/` | Public whitepaper pages (problem, mechanics, governance, roadmap) |
| `src/app/docs/` | Developer wiki rendered from MDX |
| `src/app/simulate/` | Interactive economic simulation |
| `src/lib/simulation/` | Pure TypeScript simulation engine |
| `src/content/docs/` | MDX documentation files |
| `docker/` | Nginx config for self-hosted deployment |

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Building

```bash
npm run build
npm start
```

## Docker (Self-Hosted)

```bash
docker-compose up --build
```

Requires a domain and SSL certificates. See `docker/nginx.conf` for the expected certificate paths.

## Simulation

The simulation engine lives in `src/lib/simulation/` and is pure TypeScript with no runtime dependencies. It can be imported independently of the UI.

```ts
import { runSimulation, DEFAULT_CONFIG } from "@/lib/simulation/engine";

const result = runSimulation({
  ...DEFAULT_CONFIG,
  demurrageRate: 0.01,   // 1% per month
  agents: 500,
  steps: 36,
});
```

## Status

Phase 0 — concept and simulation. No smart contracts exist yet. See the [Roadmap](/roadmap) for what comes next and the [open questions](TODO.md) blocking Phase 1.

## Licence

All rights reserved. This repository is public for review and comment only.
