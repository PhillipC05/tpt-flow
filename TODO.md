# TPT Flow — Master Task Checklist

## Phase 1: Project Scaffolding

### 1.1 Initialisation
- [ ] Run `npx create-next-app@latest` with TypeScript, Tailwind, App Router, src-dir, import alias
- [ ] Verify Next.js 15 dev server starts cleanly
- [ ] Initialise git repository
- [ ] Add `.gitignore` (node_modules, .next, .env.local)
- [ ] Create root `README.md` with project overview

### 1.2 Dependencies
- [ ] Install `shadcn/ui` and initialise (`npx shadcn@latest init`)
- [ ] Install `recharts` for simulation charts
- [ ] Install `@next/mdx` and `@mdx-js/loader` for docs
- [ ] Install `gray-matter` for MDX frontmatter parsing
- [ ] Install `next-themes` for dark mode
- [ ] Install `lucide-react` for icons
- [ ] Install `next-mdx-remote` (if using dynamic MDX loading)
- [ ] Install `rehype-highlight` or `rehype-pretty-code` for code block syntax highlighting
- [ ] Install `remark-gfm` for GitHub-flavoured Markdown in MDX

### 1.3 Directory Structure
- [ ] Create `src/app/(public)/` route group
- [ ] Create `src/app/docs/[[...slug]]/` catch-all route
- [ ] Create `src/app/simulate/` route
- [ ] Create `src/components/ui/` (shadcn primitives live here)
- [ ] Create `src/components/docs/` (sidebar, TOC, breadcrumbs)
- [ ] Create `src/components/simulation/` (controls, charts)
- [ ] Create `src/components/layout/` (header, footer, nav)
- [ ] Create `src/lib/simulation/` (pure TS engine)
- [ ] Create `src/content/docs/` (MDX doc files)
- [ ] Create `src/content/whitepaper/` (MDX whitepaper pages)
- [ ] Create `docker/` directory

### 1.4 Configuration
- [ ] Configure `next.config.ts` with MDX support
- [ ] Configure Tailwind `tailwind.config.ts` with content paths and theme tokens
- [ ] Set up `src/app/layout.tsx` with `ThemeProvider` from next-themes
- [ ] Configure TypeScript paths in `tsconfig.json` if needed beyond defaults

---

## Phase 2: Documentation Site

### 2.1 Global Layout & Navigation
- [ ] Build `src/components/layout/Header.tsx` — logo, primary nav links, dark mode toggle
- [ ] Build `src/components/layout/Footer.tsx` — links, tagline, licence
- [ ] Wire header and footer into `src/app/layout.tsx`
- [ ] Implement dark mode toggle (next-themes + shadcn switch)
- [ ] Ensure navigation is mobile-responsive

### 2.2 Public Pages — Whitepaper/Concept

#### Landing Page (`/`)
- [ ] Hero section — headline, sub-headline, CTA buttons (Try Simulation, Read Docs)
- [ ] "The Problem in One Number" stat block (M2 +91%, prices +34%, velocity -36%)
- [ ] Three-mechanic overview cards (Demurrage, Accumulation Limits, Commons)
- [ ] Prior art comparison table (WIR, Sardex, crypto/DeFi, TPT Flow)
- [ ] CTA section — pilot community interest form (or mailto link initially)

#### The Problem (`/the-problem`)
- [ ] Structural wealth concentration section
- [ ] Velocity collapse section with M2/M2V data visualisation (static chart from FRED data)
- [ ] Advice asymmetry section
- [ ] Why conventional policy fails section

#### How It Works (`/how-it-works`)
- [ ] Demurrage mechanic — visual explainer (timeline diagram or animated illustration)
- [ ] Accumulation limits — soft cap / hard cap diagram
- [ ] Commons redistribution flow diagram
- [ ] Example: walk through a single wallet's lifecycle under demurrage

#### Governance (`/governance`)
- [ ] One-person-one-vote section
- [ ] ZK identity requirement explanation
- [ ] Immutable mechanics vs bounded mutable parameters table
- [ ] Governance risk section (plutocratic capture mitigation)

#### Roadmap (`/roadmap`)
- [ ] Phase 1 card (Closed Network) — status: upcoming
- [ ] Phase 2 card (Network Expansion) — status: future
- [ ] Phase 3 card (Global Layer) — status: future
- [ ] Immediate next steps section

#### References (`/references`)
- [ ] Gesell entry
- [ ] WIR Bank entry
- [ ] Sardex entry
- [ ] Piketty entry
- [ ] Mian, Straub & Sufi entry
- [ ] FRED data links

### 2.3 Docs Section (Dev Wiki)

#### Docs Infrastructure
- [ ] Build `src/components/docs/Sidebar.tsx` — collapsible section nav
- [ ] Build `src/components/docs/TableOfContents.tsx` — auto-generated from MDX headings
- [ ] Build `src/app/docs/layout.tsx` — sidebar + TOC shell
- [ ] Build `src/app/docs/[[...slug]]/page.tsx` — MDX rendering pipeline
- [ ] Build `src/lib/mdx.ts` — MDX file loading, frontmatter parsing, slug resolution
- [ ] Add breadcrumb navigation component

#### MDX Doc Files
- [ ] `src/content/docs/parameters.mdx` — all economic parameters with rationale and suggested ranges
- [ ] `src/content/docs/architecture.mdx` — chain-agnostic protocol description, ZK identity integration points
- [ ] `src/content/docs/chains.mdx` — comparison table (Base, Arbitrum, Optimism, Cosmos) against requirements
- [ ] `src/content/docs/governance.mdx` — full governance spec, parameter bounds, immutable vs mutable
- [ ] `src/content/docs/roadmap.mdx` — detailed phased roadmap with milestone definitions
- [ ] `src/content/docs/api.mdx` — placeholder for future Merchant API reference

---

## Phase 3: Simulation Engine

### 3.1 Core Engine (Pure TypeScript)

#### Types & Interfaces
- [ ] Define `SimulationConfig` interface in `src/lib/simulation/engine.ts`
- [ ] Define `SimulationSnapshot` interface
- [ ] Define `Agent` interface in `src/lib/simulation/agents.ts`
- [ ] Define `CommonsPool` interface in `src/lib/simulation/commons.ts`

#### `agents.ts`
- [ ] Implement `createAgents(config)` — initialise N agents with starting balances
- [ ] Implement `uniformDistribution(n, totalSupply)` — equal starting balances
- [ ] Implement `paretoDistribution(n, totalSupply)` — wealth-concentrated starting state
- [ ] Implement `selectTransactionPairs(agents, frequency)` — random pair selection
- [ ] Implement `executeTransaction(from, to, amount)` — transfer with balance guard

#### `demurrage.ts`
- [ ] Implement `applyDemurrage(agent, config, currentStep)` — core holding cost function
- [ ] Free tier exemption logic (balances below threshold: zero charge)
- [ ] Standard rate logic (balance above free tier, below soft cap)
- [ ] Escalating rate logic (balance above soft cap, below hard cap)
- [ ] Hard cap overflow logic (excess above hard cap → returns amount for commons)
- [ ] Write unit tests for demurrage calculation edge cases

#### `commons.ts`
- [ ] Implement `CommonsPool` accumulation (add demurrage proceeds + overflow)
- [ ] Implement `proportionalDistribution(pool, agents)` — by transaction count
- [ ] Implement `uniformDistribution(pool, agents)` — equal split
- [ ] Implement `hybridDistribution(pool, agents, weight)` — blend of both
- [ ] Write unit tests for distribution logic

#### `metrics.ts`
- [ ] Implement `giniCoefficient(balances[])` — standard Gini formula
- [ ] Implement `velocityProxy(transactionVolume, totalSupply)` — M2V analogue
- [ ] Implement `wealthPercentiles(balances[], percentiles[])` — p10/p25/p50/p75/p90/p99
- [ ] Write unit tests for metric calculations

#### `engine.ts`
- [ ] Implement `runStep(state, config)` — single time-step: transact → demurrage → commons distribute → snapshot
- [ ] Implement `runSimulation(config)` — full run returning all snapshots
- [ ] Implement `runComparison(configA, configB)` — run two configs and return paired snapshots
- [ ] Ensure engine is deterministic given a seed (add `seed` to `SimulationConfig`)

### 3.2 Simulation UI

#### Controls Panel
- [ ] `src/components/simulation/ConfigPanel.tsx` — all parameter sliders + inputs
- [ ] Demurrage rate slider (0–5%/month)
- [ ] Free tier amount input
- [ ] Soft cap multiplier slider
- [ ] Hard cap multiplier slider
- [ ] Soft cap surcharge multiplier slider
- [ ] Commons formula selector (proportional / uniform / hybrid)
- [ ] Initial distribution selector (uniform / pareto)
- [ ] Network size input (10–10,000 agents)
- [ ] Simulation steps input (1–120 months)
- [ ] Transaction frequency slider
- [ ] Convertibility mode selector
- [ ] Preset buttons: "Baseline", "Gentle (0.5%)", "Strong (2%)", "Experimental"
- [ ] Run / Pause / Reset buttons
- [ ] Step speed control (slow / normal / fast / instant)

#### Chart Components
- [ ] `src/components/simulation/VelocityChart.tsx` — line chart, velocity over time
- [ ] `src/components/simulation/GiniChart.tsx` — line chart, Gini coefficient over time
- [ ] `src/components/simulation/CommonsPoolChart.tsx` — area chart, pool size over time
- [ ] `src/components/simulation/WealthHistogram.tsx` — animated bar chart per step
- [ ] `src/components/simulation/SummaryStats.tsx` — final velocity, Gini, total redistribution table
- [ ] `src/components/simulation/WealthPercentilesChart.tsx` — percentile band chart

#### Comparison Mode
- [ ] Two-config side-by-side layout
- [ ] Overlay toggle for each chart (show both configs on one chart)
- [ ] Config A / Config B labels and colour coding

#### Simulation Page Assembly
- [ ] `src/app/simulate/page.tsx` — wire controls + charts together
- [ ] State management for simulation run (useReducer or Zustand)
- [ ] Web Worker for simulation computation (avoid blocking UI thread for large sims)
- [ ] Export results as CSV button
- [ ] Share config via URL query params

---

## Phase 4: Docker & Self-Hosted Deployment

- [ ] `docker/Dockerfile` — multi-stage build (builder + runner stages, standalone output)
- [ ] `docker/nginx.conf` — reverse proxy, static file caching, rate limiting
- [ ] `docker-compose.yml` — `web` + `nginx` services, SSL cert volume
- [ ] `.dockerignore` — exclude node_modules, .next, .git
- [ ] Test `docker-compose up --build` locally
- [ ] Document VPS setup steps in `docs/deployment.md` (Nginx SSL, env vars)
- [ ] Add health check endpoint (`/api/health`) for container monitoring

---

## Phase 5: Quality & Polish

### Testing
- [ ] Unit tests for all simulation engine modules (`*.test.ts`)
- [ ] Verify demurrage mechanics produce expected economic outcomes (velocity up, Gini down)
- [ ] Test comparison mode with identical configs produces identical results
- [ ] Test edge cases: all balances below free tier, all balances above hard cap, zero transactions

### Accessibility & Performance
- [ ] Keyboard navigation for simulation controls
- [ ] ARIA labels on all interactive chart elements
- [ ] Mobile responsiveness check on all public pages
- [ ] Mobile responsiveness check on simulation page (controls collapse gracefully)
- [ ] Lighthouse audit — target 90+ on Performance and Accessibility

### SEO & Metadata
- [ ] `metadata` export on all public pages (title, description, OG tags)
- [ ] `opengraph-image` for social sharing
- [ ] `sitemap.ts` for search engine discovery
- [ ] `robots.ts`

---

## Phase 6: Future (Smart Contracts — Deferred)

_These tasks are not started. Blocked on: pilot community selection, convertibility model decision, chain selection._

- [ ] Select blockchain (Base / Arbitrum / Optimism / Cosmos — decide after simulation modelling)
- [ ] Select ZK identity provider (Worldcoin ZK / Proof of Humanity / custom)
- [ ] Write demurrage smart contract (Solidity) — time-weighted balance decay
- [ ] Write accumulation cap contract — soft cap escalation + hard cap overflow
- [ ] Write commons pool contract — accumulation + distribution logic
- [ ] Write governance contract — one-person-one-vote with ZK identity gate
- [ ] Deploy to testnet
- [ ] Commission independent security audit
- [ ] Formal verification of core contracts
- [ ] Mainnet deployment (rate-limited rollout)
- [ ] Merchant API (REST + webhooks + QR code payments)
- [ ] Mobile PWA wallet (send / receive / demurrage display)
- [ ] Fiat on/off ramp integration (multi-ramp, rate-limited)

---

## Open Questions (Track Here)

- [ ] **Convertibility model** — time-locked / rate-limited / community-pool? Run simulation first.
- [ ] **Pilot community** — identify specific network willing to run Phase 1
- [ ] **Chain selection** — finalise after economic modelling confirms parameter ranges
- [ ] **ZK identity** — evaluate Worldcoin ZK vs Proof of Humanity vs custom at contract phase
- [ ] **Legal structure** — NZ/AU crypto-specialist firm review; non-profit foundation vs other
- [ ] **Economic modelling** — commission external modelling once simulation baseline is built
