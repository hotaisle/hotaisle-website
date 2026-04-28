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
-   **⚡ High-Performance Architecture**: Leveraging App Router for optimal SEO and loading speeds.
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

- `bun run dev` starts Vinext on HTTPS at `https://localhost:4174`.
- Local TLS certs are generated automatically if `.dev-localhost-cert.pem` or `.dev-localhost-key.pem` are missing.
- Local-only `.dev*` files are ignored by git and excluded from the static export.
- Blog images under `content/blog/assets` are mirrored into generated `public/assets/blog` during content generation so Vite dev can serve `/assets/blog/...` correctly.
- The content watcher regenerates on blog markdown, policy markdown, and blog asset changes.

### Useful scripts

- `bun run check` runs formatting, import checks, and TypeScript.
- `bun run test` runs the test suite.
- `bun run build` generates the static output used for deploys.
- `bun run preview` builds the static output and serves it locally over HTTPS at `https://localhost:4174`. This is a static-only server — the Worker is not running, so `/api/ws` and `/api/machine-status` are unavailable.
- `bun run test:toast` posts a sample machine-status event to the local Worker.
- `bun run test:toast:prod` opens the production websocket, posts a production machine-status event, and waits for the matching broadcast.

### Previewing with the Worker (WSS / machine-status)

`bun run preview` does not start the Cloudflare Worker, so the WebSocket endpoint (`/api/ws`) and machine-status push (`/api/machine-status`) will not work. To test the full stack locally, build first then start Wrangler dev in a second terminal:

```bash
# Terminal 1
bun run build

# Terminal 2 — serves static assets + Worker at https://localhost:4174
bun run wrangler dev --config wrangler.jsonc
```

Wrangler dev handles both static asset serving and the Worker, so `bun run preview` and `wrangler dev` should not run at the same time (they both bind port 4174).

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
bun run test:toast
bun run test:toast bm reserved
bun run test:toast vm reserved 4
```

Optional overrides:

```bash
HOTAISLE_WEBSITE_SECRET=your-secret \
HOTAISLE_MACHINE_STATUS_URL=https://localhost:4174/api/machine-status \
bun run test:toast vm deleted 8
```

### Production machine-status probe

The production Worker exposes:

- `POST https://hotaisle.xyz/api/machine-status`
- `GET wss://hotaisle.xyz/api/ws`

To verify that production `reserved` and `deleted` events are both broadcast to connected websocket clients, run:

```bash
HOTAISLE_WEBSITE_SECRET=your-production-secret \
bun run test:toast:prod
```

Single-event examples:

```bash
HOTAISLE_WEBSITE_SECRET=your-production-secret \
bun run test:toast:prod bm reserved
```

```bash
HOTAISLE_WEBSITE_SECRET=your-production-secret \
bun run test:toast:prod vm deleted 8
```

VM two-event example:

```bash
HOTAISLE_WEBSITE_SECRET=your-production-secret \
bun run test:toast:prod vm 8
```

Optional timeout override:

```bash
HOTAISLE_WEBSITE_SECRET=your-production-secret \
HOTAISLE_MACHINE_STATUS_TIMEOUT_MS=15000 \
bun run test:toast:prod
```


## 📂 Project Structure

```
hotaisle-next/
├── content/             # Markdown content and source blog assets
├── public/              # Static assets served directly by Vite/Worker
│   └── assets/blog/     # Generated mirror of content/blog/assets for local dev
├── scripts/             # Build, content, and maintenance scripts
├── src/
│   ├── app/             # App Router pages
│   ├── components/      # Reusable UI components
│   │   ├── home/        # Homepage specific (PyramidHero, SecuritySection)
│   │   └── layout/      # Sidebar, Header, Footer
│   ├── lib/             # Utility functions
│   └── worker/          # Cloudflare Worker entrypoint and Durable Objects
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
