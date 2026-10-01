// Generates the TAWAN-OS README cards as SVG files in assets/.
// Standard library only. Run from the repo root:  node scripts/build-assets.mjs

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { profile, palette as c } from "./profile.mjs";
import { AVATAR, AVATAR_COLORS, AVATAR_EYES, AVATAR_W, AVATAR_H } from "./avatar.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "assets");

const SANS = `'Trebuchet MS', Verdana, sans-serif`;
const MONO = `ui-monospace, Consolas, 'Courier New', monospace`;

// ---------- helpers ----------

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Draws a bitmap (array of strings) as pixel rects. `colors` maps a char to a fill; "." is empty.
function pixels(bitmap, colors, x, y, size) {
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
function sparkle(x, y, r, fill, delay) {
  const k = r * 0.28;
  const d = `M${x} ${y - r} L${x + k} ${y - k} L${x + r} ${y} L${x + k} ${y + k} L${x} ${y + r} L${x - k} ${y + k} L${x - r} ${y} L${x - k} ${y - k}Z`;
  return `<path class="twinkle" style="animation-delay:${delay}s" d="${d}" fill="${fill}" stroke="${c.ink}" stroke-width="1.5" stroke-linejoin="round"/>`;
}

// WCAG 2.x contrast ratio.
function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lin = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// ---------- pixel art ----------

const ICONS = {
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

const ICON_COLORS = {
  o: c.ink,
  y: c.gold,
  Y: "#F0C860",
  p: c.sakura,
  P: c.hotPink,
  w: "#FFFFFF",
  b: c.electric,
  s: c.sky,
};

const CLOUD = [
  "....oooo......",
  "...owwwwo.oo..",
  ".ooowwwwwowwo.",
  "owwwwwwwwwwwwo",
  "owwwwwwwwwwsso",
  ".oooooooooooo.",
];

// ---------- window chrome (shared by every card) ----------

const FX = 10; // frame inset leaves room for the offset shadow
const BAR = 42;

// Returns the pieces of an app window: `defs` for <defs>, `back` to draw first
// (shadow + body fill), `front` to draw last (title bar + outline).
function windowChrome(W, H, title, icon, bodyFill) {
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
const MOTION_CSS = `
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
    @keyframes dot { 0%,60%,100% { transform: translateY(0) } 30% { transform: translateY(-5px) } }
    @media (prefers-reduced-motion: reduce) {
      * { animation: none !important; }
      .glitch, .blink { opacity: 0; }
    }`;

// Soft out-of-focus circles drifting behind the content.
function bokeh(circles) {
  return circles
    .map(([x, y, r, d]) => `<circle class="bokeh" style="animation-delay:-${d}s" cx="${x}" cy="${y}" r="${r}" fill="#FFFFFF" opacity=".22"/>`)
    .join("");
}

// Small sparkles that float up from `baseY` and fade, staggered.
function risers(xs, baseY, colors) {
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
function crt(x, y, w, h) {
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

const BUBBLE = [
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
function heartBubble(x, y, size, delay) {
  return `<g class="pop" style="animation-delay:${delay}s">${pixels(BUBBLE, { o: c.ink, w: "#FFFFFF", P: c.hotPink }, x, y, size)}</g>`;
}

// ---------- welcome.svg ----------

function welcome() {
  const W = 840;
  const H = 360;
  const fx = FX;
  const { defs, back, front, fw, fh } = windowChrome(W, H, "welcome.exe — TAWAN-OS", "heart", "url(#sky)");
  const screen = crt(fx, fx + BAR, fw, fh - BAR);

  // Typewriter: each line reveals through a clip rect, one after another.
  const lines = profile.typewriter.map((t) => `> ${t}`);
  const step = 4; // seconds per line
  const total = step * lines.length;
  const charW = 9.6; // approx advance of a 16px monospace glyph
  const tx = 46;
  const ty = 258;
  const typer = lines
    .map((line, i) => {
      const w = Math.ceil(line.length * charW) + 4;
      const pts = [
        [0, 0],
        [i / lines.length, 0],
        [(i + 0.45) / lines.length, w],
        [(i + 0.92) / lines.length, w],
        [(i + 1) / lines.length, 0],
        [1, 0],
      ];
      // drop points that share a time with the next one (keyTimes must be increasing)
      const keep = pts.filter((p, j) => j === pts.length - 1 || p[0] !== pts[j + 1][0]);
      const keyTimes = keep.map((p) => +p[0].toFixed(4)).join(";");
      const values = keep.map((p) => p[1]).join(";");
      return `
    <clipPath id="type${i}"><rect x="${tx}" y="${ty - 18}" height="26" width="0">
      <animate attributeName="width" dur="${total}s" repeatCount="indefinite" keyTimes="${keyTimes}" values="${values}"/>
    </rect></clipPath>
    <text clip-path="url(#type${i})" x="${tx}" y="${ty}" font-family="${MONO}" font-size="16" fill="${c.ink}">${esc(line)}</text>`;
    })
    .join("");

  const desktopIcons = [
    ["folder", "projects"],
    ["heart", "about.me"],
    ["star", "skills"],
  ]
    .map(([icon, label], i) => {
      const x = 718;
      const y = 74 + i * 86;
      return `
    <g>
      ${pixels(ICONS[icon], ICON_COLORS, x, y, 4)}
      <rect x="${x - 14}" y="${y + 42}" width="68" height="20" rx="4" fill="${c.paper}" stroke="${c.ink}" stroke-width="1.5"/>
      <text x="${x + 20}" y="${y + 56}" text-anchor="middle" font-family="${MONO}" font-size="12" fill="${c.ink}">${label}</text>
    </g>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="t d">
  <title id="t">welcome.exe — TAWAN-OS</title>
  <desc id="d">${esc(`${profile.name} (${profile.nickname}). ${profile.roles.join(", ")}. ${profile.school}.`)}</desc>
  <style>${MOTION_CSS}
  </style>
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c.lavender}"/>
      <stop offset=".5" stop-color="${c.sakura}"/>
      <stop offset="1" stop-color="${c.sky}"/>
    </linearGradient>
    ${defs}${screen.defs}
  </defs>

  ${back}

  <!-- scenery -->
  <g clip-path="url(#body)">
    ${bokeh([[120, 120, 90, 0], [470, 250, 110, 4], [700, 110, 70, 7], [300, 330, 80, 2]])}
    ${pixels(ICONS.sun, ICON_COLORS, 560, 70, 7)}
    <g class="drift">${pixels(CLOUD, { o: c.ink, w: "#FFFFFF", s: c.lavender }, 410, 60, 4)}</g>
    <g class="drift2">${pixels(CLOUD, { o: c.ink, w: "#FFFFFF", s: c.lavender }, 560, 190, 4)}</g>
    <path d="M${fx} ${fx + fh - 34} Q 220 ${fx + fh - 70} 420 ${fx + fh - 40} T ${fx + fw} ${fx + fh - 50} V ${fx + fh} H ${fx} Z" fill="${c.mint}" stroke="${c.ink}" stroke-width="2.5"/>
    ${sparkle(400, 76, 11, "#FFFFFF", 0)}
    ${sparkle(660, 236, 9, c.gold, 0.8)}
    ${sparkle(612, 262, 7, "#FFFFFF", 1.6)}
    ${sparkle(372, 210, 6, c.gold, 0.4)}
    ${risers([60, 150, 250, 330, 420, 500, 590, 650, 700, 780, 200, 460], 330, ["#FFFFFF", c.gold, "#FFFFFF", c.sky])}
  </g>

  ${front}

  <!-- greeting -->
  <rect x="38" y="72" width="132" height="26" rx="13" fill="${c.paper}" stroke="${c.ink}" stroke-width="2"/>
  <text x="104" y="90" text-anchor="middle" font-family="${MONO}" font-size="13" fill="${c.ink}">hello, world!</text>
  <text class="glitch" x="38" y="150" font-family="${SANS}" font-size="46" font-weight="700" fill="${c.sky}" stroke="${c.sky}" stroke-width="8" stroke-linejoin="round">${esc(profile.name)}</text>
  <text class="glitch" style="animation-direction:reverse" x="38" y="150" font-family="${SANS}" font-size="46" font-weight="700" fill="${c.hotPink}" stroke="${c.hotPink}" stroke-width="8" stroke-linejoin="round">${esc(profile.name)}</text>
  <text x="38" y="150" font-family="${SANS}" font-size="46" font-weight="700" fill="${c.paper}" stroke="${c.ink}" stroke-width="8" stroke-linejoin="round" paint-order="stroke">${esc(profile.name)}</text>
  <text x="40" y="182" font-family="${SANS}" font-size="18" font-weight="700" fill="${c.ink}">aka ${esc(profile.nickname)} · ${esc(profile.roles.join(" · "))}</text>
  <text x="40" y="208" font-family="${SANS}" font-size="15" fill="${c.ink}">${esc(profile.school)}</text>

  <!-- terminal line -->
  <rect x="34" y="234" width="${520}" height="34" rx="8" fill="${c.paper}" stroke="${c.ink}" stroke-width="2"/>
  ${typer}

  <!-- desktop icons -->
  ${desktopIcons}

  <!-- status chip -->
  <rect x="34" y="${fx + fh - 30}" width="210" height="22" rx="11" fill="${c.paper}" stroke="${c.ink}" stroke-width="2"/>
  <circle cx="50" cy="${fx + fh - 19}" r="5" fill="#2F9E44" stroke="${c.ink}" stroke-width="1.5"/>
  <text x="62" y="${fx + fh - 14}" font-family="${MONO}" font-size="12" fill="${c.ink}">online · ${esc(profile.location)}</text>

  ${heartBubble(628, 58, 3, 0.5)}
  ${screen.layer}
</svg>
`;
}

// ---------- profile.sys ----------

const CHIP_FILLS = [c.sakura, c.sky, c.mint, c.lavender, c.gold];
const MONO12_W = 7.3; // approx advance of a 12px monospace glyph

function profileCard() {
  const W = 840;
  const H = 440;
  const { defs, back, front } = windowChrome(W, H, "profile.sys", "star", c.paper);
  const rx = 256; // right column start
  const rEnd = 800;

  // left: avatar panel — a small pixel "screen" showing the avatar
  const px = 4;
  const scr = { x: 44, y: 82, w: 172, h: AVATAR_H * px };
  const ax = 130 - (AVATAR_W * px) / 2;
  const blink = AVATAR_EYES.map(([x, y, , h]) => `<rect x="${ax + x * px}" y="${scr.y + y * px}" width="${2 * px}" height="${(h - 1) * px}" fill="${AVATAR_COLORS.s}"/>`).join("");
  const avatar = `
  <rect x="30" y="70" width="200" height="236" rx="10" fill="${c.sky}" stroke="${c.ink}" stroke-width="2.5"/>
  <rect x="${scr.x}" y="${scr.y}" width="${scr.w}" height="${scr.h}" fill="url(#screenBg)"/>
  <rect x="${scr.x}" y="${scr.y}" width="${scr.w}" height="${scr.h}" fill="url(#halftone)"/>
  <g clip-path="url(#screen)">
    ${sparkle(scr.x + 18, scr.y + 22, 6, "#FFFFFF", 0.3)}
    ${sparkle(scr.x + scr.w - 16, scr.y + 60, 5, c.gold, 1.1)}
    ${sparkle(scr.x + 14, scr.y + 104, 4, "#FFFFFF", 1.9)}
    <g class="bob">
      ${pixels(AVATAR, AVATAR_COLORS, ax, scr.y, px)}
      <g class="blink">${blink}</g>
    </g>
  </g>
  <rect x="${scr.x}" y="${scr.y}" width="${scr.w}" height="${scr.h}" fill="none" stroke="${c.ink}" stroke-width="2.5"/>
  ${heartBubble(170, 70, 3, 1.2)}
  <text x="130" y="250" text-anchor="middle" font-family="${SANS}" font-size="22" font-weight="700" fill="${c.ink}">${esc(profile.nickname)}</text>
  <text x="130" y="268" text-anchor="middle" font-family="${MONO}" font-size="12" fill="${c.ink}">LV.3 · IT student</text>
  <rect x="62" y="278" width="136" height="22" rx="11" fill="${c.paper}" stroke="${c.ink}" stroke-width="1.5"/>
  <text x="130" y="293" text-anchor="middle" font-family="${MONO}" font-size="12" fill="${c.ink}">${esc(profile.location)}</text>`;

  // right: stat rows
  const rows = profile.stats
    .map(([k, v], i) => {
      const y = 92 + i * 28;
      return `
  <text x="${rx}" y="${y}" font-family="${MONO}" font-size="12" font-weight="700" fill="${c.ink}">${esc(k)}</text>
  <text x="${rx + 110}" y="${y}" font-family="${MONO}" font-size="14" fill="${c.ink}">${esc(v)}</text>
  <line x1="${rx}" y1="${y + 9}" x2="${rEnd}" y2="${y + 9}" stroke="${c.lavender}" stroke-width="1.5" stroke-dasharray="4 4"/>`;
    })
    .join("");

  // engine bars: 5 segments, filled up to the stated level
  const engines = profile.engines
    .map(([name, level, label], i) => {
      const x = rx + (i % 2) * 276;
      const y = 234 + Math.floor(i / 2) * 40;
      const segs = Array.from({ length: 5 }, (_, s) => {
        const on = s < level;
        const sx = x + 128 + s * 24;
        const base = `<rect x="${sx}" y="${y - 12}" width="20" height="14" rx="2" fill="${c.paper}" stroke="${c.ink}" stroke-width="1.5"/>`;
        return on
          ? base + `<rect class="charge" style="animation-delay:${(s * 0.25 + i * 0.1).toFixed(2)}s" x="${sx}" y="${y - 12}" width="20" height="14" rx="2" fill="${c.titleB}" stroke="${c.ink}" stroke-width="1.5"/>`
          : base;
      }).join("");
      return `
  <text x="${x}" y="${y}" font-family="${MONO}" font-size="13" font-weight="700" fill="${c.ink}">${esc(name)}</text>
  <text x="${x}" y="${y + 16}" font-family="${MONO}" font-size="11" fill="${c.ink}">${esc(label)}</text>
  ${segs}`;
    })
    .join("");

  // inventory chips, wrapped to the right column
  let cx = rx;
  let cy = 336;
  const chips = profile.inventory
    .map((item, i) => {
      const w = Math.ceil(item.length * MONO12_W) + 18;
      if (cx + w > rEnd) {
        cx = rx;
        cy += 30;
      }
      const out = `<rect x="${cx}" y="${cy}" width="${w}" height="22" rx="11" fill="${CHIP_FILLS[i % CHIP_FILLS.length]}" stroke="${c.ink}" stroke-width="1.5"/><text x="${cx + w / 2}" y="${cy + 15}" text-anchor="middle" font-family="${MONO}" font-size="12" fill="${c.ink}">${esc(item)}</text>`;
      cx += w + 6;
      return out;
    })
    .join("");

  const heading = (x, y, text) =>
    `<rect x="${x}" y="${y - 15}" width="${Math.ceil(text.length * MONO12_W) + 20}" height="20" rx="4" fill="${c.ink}"/><text x="${x + 10}" y="${y}" font-family="${MONO}" font-size="12" font-weight="700" fill="${c.paper}">${esc(text)}</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="t d">
  <title id="t">profile.sys — TAWAN-OS</title>
  <desc id="d">${esc(
    `${profile.stats.map(([k, v]) => `${k}: ${v}`).join(". ")}. Engines: ${profile.engines
      .map(([n, , l]) => `${n} ${l}`)
      .join(", ")}. Inventory: ${profile.inventory.join(", ")}. Motto: ${profile.motto}`
  )}</desc>
  <style>${MOTION_CSS}
  </style>
  <defs>${defs}
    <linearGradient id="screenBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${c.sakura}"/>
      <stop offset="1" stop-color="${c.lavender}"/>
    </linearGradient>
    <pattern id="halftone" width="8" height="8" patternUnits="userSpaceOnUse">
      <rect x="3" y="3" width="2" height="2" fill="#FFFFFF" opacity=".5"/>
    </pattern>
    <clipPath id="screen"><rect x="44" y="82" width="172" height="${AVATAR_H * 4}"/></clipPath>
  </defs>
  ${back}
  ${avatar}
  ${rows}
  ${heading(rx, 208, "ENGINE XP")}
  ${engines}
  ${heading(rx, 324, "INVENTORY")}
  ${chips}
  <text x="130" y="336" text-anchor="middle" font-family="${MONO}" font-size="12" font-weight="700" fill="${c.ink}">MOTTO</text>
  <text font-family="${SANS}" font-size="13" font-style="italic" fill="${c.ink}" text-anchor="middle">
    <tspan x="130" y="356">“take care of your work,</tspan>
    <tspan x="130" y="374">and your work will</tspan>
    <tspan x="130" y="392">take care of you.”</tspan>
  </text>
  ${front}
</svg>
`;
}

// ---------- experience.log ----------

// Splits text into lines of at most `max` characters, breaking on spaces.
function wrap(text, max) {
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

function experienceCard() {
  const W = 840;
  const H = 132 + profile.experience.length * 68; // header + bubbles + input bar
  const { defs, back, front, fw, fh } = windowChrome(W, H, "experience.log", "code", c.paper);
  const bottom = FX + fh;

  // chat bubbles, newest first
  const bubbles = profile.experience
    .map(([icon, role, org, dates, current, note], i) => {
      const y = 66 + i * 68;
      const fill = CHIP_FILLS[i % CHIP_FILLS.length];
      const chipW = Math.ceil(dates.length * 6.7) + 16;
      const chipX = 556 - chipW;
      return `
  <g class="slidein" style="animation-delay:${(0.15 + i * 0.22).toFixed(2)}s">
    <rect x="30" y="${y + 6}" width="40" height="40" rx="10" fill="${c.paper}" stroke="${c.ink}" stroke-width="2"/>
    ${pixels(ICONS[icon], ICON_COLORS, 35, y + 13, 3)}
    <path d="M78 ${y + 20} l-8 6 l8 4 z" fill="${fill}" stroke="${c.ink}" stroke-width="2" stroke-linejoin="round"/>
    <rect x="78" y="${y}" width="486" height="60" rx="12" fill="${fill}" stroke="${c.ink}" stroke-width="2"/>
    <rect x="76" y="${y + 21}" width="4" height="8" fill="${fill}"/>
    <text x="92" y="${y + 21}" font-family="${SANS}" font-size="15" font-weight="700" fill="${c.ink}">${esc(role)}</text>
    <text x="92" y="${y + 37}" font-family="${MONO}" font-size="11" fill="${c.ink}">${esc(org)}</text>
    <text x="92" y="${y + 53}" font-family="${SANS}" font-size="12.5" fill="${c.ink}">${esc(note)}</text>
    <rect x="${chipX}" y="${y + 8}" width="${chipW}" height="18" rx="9" fill="${current ? c.titleB : c.paper}" stroke="${c.ink}" stroke-width="1.5"/>
    <text x="${chipX + chipW / 2}" y="${y + 21}" text-anchor="middle" font-family="${MONO}" font-size="11" fill="${current ? c.paper : c.ink}">${esc(dates)}</text>
  </g>`;
    })
    .join("");

  // input bar with a typing indicator
  const barY = bottom - 44;
  const input = `
  <rect x="30" y="${barY}" width="534" height="30" rx="15" fill="#FFFFFF" stroke="${c.ink}" stroke-width="2"/>
  <text x="48" y="${barY + 20}" font-family="${MONO}" font-size="12" fill="${c.ink}">tawan is typing</text>
  ${[0, 1, 2].map((d) => `<circle class="dot" style="animation-delay:${d * 0.15}s" cx="${172 + d * 10}" cy="${barY + 16}" r="3" fill="${c.titleB}"/>`).join("")}
  <rect x="482" y="${barY + 4}" width="76" height="22" rx="11" fill="${c.titleB}" stroke="${c.ink}" stroke-width="1.5"/>
  <text x="520" y="${barY + 19}" text-anchor="middle" font-family="${MONO}" font-size="12" font-weight="700" fill="${c.paper}">SEND</text>`;

  // trophies sidebar
  const sx = 586;
  const sw = 226;
  const trophies = profile.achievements
    .map(([title, detail, year], j) => {
      const y = 98 + j * 76;
      const lines = wrap(detail, 32);
      return `
  <rect x="${sx}" y="${y}" width="${sw}" height="68" rx="10" fill="${CHIP_FILLS[(j + 2) % CHIP_FILLS.length]}" stroke="${c.ink}" stroke-width="2"/>
  ${pixels(ICONS.trophy, ICON_COLORS, sx + 10, y + 9, 2)}
  <text x="${sx + 36}" y="${y + 22}" font-family="${MONO}" font-size="13" font-weight="700" fill="${c.ink}">${esc(title)}</text>
  <text x="${sx + sw - 10}" y="${y + 22}" text-anchor="end" font-family="${MONO}" font-size="11" fill="${c.ink}">${year}</text>
  ${lines.map((l, k) => `<text x="${sx + 12}" y="${y + 41 + k * 15}" font-family="${SANS}" font-size="12" fill="${c.ink}">${esc(l)}</text>`).join("")}`;
    })
    .join("");

  // languages (levels from the resume, rounded to 5 segments)
  const langY = 98 + profile.achievements.length * 76 + 8;
  const langs = profile.languages
    .map(([lang, level, label], k) => {
      const y = langY + 26 + k * 22;
      const segs = Array.from({ length: 5 }, (_, s) => `<rect x="${sx + 84 + s * 15}" y="${y - 10}" width="12" height="11" rx="2" fill="${s < level ? c.titleB : c.paper}" stroke="${c.ink}" stroke-width="1.2"/>`).join("");
      return `<text x="${sx + 4}" y="${y}" font-family="${MONO}" font-size="12" font-weight="700" fill="${c.ink}">${esc(lang)}</text>${segs}<text x="${sx + 166}" y="${y}" font-family="${MONO}" font-size="10" fill="${c.ink}">${esc(label)}</text>`;
    })
    .join("");

  // workshops attended, under the languages
  const shopY = langY + 26 + profile.languages.length * 22 + 14;
  const workshops = profile.workshops
    .map(([title, detail], k) => {
      const y = shopY + 12 + k * 52;
      return `
  <rect x="${sx}" y="${y}" width="${sw}" height="44" rx="10" fill="${CHIP_FILLS[(k + 1) % CHIP_FILLS.length]}" stroke="${c.ink}" stroke-width="2"/>
  <text x="${sx + 12}" y="${y + 18}" font-family="${MONO}" font-size="12" font-weight="700" fill="${c.ink}">${esc(title)}</text>
  <text x="${sx + 12}" y="${y + 35}" font-family="${SANS}" font-size="11.5" fill="${c.ink}">${esc(detail)}</text>`;
    })
    .join("");

  const heading = (x, y, text) =>
    `<rect x="${x}" y="${y - 15}" width="${Math.ceil(text.length * MONO12_W) + 20}" height="20" rx="4" fill="${c.ink}"/><text x="${x + 10}" y="${y}" font-family="${MONO}" font-size="12" font-weight="700" fill="${c.paper}">${esc(text)}</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="t d">
  <title id="t">experience.log — TAWAN-OS</title>
  <desc id="d">${esc(
    `Work history: ${profile.experience.map(([, r, o, d, , n]) => `${r}, ${o}, ${d}: ${n}`).join(". ")}. Trophies: ${profile.achievements
      .map(([t, d, y]) => `${t}, ${d}, ${y}`)
      .join(". ")}. Languages: ${profile.languages.map(([l, , lab]) => `${l} ${lab}`).join(", ")}. Workshops: ${profile.workshops
      .map(([t, d]) => `${t}, ${d}`)
      .join(". ")}.`
  )}</desc>
  <style>${MOTION_CSS}
  </style>
  <defs>${defs}
  </defs>
  ${back}
  <line x1="574" y1="${FX + BAR + 12}" x2="574" y2="${bottom - 12}" stroke="${c.lavender}" stroke-width="2" stroke-dasharray="4 4"/>
  ${bubbles}
  ${input}
  ${heading(sx, 84, "TROPHIES")}
  ${sparkle(sx + sw - 14, 72, 7, c.gold, 0.2)}
  ${trophies}
  ${heading(sx, langY + 6, "LANGUAGES")}
  ${langs}
  ${heading(sx, shopY, "WORKSHOPS")}
  ${workshops}
  ${front}
</svg>
`;
}

// ---------- taskbar buttons ----------

function taskButton({ label, icon, fill, title }) {
  const W = 200;
  const H = 56;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(title)}">
  <title>${esc(title)}</title>
  <rect x="7" y="7" width="${W - 10}" height="${H - 10}" rx="${(H - 10) / 2}" fill="${c.ink}"/>
  <rect x="2" y="2" width="${W - 10}" height="${H - 10}" rx="${(H - 10) / 2}" fill="${fill}" stroke="${c.ink}" stroke-width="3"/>
  <rect x="14" y="8" width="${W - 50}" height="6" rx="3" fill="#FFFFFF" opacity=".55"/>
  ${pixels(ICONS[icon], ICON_COLORS, 22, 10, 3)}
  <text x="62" y="32" font-family="${SANS}" font-size="18" font-weight="700" fill="${c.ink}">${esc(label)}</text>
</svg>
`;
}

const buttons = [
  { file: "task-start.svg", label: "TAWAN-OS", icon: "heart", fill: c.mint, title: "Start — TAWAN-OS" },
  { file: "task-portfolio.svg", label: "Portfolio", icon: "window", fill: c.sakura, title: "Portfolio website" },
  { file: "task-github.svg", label: "GitHub", icon: "code", fill: c.lavender, title: "GitHub — tawaninm" },
  { file: "task-mail.svg", label: "Mail", icon: "mail", fill: c.sky, title: "Email — tawaninm13@gmail.com" },
];

// ---------- contrast gate ----------

const textPairs = [
  ["ink on paper", c.ink, c.paper],
  ["ink on lavender", c.ink, c.lavender],
  ["ink on sakura", c.ink, c.sakura],
  ["ink on sky", c.ink, c.sky],
  ["ink on mint", c.ink, c.mint],
  ["paper on title start", c.paper, c.titleA],
  ["paper on title end", c.paper, c.titleB],
  ["ink on gold", c.ink, c.gold],
  ["paper on ink", c.paper, c.ink],
  // non-text: filled vs empty skill segment needs 3:1 (WCAG 1.4.11)
  ["segment filled vs empty", c.titleB, c.paper, 3],
];

let failed = false;
for (const [name, fg, bg, min = 4.5] of textPairs) {
  const ratio = contrast(fg, bg);
  const ok = ratio >= min;
  if (!ok) failed = true;
  console.log(`${ok ? "pass" : "FAIL"}  ${ratio.toFixed(2)}:1  ${name}`);
}
if (failed) {
  console.error("Contrast check failed (WCAG AA needs 4.5:1). No files written.");
  process.exit(1);
}

// ---------- write ----------

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "welcome.svg"), welcome());
writeFileSync(join(outDir, "profile.svg"), profileCard());
writeFileSync(join(outDir, "experience.svg"), experienceCard());
for (const b of buttons) writeFileSync(join(outDir, b.file), taskButton(b));
console.log(`wrote ${3 + buttons.length} files to assets/`);
