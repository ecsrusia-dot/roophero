// 가챠 시스템: 환생 포인트 소모 → 등급 확률로 카드 1장.
// 중복 획득 시 해당 카드의 강화 재료(shards)로 자동 전환된다.
import { CARDS, GACHA_RATES, GACHA_COST, RARITIES } from "../data.js";

export function rollRarity(rng = Math.random) {
  const r = rng();
  let acc = 0;
  for (const rarity of RARITIES) {
    acc += GACHA_RATES[rarity];
    if (r < acc) return rarity;
  }
  return "common";
}

// 강화에 필요한 재료 수: 다음 레벨 = 현재 레벨 개
export function shardsNeeded(level) {
  return level;
}

/**
 * 카드 1장 뽑기.
 * @param {number} points 보유 환생 포인트
 * @param {object} collection {cardId: {level, shards}} — 직접 변경하지 않는다
 * @returns {null | {card, isNew, leveledUp, collection, points}}
 *          포인트 부족 시 null
 */
export function pullOnce(points, collection, rng = Math.random) {
  if (points < GACHA_COST) return null;

  const rarity = rollRarity(rng);
  const pool = CARDS.filter((c) => c.rarity === rarity);
  const card = pool[Math.floor(rng() * pool.length)];

  const next = { ...collection };
  const owned = next[card.id];
  let isNew = false;
  let leveledUp = false;

  if (!owned) {
    isNew = true;
    next[card.id] = { level: 1, shards: 0 };
  } else {
    // 중복 → 강화 재료로 전환, 충분히 모이면 자동 레벨업
    let { level, shards } = owned;
    shards += 1;
    while (shards >= shardsNeeded(level)) {
      shards -= shardsNeeded(level);
      level += 1;
      leveledUp = true;
    }
    next[card.id] = { level, shards };
  }

  return { card, isNew, leveledUp, collection: next, points: points - GACHA_COST };
}
