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
  // experience.log — current role and internship pinned, the rest by end month. Sources: old README + portfolio resume page.
  // [icon, role, org, dates, current?, one-line highlight]
  experience: [
    // pinned: current role and the internship
    ["heart", "Coding Teacher", "Code Genius EmQuartier", "Feb 2026 – Now", true, "Scratch, Micro:bit and Python for primary school students"],
    ["window", "UX/UI Designer Intern", "Gumon Technology", "Jun – Aug 2026", false, "Redesigned MonsTask UI; set up a 121-token design system"],
    // the rest by end month, newest first
    ["folder", "Head · Roblox Journey Workshop #2", "IT Openhouse 2026 · KMITL", "Sep 2026", false, "2-day Lua workshop; led 10+ TAs for 100+ students"],
    ["star", "Head of Game Workshop", "ITCAMP 22 · KMITL", "Apr – May 2026", false, "Unreal Engine 5 curriculum; trained the TA and TD team"],
    ["code", "Teaching Assistant · Java OOP", "School of IT · KMITL", "Nov 2025 – Apr 2026", false, "1-on-1 code feedback for 100+ first-year students"],
    ["sun", "Coding & Math Tutor", "Login-Engineering Academy", "Sep 2024 – Mar 2026", false, "Godot, math and contest / portfolio projects"],
    ["folder", "Head · Roblox Journey Workshop #1", "IT Openhouse 2025 · KMITL", "Nov 2025", false, "2-day Lua workshop; led 10+ TAs for 100+ students"],
    ["star", "Staff & Teaching Director", "ITCAMP 21 · The Glacial Horizon · KMITL", "Apr – May 2025", false, "Guided campers' projects over 3 days; taught 1 Unreal Engine section"],
  ],
  // workshops attended (from the resume page): [title, detail]
  workshops: [
    ["LINE Developers University", "Dialogflow + LINE Messaging API · 2025"],
    ["Game Business Workshop", "Gamification for business strategy · 2025"],
  ],
  // projects.folder — from the portfolio site (src/data/projects.ts), ordered by focus.
  // [folder name, icon, items: [title, year, stack, one-line note]]
  projects: [
    ["AI & Agents", "bot", [
      ["TAWAN-OS", "2026", "Python · MCP · CLI agents", "Personal multi-agent workspace of CLI agents + MCP"],
      ["HybriCareer AI", "2026", "AI skill radar · Lovable", "Skill-proof radar for career switchers; Top 10"],
      ["Red Bull F1 3D", "2026", "Three.js · GSAP · agent harness", "3D F1 site built in a 1-week sprint with 17 subagents"],
    ]],
    ["Programming", "code", [
      ["Disney Lorcana PlayLab", "2026", "AWS Lambda · WebSocket · DynamoDB", "Real-time multiplayer TCG on AWS at $0 server cost"],
      ["Synchro", "2025", "ESP32 · JavaScript", "Rhythm-game controller with a TFT screen + web app"],
      ["Drive@KMITL", "2024", "Next.js · FastAPI · WebSocket", "Random chat rooms themed as rides around campus"],
    ]],
    ["Games", "star", [
      ["VPS-Tycoon", "2025", "Java · JavaFX · OOP", "Run a VPS hosting company starting in the year 2000"],
      ["Criminal Minds", "2023", "Unity · NSC 25", "Forensic detective RPG; NSC second round"],
      ["DETEC-CHEAT", "2022", "Unity · NSC 24", "Chat visual novel on cyber-fraud law; NSC final"],
    ]],
    ["Design & Cases", "window", [
      ["Gumon MonsTask", "2026", "Figma · design tokens", "UI redesign and a 121-token design system"],
      ["NOSE TEA 'Sip to Scale'", "2026", "O2O · financial model", "30-day growth plan with a ฿1.8M revenue model"],
      ["Chao-dom", "2026", "Figma · usability testing", "iOS dorm-matching app built from user interviews"],
      ["Polygon Mesh", "2025", "Figma · game-based learning", "From vertices to 3D meshes, then a jigsaw game"],
    ]],
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
    projects: "https://porfolio-website-five-inky.vercel.app/projects",
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
