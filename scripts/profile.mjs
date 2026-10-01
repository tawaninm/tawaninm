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
  // experience.log — order as chosen by Tawan (current role first). Sources: old README + portfolio resume page.
  // [icon, role, org, dates, current?, one-line highlight]
  experience: [
    ["heart", "Coding Teacher", "Code Genius EmQuartier", "Feb 2026 – Now", true, "Scratch, Micro:bit and Python for primary school students"],
    ["window", "UX/UI Designer Intern", "Gumon Technology", "Jun – Aug 2026", false, "Redesigned MonsTask UI; set up a 121-token design system"],
    ["folder", "Head · Roblox Journey Workshop #2", "IT Openhouse 2026 · KMITL", "Sep 2026", false, "2-day Lua workshop; led 10+ TAs for 100+ students"],
    ["star", "Head of Game Workshop", "ITCAMP 22 · KMITL", "Apr – May 2026", false, "Unreal Engine 5 curriculum; trained the TA and TD team"],
    ["code", "Teaching Assistant · Java OOP", "School of IT · KMITL", "Nov 2025 – Apr 2026", false, "1-on-1 code feedback for 100+ first-year students"],
    ["star", "Staff & Teaching Director", "ITCAMP 21 · The Glacial Horizon · KMITL", "Apr – May 2025", false, "Guided campers' projects over 3 days; taught 1 Unreal Engine section"],
    ["sun", "Coding & Math Tutor", "Login-Engineering Academy", "Sep 2024 – Mar 2026", false, "Godot, math and contest / portfolio projects"],
    ["folder", "Head · Roblox Journey Workshop #1", "IT Openhouse 2025 · KMITL", "Nov 2025", false, "2-day Lua workshop; led 10+ TAs for 100+ students"],
  ],
  // trophies sidebar: [title, detail, year]
  achievements: [
    ["Top 10 Finalist", "Generation Thailand Hackathon · HybriCareer AI", "2026"],
    ["Business Case", "NOSE TEA 'Sip to Scale' competitor", "2026"],
    ["NSC Second Round", "Criminal Minds · Unity game", "2023"],
    ["NSC Final Round", "DETEC-CHEAT · Unity mobile game", "2022"],
  ],
  // From the resume page (Thai 100%, English 85%, Japanese 25%), rounded to 5 segments.
  languages: [
    ["Thai", 5, "Native"],
    ["English", 4, "Fluent"],
    ["Japanese", 1, "Beginner"],
  ],
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
