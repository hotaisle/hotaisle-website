import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const OUT = 'content/blog/assets/soc2-is-broken';
mkdirSync(OUT, { recursive: true });

async function svgToPng(svg: string, outPath: string) {
	await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(outPath);
	console.log('wrote', outPath);
}

// ─── HEADER ──────────────────────────────────────────────────────────────────
// 1600×840 dark hero with grid, orange glow, "SOC2 IS BROKEN" headline
const header = `<svg width="1600" height="840" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
      <path d="M 64 0 L 0 0 0 64" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>
    </pattern>
    <radialGradient id="og" cx="50%" cy="42%" r="55%">
      <stop offset="0%" stop-color="#f97316" stop-opacity="0.22"/>
      <stop offset="60%" stop-color="#3b82f6" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#050816" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.55)"/>
    </radialGradient>
    <filter id="blur-glow">
      <feGaussianBlur stdDeviation="28" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- BG -->
  <rect width="1600" height="840" fill="#050816"/>
  <rect width="1600" height="840" fill="url(#grid)"/>
  <rect width="1600" height="840" fill="url(#og)"/>
  <rect width="1600" height="840" fill="url(#vignette)"/>

  <!-- Horizontal scan lines -->
  <rect width="1600" height="840" fill="none"
    style="background: repeating-linear-gradient(180deg, rgba(255,255,255,0.015) 0px, transparent 2px, transparent 8px)"/>

  <!-- Orange glow orb behind text -->
  <ellipse cx="800" cy="390" rx="420" ry="220" fill="#f97316" opacity="0.08" filter="url(#blur-glow)"/>

  <!-- Decorative corner brackets -->
  <path d="M 60 60 L 60 110 M 60 60 L 110 60" stroke="#f97316" stroke-width="3" fill="none" opacity="0.7"/>
  <path d="M 1540 60 L 1540 110 M 1540 60 L 1490 60" stroke="#f97316" stroke-width="3" fill="none" opacity="0.7"/>
  <path d="M 60 780 L 60 730 M 60 780 L 110 780" stroke="#f97316" stroke-width="3" fill="none" opacity="0.7"/>
  <path d="M 1540 780 L 1540 730 M 1540 780 L 1490 780" stroke="#f97316" stroke-width="3" fill="none" opacity="0.7"/>

  <!-- Horizontal accent lines -->
  <line x1="0" y1="180" x2="1600" y2="180" stroke="rgba(249,115,22,0.12)" stroke-width="1"/>
  <line x1="0" y1="660" x2="1600" y2="660" stroke="rgba(249,115,22,0.12)" stroke-width="1"/>

  <!-- Badge label -->
  <rect x="656" y="220" width="288" height="36" rx="18"
    fill="rgba(249,115,22,0.12)" stroke="rgba(249,115,22,0.4)" stroke-width="1"/>
  <text x="800" y="244" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    font-size="14" font-weight="600" fill="#fb923c" letter-spacing="3">
    HOT AISLE — SECURITY OPS
  </text>

  <!-- Main headline -->
  <text x="800" y="360"
    text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    font-size="110" font-weight="900" fill="white" letter-spacing="-3">
    SOC2 IS BROKEN
  </text>

  <!-- Orange underline -->
  <rect x="560" y="382" width="480" height="5" rx="2.5" fill="#f97316" opacity="0.9"/>

  <!-- Sub-headline -->
  <text x="800" y="450"
    text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    font-size="26" font-weight="400" fill="rgba(255,255,255,0.62)" letter-spacing="0.5">
    And the entire industry knows it.
  </text>

  <!-- Body teaser -->
  <text x="800" y="510"
    text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    font-size="18" font-weight="400" fill="rgba(255,255,255,0.38)" letter-spacing="0.3">
    Conflict of interest · Offshore auditing · The 12-month gap · The Delve scandal
  </text>

  <!-- Bottom bar -->
  <rect x="0" y="780" width="1600" height="60" fill="rgba(0,0,0,0.5)"/>
  <text x="80" y="818"
    font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    font-size="16" font-weight="600" fill="#f97316">hotaisle.xyz</text>
  <text x="1520" y="818" text-anchor="end"
    font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    font-size="16" font-weight="400" fill="rgba(255,255,255,0.35)">March 2026</text>
</svg>`;

// ─── AICPA CONFLICT DIAGRAM ───────────────────────────────────────────────────
// 1200×600 — shows the circular monopoly: creates standard + controls who audits
const aicpaConflict = `<svg width="1200" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="g2" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
    </pattern>
    <marker id="arrow-orange" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#f97316"/>
    </marker>
    <marker id="arrow-red" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444"/>
    </marker>
  </defs>

  <rect width="1200" height="600" fill="#0a0f1e"/>
  <rect width="1200" height="600" fill="url(#g2)"/>

  <!-- Title -->
  <text x="600" y="52" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="22" font-weight="700" fill="white" letter-spacing="-0.5">
    The AICPA Conflict of Interest
  </text>
  <text x="600" y="80" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="14" font-weight="400" fill="rgba(255,255,255,0.45)">
    One organization creates the rules, controls who enforces them, and collects fees from both sides
  </text>

  <!-- AICPA center node -->
  <circle cx="600" cy="310" r="80" fill="rgba(249,115,22,0.12)" stroke="#f97316" stroke-width="2"/>
  <text x="600" y="303" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="22" font-weight="800" fill="#f97316">AICPA</text>
  <text x="600" y="327" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="12" font-weight="400" fill="rgba(249,115,22,0.7)">Private Association</text>

  <!-- Left node: Creates Standard -->
  <rect x="80" y="250" width="200" height="120" rx="12"
    fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
  <text x="180" y="302" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="16" font-weight="700" fill="white">Creates</text>
  <text x="180" y="322" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="16" font-weight="700" fill="white">the Standard</text>
  <text x="180" y="350" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="12" fill="rgba(255,255,255,0.4)">Trust Services Criteria</text>

  <!-- Right node: Controls Who Audits -->
  <rect x="920" y="250" width="200" height="120" rx="12"
    fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
  <text x="1020" y="302" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="16" font-weight="700" fill="white">Controls</text>
  <text x="1020" y="322" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="16" font-weight="700" fill="white">Who Can Audit</text>
  <text x="1020" y="350" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="12" fill="rgba(255,255,255,0.4)">CPA licensing only</text>

  <!-- Bottom node: Collects Fees -->
  <rect x="450" y="470" width="300" height="90" rx="12"
    fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.35)" stroke-width="1"/>
  <text x="600" y="508" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="16" font-weight="700" fill="#ef4444">Collects Licensing Fees</text>
  <text x="600" y="530" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="12" fill="rgba(239,68,68,0.6)">From every firm operating inside the market it created</text>

  <!-- Arrows: AICPA → left -->
  <line x1="522" y1="290" x2="282" y2="300" stroke="#f97316" stroke-width="2"
    marker-end="url(#arrow-orange)" stroke-dasharray="6,3"/>
  <!-- Arrows: AICPA → right -->
  <line x1="678" y1="290" x2="918" y2="300" stroke="#f97316" stroke-width="2"
    marker-end="url(#arrow-orange)" stroke-dasharray="6,3"/>
  <!-- Arrows: both → fees -->
  <line x1="180" y1="370" x2="510" y2="468" stroke="#ef4444" stroke-width="1.5"
    marker-end="url(#arrow-red)" stroke-dasharray="4,3" opacity="0.7"/>
  <line x1="1020" y1="370" x2="692" y2="468" stroke="#ef4444" stroke-width="1.5"
    marker-end="url(#arrow-red)" stroke-dasharray="4,3" opacity="0.7"/>

  <!-- Label on left arrow -->
  <text x="355" y="278" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="11" fill="rgba(249,115,22,0.6)">defines &amp; owns</text>
  <!-- Label on right arrow -->
  <text x="800" y="278" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="11" fill="rgba(249,115,22,0.6)">exclusively licenses</text>

  <!-- Bottom caption -->
  <text x="600" y="588" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="12" fill="rgba(255,255,255,0.25)">hotaisle.xyz — SOC2 Is Broken</text>
</svg>`;

// ─── AUDIT GAP TIMELINE ───────────────────────────────────────────────────────
// 1200×480 — shows audit period → 12-month gap → next audit, with breach marker
const auditGap = `<svg width="1200" height="480" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="g3" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1200" height="480" fill="#0a0f1e"/>
  <rect width="1200" height="480" fill="url(#g3)"/>

  <!-- Title -->
  <text x="600" y="52" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="22" font-weight="700" fill="white" letter-spacing="-0.5">
    The 12-Month Gap Problem
  </text>
  <text x="600" y="78" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="14" fill="rgba(255,255,255,0.45)">
    Everything you add after the audit closes is invisible until the next one
  </text>

  <!-- Timeline track -->
  <rect x="80" y="210" width="1040" height="8" rx="4" fill="rgba(255,255,255,0.08)"/>

  <!-- Segment 1: Previous audit (green) -->
  <rect x="80" y="210" width="260" height="8" rx="4" fill="#22c55e" opacity="0.8"/>
  <!-- Segment 2: Gap (red) -->
  <rect x="340" y="210" width="520" height="8" fill="#ef4444" opacity="0.7"/>
  <!-- Segment 3: Next audit (green) -->
  <rect x="860" y="210" width="260" height="8" rx="4" fill="#22c55e" opacity="0.8"/>

  <!-- Audit period label (left) -->
  <text x="210" y="190" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="13" font-weight="600" fill="#22c55e">AUDIT PERIOD</text>
  <text x="210" y="206" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="11" fill="rgba(34,197,94,0.6)">Controls reviewed ✓</text>

  <!-- Gap label (center) -->
  <text x="600" y="190" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="13" font-weight="600" fill="#ef4444">12-MONTH GAP</text>
  <text x="600" y="206" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="11" fill="rgba(239,68,68,0.6)">No auditor is watching</text>

  <!-- Next audit label (right) -->
  <text x="990" y="190" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="13" font-weight="600" fill="#22c55e">NEXT AUDIT</text>
  <text x="990" y="206" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="11" fill="rgba(34,197,94,0.6)">Controls reviewed ✓</text>

  <!-- Events in the gap -->
  <!-- Event 1: New auth provider -->
  <line x1="420" y1="214" x2="420" y2="270" stroke="rgba(249,115,22,0.6)" stroke-width="1.5" stroke-dasharray="3,2"/>
  <circle cx="420" cy="214" r="5" fill="#f97316"/>
  <text x="420" y="290" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="12" fill="rgba(255,255,255,0.55)">New auth provider added</text>
  <text x="420" y="307" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="11" fill="rgba(255,255,255,0.3)">Not in scope</text>

  <!-- Event 2: LiteLLM (compromised) -->
  <line x1="580" y1="214" x2="580" y2="270" stroke="rgba(239,68,68,0.8)" stroke-width="2" stroke-dasharray="3,2"/>
  <circle cx="580" cy="214" r="6" fill="#ef4444"/>
  <text x="580" y="290" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="12" font-weight="600" fill="#ef4444">LiteLLM added via PyPI</text>
  <text x="580" y="307" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="11" fill="rgba(239,68,68,0.6)">Supply chain compromised ⚠</text>

  <!-- Event 3: Data pipeline -->
  <line x1="730" y1="214" x2="730" y2="270" stroke="rgba(249,115,22,0.6)" stroke-width="1.5" stroke-dasharray="3,2"/>
  <circle cx="730" cy="214" r="5" fill="#f97316"/>
  <text x="730" y="290" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="12" fill="rgba(255,255,255,0.55)">Data pipeline tool added</text>
  <text x="730" y="307" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="11" fill="rgba(255,255,255,0.3)">Not in scope</text>

  <!-- The certificate claim -->
  <rect x="80" y="360" width="480" height="76" rx="10"
    fill="rgba(34,197,94,0.06)" stroke="rgba(34,197,94,0.25)" stroke-width="1"/>
  <text x="320" y="390" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="14" font-weight="600" fill="#22c55e">Your SOC2 Report Says:</text>
  <text x="320" y="415" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="13" fill="rgba(255,255,255,0.5)">"Controls are operating effectively." ✓</text>

  <!-- The reality -->
  <rect x="640" y="360" width="480" height="76" rx="10"
    fill="rgba(239,68,68,0.06)" stroke="rgba(239,68,68,0.3)" stroke-width="1"/>
  <text x="880" y="390" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="14" font-weight="600" fill="#ef4444">The Reality:</text>
  <text x="880" y="415" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="13" fill="rgba(255,255,255,0.5)">You're running a compromised dependency.</text>

  <text x="600" y="468" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="12" fill="rgba(255,255,255,0.2)">hotaisle.xyz — SOC2 Is Broken</text>
</svg>`;

// ─── PRICING TIERS ────────────────────────────────────────────────────────────
// 1200×520 — $8k vs $80k audit, same badge
const pricingTiers = `<svg width="1200" height="520" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="g4" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1200" height="520" fill="#0a0f1e"/>
  <rect width="1200" height="520" fill="url(#g4)"/>

  <text x="600" y="52" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="22" font-weight="700" fill="white" letter-spacing="-0.5">
    The Two-Tier Badge Problem
  </text>
  <text x="600" y="78" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="14" fill="rgba(255,255,255,0.45)">
    Different scrutiny. Different rigor. Identical report.
  </text>

  <!-- Left card: budget -->
  <rect x="80" y="110" width="460" height="340" rx="16"
    fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
  <text x="310" y="158" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="15" font-weight="600" fill="rgba(255,255,255,0.5)" letter-spacing="2">BUDGET AUDIT</text>
  <text x="310" y="220" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="64" font-weight="900" fill="white">$8K</text>
  <text x="310" y="250" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="13" fill="rgba(255,255,255,0.35)">Offshore CPA firm · Checklist review</text>

  <text x="310" y="295" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="13" fill="rgba(255,255,255,0.45)">Policy document review</text>
  <text x="310" y="318" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="13" fill="rgba(255,255,255,0.45)">Employee interviews over Zoom</text>
  <text x="310" y="341" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="13" fill="rgba(255,255,255,0.45)">Screenshot log verification</text>
  <text x="310" y="364" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="13" fill="rgba(255,255,255,0.3)">No penetration testing</text>

  <!-- Badge on left -->
  <rect x="230" y="390" width="160" height="42" rx="8"
    fill="rgba(34,197,94,0.1)" stroke="rgba(34,197,94,0.4)" stroke-width="1.5"/>
  <text x="310" y="417" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="14" font-weight="700" fill="#22c55e">SOC2 Type 2 ✓</text>

  <!-- Right card: premium -->
  <rect x="660" y="110" width="460" height="340" rx="16"
    fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
  <text x="890" y="158" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="15" font-weight="600" fill="rgba(255,255,255,0.5)" letter-spacing="2">PREMIUM AUDIT</text>
  <text x="890" y="220" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="64" font-weight="900" fill="white">$80K</text>
  <text x="890" y="250" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="13" fill="rgba(255,255,255,0.35)">US-based Big Four affiliate · Deeper review</text>

  <text x="890" y="295" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="13" fill="rgba(255,255,255,0.45)">Policy document review</text>
  <text x="890" y="318" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="13" fill="rgba(255,255,255,0.45)">Employee interviews (on-site)</text>
  <text x="890" y="341" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="13" fill="rgba(255,255,255,0.45)">Evidence sampling and testing</text>
  <text x="890" y="364" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="13" fill="rgba(255,255,255,0.45)">More extensive control walkthroughs</text>

  <!-- Badge on right — identical -->
  <rect x="810" y="390" width="160" height="42" rx="8"
    fill="rgba(34,197,94,0.1)" stroke="rgba(34,197,94,0.4)" stroke-width="1.5"/>
  <text x="890" y="417" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="14" font-weight="700" fill="#22c55e">SOC2 Type 2 ✓</text>

  <!-- VS divider -->
  <text x="600" y="295" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="22" font-weight="900" fill="rgba(249,115,22,0.6)">VS</text>
  <line x1="600" y1="115" x2="600" y2="445" stroke="rgba(255,255,255,0.08)" stroke-width="1" stroke-dasharray="4,4"/>

  <!-- Bottom: identical report callout -->
  <text x="600" y="480" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="14" font-weight="600" fill="rgba(249,115,22,0.7)">
    The buyer cannot tell the difference. The report is identical.
  </text>

  <text x="600" y="510" text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, sans-serif"
    font-size="12" fill="rgba(255,255,255,0.2)">hotaisle.xyz — SOC2 Is Broken</text>
</svg>`;

await svgToPng(header, `${OUT}/header.png`);
await svgToPng(aicpaConflict, `${OUT}/aicpa-conflict.png`);
await svgToPng(auditGap, `${OUT}/audit-gap.png`);
await svgToPng(pricingTiers, `${OUT}/pricing-tiers.png`);

console.log('All images generated.');
