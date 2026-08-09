// 텍스트 도트(pixel-sprites.mjs)를 public/art/<id>.png 로 렌더링한다.
// 외부 API 불필요. 사용법: node scripts/gen-pixel-art.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { encodePng } from "./lib/png.mjs";
import { PALETTE, SPRITES } from "./pixel-sprites.mjs";

const OUT_DIR = "public/art";
const SCALE = 12; // 16px → 192px

function hexToRgb(hex) {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16)
  ];
}

const colors = Object.fromEntries(
  Object.entries(PALETTE).map(([ch, hex]) => [ch, hex ? [...hexToRgb(hex), 255] : [0, 0, 0, 0]])
);

mkdirSync(OUT_DIR, { recursive: true });
let count = 0;
for (const [id, rows] of Object.entries(SPRITES)) {
  // 그리드 검증: 16x16, 알 수 없는 문자 없음
  if (rows.length !== 16) throw new Error(`${id}: 행 수 ${rows.length} (16 필요)`);
  rows.forEach((row, y) => {
    if (row.length !== 16) throw new Error(`${id} ${y + 1}번째 행: 길이 ${row.length} (16 필요)`);
    for (const ch of row) if (!(ch in colors)) throw new Error(`${id} ${y + 1}번째 행: 알 수 없는 문자 '${ch}'`);
  });

  const size = 16 * SCALE;
  const png = encodePng(size, size, (x, y) => {
    const ch = rows[Math.floor(y / SCALE)][Math.floor(x / SCALE)];
    return colors[ch];
  });
  writeFileSync(`${OUT_DIR}/${id}.png`, png);
  count++;
}
console.log(`${count}개 도트 스프라이트 생성 완료 → ${OUT_DIR}/`);
