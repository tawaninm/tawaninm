// Single source of truth for the text and colours on the README cards.
// Edit this file, then run:  node scripts/build-assets.mjs

export const profile = {
  name: "Thanatpat Promthong",
  nickname: "Tawan",
  roles: ["AI Solution", "Coding Tutor", "Game Dev", "Programmer"],
  school: "IT @ KMITL · Multimedia & Game Technology",
  location: "Bangkok, TH",
  typewriter: [
    "building AI solutions and agent tools",
    "teaching kids to code @ Code Genius",
    "building games in Godot / Unity / Unreal",
    "programming: AWS serverless, Three.js, CLI",
  ],
  // profile.sys — rows shown next to the avatar
  stats: [
    ["CLASS", "AI Solution + Game Dev + Tutor"],
    ["GUILD", "IT KMITL · Multimedia & Game Tech · Year 3"],
    ["JOB", "Coding Teacher @ Code Genius EmQuartier"],
    ["SIDE QUEST", "AI Solution + Programmer + UX/UI"],
  ],
  // Levels are the ones stated on the portfolio: 3 = Intermediate, 1 = Beginner (out of 5).
  engines: [
    ["Godot", 3, "Intermediate"],
    ["Unity", 3, "Intermediate"],
    ["Unreal", 3, "Intermediate"],
    ["Roblox Studio", 1, "Beginner"],
  ],
  inventory: ["Claude", "ChatGPT", "Gemini", "NotebookLM", "Python", "C#", "GDScript", "Java", "JavaScript", "HTML/CSS", "Lua", "SQL", "Figma"],
  motto: "take care of your work, and your work will take care of you.",
  links: {
    profile: "https://github.com/tawaninm",
    portfolio: "https://porfolio-website-five-inky.vercel.app/",
    github: "https://github.com/tawaninm",
    mail: "mailto:tawaninm13@gmail.com",
  },
};

// Palette shared with the portfolio website (DESIGN_SPEC.md §2).
// Rule: text is only `ink` on light fills or `paper` on the dark title bar.
export const palette = {
  lavender: "#C8A8E8",
  sakura: "#F0B0D0",
  sky: "#88D8E8",
  mint: "#A8E8D0",
  gold: "#F8E0A0",
  hotPink: "#FF6090",
  electric: "#5080F0",
  ink: "#2D1B4E",
  paper: "#FFF8F0",
  titleA: "#4B3AA8",
  titleB: "#B5306E",
};
