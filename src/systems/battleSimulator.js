// 자동전투 시뮬레이터.
// 로드아웃·경지·축복을 입력받아 런 전체(사망까지)를 즉시 연산하고
// 프론트에서 순차 재생할 수 있는 이벤트 로그 배열을 반환하는 순수 함수.
//
// 전투 규칙:
// - 속성 상성: 적의 약점 속성 1.5배 / 저항 속성 0.6배
// - 치명타 1.7배, 회피/흡혈/가시 반사 스탯
// - 보스는 3회 공격마다 힘을 모아 강타(2.2배)
// - 일반 몹은 체력 30% 이하에서 광폭화(공격 1.3배)
// - 층 클리어 후 30% 확률로 랜덤 이벤트(샘/함정/보물/제단)
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
  REALMS,
  FOES_NORMAL,
  FOES_BOSS,
  WEAKNESS_MULT,
  RESIST_MULT,
  CRIT_MULT
} from "../data.js";

const MAX_FLOORS = 500; // 무한 루프 방지 안전장치
const MAX_TICKS_PER_FLOOR = 300;
const DROP_CHANCE = 0.3; // 처치당 아이템 드랍 확률
const EVENT_CHANCE = 0.3; // 층 클리어 후 이벤트 확률
const ENRAGE_THRESHOLD = 0.3;
const BOSS_SMASH_MULT = 2.2;

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
    critChance: PLAYER_BASE.critChance,
    damageReduction: 0,
    dodge: 0,
    lifesteal: 0,
    thorns: 0,
    pointsMult: 1,
    elementBoost: {}
  };

  const apply = (effect, v) => {
    if (effect.type === "max_hp") stats.maxHp += v;
    else if (effect.type === "attack") stats.attack += v;
    else if (effect.type === "focus_regen") stats.focusRegen += v;
    else if (effect.type === "damage_reduction") stats.damageReduction += v;
    else if (effect.type === "crit_chance") stats.critChance += v;
    else if (effect.type === "dodge") stats.dodge += v;
    else if (effect.type === "element_boost")
      stats.elementBoost[effect.element] = (stats.elementBoost[effect.element] || 0) + v;
  };

  for (const { card, level } of loadout.equipment)
    apply(card.effect, scaledValue(card.effect.value, level));
  for (const realm of REALMS) {
    const level = realmLevels[realm.id] || 0;
    if (level > 0) apply(realm.effect, realm.effect.value * level);
  }
  return stats;
}

// 축복은 해당 런에만 적용된다.
function applyBlessing(stats, blessingId) {
  let startFloor = 0;
  switch (blessingId) {
    case "bless_atk":
      stats.attack = Math.round(stats.attack * 1.4 * 10) / 10;
      break;
    case "bless_hp":
      stats.maxHp = Math.round(stats.maxHp * 1.5);
      break;
    case "bless_crit":
      stats.critChance += 0.15;
      break;
    case "bless_focus":
      stats.focusRegen = Math.round(stats.focusRegen * 1.6 * 10) / 10;
      break;
    case "bless_vamp":
      stats.lifesteal += 0.15;
      break;
    case "bless_gold":
      stats.pointsMult *= 1.3;
      break;
    case "bless_thorn":
      stats.thorns += 0.2;
      break;
    case "bless_rush":
      startFloor = 4; // 5층부터 시작
      break;
    default:
      break;
  }
  return startFloor;
}

function toLoadout(loadoutIds) {
  return {
    skill: loadoutIds.skill.map((s) => ({ card: cardById(s.id), level: s.level })),
    equipment: loadoutIds.equipment.map((s) => ({ card: cardById(s.id), level: s.level })),
    companion: loadoutIds.companion.map((s) => ({ card: cardById(s.id), level: s.level }))
  };
}

// 출전 준비 화면 등에서 최종 스탯 미리보기용
export function computePlayerStats(loadoutIds, realmLevels = {}) {
  return buildPlayerStats(toLoadout(loadoutIds), realmLevels);
}

function makeEnemy(floor, index, rng) {
  const scale = 1 + floor * FLOOR_SCALING;
  const isBoss = floor % 10 === 0 && index === 0;
  const mult = isBoss ? 3 : 1;
  const pool = isBoss ? FOES_BOSS : FOES_NORMAL;
  const base = pool[Math.floor(rng() * pool.length)];
  return {
    ...base,
    isBoss,
    hp: Math.round(ENEMY_BASE.hp * scale * mult),
    maxHp: Math.round(ENEMY_BASE.hp * scale * mult),
    attack: Math.round(ENEMY_BASE.attack * scale * mult * 10) / 10,
    enraged: false,
    smashCounter: 0
  };
}

/**
 * 런 전체를 시뮬레이션한다.
 * @param {object} loadoutIds {skill: [{id, level}], equipment: [...], companion: [...]}
 * @param {object} realmLevels {realm_hp: 2, ...}
 * @param {string|null} blessingId 선택한 축복 (없으면 null)
 * @param {function} [rng] 테스트용 난수 함수 (기본 Math.random)
 */
export function simulateRun(loadoutIds, realmLevels = {}, blessingId = null, rng = Math.random) {
  const loadout = toLoadout(loadoutIds);
  const stats = buildPlayerStats(loadout, realmLevels);
  const startFloor = applyBlessing(stats, blessingId);

  const log = [];
  let hp = stats.maxHp;
  let focus = stats.maxFocus;
  let kills = 0;
  let items = [];
  let bonusPoints = 0;
  let floor = startFloor;
  let enemies = [];

  const skills = [...loadout.skill].sort((a, b) => a.card.priority - b.card.priority);
  const skillCd = new Map(skills.map((s) => [s.card.id, 0]));
  const compTimers = new Map(loadout.companion.map((c) => [c.card.id, 0]));

  const push = (type, message, extra = {}) =>
    log.push({
      type,
      message,
      floor,
      hp: Math.max(0, Math.round(hp)),
      focus: Math.round(focus * 10) / 10,
      ...extra
    });

  const rollDrop = () => {
    if (rng() < DROP_CHANCE) {
      const rarity = rollRarity(rng);
      items.push(rarity);
      push("drop", `${RARITY_INFO[rarity].label} 등급의 전리품을 챙겼다.`, { rarity });
    }
  };

  const onKill = (t, idx) => {
    kills += 1;
    push("kill", `${t.name}을(를) 쓰러뜨렸다.`, { target: idx });
    rollDrop();
  };

  // 속성/치명타를 반영한 최종 피해 계산
  const calcDamage = (base, element, foe) => {
    let v = base;
    const tags = [];
    if (element && stats.elementBoost[element]) v *= 1 + stats.elementBoost[element];
    if (element && foe.weak === element) {
      v *= WEAKNESS_MULT;
      tags.push("weak");
    } else if (element && foe.resist === element) {
      v *= RESIST_MULT;
      tags.push("resist");
    }
    if (rng() < stats.critChance) {
      v *= CRIT_MULT;
      tags.push("crit");
    }
    return { v: Math.max(1, Math.round(v * 10) / 10), tags };
  };

  const dealDamage = (t, base, element, type, label, extra = {}) => {
    const idx = enemies.indexOf(t);
    const { v, tags } = calcDamage(base, element, t);
    t.hp -= v;
    const tagText = tags.includes("weak")
      ? " 약점 적중!"
      : tags.includes("resist")
        ? " (저항)"
        : "";
    const critText = tags.includes("crit") ? " 치명타!" : "";
    push(type, `${label} ${t.name}에게 ${v}의 피해!${tagText}${critText}`, {
      target: idx,
      value: v,
      tags,
      foeHp: Math.max(0, Math.round(t.hp)),
      ...extra
    });
    // 광폭화: 일반 몹이 빈사 상태가 되면 이성을 잃는다
    if (!t.isBoss && !t.enraged && t.hp > 0 && t.hp < t.maxHp * ENRAGE_THRESHOLD) {
      t.enraged = true;
      t.attack = Math.round(t.attack * 1.3 * 10) / 10;
      push("enrage", `${t.name}이(가) 광폭화했다!`, { target: idx });
    }
    if (t.hp <= 0) onKill(t, idx);
    return v;
  };

  push("run_start", "낡은 문이 열리고, 끝없는 회랑의 냉기가 스며든다.");
  if (blessingId === "bless_rush")
    push("event_shrine", "익숙한 초입을 단숨에 내달렸다. 5층에서 시작한다.");

  while (floor < MAX_FLOORS) {
    floor += 1;
    const enemyCount = floor % 10 === 0 ? 1 : Math.min(3, 1 + Math.floor(floor / 7));
    enemies = Array.from({ length: enemyCount }, (_, i) => makeEnemy(floor, i, rng));
    push(
      "floor_start",
      `${floor}층 — ${enemies.map((e) => e.name).join(", ")}${enemies[0].isBoss ? " (수문장)" : ""} 이(가) 길을 막아선다.`,
      {
        foes: enemies.map((e) => ({
          name: e.name,
          icon: e.icon,
          art: e.art,
          hp: e.hp,
          max: e.maxHp,
          boss: e.isBoss,
          weak: e.weak
        }))
      }
    );

    let tick = 0;
    while (enemies.some((e) => e.hp > 0) && hp > 0 && tick < MAX_TICKS_PER_FLOOR) {
      tick += 1;
      focus = Math.min(stats.maxFocus, focus + stats.focusRegen);
      for (const [id, cd] of skillCd) skillCd.set(id, Math.max(0, cd - 1));

      const target = () => enemies.find((e) => e.hp > 0);

      // 1) 스킬 발동 (우선순위 순, 쿨타임/정신력 충족 시 1개)
      let acted = false;
      let dealtThisTick = 0;
      for (const { card, level } of skills) {
        if (skillCd.get(card.id) > 0 || focus < card.cost) continue;
        focus -= card.cost;
        skillCd.set(card.id, card.cooldown);
        acted = true;
        const eff = card.effect;

        if (eff.type === "heal") {
          const v = scaledValue(eff.value, level);
          hp = Math.min(stats.maxHp, hp + v);
          push("skill_heal", `[${card.name}] 체력을 ${v} 회복했다.`, {
            card: card.id,
            value: v
          });
        } else if (eff.type === "aoe_damage") {
          for (const t of enemies.filter((e) => e.hp > 0)) {
            dealtThisTick += dealDamage(
              t,
              scaledValue(eff.value, level),
              card.element,
              "skill",
              `[${card.name}]`,
              { card: card.id }
            );
          }
        } else {
          const hits = eff.hits || 1;
          for (let h = 0; h < hits; h++) {
            const t = target();
            if (!t) break;
            const v = dealDamage(t, scaledValue(eff.value, level), card.element, "skill", `[${card.name}]`, {
              card: card.id
            });
            dealtThisTick += v;
            if (eff.lifesteal) {
              const heal = Math.round(v * eff.lifesteal * 10) / 10;
              hp = Math.min(stats.maxHp, hp + heal);
              push("skill_heal", `어둠이 생명을 빨아들인다. 체력 ${heal} 회복.`, {
                value: heal
              });
            }
          }
        }
        break;
      }

      // 2) 스킬을 못 썼으면 기본 공격 (참격)
      if (!acted) {
        const t = target();
        if (t) dealtThisTick += dealDamage(t, stats.attack, "slash", "attack", "몸에 밴 반격.");
      }

      // 흡혈 축복: 이번 틱에 입힌 피해 비례 회복
      if (stats.lifesteal > 0 && dealtThisTick > 0 && hp > 0) {
        const heal = Math.round(dealtThisTick * stats.lifesteal * 10) / 10;
        hp = Math.min(stats.maxHp, hp + heal);
      }

      // 3) 동료 행동
      for (const { card, level } of loadout.companion) {
        const timer = compTimers.get(card.id) + 1;
        if (timer >= card.effect.interval) {
          compTimers.set(card.id, 0);
          if (card.effect.type === "heal") {
            const v = scaledValue(card.effect.value, level);
            hp = Math.min(stats.maxHp, hp + v);
            push("companion_heal", `[${card.name}] 이(가) 체력을 ${v} 회복시켰다.`, {
              card: card.id,
              value: v
            });
          } else {
            const t = enemies.find((e) => e.hp > 0);
            if (t)
              dealDamage(t, scaledValue(card.effect.value, level), card.effect.element, "companion", `[${card.name}]`, {
                card: card.id
              });
          }
        } else {
          compTimers.set(card.id, timer);
        }
      }

      // 4) 살아남은 적들의 반격
      for (const e of enemies) {
        if (e.hp <= 0 || hp <= 0) continue;
        const idx = enemies.indexOf(e);

        // 보스 강타 패턴: 모으기 → 강타
        if (e.isBoss) {
          e.smashCounter += 1;
          if (e.smashCounter % 4 === 3) {
            push("boss_charge", `${e.name}이(가) 힘을 모으고 있다…!`, { attacker: idx });
            continue;
          }
        }
        const isSmash = e.isBoss && e.smashCounter % 4 === 0;

        // 회피 판정
        if (rng() < stats.dodge) {
          push("dodge", `${e.name}의 공격을 흘려보냈다!`, { attacker: idx });
          continue;
        }

        let dmg = Math.max(1, Math.round((e.attack - stats.damageReduction) * 10) / 10);
        if (isSmash) dmg = Math.round(dmg * BOSS_SMASH_MULT * 10) / 10;
        hp -= dmg;
        push(
          isSmash ? "boss_smash" : "enemy_attack",
          isSmash
            ? `${e.name}의 강타! ${dmg}의 막대한 피해를 입었다!`
            : `${e.name}의 공격! ${dmg}의 피해를 입었다.`,
          { attacker: idx, value: dmg }
        );

        // 가시 반사
        if (stats.thorns > 0 && e.hp > 0) {
          const ref = Math.max(1, Math.round(dmg * stats.thorns * 10) / 10);
          e.hp -= ref;
          push("thorns", `가시 갑주가 ${e.name}에게 ${ref}의 피해를 돌려주었다.`, {
            target: idx,
            value: ref,
            foeHp: Math.max(0, Math.round(e.hp))
          });
          if (e.hp <= 0) onKill(e, idx);
        }
        if (hp <= 0) break;
      }

      if (hp <= 0) {
        push("death", `${floor}층에서 쓰러졌다. 시야가 어두워진다…`);
        break;
      }
    }

    if (hp <= 0) break;
    push("floor_clear", `${floor}층을 돌파했다.`);

    // 층 사이 랜덤 이벤트
    if (rng() < EVENT_CHANCE) {
      const roll = rng();
      if (roll < 0.3) {
        const heal = Math.round(stats.maxHp * 0.3);
        hp = Math.min(stats.maxHp, hp + heal);
        push("event_heal", `이끼 낀 돌틈에서 맑은 샘을 발견했다. 체력 ${heal} 회복.`, {
          value: heal
        });
      } else if (roll < 0.55) {
        const dmg = Math.round(stats.maxHp * 0.1);
        hp = Math.max(1, hp - dmg);
        push("event_trap", `바닥의 낡은 함정을 밟았다! 체력 ${dmg} 감소.`, { value: dmg });
      } else if (roll < 0.8) {
        const rarity = rollRarity(rng);
        items.push(rarity);
        push("event_treasure", `무너진 벽 뒤에서 숨겨진 상자를 열었다. ${RARITY_INFO[rarity].label} 전리품 획득!`, {
          rarity
        });
      } else {
        const bonus = 15 + floor;
        bonusPoints += bonus;
        push("event_shrine", `이름 모를 제단에 손을 얹자 온기가 스민다. 환생 포인트 +${bonus}.`, {
          value: bonus
        });
      }
    }
  }

  const itemRaritySum = items.reduce((sum, r) => sum + RARITY_INFO[r].value, 0);
  const points = Math.round(
    (floor * POINT_WEIGHTS.floor +
      kills * POINT_WEIGHTS.kill +
      itemRaritySum * POINT_WEIGHTS.itemRarity +
      bonusPoints) *
      stats.pointsMult
  );

  push(
    "reward",
    `환생의 제단이 빛난다. 도달 ${floor}층 · 처치 ${kills} · 전리품 ${items.length}개 → 환생 포인트 +${points}`
  );

  return {
    log,
    result: { floor, kills, items, points },
    stats: { maxHp: stats.maxHp, maxFocus: stats.maxFocus }
  };
}
