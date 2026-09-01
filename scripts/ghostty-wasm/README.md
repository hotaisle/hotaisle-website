# Ghostty WASM

`public/assets/terminal/ghostty-vt.wasm` is copied from `@wterm/ghostty` 0.3.4.
This release includes the upstream fix for Ghostty style leakage across screens.

The fix initializes cells without a style ID to Ghostty's default style:

```zig
const style: Style = if (raw.style_id != 0) style_cells[x] else .{};
```

This prevents stale foreground, background, and cursor attributes from leaking
into otherwise unstyled cells after alternate-screen and TUI redraws.

The expected SHA-256 is:

```text
d96f1f384d94dd10fb8628eea41874784cbe62361fc6f7e6428211f9b9bd0bda
```

`src/lib/ghostty-wasm.ts` uses this hash as the public URL's cache key. Update the
constant whenever the binary changes so browsers cannot combine cached WASM with
JavaScript from a different release.

`src/lib/ghostty-wasm.test.ts` verifies that the public binary exactly matches the
installed package and its cache key, and guards the style-reset behavior.
