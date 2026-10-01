// Single source of truth for the text and colours on the README cards.
// Edit this file, then run:  node scripts/build-assets.mjs

export const profile = {
  name: "Thanatpat Promthong",
  nickname: "Tawan",
  roles: ["UX/UI Designer", "Game Developer", "Coding Tutor"],
  school: "IT @ KMITL · Multimedia & Game Technology",
  location: "Bangkok, TH",
  typewriter: [
    "designing user-centered interfaces",
    "building games in Godot / Unity / Unreal",
    "teaching kids to code",
    "currently: UX/UI intern @ Gumon Technology",
  ],
  // profile.sys — rows shown next to the avatar
  stats: [
    ["CLASS", "UX/UI Designer + Game Developer"],
    ["GUILD", "IT KMITL · Multimedia & Game Tech · Year 3"],
    ["JOB", "UX/UI Designer Intern @ Gumon Technology"],
    ["SIDE QUEST", "Coding Teacher @ Code Genius EmQuartier"],
  ],
  // Levels are the ones stated on the portfolio: 3 = Intermediate, 1 = Beginner (out of 5).
  engines: [
    ["Godot", 3, "Intermediate"],
    ["Unity", 3, "Intermediate"],
    ["Unreal", 3, "Intermediate"],
    ["Roblox Studio", 1, "Beginner"],
  ],
  inventory: ["Figma", "Illustrator", "Canva", "C#", "GDScript", "Java", "Python", "JavaScript", "HTML/CSS", "Lua", "SQL"],
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
