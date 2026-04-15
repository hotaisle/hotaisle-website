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

The site is hosted on CloudFlare workers and is just static generated without any connections to anything. We could have some dynamic aspects some day. Have fun hackers.

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

    Open [http://localhost:3000](http://localhost:3000) to view the application.


## 📂 Project Structure

```
hotaisle-next/
├── public/              # Static assets (images, logos, icons)
│   └── assets/          # Blog and content images
├── scripts/             # Maintenance scripts (date fixers, tag generators)
├── src/
│   ├── app/             # App Router pages
│   ├── components/      # Reusable UI components
│   │   ├── home/        # Homepage specific (PyramidHero, SecuritySection)
│   │   └── layout/      # Sidebar, Header, Footer
│   └── lib/             # Utility functions
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
