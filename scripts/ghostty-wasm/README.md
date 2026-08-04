# Ghostty WASM

`public/assets/terminal/ghostty-vt.wasm` is copied from `@wterm/ghostty` 0.3.2.
This release includes the upstream fix for Ghostty style leakage across screens.

The fix initializes cells without a style ID to Ghostty's default style:

```zig
const style: Style = if (raw.style_id != 0) style_cells[x] else .{};
```

This prevents stale foreground, background, and cursor attributes from leaking
into otherwise unstyled cells after alternate-screen and TUI redraws.

The expected SHA-256 is:

```text
551e3eb20fc66509f648f46b7261da35d6f1abe5138961ff1e33907673e1561c
```

`src/lib/ghostty-wasm.test.ts` guards the style-reset behavior.
