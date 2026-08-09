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

import { STYLE, SUBJECTS } from "./art-subjects.mjs";

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
