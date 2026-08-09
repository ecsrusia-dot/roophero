// 자동전투 시뮬레이터.
// 로드아웃과 시작 스탯을 입력받아 런 전체(사망까지)를 즉시 연산하고
// 프론트에서 순차 재생할 수 있는 이벤트 로그 배열을 반환하는 순수 함수.
import {
  cardById,
  scaledValue,
  PLAYER_BASE,
  ENEMY_BASE,
  FLOOR_SCALING,
  POINT_WEIGHTS,
  RARITY_INFO,
  GACHA_RATES,
  RARITIES,
  REALMS
} from "../data.js";

const MAX_FLOORS = 500; // 무한 루프 방지 안전장치
const MAX_TICKS_PER_FLOOR = 300;
const DROP_CHANCE = 0.3; // 처치당 아이템 드랍 확률

function rollRarity(rng) {
  const r = rng();
  let acc = 0;
  for (const rarity of RARITIES) {
    acc += GACHA_RATES[rarity];
    if (r < acc) return rarity;
  }
  return "common";
}

// 장비/경지의 패시브 효과를 합산해 플레이어 최종 스탯을 만든다.
function buildPlayerStats(loadout, realmLevels) {
  const stats = {
    maxHp: PLAYER_BASE.maxHp,
    attack: PLAYER_BASE.attack,
    maxFocus: PLAYER_BASE.maxFocus,
    focusRegen: PLAYER_BASE.focusRegen,
    damageReduction: 0
  };

  for (const { card, level } of loadout.equipment) {
    const v = scaledValue(card.effect.value, level);
    if (card.effect.type === "max_hp") stats.maxHp += v;
    else if (card.effect.type === "attack") stats.attack += v;
    else if (card.effect.type === "focus_regen") stats.focusRegen += v;
    else if (card.effect.type === "damage_reduction") stats.damageReduction += v;
  }

  for (const realm of REALMS) {
    const level = realmLevels[realm.id] || 0;
    if (level === 0) continue;
    const v = realm.effect.value * level;
    if (realm.effect.type === "max_hp") stats.maxHp += v;
    else if (realm.effect.type === "attack") stats.attack += v;
    else if (realm.effect.type === "focus_regen") stats.focusRegen += v;
  }

  return stats;
}

function makeEnemy(floor, index, rng) {
  const scale = 1 + floor * FLOOR_SCALING;
  const isBoss = floor % 10 === 0 && index === 0;
  const mult = isBoss ? 3 : 1;
  const names = isBoss
    ? ["회랑의 감시자", "심연의 문지기", "붉은 눈의 기사"]
    : ["부랑 괴물", "녹슨 갑주 망령", "굶주린 들개 무리", "허물 벗은 도마뱀"];
  return {
    name: names[Math.floor(rng() * names.length)],
    isBoss,
    hp: Math.round(ENEMY_BASE.hp * scale * mult),
    maxHp: Math.round(ENEMY_BASE.hp * scale * mult),
    attack: Math.round(ENEMY_BASE.attack * scale * mult * 10) / 10
  };
}

/**
 * 런 전체를 시뮬레이션한다.
 * @param {object} loadoutIds {skill: [{id, level}], equipment: [...], companion: [...]}
 * @param {object} realmLevels {realm_hp: 2, ...}
 * @param {function} [rng] 테스트용 난수 함수 (기본 Math.random)
 * @returns {{log: Array, result: {floor, kills, items, points}}}
 */
export function simulateRun(loadoutIds, realmLevels = {}, rng = Math.random) {
  const loadout = {
    skill: loadoutIds.skill.map((s) => ({ card: cardById(s.id), level: s.level })),
    equipment: loadoutIds.equipment.map((s) => ({ card: cardById(s.id), level: s.level })),
    companion: loadoutIds.companion.map((s) => ({ card: cardById(s.id), level: s.level }))
  };

  const stats = buildPlayerStats(loadout, realmLevels);
  const log = [];
  let hp = stats.maxHp;
  let focus = stats.maxFocus;
  let kills = 0;
  let items = []; // 획득 아이템 등급 목록
  let floor = 0;

  // 우선순위 낮은 값 먼저 발동
  const skills = [...loadout.skill].sort((a, b) => a.card.priority - b.card.priority);
  const skillCd = new Map(skills.map((s) => [s.card.id, 0]));
  const compTimers = new Map(loadout.companion.map((c) => [c.card.id, 0]));

  const push = (type, message, extra = {}) =>
    log.push({ type, message, floor, hp: Math.max(0, Math.round(hp)), ...extra });

  push("run_start", "낡은 문이 열리고, 끝없는 회랑의 냉기가 스며든다.");

  while (floor < MAX_FLOORS) {
    floor += 1;
    const enemyCount = floor % 10 === 0 ? 1 : Math.min(3, 1 + Math.floor(floor / 7));
    const enemies = Array.from({ length: enemyCount }, (_, i) => makeEnemy(floor, i, rng));
    push(
      "floor_start",
      `${floor}층 — ${enemies.map((e) => e.name).join(", ")}${enemies[0].isBoss ? " (수문장)" : ""} 이(가) 길을 막아선다.`
    );

    let tick = 0;
    while (enemies.some((e) => e.hp > 0) && hp > 0 && tick < MAX_TICKS_PER_FLOOR) {
      tick += 1;

      // 1) 정신력 회복 및 쿨타임 감소
      focus = Math.min(stats.maxFocus, focus + stats.focusRegen);
      for (const [id, cd] of skillCd) skillCd.set(id, Math.max(0, cd - 1));

      const target = () => enemies.find((e) => e.hp > 0);

      // 2) 스킬 발동 (우선순위 순, 쿨타임/정신력 충족 시 1개)
      let acted = false;
      for (const { card, level } of skills) {
        if (skillCd.get(card.id) > 0 || focus < card.cost) continue;
        focus -= card.cost;
        skillCd.set(card.id, card.cooldown);
        acted = true;

        if (card.effect.type === "heal") {
          const v = scaledValue(card.effect.value, level);
          hp = Math.min(stats.maxHp, hp + v);
          push("skill", `[${card.name}] 체력을 ${v} 회복했다.`, { card: card.id });
        } else {
          const hits = card.effect.hits || 1;
          for (let h = 0; h < hits; h++) {
            const t = target();
            if (!t) break;
            const v = scaledValue(card.effect.value, level);
            t.hp -= v;
            push("skill", `[${card.name}] ${t.name}에게 ${v}의 피해!`, { card: card.id });
            if (t.hp <= 0) {
              kills += 1;
              push("kill", `${t.name}을(를) 쓰러뜨렸다.`);
              if (rng() < DROP_CHANCE) {
                const rarity = rollRarity(rng);
                items.push(rarity);
                push("drop", `${RARITY_INFO[rarity].label} 등급의 전리품을 챙겼다.`, { rarity });
              }
            }
          }
        }
        break;
      }

      // 3) 스킬을 못 썼으면 기본 공격
      if (!acted) {
        const t = target();
        if (t) {
          t.hp -= stats.attack;
          push("attack", `맨손 감각으로 ${t.name}을(를) 후려쳤다. ${stats.attack}의 피해.`);
          if (t.hp <= 0) {
            kills += 1;
            push("kill", `${t.name}을(를) 쓰러뜨렸다.`);
            if (rng() < DROP_CHANCE) {
              const rarity = rollRarity(rng);
              items.push(rarity);
              push("drop", `${RARITY_INFO[rarity].label} 등급의 전리품을 챙겼다.`, { rarity });
            }
          }
        }
      }

      // 4) 동료 행동
      for (const { card, level } of loadout.companion) {
        const timer = compTimers.get(card.id) + 1;
        if (timer >= card.effect.interval) {
          compTimers.set(card.id, 0);
          if (card.effect.type === "heal") {
            const v = scaledValue(card.effect.value, level);
            hp = Math.min(stats.maxHp, hp + v);
            push("companion", `[${card.name}] 이(가) 체력을 ${v} 회복시켰다.`, { card: card.id });
          } else {
            const t = enemies.find((e) => e.hp > 0);
            if (t) {
              const v = scaledValue(card.effect.value, level);
              t.hp -= v;
              push("companion", `[${card.name}] 이(가) ${t.name}에게 ${v}의 피해!`, { card: card.id });
              if (t.hp <= 0) {
                kills += 1;
                push("kill", `${t.name}을(를) 쓰러뜨렸다.`);
                if (rng() < DROP_CHANCE) {
                  const rarity = rollRarity(rng);
                  items.push(rarity);
                  push("drop", `${RARITY_INFO[rarity].label} 등급의 전리품을 챙겼다.`, { rarity });
                }
              }
            }
          }
        } else {
          compTimers.set(card.id, timer);
        }
      }

      // 5) 살아남은 적들의 반격
      for (const e of enemies) {
        if (e.hp <= 0) continue;
        const dmg = Math.max(1, Math.round((e.attack - stats.damageReduction) * 10) / 10);
        hp -= dmg;
        push("enemy_attack", `${e.name}의 공격! ${dmg}의 피해를 입었다.`);
        if (hp <= 0) break;
      }

      if (hp <= 0) {
        push("death", `${floor}층에서 쓰러졌다. 시야가 어두워진다…`);
        break;
      }
    }

    if (hp <= 0) break;
    push("floor_clear", `${floor}층을 돌파했다.`);
  }

  const itemRaritySum = items.reduce((sum, r) => sum + RARITY_INFO[r].value, 0);
  const points =
    floor * POINT_WEIGHTS.floor +
    kills * POINT_WEIGHTS.kill +
    itemRaritySum * POINT_WEIGHTS.itemRarity;

  push(
    "reward",
    `환생의 제단이 빛난다. 도달 ${floor}층 · 처치 ${kills} · 전리품 ${items.length}개 → 환생 포인트 +${points}`
  );

  return { log, result: { floor, kills, items, points } };
}
