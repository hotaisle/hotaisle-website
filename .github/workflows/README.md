# GitHub Workflows

This directory contains the repository's CI automation.

## `ci.yml`

`ci.yml` handles pull request and `main` branch validation.

The `check` job installs dependencies and runs formatting, linting, type checks, tests, the static build, and Lighthouse through `bun run ci`. Lighthouse writes its report index and supporting files to `dist-static/lighthouse`, keeping the reports with the site they measured. Cloudflare handles publishing; GitHub Actions does not upload or deploy a site artifact.

## Shared Configuration

`.lighthouserc.cjs` is localhost-only. The Lighthouse runner maps its configured routes to the local HTTPS static build, serves from `./dist-static`, and writes reports to `./dist-static/lighthouse`.

The report set includes two desktop runs for every configured route. The generated index selects a representative run and links to every interactive HTML and JSON report.

The generated report index is published at `/lighthouse` with the rest of the site. GitHub Pages is no longer part of the workflow.
