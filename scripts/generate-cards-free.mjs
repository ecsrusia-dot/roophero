// Pollinations.ai (FLUX) 로 카드/적/주인공 아트를 무료로 일괄 생성한다.
// API 키가 전혀 필요 없다. 반드시 "본인 컴퓨터"에서 실행할 것 (원격 환경은 네트워크 차단).
//
// 사용법:
//   node scripts/generate-cards-free.mjs
//
// - 결과는 public/art/<id>.png 로 저장된다.
// - 이미 존재하는 파일은 건너뛰므로 다시 실행하면 이어서 생성한다.
// - 특정 그림이 마음에 안 들면 해당 파일을 지우고 다시 실행하면 새로 뽑는다
//   (SEED 환경변수를 바꾸면 전체 그림체가 다른 버전으로 나온다: SEED=7 node scripts/...)
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { STYLE, SUBJECTS } from "./art-subjects.mjs";

const OUT_DIR = "public/art";
const DELAY_MS = 6000; // 무료 서비스 예의상 요청 간격
const MAX_RETRIES = 3;
const BASE_SEED = Number(process.env.SEED || 1);

async function generateOne(id, subject, seed) {
  const prompt = encodeURIComponent(`${subject}. ${STYLE}`);
  const url = `https://image.pollinations.ai/prompt/${prompt}?width=768&height=768&model=flux&nologo=true&seed=${seed}`;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(120000) });
      if (res.status === 429) {
        console.log(`  ${id}: 요청 제한, 30초 대기 (${attempt}/${MAX_RETRIES})`);
        await new Promise((r) => setTimeout(r, 30000));
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 5000) throw new Error(`응답이 너무 작음 (${buf.length}B)`);
      return buf;
    } catch (e) {
      if (attempt === MAX_RETRIES) throw new Error(`${id}: ${e.message}`);
      console.log(`  ${id}: ${e.message}, 10초 후 재시도 (${attempt}/${MAX_RETRIES})`);
      await new Promise((r) => setTimeout(r, 10000));
    }
  }
}

mkdirSync(OUT_DIR, { recursive: true });
const entries = Object.entries(SUBJECTS);
let done = 0;
let skipped = 0;
const failed = [];

console.log(`총 ${entries.length}개 아트 생성 시작 (Pollinations/FLUX, 무료)`);
console.log("예상 소요: 5~10분. 중간에 멈춰도 다시 실행하면 이어서 진행됩니다.\n");

let i = 0;
for (const [id, subject] of entries) {
  i++;
  const path = `${OUT_DIR}/${id}.png`;
  if (existsSync(path)) {
    skipped++;
    continue;
  }
  try {
    const buf = await generateOne(id, subject, BASE_SEED * 1000 + i);
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
else if (done > 0)
  console.log('\n다음 단계:\n  git add public/art && git commit -m "카드 아트 추가" && git push');
