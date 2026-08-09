// 카드/적/경지 정의.
// 특정 웹툰의 고유명사는 쓰지 않고 오마주 수준의 자체 명칭만 사용한다.

export const RARITIES = ["common", "rare", "epic", "legendary"];

export const RARITY_INFO = {
  common: { label: "일반", value: 1, color: "text-stone-300", ring: "ring-stone-500" },
  rare: { label: "희귀", value: 2, color: "text-sky-300", ring: "ring-sky-500" },
  epic: { label: "영웅", value: 3, color: "text-violet-300", ring: "ring-violet-500" },
  legendary: { label: "전설", value: 4, color: "text-amber-300", ring: "ring-amber-500" }
};

// 가챠 확률 (천장 없음, 순수 확률제)
export const GACHA_RATES = {
  common: 0.6,
  rare: 0.25,
  epic: 0.12,
  legendary: 0.03
};

export const GACHA_COST = 100; // 1회 뽑기 환생 포인트

// 로드아웃 슬롯 제한
export const LOADOUT_LIMITS = { skill: 4, equipment: 3, companion: 2 };

// 중복 카드 강화: 레벨당 필요한 재료 수 = 현재 레벨
// 카드 효과 수치 = 기본값 × (1 + 0.15 × (레벨 - 1))
export const LEVEL_SCALING = 0.15;

export const CARDS = [
  // ── 스킬 ──────────────────────────────────────────────
  {
    id: "skill_001",
    name: "기본 검격",
    category: "skill",
    rarity: "common",
    cost: 1,
    cooldown: 2,
    priority: 5,
    effect: { type: "damage", value: 6 },
    description: "몸에 밴 가장 단순한 베기. 적에게 6의 피해를 입힌다."
  },
  {
    id: "skill_002",
    name: "뒷골목 연격",
    category: "skill",
    rarity: "common",
    cost: 2,
    cooldown: 4,
    priority: 4,
    effect: { type: "multi_damage", value: 5, hits: 2 },
    description: "골목 싸움에서 익힌 변칙 연타. 5의 피해로 2회 공격한다."
  },
  {
    id: "skill_003",
    name: "숨 고르기",
    category: "skill",
    rarity: "rare",
    cost: 3,
    cooldown: 6,
    priority: 6,
    effect: { type: "heal", value: 12 },
    description: "호흡을 가다듬어 상처를 추스른다. 체력을 12 회복한다."
  },
  {
    id: "skill_004",
    name: "파쇄격",
    category: "skill",
    rarity: "epic",
    cost: 4,
    cooldown: 8,
    priority: 2,
    effect: { type: "damage", value: 22 },
    description: "전신의 힘을 실어 내려친다. 적에게 22의 피해를 입힌다."
  },
  {
    id: "skill_005",
    name: "월영 일섬",
    category: "skill",
    rarity: "legendary",
    cost: 6,
    cooldown: 12,
    priority: 1,
    effect: { type: "damage", value: 45 },
    description: "달그림자가 스치는 찰나의 일격. 적에게 45의 피해를 입힌다."
  },
  // ── 장비 ──────────────────────────────────────────────
  {
    id: "equip_001",
    name: "낡은 가죽 갑옷",
    category: "equipment",
    rarity: "common",
    effect: { type: "max_hp", value: 12 },
    description: "해진 자국이 많지만 아직 쓸 만하다. 최대 체력 +12."
  },
  {
    id: "equip_002",
    name: "뒷골목 단검",
    category: "equipment",
    rarity: "common",
    effect: { type: "attack", value: 2 },
    description: "손에 익은 짧은 칼. 기본 공격력 +2."
  },
  {
    id: "equip_003",
    name: "은빛 정신 목걸이",
    category: "equipment",
    rarity: "rare",
    effect: { type: "focus_regen", value: 0.5 },
    description: "차가운 은이 정신을 맑게 한다. 초당 정신력 회복 +0.5."
  },
  {
    id: "equip_004",
    name: "수호자의 낡은 방패",
    category: "equipment",
    rarity: "epic",
    effect: { type: "damage_reduction", value: 2 },
    description: "이름 모를 수호자가 남긴 방패. 받는 피해 -2."
  },
  // ── 동료 ──────────────────────────────────────────────
  {
    id: "comp_001",
    name: "떠돌이 용병",
    category: "companion",
    rarity: "common",
    effect: { type: "attack", value: 4, interval: 3 },
    description: "값싼 보수로 함께 싸우는 용병. 3초마다 4의 피해를 입힌다."
  },
  {
    id: "comp_002",
    name: "견습 사제",
    category: "companion",
    rarity: "rare",
    effect: { type: "heal", value: 5, interval: 5 },
    description: "아직 서툴지만 진심인 기도. 5초마다 체력을 5 회복시킨다."
  },
  {
    id: "comp_003",
    name: "흑묘 정령",
    category: "companion",
    rarity: "epic",
    effect: { type: "attack", value: 9, interval: 4 },
    description: "그림자 속을 오가는 검은 고양이. 4초마다 9의 피해를 입힌다."
  }
];

// ── 경지 (영구 스탯, 포인트 직접 구매 — 뽑기 운과 무관) ──
export const REALMS = [
  {
    id: "realm_hp",
    name: "육체 단련",
    effect: { type: "max_hp", value: 6 },
    baseCost: 50,
    description: "레벨당 최대 체력 +6"
  },
  {
    id: "realm_atk",
    name: "근력 연마",
    effect: { type: "attack", value: 1 },
    baseCost: 80,
    description: "레벨당 기본 공격력 +1"
  },
  {
    id: "realm_focus",
    name: "정신 수양",
    effect: { type: "focus_regen", value: 0.2 },
    baseCost: 60,
    description: "레벨당 초당 정신력 회복 +0.2"
  }
];

// 경지 다음 레벨 비용 = baseCost × (현재 레벨 + 1)
export function realmCost(realm, currentLevel) {
  return realm.baseCost * (currentLevel + 1);
}

export const PLAYER_BASE = {
  maxHp: 60,
  attack: 3, // 스킬이 준비되지 않았을 때의 맨손/기본 공격
  maxFocus: 12,
  focusRegen: 1
};

export const ENEMY_BASE = {
  hp: 18,
  attack: 4
};

// 층 난이도 스케일링: 몹 스탯 = 기본 스탯 × (1 + 층수 × 0.08)
export const FLOOR_SCALING = 0.08;

// 환생 포인트 = 도달 층수 × 10 + 처치 몹 수 × 1 + 획득 아이템 등급 합산 × 5
export const POINT_WEIGHTS = { floor: 10, kill: 1, itemRarity: 5 };

export function cardById(id) {
  return CARDS.find((c) => c.id === id);
}

// 레벨을 반영한 효과 수치
export function scaledValue(baseValue, level) {
  return Math.round(baseValue * (1 + LEVEL_SCALING * (level - 1)) * 10) / 10;
}
