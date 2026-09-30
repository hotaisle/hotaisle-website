# Ghostty WASM

`public/assets/terminal/ghostty-vt.wasm` is copied from `@wterm/ghostty` 0.5.4.
This version retains the upstream fix for Ghostty style leakage across screens.

The fix initializes cells without a style ID to Ghostty's default style:

```zig
const style: Style = if (raw.style_id != 0) style_cells[x] else .{};
```

This prevents stale foreground, background, and cursor attributes from leaking
into otherwise unstyled cells after alternate-screen and TUI redraws.

The expected SHA-256 is:

```text
da382d54a9d1115e994802c90411e754fc1f7d090e3a28b34b465b187f41be6d
```

`src/lib/ghostty-wasm.ts` uses this hash as the public URL's cache key. Update the
constant whenever the binary changes so browsers cannot combine cached WASM with
JavaScript from a different release.

`src/lib/ghostty-wasm.test.ts` verifies that the public binary exactly matches the
installed package and its cache key, and guards the style-reset behavior.

After any wterm upgrade or patch change, also run:

```sh
bun run test src/lib/ghostty-wasm.test.ts src/lib/kitty-graphics-integration.test.ts src/lib/terminal-renderer.test.ts
```

The QR integration tests use the installed DOM renderer, the public WASM binary,
and a DOM test environment. They reproduce the checkout's 20-by-10 Kitty
placeholder grid, including its combining marks, and verify that only blank
cells are painted beneath the PNG. They cover fragmented transfers, both upload
orderings, live cell metrics, grid rebuilds, scrollback, and image cleanup.
These tests run automatically with `bun run test` and CI.

The DOM package patch suppresses placeholder glyphs only when rendering; the
core retains them so the graphics bridge can locate the image. Preserve this
behavior when rebasing the patch. The tests verify DOM and protocol behavior,
not browser pixel output or QR scanner recognition.
