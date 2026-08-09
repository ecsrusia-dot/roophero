// 아트 생성 공통 정의 — generate-cards.mjs(Gemini)와 generate-cards-free.mjs(Pollinations)가 공유한다.

// 공통 스타일 — 모든 아트가 한 게임처럼 보이도록 고정한다.
export const STYLE =
  "Dark fantasy Korean webtoon illustration, painterly semi-realistic anime style, " +
  "deep indigo and obsidian background with golden rim lighting, rich colors, " +
  "dramatic atmosphere, centered composition, single subject, no text, no watermark, no border.";

// id → 영어 프롬프트 주제. src/data.js 의 카드/적과 1:1 대응.
export const SUBJECTS = {
  // 주인공
  hero:
    "Bust portrait of a young male adventurer from the back alleys, messy dark hair, " +
    "worn dark-violet hooded cloak with gold trim, determined amber eyes, plain sword on his back",
  // 스킬
  skill_001: "A simple straight steel sword mid-swing leaving a clean white arc of light",
  skill_002: "Twin crossed dagger slashes, two crackling yellow lightning arcs in an X shape",
  skill_003: "A calm swirl of pale healing wind and green light gathering around an open hand",
  skill_004: "A heavy gauntleted fist smashing down, ground cracking with orange shockwave",
  skill_005: "A curved moonlit blade slash under a crescent moon, dark violet night energy",
  skill_006: "A small fierce fireball launched from fingertips, embers trailing",
  skill_007: "A ring of jagged ice shards erupting outward across a frozen floor",
  skill_008: "A dark dagger wrapped in crimson-violet vampiric mist, bat silhouettes",
  skill_009: "A massive pillar of holy golden dawn light breaking through darkness",
  // 장비
  equip_001: "A worn brown leather armor chestpiece with scratches, on a display stand",
  equip_002: "A well-used back-alley dagger with wrapped leather grip",
  equip_003: "A silver necklace with a glowing pale-blue crystal pendant",
  equip_004: "An ancient battered guardian shield with faded gold crest",
  equip_005: "A leather duelist bracelet engraved with hawk motifs, faint red glow",
  equip_006: "A round ember amulet, a sealed flame swirling inside dark glass",
  equip_007: "A translucent moonlight veil cloak floating weightlessly, silver shimmer",
  // 동료
  comp_001: "A rugged wandering mercenary with a battle axe, leather armor, standing ready",
  comp_002: "A young apprentice priestess in white-and-gold robe praying, soft light",
  comp_003: "A sleek black cat spirit with glowing violet eyes, shadow wisps around it",
  comp_004: "A scrappy street boy archer drawing a shortbow, hooded",
  comp_005: "A small fire elemental spirit rising from an old brazier, candle-like flame body",
  // 일반 적
  foe_brute: "A hulking red ogre-like street monster with tusks, hunched menacing pose",
  foe_wraith: "A ghostly knight wraith in rusted armor, hollow glowing eyes",
  foe_hounds: "A pack of starving feral hounds with glowing eyes, snarling",
  foe_lizard: "A molted giant lizard warrior with pale shed skin, cold eyes",
  foe_caster: "A hooded shadow sorcerer channeling dark violet magic orbs",
  foe_frozen: "A frost-covered undead walker, ice crystals on rotten armor",
  // 보스
  boss_watcher: "A giant floating eye wreathed in dark tendrils, ominous red iris",
  boss_gate: "A colossal stone golem gatekeeper with abyssal cracks glowing red",
  boss_knight: "A crimson-eyed black knight with a greatsword, tattered red cape"
};
