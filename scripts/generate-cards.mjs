// Gemini(나노바나나) 무료 티어로 카드/적/주인공 아트를 일괄 생성한다.
//
// 사용법:
//   1. https://aistudio.google.com/apikey 에서 API 키 발급 (무료)
//   2. GEMINI_API_KEY=발급받은키 node scripts/generate-cards.mjs
//
// - 결과는 public/art/<id>.png 로 저장된다.
// - 이미 존재하는 파일은 건너뛰므로 중간에 끊겨도 다시 실행하면 이어서 생성한다.
// - 무료 티어 분당 요청 제한을 고려해 호출 사이에 딜레이를 둔다.
import { mkdirSync, writeFileSync, existsSync } from "node:fs";

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("GEMINI_API_KEY 환경변수가 필요합니다.");
  console.error("사용법: GEMINI_API_KEY=... node scripts/generate-cards.mjs");
  process.exit(1);
}

const MODEL = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";
const OUT_DIR = "public/art";
const DELAY_MS = 7000; // 무료 티어 RPM 보호
const MAX_RETRIES = 4;

// 공통 스타일 — 모든 아트가 한 게임처럼 보이도록 고정한다.
const STYLE =
  "Dark fantasy Korean webtoon illustration, painterly semi-realistic anime style, " +
  "deep indigo and obsidian background with golden rim lighting, rich colors, " +
  "dramatic atmosphere, centered composition, single subject, no text, no watermark, no border.";

// id → 영어 프롬프트 주제. data.js 의 카드/적과 1:1 대응.
const SUBJECTS = {
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

async function generateOne(id, subject) {
  const prompt = `${subject}. ${STYLE} Square 1:1 aspect ratio.`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ["IMAGE"],
      imageConfig: { aspectRatio: "1:1" }
    }
  };

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }
    );

    if (res.status === 429) {
      const wait = 20000 * attempt;
      console.log(`  ${id}: 요청 제한(429), ${wait / 1000}초 대기 후 재시도 (${attempt}/${MAX_RETRIES})`);
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }
    if (res.status === 400 && body.generationConfig.imageConfig) {
      // 일부 모델/버전은 imageConfig 를 지원하지 않는다 — 빼고 재시도
      delete body.generationConfig.imageConfig;
      continue;
    }
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${id}: HTTP ${res.status} — ${text.slice(0, 300)}`);
    }

    const json = await res.json();
    const parts = json.candidates?.[0]?.content?.parts || [];
    const img = parts.find((p) => p.inlineData?.data);
    if (!img) {
      console.log(`  ${id}: 이미지가 없는 응답, 재시도 (${attempt}/${MAX_RETRIES})`);
      await new Promise((r) => setTimeout(r, 5000));
      continue;
    }
    return Buffer.from(img.inlineData.data, "base64");
  }
  throw new Error(`${id}: ${MAX_RETRIES}회 재시도 실패`);
}

mkdirSync(OUT_DIR, { recursive: true });
const entries = Object.entries(SUBJECTS);
let done = 0;
let skipped = 0;
let failed = [];

console.log(`총 ${entries.length}개 아트 생성 시작 (모델: ${MODEL})`);
for (const [id, subject] of entries) {
  const path = `${OUT_DIR}/${id}.png`;
  if (existsSync(path)) {
    skipped++;
    continue;
  }
  try {
    const buf = await generateOne(id, subject);
    writeFileSync(path, buf);
    done++;
    console.log(`✓ ${path} (${Math.round(buf.length / 1024)}KB) [${done + skipped}/${entries.length}]`);
  } catch (e) {
    failed.push(id);
    console.error(`✗ ${e.message}`);
  }
  await new Promise((r) => setTimeout(r, DELAY_MS));
}

console.log(`\n완료: 생성 ${done} · 건너뜀 ${skipped} · 실패 ${failed.length}`);
if (failed.length) console.log("실패 목록(다시 실행하면 이어서 시도):", failed.join(", "));
