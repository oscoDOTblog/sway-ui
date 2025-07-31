export const teamMembers = [
  {
    id: 1,
    name: "osco",
    role: "LEADER",
    level: 61,
    hp: 449,
    sp: 198,
    maxHp: 449,
    maxSp: 239,
    exp: 329889,
    nextLevelExp: 3780,
    persona: {
      name: "Baphomet",
      arcana: "Devil",
      level: 60
    },
    stats: {
      meleeAtk: 204,
      rangedAtk: 236,
      ammo: 15,
      maxAmmo: 16,
      defense: 192
    },
    socialMedia: [
      { platform: "Instagram", handle: "@oscoDOTblog", url: "https://www.instagram.com/oscoDOTblog" },
      { platform: "Twitter", handle: "@oscoDOTblog", url: "https://twitter.com/oscoDOTblog" },
      { platform: "YouTube", handle: "@oscoDOTblog", url: "https://www.youtube.com/@oscoDOTblog" },
    ],
    socialStats: {
      knowledge: { level: 5, rank: "Erudite", maxed: true },
      charm: { level: 5, rank: "Debonair", maxed: true },
      guts: { level: 4, rank: "Dauntless", maxed: false },
      kindness: { level: 5, rank: "Angelic", maxed: true },
      proficiency: { level: 5, rank: "Transcendent", maxed: true }
    },
    description: "Former corporate software engineer and aspiring dancer",
    image: "/team/osco-wide.jpg" // Using existing image as placeholder
  },
  {
    id: 2,
    name: "nat",
    role: "PARTY",
    level: 61,
    hp: 496,
    sp: 170,
    maxHp: 496,
    maxSp: 170,
    exp: 315420,
    nextLevelExp: 4200,
    persona: {
      name: "Captain Kidd",
      arcana: "Chariot",
      level: 58
    },
    stats: {
      meleeAtk: 218,
      rangedAtk: 195,
      ammo: 12,
      maxAmmo: 12,
      defense: 185
    },
    socialMedia: [
      { platform: "Instagram", handle: "@natwongdancejournal", url: "https://www.instagram.com/natwongdancejournal" },
    ],
    socialStats: {
      knowledge: { level: 3, rank: "Scholar", maxed: false },
      charm: { level: 2, rank: "Charming", maxed: false },
      guts: { level: 5, rank: "Dauntless", maxed: true },
      kindness: { level: 4, rank: "Compassionate", maxed: false },
      proficiency: { level: 3, rank: "Skilled", maxed: false }
    },
    description: "20+ year dancer and one of the best practioners of Oakland Boogalo in the world",
    image: "/team/nat-wide.jpg"
  },
  // {
  //   id: 3,
  //   name: "Morgana",
  //   role: "PARTY",
  //   level: 60,
  //   hp: 378,
  //   sp: 208,
  //   maxHp: 378,
  //   maxSp: 208,
  //   exp: 298750,
  //   nextLevelExp: 3800,
  //   persona: {
  //     name: "Zorro",
  //     arcana: "Magician",
  //     level: 55
  //   },
  //   stats: {
  //     meleeAtk: 165,
  //     rangedAtk: 180,
  //     ammo: 8,
  //     maxAmmo: 8,
  //     defense: 145
  //   },
  //   socialMedia: [
  //     { platform: "Twitter", handle: "@morgana_cat", url: "https://twitter.com/morgana_cat" },
  //     { platform: "Bluesky", handle: "morgana.metaverse", url: "https://bsky.app/profile/morgana.metaverse" },
  //     { platform: "Mastodon", handle: "@morgana_nav", url: "https://mastodon.social/@morgana_nav" }
  //   ],
  //   socialStats: {
  //     knowledge: { level: 4, rank: "Wise", maxed: false },
  //     charm: { level: 3, rank: "Charming", maxed: false },
  //     guts: { level: 2, rank: "Brave", maxed: false },
  //     kindness: { level: 5, rank: "Angelic", maxed: true },
  //     proficiency: { level: 4, rank: "Expert", maxed: false }
  //   },
  //   description: "The mysterious cat-like creature with vast knowledge of the Metaverse. Provides tactical support and healing abilities.",
  //   image: "/projects/drip-v1.png"
  // },
  // {
  //   id: 4,
  //   name: "Ann",
  //   role: "PARTY",
  //   level: 59,
  //   hp: 398,
  //   sp: 232,
  //   maxHp: 398,
  //   maxSp: 232,
  //   exp: 285600,
  //   nextLevelExp: 4100,
  //   persona: {
  //     name: "Carmen",
  //     arcana: "Lovers",
  //     level: 52
  //   },
  //   stats: {
  //     meleeAtk: 175,
  //     rangedAtk: 190,
  //     ammo: 10,
  //     maxAmmo: 10,
  //     defense: 160
  //   },
  //   socialMedia: [
  //     { platform: "Instagram", handle: "@ann_takamaki", url: "https://instagram.com/ann_takamaki" },
  //     { platform: "TikTok", handle: "@ann_fashion", url: "https://tiktok.com/@ann_fashion" },
  //     { platform: "YouTube", handle: "@ann_modeling", url: "https://youtube.com/@ann_modeling" },
  //     { platform: "Threads", handle: "@ann_takamaki", url: "https://threads.net/@ann_takamaki" }
  //   ],
  //   socialStats: {
  //     knowledge: { level: 3, rank: "Scholar", maxed: false },
  //     charm: { level: 5, rank: "Debonair", maxed: true },
  //     guts: { level: 3, rank: "Brave", maxed: false },
  //     kindness: { level: 4, rank: "Compassionate", maxed: false },
  //     proficiency: { level: 3, rank: "Skilled", maxed: false }
  //   },
  //   description: "The team's fire specialist with incredible magical abilities. Her determination and empathy drive her to fight for justice.",
  //   image: "/projects/dance-central-4.jpg"
  // },
  // {
  //   id: 5,
  //   name: "Yusuke",
  //   role: "PARTY",
  //   level: 60,
  //   hp: 477,
  //   sp: 202,
  //   maxHp: 477,
  //   maxSp: 202,
  //   exp: 292800,
  //   nextLevelExp: 3950,
  //   persona: {
  //     name: "Goemon",
  //     arcana: "Emperor",
  //     level: 54
  //   },
  //   stats: {
  //     meleeAtk: 225,
  //     rangedAtk: 185,
  //     ammo: 14,
  //     maxAmmo: 14,
  //     defense: 195
  //   },
  //   socialMedia: [
  //     { platform: "Instagram", handle: "@yusuke_art", url: "https://instagram.com/yusuke_art" },
  //     { platform: "Twitter", handle: "@yusuke_paintings", url: "https://twitter.com/yusuke_paintings" },
  //     { platform: "Bluesky", handle: "yusuke.art", url: "https://bsky.app/profile/yusuke.art" }
  //   ],
  //   socialStats: {
  //     knowledge: { level: 4, rank: "Wise", maxed: false },
  //     charm: { level: 2, rank: "Charming", maxed: false },
  //     guts: { level: 4, rank: "Dauntless", maxed: false },
  //     kindness: { level: 3, rank: "Kind", maxed: false },
  //     proficiency: { level: 5, rank: "Transcendent", maxed: true }
  //   },
  //   description: "The artistic swordsman with incredible technique and precision. His calm demeanor belies his fierce combat abilities.",
  //   image: "/projects/crews-v1.png"
  // },
  // {
  //   id: 6,
  //   name: "Makoto",
  //   role: "PARTY",
  //   level: 60,
  //   hp: 436,
  //   sp: 210,
  //   maxHp: 436,
  //   maxSp: 210,
  //   exp: 290100,
  //   nextLevelExp: 4000,
  //   persona: {
  //     name: "Johanna",
  //     arcana: "Priestess",
  //     level: 53
  //   },
  //   stats: {
  //     meleeAtk: 195,
  //     rangedAtk: 205,
  //     ammo: 12,
  //     maxAmmo: 12,
  //     defense: 180
  //   },
  //   socialMedia: [
  //     { platform: "Twitter", handle: "@makoto_queen", url: "https://twitter.com/makoto_queen" },
  //     { platform: "Mastodon", handle: "@makoto_strategy", url: "https://mastodon.social/@makoto_strategy" },
  //     { platform: "Discord", handle: "makoto_study", url: "https://discord.gg/makoto_study" }
  //   ],
  //   socialStats: {
  //     knowledge: { level: 5, rank: "Erudite", maxed: true },
  //     charm: { level: 3, rank: "Charming", maxed: false },
  //     guts: { level: 4, rank: "Dauntless", maxed: false },
  //     kindness: { level: 4, rank: "Compassionate", maxed: false },
  //     proficiency: { level: 4, rank: "Expert", maxed: false }
  //   },
  //   description: "The intelligent strategist and former student council president. Her analytical mind and strong sense of justice guide the team.",
  //   image: "/projects/drip-v1.png"
  // },
  // {
  //   id: 7,
  //   name: "Haru",
  //   role: "PARTY",
  //   level: 60,
  //   hp: 417,
  //   sp: 260,
  //   maxHp: 417,
  //   maxSp: 260,
  //   exp: 287500,
  //   nextLevelExp: 4050,
  //   persona: {
  //     name: "Milady",
  //     arcana: "Empress",
  //     level: 51
  //   },
  //   stats: {
  //     meleeAtk: 185,
  //     rangedAtk: 220,
  //     ammo: 16,
  //     maxAmmo: 16,
  //     defense: 170
  //   },
  //   socialMedia: [
  //     { platform: "Instagram", handle: "@haru_gardening", url: "https://instagram.com/haru_gardening" },
  //     { platform: "YouTube", handle: "@haru_tea", url: "https://youtube.com/@haru_tea" },
  //     { platform: "Threads", handle: "@haru_okumura", url: "https://threads.net/@haru_okumura" }
  //   ],
  //   socialStats: {
  //     knowledge: { level: 4, rank: "Wise", maxed: false },
  //     charm: { level: 4, rank: "Charming", maxed: false },
  //     guts: { level: 3, rank: "Brave", maxed: false },
  //     kindness: { level: 5, rank: "Angelic", maxed: true },
  //     proficiency: { level: 4, rank: "Expert", maxed: false }
  //   },
  //   description: "The elegant heiress with powerful psychic abilities. Her gentle nature and strong will make her a reliable support member.",
  //   image: "/projects/dance-central-4.jpg"
  // },
  // {
  //   id: 8,
  //   name: "Futaba",
  //   role: "NAVI",
  //   level: 61,
  //   hp: 319,
  //   sp: 231,
  //   maxHp: 319,
  //   maxSp: 231,
  //   exp: 320000,
  //   nextLevelExp: 3600,
  //   persona: {
  //     name: "Necronomicon",
  //     arcana: "Hermit",
  //     level: 56
  //   },
  //   stats: {
  //     meleeAtk: 120,
  //     rangedAtk: 150,
  //     ammo: 6,
  //     maxAmmo: 6,
  //     defense: 125
  //   },
  //   socialMedia: [
  //     { platform: "Twitter", handle: "@futaba_hacker", url: "https://twitter.com/futaba_hacker" },
  //     { platform: "Discord", handle: "futaba_tech", url: "https://discord.gg/futaba_tech" },
  //     { platform: "Mastodon", handle: "@futaba_code", url: "https://mastodon.social/@futaba_code" },
  //     { platform: "Bluesky", handle: "futaba.nav", url: "https://bsky.app/profile/futaba.nav" }
  //   ],
  //   socialStats: {
  //     knowledge: { level: 5, rank: "Erudite", maxed: true },
  //     charm: { level: 2, rank: "Charming", maxed: false },
  //     guts: { level: 2, rank: "Brave", maxed: false },
  //     kindness: { level: 3, rank: "Kind", maxed: false },
  //     proficiency: { level: 5, rank: "Transcendent", maxed: true }
  //   },
  //   description: "The brilliant hacker and navigator who provides crucial support from the sidelines. Her technical expertise is unmatched.",
  //   image: "/projects/osco.png"
  // }
];

export default teamMembers; 