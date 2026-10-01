// Pixel avatar of Tawan, drawn from simple shapes on a 32×36 grid.
// Shapes are filled first; outlines are added afterwards so edits stay easy.
// Run `node scripts/build-assets.mjs` to rebuild profile.svg.

export const AVATAR_W = 32;
export const AVATAR_H = 36;

// Character → colour key used by build-assets.mjs.
export const AVATAR_COLORS = {
  o: "#2D1B4E", // outline
  h: "#2A2236", // hair
  H: "#6A5A9A", // hair sheen
  s: "#F2C6A0", // skin
  S: "#D9A07E", // skin shade
  e: "#2D1B4E", // eyes and brows
  w: "#FFFFFF", // eye highlight
  b: "#F08CA8", // blush
  m: "#B0566A", // mouth
  t: "#BCD6F2", // tee
  T: "#93B3DE", // tee shade
  k: "#1E1A2A", // bag strap, black band
  r: "#E0405A", // red string
  g: "#6BC48A", // bead bracelet
};

// Eye pixels, so the card can draw a blink over them.
export const AVATAR_EYES = [
  [12, 14, 2, 3],
  [19, 14, 2, 3],
]; // x, y, w, h

function build() {
  const g = Array.from({ length: AVATAR_H }, () => Array(AVATAR_W).fill("."));
  const inside = (x, y) => x >= 0 && y >= 0 && x < AVATAR_W && y < AVATAR_H;
  const set = (x, y, ch) => inside(x, y) && (g[y][x] = ch);
  const rect = (x0, y0, x1, y1, ch) => {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) set(x, y, ch);
  };
  const disc = (cx, cy, rx, ry, ch, y0 = 0, y1 = AVATAR_H) => {
    for (let y = y0; y <= y1; y++)
      for (let x = 0; x < AVATAR_W; x++)
        if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) set(x, y, ch);
  };
  // thick line between two points
  const line = (x0, y0, x1, y1, r, ch) => {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) * 2;
    for (let i = 0; i <= n; i++) {
      const x = x0 + ((x1 - x0) * i) / n;
      const y = y0 + ((y1 - y0) * i) / n;
      rect(Math.round(x - r), Math.round(y), Math.round(x + r - 1), Math.round(y), ch);
    }
  };

  // torso: oversized tee, shade on the right
  for (let y = 24; y < AVATAR_H; y++) {
    const spread = Math.min(y - 24, 4);
    rect(7 - spread, y, 25 + spread, y, "t");
    rect(22 + spread, y, 25 + spread, y, "T");
  }
  // neck
  rect(13, 21, 19, 24, "S");
  rect(14, 21, 18, 22, "s");
  // collar
  rect(12, 24, 20, 24, "T");
  rect(13, 25, 19, 25, "t");

  // head: hair mass then face
  disc(16, 11, 11, 10, "h", 1, 17);
  rect(9, 11, 23, 19, "s");
  disc(16, 17, 7, 4, "s", 17, 21);
  // ears
  rect(24, 13, 25, 16, "s");
  set(25, 14, "S");
  rect(7, 13, 8, 16, "s");
  // fringe: jagged strands over the forehead
  rect(8, 9, 24, 11, "h");
  [9, 10, 13, 14, 15, 18, 19, 22].forEach((x) => set(x, 12, "h"));
  [10, 14, 19].forEach((x) => set(x, 13, "h"));
  rect(7, 10, 8, 16, "h"); // sideburn left
  rect(24, 10, 24, 12, "h");
  // sheen
  [[12, 3], [13, 3], [14, 3], [11, 4], [12, 4], [10, 5], [19, 3], [20, 3], [21, 4]].forEach(([x, y]) => set(x, y, "H"));

  // face: anime eyes (upper lash + 2×2 eye with a highlight), brows hidden by the fringe
  rect(11, 13, 13, 13, "e");
  rect(19, 13, 21, 13, "e");
  rect(12, 14, 13, 16, "e");
  rect(19, 14, 20, 16, "e");
  set(12, 14, "w");
  set(19, 14, "w");
  rect(10, 17, 11, 17, "b"); // blush
  rect(21, 17, 22, 17, "b");
  set(16, 18, "S"); // nose
  rect(15, 20, 17, 20, "m"); // small smirk, raised on the right
  set(18, 19, "m");

  // raised arm: hand in the hair, forearm down to the elbow
  line(5, 9, 3, 25, 2, "s");
  rect(2, 22, 4, 26, "S");
  disc(6, 7, 3, 3, "s", 3, 10); // hand
  [5, 7, 9].forEach((x) => set(x, 4, "h")); // hair between fingers
  // wrist bands
  rect(3, 13, 6, 13, "r");
  rect(3, 14, 6, 14, "g");
  rect(2, 15, 6, 16, "k");
  // sleeve over the upper arm, joining the torso
  for (let y = 23; y < AVATAR_H; y++) rect(1, y, 8, y, y < 26 ? "t" : "T");

  // bag strap: from the left shoulder (viewer's right) down across the chest
  line(24, 24, 9, 35, 1.5, "k");

  // internal outlines between parts
  const isHair = (ch) => ch === "h" || ch === "H";
  const skinLike = (ch) => ch === "s" || ch === "S" || ch === "r" || ch === "g" || ch === "k";
  const snap = g.map((r) => r.slice());
  const at = (x, y) => (inside(x, y) ? snap[y][x] : ".");
  const n4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  for (let y = 0; y < AVATAR_H; y++)
    for (let x = 0; x < AVATAR_W; x++) {
      const ch = snap[y][x];
      // hair pixels touching the hand get an outline so fingers read clearly
      if (isHair(ch) && x < 11 && n4.some(([dx, dy]) => at(x + dx, y + dy) === "s")) set(x, y, "o");
      // sleeve edge against the arm
      if ((ch === "t" || ch === "T") && x <= 9 && y >= 23 && n4.some(([dx, dy]) => skinLike(at(x + dx, y + dy)))) set(x, y, "o");
    }
  // outer silhouette outline
  const snap2 = g.map((r) => r.slice());
  for (let y = 0; y < AVATAR_H; y++)
    for (let x = 0; x < AVATAR_W; x++)
      if (snap2[y][x] === "." && n4.some(([dx, dy]) => inside(x + dx, y + dy) && snap2[y + dy][x + dx] !== ".")) set(x, y, "o");
  // seam between sleeve and torso
  for (let y = 26; y < AVATAR_H; y++) set(9, y, "o");

  return g.map((r) => r.join(""));
}

export const AVATAR = build();
