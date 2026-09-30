# GitHub Workflows

This directory contains the repository's CI automation.

## `ci.yml`

`ci.yml` handles pull request validation and production deployments from `main`.

The `check` job installs dependencies and runs formatting, linting, type checks, tests, the static build, Lighthouse, and the Worker build through `bun run ci`. Lighthouse writes its report index and supporting files to `dist-static/lighthouse`, keeping the reports with the site they measured. The Cloudflare Vite plugin bundles the Worker and copies the audited static output into `.cloudflare/output`.

For pull requests, the job stops after validation. For pushes to `main`, `bun run deploy` packages the existing static output and deploys it with the repository's pinned `cf` CLI using `cf deploy --prebuilt`. Deployment does not rerun Astro or Lighthouse.

Production deployment requires these GitHub Actions repository secrets:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

The API token should be scoped to the production Cloudflare account with Workers Scripts edit and Workers Routes edit access.

## Shared Configuration

`.lighthouserc.cjs` is localhost-only. The Lighthouse runner maps its configured routes to the local HTTPS static build, serves from `./dist-static`, and writes reports to `./dist-static/lighthouse`.

The report set includes two desktop runs for every configured route. The generated index selects a representative run and links to every interactive HTML and JSON report.

The generated report index is published at `/lighthouse` with the rest of the site. GitHub Pages and Cloudflare Workers Builds are not part of the deployment workflow.
