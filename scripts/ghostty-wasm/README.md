# Ghostty WASM

`public/assets/terminal/ghostty-vt.wasm` is copied from `@wterm/ghostty` 0.5.1.
This release includes the upstream fix for Ghostty style leakage across screens.

The fix initializes cells without a style ID to Ghostty's default style:

```zig
const style: Style = if (raw.style_id != 0) style_cells[x] else .{};
```

This prevents stale foreground, background, and cursor attributes from leaking
into otherwise unstyled cells after alternate-screen and TUI redraws.

The expected SHA-256 is:

```text
c45205b70dbfd9b2510ea7186f05772db35f78ffa0da7586b2f85cc1a2e201f3
```

`src/lib/ghostty-wasm.ts` uses this hash as the public URL's cache key. Update the
constant whenever the binary changes so browsers cannot combine cached WASM with
JavaScript from a different release.

`src/lib/ghostty-wasm.test.ts` verifies that the public binary exactly matches the
installed package and its cache key, and guards the style-reset behavior.
