# Ghostty WASM

`public/assets/terminal/ghostty-vt.wasm` is built from `@wterm/ghostty` 0.3.0 with
the fix for [wterm issue #86](https://github.com/vercel-labs/wterm/issues/86).

The fix initializes cells without a style ID to Ghostty's default style:

```zig
const style: Style = if (raw.style_id != 0) style_cells[x] else .{};
```

This prevents stale foreground, background, and cursor attributes from leaking
into otherwise unstyled cells after alternate-screen and TUI redraws.

The expected SHA-256 is:

```text
43ec508e2134d863b21e1dfba2d67eafbad9ba799252017c40934bf4ecff83bd
```

`src/lib/ghostty-wasm.test.ts` covers the style-reset behavior.
