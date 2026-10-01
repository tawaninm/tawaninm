// Generates the TAWAN-OS README cards as SVG files in assets/.
// Standard library only. Run from the repo root:  node scripts/build-assets.mjs

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { profile, palette as c } from "./profile.mjs";

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

// ---------- welcome.svg ----------

function welcome() {
  const W = 840;
  const H = 360;
  const bar = 42;
  const fx = 10; // frame inset leaves room for the offset shadow
  const fw = W - fx * 2 - 8;
  const fh = H - fx * 2 - 8;

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
  <style>
    .twinkle { transform-box: fill-box; transform-origin: center; animation: twinkle 2.4s ease-in-out infinite; }
    .drift { animation: drift 14s ease-in-out infinite alternate; }
    .drift2 { animation: drift 18s ease-in-out infinite alternate-reverse; }
    @keyframes twinkle { 0%,100% { transform: scale(1); opacity: 1 } 50% { transform: scale(.55); opacity: .6 } }
    @keyframes drift { from { transform: translateX(0) } to { transform: translateX(40px) } }
    @media (prefers-reduced-motion: reduce) { .twinkle, .drift, .drift2 { animation: none } }
  </style>
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c.lavender}"/>
      <stop offset=".5" stop-color="${c.sakura}"/>
      <stop offset="1" stop-color="${c.sky}"/>
    </linearGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${c.titleA}"/>
      <stop offset="1" stop-color="${c.titleB}"/>
    </linearGradient>
    <pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse">
      <rect x="7" y="7" width="2" height="2" fill="#FFFFFF" opacity=".45"/>
    </pattern>
    <clipPath id="body"><rect x="${fx}" y="${fx + bar}" width="${fw}" height="${fh - bar}" rx="0"/></clipPath>
  </defs>

  <!-- shadow + frame -->
  <rect x="${fx + 8}" y="${fx + 8}" width="${fw}" height="${fh}" rx="14" fill="${c.ink}"/>
  <rect x="${fx}" y="${fx}" width="${fw}" height="${fh}" rx="14" fill="url(#sky)"/>
  <rect x="${fx}" y="${fx + bar}" width="${fw}" height="${fh - bar}" fill="url(#dots)"/>

  <!-- scenery -->
  <g clip-path="url(#body)">
    ${pixels(ICONS.sun, ICON_COLORS, 560, 70, 7)}
    <g class="drift">${pixels(CLOUD, { o: c.ink, w: "#FFFFFF", s: c.lavender }, 410, 60, 4)}</g>
    <g class="drift2">${pixels(CLOUD, { o: c.ink, w: "#FFFFFF", s: c.lavender }, 560, 190, 4)}</g>
    <path d="M${fx} ${fx + fh - 34} Q 220 ${fx + fh - 70} 420 ${fx + fh - 40} T ${fx + fw} ${fx + fh - 50} V ${fx + fh} H ${fx} Z" fill="${c.mint}" stroke="${c.ink}" stroke-width="2.5"/>
    ${sparkle(400, 76, 11, "#FFFFFF", 0)}
    ${sparkle(660, 236, 9, c.gold, 0.8)}
    ${sparkle(612, 262, 7, "#FFFFFF", 1.6)}
    ${sparkle(372, 210, 6, c.gold, 0.4)}
  </g>

  <!-- title bar -->
  <path d="M${fx} ${fx + 14} a14 14 0 0 1 14 -14 h${fw - 28} a14 14 0 0 1 14 14 v${bar - 14} h-${fw} z" fill="url(#bar)"/>
  <line x1="${fx}" y1="${fx + bar}" x2="${fx + fw}" y2="${fx + bar}" stroke="${c.ink}" stroke-width="3"/>
  ${pixels(ICONS.heart, ICON_COLORS, fx + 14, fx + 12, 2)}
  <text x="${fx + 42}" y="${fx + 27}" font-family="${MONO}" font-size="15" font-weight="700" fill="${c.paper}">welcome.exe — TAWAN-OS</text>
  ${["_", "□", "×"]
    .map((g, i) => {
      const bx = fx + fw - 110 + i * 34;
      return `<rect x="${bx}" y="${fx + 9}" width="26" height="24" rx="5" fill="${c.paper}" stroke="${c.ink}" stroke-width="2"/><text x="${bx + 13}" y="${fx + 26}" text-anchor="middle" font-family="${MONO}" font-size="15" font-weight="700" fill="${c.ink}">${g}</text>`;
    })
    .join("")}
  <rect x="${fx}" y="${fx}" width="${fw}" height="${fh}" rx="14" fill="none" stroke="${c.ink}" stroke-width="3"/>

  <!-- greeting -->
  <rect x="38" y="72" width="132" height="26" rx="13" fill="${c.paper}" stroke="${c.ink}" stroke-width="2"/>
  <text x="104" y="90" text-anchor="middle" font-family="${MONO}" font-size="13" fill="${c.ink}">hello, world!</text>
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
];

let failed = false;
for (const [name, fg, bg] of textPairs) {
  const ratio = contrast(fg, bg);
  const ok = ratio >= 4.5;
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
for (const b of buttons) writeFileSync(join(outDir, b.file), taskButton(b));
console.log(`wrote ${1 + buttons.length} files to assets/`);
