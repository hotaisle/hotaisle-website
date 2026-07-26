<div align="center">
  <img src="public/hotaisle-logo.svg" alt="Hot Aisle Logo" width="400" />
  <br />

  # Hot Aisle | AMD Exclusive AI Cloud
  
  **Frictionless access to MI300x GPUs. No Contracts. Just Performance.**
</div>

---

## 🚀 Overview

**Hot Aisle** is a high-performance cloud platform designed to democratize access to supercomputing power. We provide instant, bare-metal and virtual machine access to AMD Instinct™ MI300x accelerators for AI training and inference at a fraction of the cost and complexity of traditional hyperscalers.

This repository contains the frontend application that powers **[hotaisle.xyz](https://hotaisle.xyz)**.

## Hosting

The site is deployed on Cloudflare Workers. Most routes are statically generated, but local and production runtime also include a small Worker surface for realtime machine-status events and websocket fanout.

## ✨ Key Features

-   **🔥 3D Hero**: A custom, CSS-driven 3D animation.
-   **🎨 Premium UI System**: Built with Tailwind CSS, supporting seamless Light/Dark modes.
-   **⚡ High-Performance Architecture**: Astro generates complete static HTML for every public route with no hydrated React runtime.
-   **🔍 Site-Wide Search**: Integrated Cmd+K command palette for instant navigation across documentation and blogs.
-   **🛡️ Trust & Compliance**: Dedicated security sections highlighting SOC 2 Type 2 compliance and official Dell/AMD partnerships.
-   **📝 Markdown Content Pipeline**: Robust blog and documentation engine powered by raw Markdown files with automated tag and date management.

## 📦 Getting Started

### Installation

1.  **Install dependencies:**
    ```bash
    bun install
    ```

2.  **Run the development server:**
    ```bash
    bun run dev
    ```

    Open [https://localhost:4174](https://localhost:4174) to view the application.

### Local development notes

- `bun run dev` starts Astro on HTTPS at `https://localhost:4174`.
- Local TLS certs are generated automatically if `.dev-localhost-cert.pem` or `.dev-localhost-key.pem` are missing.
- Local-only `.dev*` files are ignored by git and excluded from the static output.
- Blog images under `src/content/blog/assets` are mirrored into `public/assets/blog` before Astro builds so `/assets/blog/...` remains stable.
- Astro content collections load and validate blog and policy Markdown during development and static builds.

### Useful scripts

- `bun run check` runs formatting, import and Tailwind checks, TypeScript, and Astro diagnostics.
- `bun run test` runs the test suite.
- `bun run build` generates and validates all Astro static pages used for deploys.
- `bun run lighthouse` builds and audits the static site, then writes the reports to `dist-static/lighthouse`.
- `bun run ci` runs the complete local equivalent of the CI validation job, including Lighthouse.
- `bun run deploy` generates the combined site and Lighthouse output before deploying through Cloudflare.
- `bun run generate:mermaid` refreshes committed Mermaid diagram assets after diagram source changes.
- `bun run preview` builds the site, refreshes Lighthouse only when relevant inputs changed, includes the reports at `/lighthouse`, and serves the complete static output with the local Cloudflare Worker over HTTPS at `https://localhost:4174`.
- `bun run machine-status:local` posts a sample machine-status event to the local Worker.
- `bun run machine-status:production` opens the production websocket, posts production machine-status events, and waits for matching broadcasts.

### Previewing with the Worker (WSS / machine-status)

`bun run preview` generates the production-equivalent site, reuses the last complete Lighthouse report set when its inputs are unchanged, then starts Wrangler with the generated localhost TLS certificate. Wrangler serves the static assets, reports, and these Worker endpoints from the same origin:

```bash
bun run preview
```

- `POST /api/machine-status`
- `GET /api/ws`

Preview cannot run alongside `bun run dev` because both use port 4174.

### Realtime machine-status events

The local Worker exposes:

- `POST /api/machine-status`
- `GET /api/ws`

`POST /api/machine-status` expects the shared secret header:

```text
x-hotaisle-auth: <secret>
```

Local dev defaults:

- URL: `https://localhost:4174/api/machine-status`
- Secret: `dev-secret`

Payloads:

```json
{ "type": "bm", "status": "deleted" }
```

```json
{ "type": "vm", "gpuCount": 4, "status": "reserved" }
```

Test from the repo with:

```bash
bun run machine-status:local
bun run machine-status:local bm reserved
bun run machine-status:local vm reserved 4
```

Optional overrides:

```bash
HOTAISLE_WEBSITE_SECRET=your-secret \
HOTAISLE_MACHINE_STATUS_URL=https://localhost:4174/api/machine-status \
bun run machine-status:local vm deleted 8
```

### Production machine-status probe

The production Worker exposes:

- `POST https://hotaisle.xyz/api/machine-status`
- `GET wss://hotaisle.xyz/api/ws`

To verify that production `reserved` and `deleted` events are both broadcast to connected websocket clients, run:

```bash
HOTAISLE_WEBSITE_SECRET=your-production-secret \
bun run machine-status:production
```

Single-event examples:

```bash
HOTAISLE_WEBSITE_SECRET=your-production-secret \
bun run machine-status:production bm reserved
```

```bash
HOTAISLE_WEBSITE_SECRET=your-production-secret \
bun run machine-status:production vm deleted 8
```

VM two-event example:

```bash
HOTAISLE_WEBSITE_SECRET=your-production-secret \
bun run machine-status:production vm all 8
```

Optional timeout override:

```bash
HOTAISLE_WEBSITE_SECRET=your-production-secret \
HOTAISLE_MACHINE_STATUS_TIMEOUT_MS=15000 \
bun run machine-status:production
```


## 📂 Project Structure

```
hotaisle-website/
├── public/              # Static assets served directly by Vite/Worker
│   └── assets/blog/     # Generated mirror of src/content/blog/assets for local dev
├── scripts/             # Build, content, and maintenance scripts
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── home/        # Homepage specific (PyramidHero, SecuritySection)
│   │   └── layout/      # Sidebar, Header, Footer
│   ├── content/         # Markdown content and source blog assets
│   ├── lib/             # Utility functions
│   ├── pages/           # Astro static routes
│   ├── scripts/         # Browser-side initialization scripts
│   ├── styles/          # Global and route-specific styles
│   └── worker/          # Cloudflare Worker entrypoint and Durable Object
├── wrangler.jsonc       # Cloudflare Worker config
└── dist-static/         # Generated deploy output
```

## 🎨 Branding

The **Hot Aisle** brand is defined by:
-   **Hot Aisle**: Name is "Hot Aisle"
-   **Primary Color**: Hot Orange
-   **Light Theme Orange**: `#ce4c11` (WCAG AA on white)
-   **Dark Theme Orange**: `#e46711` (WCAG AA on dark surfaces)
-   **Secondary**: Neutral Grays / Dark Mode Black
-   **Aesthetic**: "Glassy", Technical, Premium, Minimalist.

## Contributions

All commits must be verified. If you don't set that up first, I have to uncheck the box and then recheck it.

<img width="1192" height="145" alt="image" src="https://github.com/user-attachments/assets/ab086c4a-d0b8-44f9-bafd-8d3554be5855" />

---

<div align="center">
  <sub>Built with ❤️ by the Hot Aisle Team</sub>
</div>
