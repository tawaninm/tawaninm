// Builds stats.svg (the stats.exe card) from live GitHub data.
// Runs daily in .github/workflows/stats.yml, which publishes the file to the `output` branch.
//
//   GITHUB_TOKEN=... node scripts/build-stats.mjs --out dist      live data
//   node scripts/build-stats.mjs --sample --out <dir>             fixture data, for local preview
//
// Only public contributions are visible to the workflow token.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { profile, palette as c } from "./profile.mjs";
import { SANS, MONO, esc, windowChrome, FX, MOTION_CSS, CHIP_FILLS, sparkle, heartBubble } from "./lib/svg.mjs";

const args = process.argv.slice(2);
const sample = args.includes("--sample");
const outDir = args.includes("--out") ? args[args.indexOf("--out") + 1] : "dist";
const login = process.env.GH_LOGIN || "tawaninm";

// Sequential ramp for the heatmap: one hue (magenta), light to dark. Index 0 = no contributions.
const RAMP = ["#EFE6F4", "#F4C3DA", "#E98DB8", "#CF5A96", "#B5306E"];
// Categorical order for languages, checked with the dataviz palette validator (light, #FFF8F0).
// Some slots sit under 3:1 against the surface, so every segment has an outline and a text label.
const LANG_COLORS = ["#5080F0", "#E8A23A", "#B5306E", "#2FAE8A", "#8E5BD8"];
const OTHER = "#B0A0C8";

// ---------- data ----------

async function fetchLive() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is not set (use --sample for a local preview)");
  const query = `query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } }
      }
      repositories(ownerAffiliations: OWNER, isFork: false, first: 100, orderBy: { field: PUSHED_AT, direction: DESC }) {
        nodes { languages(first: 10, orderBy: { field: SIZE, direction: DESC }) { edges { size node { name } } } }
      }
    }
  }`;
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json", "User-Agent": "tawan-os-stats" },
    body: JSON.stringify({ query, variables: { login } }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error(`GitHub API error: ${JSON.stringify(json.errors || json)}`);
  const user = json.data.user;
  const cal = user.contributionsCollection.contributionCalendar;
  const days = cal.weeks.flatMap((w) => w.contributionDays).map((d) => ({ date: d.date, count: d.contributionCount }));
  const sizes = {};
  for (const repo of user.repositories.nodes)
    for (const { size, node } of repo.languages.edges) sizes[node.name] = (sizes[node.name] || 0) + size;
  return { days, total: cal.totalContributions, sizes };
}

// Deterministic fixture so previews are stable.
function fixture() {
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const end = new Date("2026-10-01T00:00:00Z");
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 370 - start.getUTCDay());
  const days = [];
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const r = rand();
    const count = r < 0.55 ? 0 : r < 0.8 ? 1 + Math.floor(rand() * 3) : r < 0.95 ? 3 + Math.floor(rand() * 5) : 8 + Math.floor(rand() * 8);
    days.push({ date: d.toISOString().slice(0, 10), count });
  }
  for (let i = days.length - 6; i < days.length; i++) days[i].count = Math.max(1, days[i].count);
  const total = days.reduce((n, d) => n + d.count, 0);
  const sizes = { TypeScript: 420000, Python: 260000, Java: 180000, "C#": 120000, GDScript: 60000, JavaScript: 40000, CSS: 20000 };
  return { days, total, sizes };
}

function summarize({ days, total, sizes }) {
  // current streak: today may still be empty, so start from yesterday in that case
  let i = days.length - 1;
  if (days[i].count === 0) i--;
  let current = 0;
  while (i >= 0 && days[i].count > 0) {
    current++;
    i--;
  }
  let longest = 0;
  let longestEnd = null;
  let run = 0;
  days.forEach((d) => {
    run = d.count > 0 ? run + 1 : 0;
    if (run > longest) {
      longest = run;
      longestEnd = d.date;
    }
  });
  const best = days.reduce((a, d) => (d.count > a.count ? d : a), days[0]);
  const ranked = Object.entries(sizes).sort((a, b) => b[1] - a[1]);
  const sum = ranked.reduce((n, [, v]) => n + v, 0) || 1;
  const top = ranked.slice(0, 5).map(([name, v], k) => ({ name, pct: (v / sum) * 100, color: LANG_COLORS[k] }));
  const rest = ranked.slice(5).reduce((n, [, v]) => n + v, 0);
  if (rest > 0) top.push({ name: "Other", pct: (rest / sum) * 100, color: OTHER });
  return { days, total, current, longest, longestEnd, best, langs: top };
}

// ---------- drawing ----------

const fmt = (iso) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const level = (n, max) => (n === 0 ? 0 : Math.min(4, 1 + Math.floor(((n - 1) / Math.max(1, max - 1)) * 4)));

function statsCard(s) {
  const W = 840;
  const H = 400;
  const { defs, back, front } = windowChrome(W, H, "stats.exe", "star", c.paper);

  // stat tiles
  const tiles = [
    ["TOTAL", String(s.total), "contributions, last year"],
    ["STREAK", `${s.current}`, s.current === 1 ? "day, current" : "days, current"],
    ["LONGEST", `${s.longest}`, s.longestEnd ? `days, ended ${fmt(s.longestEnd)}` : "days"],
    ["BEST DAY", `${s.best.count}`, `on ${fmt(s.best.date)}`],
  ]
    .map(([label, value, sub], k) => {
      const x = 30 + k * 197;
      return `
  <rect x="${x}" y="64" width="186" height="66" rx="10" fill="${CHIP_FILLS[k]}" stroke="${c.ink}" stroke-width="2"/>
  <text x="${x + 12}" y="82" font-family="${MONO}" font-size="11" font-weight="700" fill="${c.ink}">${label}</text>
  <text x="${x + 12}" y="110" font-family="${SANS}" font-size="26" font-weight="700" fill="${c.ink}">${esc(value)}</text>
  <text x="${x + 12}" y="124" font-family="${MONO}" font-size="10" fill="${c.ink}">${esc(sub)}</text>`;
    })
    .join("");

  // heatmap: one column per week, Sunday on top
  const cell = 11;
  const step = 14;
  const gx = 44;
  const gy = 172;
  const max = Math.max(...s.days.map((d) => d.count));
  const firstDow = new Date(`${s.days[0].date}T00:00:00Z`).getUTCDay();
  let lastMonth = -1;
  let lastLabelCol = -9;
  const months = [];
  const cells = s.days
    .map((d, k) => {
      const pos = k + firstDow;
      const col = Math.floor(pos / 7);
      const row = pos % 7;
      const x = gx + col * step;
      const y = gy + row * step;
      const m = new Date(`${d.date}T00:00:00Z`).getUTCMonth();
      if (row === 0 && m !== lastMonth) {
        lastMonth = m;
        // a label too close to the previous one replaces it (the previous month was a partial column)
        if (col - lastLabelCol < 3) months.pop();
        if (col < 52) {
          lastLabelCol = col;
          months.push(`<text x="${x}" y="${gy - 6}" font-family="${MONO}" font-size="10" fill="${c.ink}">${fmt(d.date).split(" ")[0].toLowerCase()}</text>`);
        }
      }
      const isLast = k === s.days.length - 1;
      return `<rect class="wave" style="animation-delay:${(col * 0.05).toFixed(2)}s" x="${x}" y="${y}" width="${cell}" height="${cell}" rx="2.5" fill="${RAMP[level(d.count, max)]}"${isLast ? ` stroke="${c.ink}" stroke-width="1.5"` : ""}/>`;
    })
    .join("");
  const dows = [
    [1, "mon"],
    [3, "wed"],
    [5, "fri"],
  ]
    .map(([r, t]) => `<text x="${gx - 6}" y="${gy + r * step + 9}" text-anchor="end" font-family="${MONO}" font-size="9" fill="${c.ink}">${t}</text>`)
    .join("");
  const legendY = gy + 7 * step + 14;
  const legend = `
  <text x="${806 - 5 * step - 34}" y="${legendY + 9}" text-anchor="end" font-family="${MONO}" font-size="10" fill="${c.ink}">less</text>
  ${RAMP.map((col, k) => `<rect x="${806 - 5 * step - 28 + k * step}" y="${legendY}" width="${cell}" height="${cell}" rx="2.5" fill="${col}"/>`).join("")}
  <text x="${806 - 28 + 4}" y="${legendY + 9}" font-family="${MONO}" font-size="10" fill="${c.ink}">more</text>
  <rect x="${gx}" y="${legendY}" width="${cell}" height="${cell}" rx="2.5" fill="${RAMP[2]}" stroke="${c.ink}" stroke-width="1.5"/>
  <text x="${gx + 16}" y="${legendY + 9}" font-family="${MONO}" font-size="10" fill="${c.ink}">today</text>`;

  // languages: stacked bar with 2px gaps, every segment labelled in the legend
  const ly = legendY + 44;
  const barX = 44;
  const barW = 762;
  const gap = 2;
  let cx = barX;
  const usable = barW - gap * (s.langs.length - 1);
  const segs = s.langs
    .map((l, k) => {
      const w = Math.max(3, (l.pct / 100) * usable);
      const out = `<rect x="${cx.toFixed(1)}" y="${ly}" width="${w.toFixed(1)}" height="14" rx="${k === 0 || k === s.langs.length - 1 ? 4 : 1}" fill="${l.color}" stroke="${c.ink}" stroke-width="1"/>`;
      cx += w + gap;
      return out;
    })
    .join("");
  let lx = barX;
  const keys = s.langs
    .map((l) => {
      const label = `${l.name} ${l.pct < 1 ? "<1" : Math.round(l.pct)}%`;
      const out = `<rect x="${lx}" y="${ly + 26}" width="11" height="11" rx="2.5" fill="${l.color}" stroke="${c.ink}" stroke-width="1"/><text x="${lx + 16}" y="${ly + 35}" font-family="${MONO}" font-size="11" fill="${c.ink}">${esc(label)}</text>`;
      lx += 16 + label.length * 6.8 + 18;
      return out;
    })
    .join("");

  const heading = (x, y, text) =>
    `<rect x="${x}" y="${y - 15}" width="${Math.ceil(text.length * 7.3) + 20}" height="20" rx="4" fill="${c.ink}"/><text x="${x + 10}" y="${y}" font-family="${MONO}" font-size="12" font-weight="700" fill="${c.paper}">${esc(text)}</text>`;

  const desc = `GitHub stats for ${login}: ${s.total} contributions in the last year; current streak ${s.current} days; longest streak ${s.longest} days; best day ${s.best.count} contributions on ${fmt(s.best.date)}. Top languages by code size: ${s.langs
    .map((l) => `${l.name} ${Math.round(l.pct)}%`)
    .join(", ")}.`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="t d">
  <title id="t">stats.exe — TAWAN-OS</title>
  <desc id="d">${esc(desc)}</desc>
  <style>${MOTION_CSS}
    .wave { transform-box: fill-box; transform-origin: center; animation: wave 5s ease-in-out infinite; }
    @keyframes wave { 0%, 20%, 100% { transform: none } 10% { transform: translateY(-3px) } }
    @media (prefers-reduced-motion: reduce) { .wave { animation: none !important } }
  </style>
  <defs>${defs}
  </defs>
  ${back}
  ${tiles}
  ${heading(gx, 150, "CONTRIBUTIONS")}
  ${months}
  ${dows}
  ${cells}
  ${legend}
  ${heading(gx, ly - 8, "LANGUAGES")}
  ${segs}
  ${keys}
  ${sparkle(800, 150, 7, c.gold, 0.3)}
  ${heartBubble(770, 132, 2, 1)}
  ${sample ? `<text x="806" y="${H - 34}" text-anchor="end" font-family="${MONO}" font-size="10" fill="${c.ink}">sample data</text>` : ""}
  ${front}
</svg>
`;
}

const data = sample ? fixture() : await fetchLive();
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "stats.svg"), statsCard(summarize(data)));
console.log(`wrote ${join(outDir, "stats.svg")}${sample ? " (sample data)" : ""}`);
