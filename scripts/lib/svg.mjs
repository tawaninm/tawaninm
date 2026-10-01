// Shared drawing helpers for the TAWAN-OS cards: pixel art, window chrome, motion.
// Imported by build-assets.mjs and build-stats.mjs.

import { palette as c } from "../profile.mjs";

export const SANS = `'Trebuchet MS', Verdana, sans-serif`;
export const MONO = `ui-monospace, Consolas, 'Courier New', monospace`;

// ---------- helpers ----------

export const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Draws a bitmap (array of strings) as pixel rects. `colors` maps a char to a fill; "." is empty.
export function pixels(bitmap, colors, x, y, size) {
  const out = [];
  bitmap.forEach((row, r) => {
    [...row].forEach((ch, col) => {
      if (colors[ch]) {
        out.push(`<rect x="${x + col * size}" y="${y + r * size}" width="${size}" height="${size}" fill="${colors[ch]}"/>`);
      }
    });
  });
  return `<g shape-rendering="crispEdges">${out.join("")}</g>`;
}

// 4-point sparkle centred on (x, y).
export function sparkle(x, y, r, fill, delay) {
  const k = r * 0.28;
  const d = `M${x} ${y - r} L${x + k} ${y - k} L${x + r} ${y} L${x + k} ${y + k} L${x} ${y + r} L${x - k} ${y + k} L${x - r} ${y} L${x - k} ${y - k}Z`;
  return `<path class="twinkle" style="animation-delay:${delay}s" d="${d}" fill="${fill}" stroke="${c.ink}" stroke-width="1.5" stroke-linejoin="round"/>`;
}

// WCAG 2.x contrast ratio.
export function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lin = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// ---------- pixel art ----------

export const ICONS = {
  folder: [
    ".ooo......",
    "oyyyo.....",
    "oyyyyoooo.",
    "oyyyyyyyyo",
    "oYYYYYYYYo",
    "oYYYYYYYYo",
    "oYYYYYYYYo",
    "oYYYYYYYYo",
    ".oooooooo.",
  ],
  heart: [
    ".oo...oo..",
    "oppo.oppo.",
    "opwppppppo",
    "opppppppPo",
    "oppppppPPo",
    ".oppppPPo.",
    "..oppPPo..",
    "...oPPo...",
    "....oo....",
  ],
  star: [
    "....oo....",
    "...oyyo...",
    "oooyyyyooo",
    "oyyyyyyYYo",
    ".oyyyyYYo.",
    "..oyyyYo..",
    ".oyYooYYo.",
    "oYYo..oYYo",
    "ooo....ooo",
  ],
  window: [
    "oooooooooo",
    "obbbbbbwbo",
    "oooooooooo",
    "owwwwwwwwo",
    "owppwwssso",
    "owppwwwwwo",
    "owwwwssswo",
    "owwwwwwwwo",
    "oooooooooo",
  ],
  mail: [
    "oooooooooo",
    "oowwwwwwoo",
    "owowwwwowo",
    "owwowwowwo",
    "owwwoowwwo",
    "owwwwwwwwo",
    "owwwwwwppo",
    "owwwwwwwwo",
    "oooooooooo",
  ],
  code: [
    "..........",
    "..o....o..",
    ".oo....oo.",
    "oo..o...oo",
    "o...o....o",
    "oo..o...oo",
    ".oo.o..oo.",
    "..o....o..",
    "..........",
  ],
  bot: [
    "....oo....",
    "....oo....",
    ".oooooooo.",
    "owwwwwwwwo",
    "owoowwoowo",
    "owoowwoowo",
    "owwwppwwwo",
    "owwwwwwwwo",
    ".oooooooo.",
  ],
  doc: [
    "ooooo..",
    "owwwoo.",
    "owwwwwo",
    "owpppwo",
    "owwwwwo",
    "owsssso",
    "owwwwwo",
    "ooooooo",
  ],
  cursor: [
    "o.......",
    "oo......",
    "owo.....",
    "owwo....",
    "owwwo...",
    "owwwwo..",
    "owwwwwo.",
    "owwwoooo",
    "owowo...",
    "oo.owo..",
    "o...owo.",
    ".....o..",
  ],
  facebook: [
    "oooooooooo",
    "obbbbbbbbo",
    "obbbbbwwbo",
    "obbbbwbbbo",
    "obbwwwwwbo",
    "obbbbwbbbo",
    "obbbbwbbbo",
    "obbbbwbbbo",
    "oooooooooo",
  ],
  instagram: [
    "oooooooooo",
    "oPPPPPPPPo",
    "oPPoooPwPo",
    "oPoPPPoPPo",
    "oPoPwPoPPo",
    "oPoPPPoPPo",
    "oPPoooPPPo",
    "oPPPPPPPPo",
    "oooooooooo",
  ],
  trophy: [
    "oooooooooo",
    "oyyywyyYYo",
    ".oyyyyyYo.",
    ".oyyyyyYo.",
    "..oyyyYo..",
    "...oyYo...",
    "....oo....",
    "...oyYo...",
    "..oooooo..",
  ],
  sun: [
    "...oooo...",
    ".ooyyyyoo.",
    ".oyywyyyo.",
    "oyywyyyyYo",
    "oyyyyyyyYo",
    "oyyyyyyYYo",
    ".oyyyyYYo.",
    ".ooYYYYoo.",
    "...oooo...",
  ],
};

export const ICON_COLORS = {
  o: c.ink,
  y: c.gold,
  Y: "#F0C860",
  p: c.sakura,
  P: c.hotPink,
  w: "#FFFFFF",
  b: c.electric,
  s: c.sky,
};

export const CLOUD = [
  "....oooo......",
  "...owwwwo.oo..",
  ".ooowwwwwowwo.",
  "owwwwwwwwwwwwo",
  "owwwwwwwwwwsso",
  ".oooooooooooo.",
];

// ---------- window chrome (shared by every card) ----------

export const FX = 10; // frame inset leaves room for the offset shadow
export const BAR = 42;

// Returns the pieces of an app window: `defs` for <defs>, `back` to draw first
// (shadow + body fill), `front` to draw last (title bar + outline).
export function windowChrome(W, H, title, icon, bodyFill) {
  const fw = W - FX * 2 - 8;
  const fh = H - FX * 2 - 8;
  const defs = `
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${c.titleA}"/>
      <stop offset="1" stop-color="${c.titleB}"/>
    </linearGradient>
    <pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse">
      <rect x="7" y="7" width="2" height="2" fill="#FFFFFF" opacity=".45"/>
    </pattern>
    <clipPath id="body"><rect x="${FX}" y="${FX + BAR}" width="${fw}" height="${fh - BAR}"/></clipPath>`;
  const back = `
  <rect x="${FX + 8}" y="${FX + 8}" width="${fw}" height="${fh}" rx="14" fill="${c.ink}"/>
  <rect x="${FX}" y="${FX}" width="${fw}" height="${fh}" rx="14" fill="${bodyFill}"/>
  <rect x="${FX}" y="${FX + BAR}" width="${fw}" height="${fh - BAR}" fill="url(#dots)"/>`;
  const buttons = ["_", "□", "×"]
    .map((g, i) => {
      const bx = FX + fw - 110 + i * 34;
      return `<rect x="${bx}" y="${FX + 9}" width="26" height="24" rx="5" fill="${c.paper}" stroke="${c.ink}" stroke-width="2"/><text x="${bx + 13}" y="${FX + 26}" text-anchor="middle" font-family="${MONO}" font-size="15" font-weight="700" fill="${c.ink}">${g}</text>`;
    })
    .join("");
  const front = `
  <path d="M${FX} ${FX + 14} a14 14 0 0 1 14 -14 h${fw - 28} a14 14 0 0 1 14 14 v${BAR - 14} h-${fw} z" fill="url(#bar)"/>
  <line x1="${FX}" y1="${FX + BAR}" x2="${FX + fw}" y2="${FX + BAR}" stroke="${c.ink}" stroke-width="3"/>
  ${pixels(ICONS[icon], ICON_COLORS, FX + 14, FX + 12, 2)}
  <text x="${FX + 42}" y="${FX + 27}" font-family="${MONO}" font-size="15" font-weight="700" fill="${c.paper}">${esc(title)}</text>
  ${buttons}
  <rect x="${FX}" y="${FX}" width="${fw}" height="${fh}" rx="14" fill="none" stroke="${c.ink}" stroke-width="3"/>`;
  return { defs, back, front, fw, fh };
}

// ---------- motion (shared by every card) ----------

// One stylesheet for all cards. Everything stops under prefers-reduced-motion;
// each element's resting state is a sensible static frame.
export const MOTION_CSS = `
    .twinkle { transform-box: fill-box; transform-origin: center; animation: twinkle 2.4s ease-in-out infinite; }
    .drift { animation: drift 14s ease-in-out infinite alternate; }
    .drift2 { animation: drift 18s ease-in-out infinite alternate-reverse; }
    .bokeh { transform-box: fill-box; transform-origin: center; animation: bokeh 11s ease-in-out infinite alternate; }
    .rise { transform-box: fill-box; transform-origin: center; animation: rise 7s linear infinite both; }
    .sweep { animation: sweep 5s linear infinite; }
    .pop { transform-box: fill-box; transform-origin: 20% 100%; animation: pop 5s ease-out infinite both; }
    .glitch { opacity: 0; animation: glitch 6s steps(1) infinite; }
    .bob { animation: bob 3s ease-in-out infinite; }
    .blink { opacity: 0; animation: blink 4s steps(1) infinite; }
    .charge { animation: charge 6s ease-out infinite both; }
    .slidein { animation: slidein .6s cubic-bezier(.16,1,.3,1) 1 both; }
    .dot { transform-box: fill-box; animation: dot 1.2s ease-in-out infinite; }
    .cursor { animation: cursor 12s ease-in-out infinite; }
    .shine { animation: shine 6s ease-in-out infinite; }
    @keyframes twinkle { 0%,100% { transform: scale(1); opacity: 1 } 50% { transform: scale(.55); opacity: .6 } }
    @keyframes drift { from { transform: translateX(0) } to { transform: translateX(40px) } }
    @keyframes bokeh { from { transform: translate(0,0) scale(1) } to { transform: translate(24px,-18px) scale(1.12) } }
    @keyframes rise { 0% { transform: translateY(0) scale(.6); opacity: 0 } 15% { opacity: 1 } 80% { opacity: 1 } 100% { transform: translateY(-240px) scale(1.1); opacity: 0 } }
    @keyframes sweep { from { transform: translateY(0) } to { transform: translateY(340px) } }
    @keyframes pop { 0%,55% { transform: scale(0) } 62% { transform: scale(1.18) } 68%,92% { transform: scale(1) } 100% { transform: scale(0) } }
    @keyframes glitch { 0% { opacity: 0 } 90% { opacity: .95; transform: translateX(-4px) } 92% { opacity: 0 } 94% { opacity: .95; transform: translateX(3px) } 96% { opacity: 0 } }
    @keyframes bob { 50% { transform: translateY(-5px) } }
    @keyframes blink { 0% { opacity: 0 } 92% { opacity: 1 } 95% { opacity: 0 } }
    @keyframes charge { 0% { opacity: 0 } 12% { opacity: 1 } 88% { opacity: 1 } 100% { opacity: 0 } }
    @keyframes slidein { from { transform: translateX(-14px); opacity: 0 } to { transform: none; opacity: 1 } }
    @keyframes cursor {
      0%, 18% { transform: var(--p1) }
      25%, 43% { transform: var(--p2) }
      50%, 68% { transform: var(--p3) }
      75%, 93% { transform: var(--p4) }
      100% { transform: var(--p1) }
    }
    @keyframes shine { 0%, 55% { transform: translateX(-160px) } 85%, 100% { transform: translateX(520px) } }
    @keyframes dot { 0%,60%,100% { transform: translateY(0) } 30% { transform: translateY(-5px) } }
    @media (prefers-reduced-motion: reduce) {
      * { animation: none !important; }
      .glitch, .blink { opacity: 0; }
    }`;

// Soft out-of-focus circles drifting behind the content.
export function bokeh(circles) {
  return circles
    .map(([x, y, r, d]) => `<circle class="bokeh" style="animation-delay:-${d}s" cx="${x}" cy="${y}" r="${r}" fill="#FFFFFF" opacity=".22"/>`)
    .join("");
}

// Small sparkles that float up from `baseY` and fade, staggered.
export function risers(xs, baseY, colors) {
  return xs
    .map((x, i) => {
      const r = 3 + (i % 3);
      const k = r * 0.3;
      const y = baseY + (i % 4) * 8;
      const d = `M${x} ${y - r} L${x + k} ${y - k} L${x + r} ${y} L${x + k} ${y + k} L${x} ${y + r} L${x - k} ${y + k} L${x - r} ${y} L${x - k} ${y - k}Z`;
      return `<path class="rise" style="animation-delay:${(i * 0.83) % 7}s;animation-duration:${6 + (i % 3)}s" d="${d}" fill="${colors[i % colors.length]}"/>`;
    })
    .join("");
}

// CRT overlay: faint scanlines plus a bright band sweeping down.
// Returns `defs` for <defs> and `layer` to draw on top of the content.
export function crt(x, y, w, h) {
  const defs = `
    <pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="1" fill="${c.ink}" opacity=".06"/></pattern>
    <linearGradient id="band" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/>
      <stop offset=".5" stop-color="#FFFFFF" stop-opacity=".28"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>`;
  const layer = `
  <g clip-path="url(#body)">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#scan)"/>
    <rect class="sweep" x="${x}" y="${y - 40}" width="${w}" height="40" fill="url(#band)"/>
  </g>`;
  return { defs, layer };
}

export const BUBBLE = [
  ".ooooooooo.",
  "owwwwwwwwwo",
  "owwPPwPPwwo",
  "owPPPPPPPwo",
  "owPPPPPPPwo",
  "owwPPPPPwwo",
  "owwwPPPwwwo",
  "owwwwPwwwwo",
  ".oowoooooo.",
  "..ow.......",
  "..o........",
];

// Pixel speech bubble with a heart that pops in, holds, and shrinks away.
export function heartBubble(x, y, size, delay) {
  return `<g class="pop" style="animation-delay:${delay}s">${pixels(BUBBLE, { o: c.ink, w: "#FFFFFF", P: c.hotPink }, x, y, size)}</g>`;
}

// ---------- layout helpers ----------

export const CHIP_FILLS = [c.sakura, c.sky, c.mint, c.lavender, c.gold];
export const MONO12_W = 7.3; // approx advance of a 12px monospace glyph

// Splits text into lines of at most `max` characters, breaking on spaces.
export function wrap(text, max) {
  const lines = [];
  let line = "";
  for (const word of text.split(" ")) {
    if (line && (line + " " + word).length > max) {
      lines.push(line);
      line = word;
    } else line = line ? line + " " + word : word;
  }
  if (line) lines.push(line);
  return lines;
}
