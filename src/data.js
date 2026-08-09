// 카드/적/경지/축복/인연 정의.
// 특정 웹툰의 고유명사는 쓰지 않고 오마주 수준의 자체 명칭만 사용한다.

export const RARITIES = ["common", "rare", "epic", "legendary"];

export const RARITY_INFO = {
  common: { label: "일반", value: 1, color: "text-stone-300", ring: "ring-stone-500" },
  rare: { label: "희귀", value: 2, color: "text-sky-300", ring: "ring-sky-500" },
  epic: { label: "영웅", value: 3, color: "text-violet-300", ring: "ring-violet-500" },
  legendary: { label: "전설", value: 4, color: "text-amber-300", ring: "ring-amber-500" }
};

// ── 속성 상성 ────────────────────────────────────────────
// 적의 약점 속성으로 때리면 1.5배, 저항 속성이면 0.6배.
export const ELEMENT_INFO = {
  slash: { label: "참격", icon: "🗡", color: "text-stone-300" },
  flame: { label: "화염", icon: "🔥", color: "text-orange-400" },
  frost: { label: "냉기", icon: "❄️", color: "text-cyan-300" },
  shadow: { label: "암영", icon: "🌑", color: "text-violet-400" },
  holy: { label: "신성", icon: "✨", color: "text-amber-200" }
};
export const WEAKNESS_MULT = 1.5;
export const RESIST_MULT = 0.6;
export const CRIT_MULT = 1.7;

// 가챠 확률 (천장 없음, 순수 확률제)
export const GACHA_RATES = {
  common: 0.6,
  rare: 0.25,
  epic: 0.12,
  legendary: 0.03
};

export const GACHA_COST = 100; // 1회 뽑기 환생 포인트

// ── 편성 코스트 ──────────────────────────────────────────
// 카드마다 편성 코스트가 있고, 총합이 지휘 한도를 넘을 수 없다.
// 한도 = 기본 8 + 통솔력 경지 레벨.
export const DEPLOY_COST = { common: 1, rare: 2, epic: 3, legendary: 4 };
export const BASE_COST_CAPACITY = 8;

export function deployCostOf(card) {
  return card.deployCost ?? DEPLOY_COST[card.rarity];
}

export function costCapacity(realmLevels = {}) {
  return BASE_COST_CAPACITY + (realmLevels.realm_lead || 0);
}

// 로드아웃 슬롯 제한
export const LOADOUT_LIMITS = { skill: 4, equipment: 3, companion: 3 };

// 중복 카드 강화: 레벨당 필요한 재료 수 = 현재 레벨
// 카드 효과 수치 = 기본값 × (1 + 0.15 × (레벨 - 1))
export const LEVEL_SCALING = 0.15;

export const CARDS = [
  // ── 스킬 (18종) ───────────────────────────────────────
  {
    id: "skill_001",
    icon: "🗡️",
    name: "기본 검격",
    category: "skill",
    rarity: "common",
    element: "slash",
    cost: 1,
    cooldown: 2,
    priority: 5,
    effect: { type: "damage", value: 6 },
    description: "몸에 밴 가장 단순한 베기. 적에게 6의 참격 피해를 입힌다."
  },
  {
    id: "skill_002",
    icon: "⚡",
    name: "뒷골목 연격",
    category: "skill",
    rarity: "common",
    element: "slash",
    cost: 2,
    cooldown: 4,
    priority: 4,
    effect: { type: "multi_damage", value: 5, hits: 2 },
    description: "골목 싸움에서 익힌 변칙 연타. 5의 참격 피해로 2회 공격한다."
  },
  {
    id: "skill_010",
    icon: "🪨",
    name: "돌팔매",
    category: "skill",
    rarity: "common",
    element: "slash",
    cost: 1,
    cooldown: 3,
    priority: 5,
    effect: { type: "damage", value: 8 },
    description: "골목에서 갈고닦은 투석. 적에게 8의 참격 피해를 입힌다."
  },
  {
    id: "skill_011",
    icon: "🎯",
    name: "급소 노리기",
    category: "skill",
    rarity: "rare",
    element: "slash",
    cost: 3,
    cooldown: 6,
    priority: 3,
    effect: { type: "damage", value: 9, alwaysCrit: true },
    description: "빈틈을 파고드는 일격. 9의 참격 피해가 반드시 치명타로 적중한다."
  },
  {
    id: "skill_003",
    icon: "🌬️",
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
    id: "skill_006",
    icon: "🔥",
    name: "잉걸불 탄환",
    category: "skill",
    rarity: "rare",
    element: "flame",
    cost: 3,
    cooldown: 5,
    priority: 3,
    effect: { type: "damage", value: 14 },
    description: "손끝에서 튕겨낸 불씨. 적에게 14의 화염 피해를 입힌다."
  },
  {
    id: "skill_007",
    icon: "❄️",
    name: "서리 파문",
    category: "skill",
    rarity: "rare",
    element: "frost",
    cost: 4,
    cooldown: 7,
    priority: 3,
    effect: { type: "aoe_damage", value: 8 },
    description: "발밑에서 퍼지는 한기. 모든 적에게 8의 냉기 피해를 입힌다."
  },
  {
    id: "skill_014",
    icon: "🌫️",
    name: "그림자 분신",
    category: "skill",
    rarity: "rare",
    element: "shadow",
    cost: 3,
    cooldown: 6,
    priority: 4,
    effect: { type: "multi_damage", value: 4, hits: 3 },
    description: "세 갈래로 흩어지는 그림자. 4의 암영 피해로 3회 공격한다."
  },
  {
    id: "skill_018",
    icon: "🕊️",
    name: "수호의 기도",
    category: "skill",
    rarity: "rare",
    element: "holy",
    cost: 2,
    cooldown: 4,
    priority: 6,
    effect: { type: "heal", value: 8 },
    description: "짧지만 간절한 기도. 체력을 8 회복한다."
  },
  {
    id: "skill_004",
    icon: "💥",
    name: "파쇄격",
    category: "skill",
    rarity: "epic",
    element: "slash",
    cost: 4,
    cooldown: 8,
    priority: 2,
    effect: { type: "damage", value: 22 },
    description: "전신의 힘을 실어 내려친다. 적에게 22의 참격 피해를 입힌다."
  },
  {
    id: "skill_008",
    icon: "🦇",
    name: "흡혈 찌르기",
    category: "skill",
    rarity: "epic",
    element: "shadow",
    cost: 4,
    cooldown: 6,
    priority: 2,
    effect: { type: "damage", value: 16, lifesteal: 0.5 },
    description: "어둠이 스민 칼끝. 16의 암영 피해를 입히고 피해의 절반만큼 회복한다."
  },
  {
    id: "skill_012",
    icon: "🌋",
    name: "화염 소용돌이",
    category: "skill",
    rarity: "epic",
    element: "flame",
    cost: 5,
    cooldown: 9,
    priority: 2,
    effect: { type: "aoe_damage", value: 14 },
    description: "휘몰아치는 불기둥. 모든 적에게 14의 화염 피해를 입힌다."
  },
  {
    id: "skill_013",
    icon: "🧊",
    name: "얼음 창",
    category: "skill",
    rarity: "epic",
    element: "frost",
    cost: 4,
    cooldown: 7,
    priority: 2,
    effect: { type: "damage", value: 20 },
    description: "심장을 노리는 서슬. 적에게 20의 냉기 피해를 입힌다."
  },
  {
    id: "skill_015",
    icon: "🙏",
    name: "축성의 기도",
    category: "skill",
    rarity: "epic",
    element: "holy",
    cost: 5,
    cooldown: 9,
    priority: 6,
    effect: { type: "heal", value: 22 },
    description: "빛이 상처를 어루만진다. 체력을 22 회복한다."
  },
  {
    id: "skill_005",
    icon: "🌙",
    name: "월영 일섬",
    category: "skill",
    rarity: "legendary",
    element: "shadow",
    cost: 6,
    cooldown: 12,
    priority: 1,
    effect: { type: "damage", value: 45 },
    description: "달그림자가 스치는 찰나의 일격. 적에게 45의 암영 피해를 입힌다."
  },
  {
    id: "skill_009",
    icon: "🌅",
    name: "여명의 심판",
    category: "skill",
    rarity: "legendary",
    element: "holy",
    cost: 7,
    cooldown: 14,
    priority: 1,
    effect: { type: "aoe_damage", value: 30 },
    description: "회랑의 어둠을 가르는 빛기둥. 모든 적에게 30의 신성 피해를 입힌다."
  },
  {
    id: "skill_016",
    icon: "🌩️",
    name: "낙뢰 강타",
    category: "skill",
    rarity: "legendary",
    element: "slash",
    cost: 6,
    cooldown: 11,
    priority: 1,
    effect: { type: "damage", value: 38 },
    description: "하늘이 내리꽂는 벼락의 검. 적에게 38의 참격 피해를 입힌다."
  },
  {
    id: "skill_017",
    icon: "🩸",
    name: "피의 갈증",
    category: "skill",
    rarity: "legendary",
    element: "shadow",
    cost: 7,
    cooldown: 13,
    priority: 1,
    effect: { type: "aoe_damage", value: 18, lifesteal: 0.4 },
    description: "모든 적의 생기를 앗는다. 18의 암영 피해를 입히고 피해의 40%만큼 회복한다."
  },
  // ── 장비 (16종) ───────────────────────────────────────
  {
    id: "equip_001",
    icon: "🥋",
    name: "낡은 가죽 갑옷",
    category: "equipment",
    rarity: "common",
    effect: { type: "max_hp", value: 12 },
    description: "해진 자국이 많지만 아직 쓸 만하다. 최대 체력 +12."
  },
  {
    id: "equip_002",
    icon: "🔪",
    name: "뒷골목 단검",
    category: "equipment",
    rarity: "common",
    effect: { type: "attack", value: 2 },
    description: "손에 익은 짧은 칼. 기본 공격력 +2."
  },
  {
    id: "equip_008",
    icon: "🧤",
    name: "무쇠 장갑",
    category: "equipment",
    rarity: "common",
    effect: { type: "attack", value: 1.5 },
    description: "투박하지만 믿음직한 무게. 기본 공격력 +1.5."
  },
  {
    id: "equip_009",
    icon: "🥾",
    name: "여행자의 장화",
    category: "equipment",
    rarity: "common",
    effect: { type: "dodge", value: 0.04 },
    description: "먼 길을 함께한 가벼운 장화. 회피 +4%."
  },
  {
    id: "equip_003",
    icon: "📿",
    name: "은빛 정신 목걸이",
    category: "equipment",
    rarity: "rare",
    effect: { type: "focus_regen", value: 0.5 },
    description: "차가운 은이 정신을 맑게 한다. 초당 정신력 회복 +0.5."
  },
  {
    id: "equip_005",
    icon: "🦅",
    name: "투사의 팔찌",
    category: "equipment",
    rarity: "rare",
    effect: { type: "crit_chance", value: 0.08 },
    description: "숱한 결투가 새겨진 가죽 팔찌. 치명타 확률 +8%."
  },
  {
    id: "equip_010",
    icon: "⛓️",
    name: "사슬 갑옷",
    category: "equipment",
    rarity: "rare",
    effect: { type: "max_hp", value: 22 },
    description: "촘촘히 엮인 쇠사슬. 최대 체력 +22."
  },
  {
    id: "equip_014",
    icon: "⚔️",
    name: "결투가의 대검",
    category: "equipment",
    rarity: "rare",
    effect: { type: "attack", value: 4 },
    description: "정면 승부를 위한 묵직한 검. 기본 공격력 +4."
  },
  {
    id: "equip_016",
    icon: "🪖",
    name: "불굴의 투구",
    category: "equipment",
    rarity: "rare",
    effect: { type: "damage_reduction", value: 1 },
    description: "찌그러져도 벗지 않았다. 받는 피해 -1."
  },
  {
    id: "equip_004",
    icon: "🛡️",
    name: "수호자의 낡은 방패",
    category: "equipment",
    rarity: "epic",
    effect: { type: "damage_reduction", value: 2 },
    description: "이름 모를 수호자가 남긴 방패. 받는 피해 -2."
  },
  {
    id: "equip_006",
    icon: "🧿",
    name: "잉걸불 부적",
    category: "equipment",
    rarity: "epic",
    effect: { type: "element_boost", element: "flame", value: 0.3 },
    description: "꺼지지 않는 불씨가 봉인된 부적. 화염 피해 +30%."
  },
  {
    id: "equip_011",
    icon: "❄️",
    name: "서리 결정 목걸이",
    category: "equipment",
    rarity: "epic",
    effect: { type: "element_boost", element: "frost", value: 0.3 },
    description: "녹지 않는 얼음 조각. 냉기 피해 +30%."
  },
  {
    id: "equip_012",
    icon: "🌑",
    name: "월광석 반지",
    category: "equipment",
    rarity: "epic",
    effect: { type: "element_boost", element: "shadow", value: 0.3 },
    description: "그믐밤에만 캘 수 있는 돌. 암영 피해 +30%."
  },
  {
    id: "equip_013",
    icon: "✝️",
    name: "빛바랜 성표",
    category: "equipment",
    rarity: "epic",
    effect: { type: "element_boost", element: "holy", value: 0.3 },
    description: "오래전 순례자의 증표. 신성 피해 +30%."
  },
  {
    id: "equip_007",
    icon: "🌫️",
    name: "달빛 장막",
    category: "equipment",
    rarity: "legendary",
    effect: { type: "dodge", value: 0.1 },
    description: "달빛으로 짠 얇은 망토. 10% 확률로 적의 공격을 회피한다."
  },
  {
    id: "equip_015",
    icon: "📖",
    name: "현자의 서",
    category: "equipment",
    rarity: "legendary",
    effect: { type: "focus_regen", value: 1 },
    description: "읽을수록 머리가 맑아지는 책. 초당 정신력 회복 +1."
  },
  // ── 동료 (14종) ───────────────────────────────────────
  {
    id: "comp_001",
    icon: "🪓",
    name: "떠돌이 용병",
    category: "companion",
    rarity: "common",
    effect: { type: "attack", value: 4, interval: 3, element: "slash" },
    description: "값싼 보수로 함께 싸우는 용병. 3초마다 4의 참격 피해를 입힌다."
  },
  {
    id: "comp_004",
    icon: "🏹",
    name: "골목 소년 궁수",
    category: "companion",
    rarity: "common",
    effect: { type: "attack", value: 3, interval: 2, element: "slash" },
    description: "새총 대신 활을 쥔 소년. 2초마다 3의 참격 피해를 입힌다."
  },
  {
    id: "comp_006",
    icon: "🐕",
    name: "들개 조련사",
    category: "companion",
    rarity: "common",
    effect: { type: "attack", value: 3, interval: 2, element: "slash" },
    description: "휘파람 하나로 들개를 부린다. 2초마다 3의 참격 피해를 입힌다."
  },
  {
    id: "comp_007",
    icon: "🧪",
    name: "뒷골목 약장수",
    category: "companion",
    rarity: "common",
    effect: { type: "heal", value: 3, interval: 4 },
    description: "출처 불명이지만 잘 듣는 물약. 4초마다 체력을 3 회복시킨다."
  },
  {
    id: "comp_002",
    icon: "⛑️",
    name: "견습 사제",
    category: "companion",
    rarity: "rare",
    effect: { type: "heal", value: 5, interval: 5 },
    description: "아직 서툴지만 진심인 기도. 5초마다 체력을 5 회복시킨다."
  },
  {
    id: "comp_009",
    icon: "🎻",
    name: "유랑 악사",
    category: "companion",
    rarity: "rare",
    effect: { type: "focus_regen", value: 0.3, passive: true },
    description: "낮은 선율이 정신을 붙잡아준다. 초당 정신력 회복 +0.3 (상시)."
  },
  {
    id: "comp_010",
    icon: "👤",
    name: "그림자 쌍둥이 형",
    category: "companion",
    rarity: "rare",
    effect: { type: "attack", value: 6, interval: 3, element: "shadow" },
    description: "어둠 속에서 나타나는 형. 3초마다 6의 암영 피해를 입힌다."
  },
  {
    id: "comp_011",
    icon: "👥",
    name: "그림자 쌍둥이 동생",
    category: "companion",
    rarity: "rare",
    effect: { type: "attack", value: 6, interval: 3, element: "shadow" },
    description: "형의 그림자를 밟고 오는 동생. 3초마다 6의 암영 피해를 입힌다."
  },
  {
    id: "comp_008",
    icon: "🛡️",
    name: "방패 든 노병",
    category: "companion",
    rarity: "rare",
    effect: { type: "damage_reduction", value: 1, passive: true },
    description: "말없이 앞을 막아선다. 받는 피해 -1 (상시)."
  },
  {
    id: "comp_003",
    icon: "🐈‍⬛",
    name: "흑묘 정령",
    category: "companion",
    rarity: "epic",
    effect: { type: "attack", value: 9, interval: 4, element: "shadow" },
    description: "그림자 속을 오가는 검은 고양이. 4초마다 9의 암영 피해를 입힌다."
  },
  {
    id: "comp_012",
    icon: "🐺",
    name: "서리 늑대",
    category: "companion",
    rarity: "epic",
    effect: { type: "attack", value: 10, interval: 4, element: "frost" },
    description: "입김마저 얼어붙는 늑대. 4초마다 10의 냉기 피해를 입힌다."
  },
  {
    id: "comp_013",
    icon: "📿",
    name: "성당의 파계승",
    category: "companion",
    rarity: "epic",
    effect: { type: "attack", value: 8, interval: 3, element: "holy" },
    description: "쫓겨나도 믿음은 버리지 않았다. 3초마다 8의 신성 피해를 입힌다."
  },
  {
    id: "comp_005",
    icon: "🕯️",
    name: "화로의 정령",
    category: "companion",
    rarity: "legendary",
    effect: { type: "attack", value: 14, interval: 5, element: "flame" },
    description: "오래된 화로에서 깨어난 불꽃. 5초마다 14의 화염 피해를 입힌다."
  },
  {
    id: "comp_014",
    icon: "🐉",
    name: "잿불 해츨링",
    category: "companion",
    rarity: "legendary",
    effect: { type: "attack", value: 16, interval: 5, element: "flame" },
    description: "잿더미에서 부화한 어린 용. 5초마다 16의 화염 피해를 입힌다."
  }
];

// ── 동료 인연 (조합 시너지) ──────────────────────────────
// 지정된 동료를 모두 편성하면 발동한다. 저등급 조합이 고등급 단일 카드를
// 능가할 수 있도록 설계 — 등급이 전부가 아니다.
export const BONDS = [
  {
    id: "bond_alley",
    icon: "🏚️",
    name: "뒷골목 패거리",
    members: ["comp_001", "comp_004", "comp_007"],
    description: "용병·소년 궁수·약장수. 골목에서 구른 세월은 배신하지 않는다.",
    effectText: "동료 공격력 +60% · 동료 행동 주기 -1초",
    effects: { compAttackPct: 0.6, compIntervalMinus: 1 }
  },
  {
    id: "bond_twins",
    icon: "♊",
    name: "그림자 쌍둥이",
    members: ["comp_010", "comp_011"],
    description: "형과 동생이 같은 어둠을 밟으면 그림자가 배가 된다.",
    effectText: "동료 공격력 +50% · 암영 피해 +30%",
    effects: { compAttackPct: 0.5, elementBoost: { shadow: 0.3 } }
  },
  {
    id: "bond_faith",
    icon: "⛪",
    name: "믿음의 그늘",
    members: ["comp_002", "comp_013"],
    description: "견습 사제와 파계승. 길은 달라도 기도는 같은 곳에 닿는다.",
    effectText: "회복량 +50% · 신성 피해 +25%",
    effects: { healPct: 0.5, elementBoost: { holy: 0.25 } }
  },
  {
    id: "bond_beast",
    icon: "🐾",
    name: "야성의 무리",
    members: ["comp_006", "comp_012"],
    description: "조련사의 휘파람에 서리 늑대도 귀를 세운다.",
    effectText: "동료 공격력 +40% · 냉기 피해 +20%",
    effects: { compAttackPct: 0.4, elementBoost: { frost: 0.2 } }
  },
  {
    id: "bond_warmth",
    icon: "🕯️",
    name: "골목의 온기",
    members: ["comp_004", "comp_002"],
    description: "소년의 활시위를 사제가 말없이 지켜본다.",
    effectText: "최대 체력 +15% · 회복량 +30%",
    effects: { maxHpPct: 0.15, healPct: 0.3 }
  },
  {
    id: "bond_ember",
    icon: "🔥",
    name: "화로의 계승",
    members: ["comp_005", "comp_014"],
    description: "오래된 화로의 불씨가 어린 용에게 옮겨붙는다.",
    effectText: "화염 피해 +35% · 동료 공격력 +25%",
    effects: { elementBoost: { flame: 0.35 }, compAttackPct: 0.25 }
  },
  {
    id: "bond_wall",
    icon: "🧱",
    name: "낡은 방벽",
    members: ["comp_008", "comp_001"],
    description: "노병의 방패 뒤에서 용병의 도끼가 춤춘다.",
    effectText: "받는 피해 -1 · 동료 공격력 +30%",
    effects: { damageReduction: 1, compAttackPct: 0.3 }
  }
];

// 편성된 동료 id 배열로 발동 중인 인연을 구한다.
export function activeBonds(companionIds) {
  return BONDS.filter((b) => b.members.every((m) => companionIds.includes(m)));
}

// ── 적 정의 (약점/저항 속성) ─────────────────────────────
export const FOES_NORMAL = [
  { name: "부랑 괴물", icon: "👹", art: "foe_brute", weak: "slash", resist: "shadow" },
  { name: "녹슨 갑주 망령", icon: "💀", art: "foe_wraith", weak: "holy", resist: "slash" },
  { name: "굶주린 들개 무리", icon: "🐺", art: "foe_hounds", weak: "flame", resist: "frost" },
  { name: "허물 벗은 도마뱀", icon: "🦎", art: "foe_lizard", weak: "frost", resist: "flame" },
  { name: "그림자 술사", icon: "🧙", art: "foe_caster", weak: "holy", resist: "shadow" },
  { name: "얼어붙은 망자", icon: "🧟", art: "foe_frozen", weak: "flame", resist: "frost" }
];
export const FOES_BOSS = [
  { name: "회랑의 감시자", icon: "👁️", art: "boss_watcher", weak: "shadow", resist: "holy" },
  { name: "심연의 문지기", icon: "🗿", art: "boss_gate", weak: "flame", resist: "slash" },
  { name: "붉은 눈의 기사", icon: "🩸", art: "boss_knight", weak: "holy", resist: "shadow" }
];

// ── 회랑의 축복 (런 시작 시 3택1, 해당 런에만 적용) ────────
export const BLESSINGS = [
  {
    id: "bless_atk",
    icon: "⚔️",
    name: "강철의 결의",
    description: "이번 런 동안 공격력 +40%"
  },
  {
    id: "bless_hp",
    icon: "❤️‍🔥",
    name: "거인의 심장",
    description: "이번 런 동안 최대 체력 +50%"
  },
  {
    id: "bless_crit",
    icon: "🎯",
    name: "매의 눈",
    description: "이번 런 동안 치명타 확률 +15%"
  },
  {
    id: "bless_focus",
    icon: "🔮",
    name: "맑은 정신",
    description: "이번 런 동안 정신력 회복 +60%"
  },
  {
    id: "bless_vamp",
    icon: "🦇",
    name: "흡혈의 계약",
    description: "이번 런 동안 입힌 피해의 15%만큼 회복"
  },
  {
    id: "bless_gold",
    icon: "💰",
    name: "탐욕의 계약",
    description: "이번 런의 환생 포인트 +30%"
  },
  {
    id: "bless_thorn",
    icon: "🌵",
    name: "가시 갑주",
    description: "이번 런 동안 받은 피해의 20%를 반사"
  },
  {
    id: "bless_rush",
    icon: "💨",
    name: "회귀자의 질주",
    description: "익숙한 초입을 건너뛰고 5층에서 시작"
  }
];

// ── 경지 (영구 스탯, 포인트 직접 구매 — 뽑기 운과 무관) ──
export const REALMS = [
  {
    id: "realm_hp",
    icon: "❤️‍🔥",
    name: "육체 단련",
    effect: { type: "max_hp", value: 6 },
    baseCost: 50,
    description: "레벨당 최대 체력 +6"
  },
  {
    id: "realm_atk",
    icon: "💪",
    name: "근력 연마",
    effect: { type: "attack", value: 1 },
    baseCost: 80,
    description: "레벨당 기본 공격력 +1"
  },
  {
    id: "realm_focus",
    icon: "🧘",
    name: "정신 수양",
    effect: { type: "focus_regen", value: 0.2 },
    baseCost: 60,
    description: "레벨당 초당 정신력 회복 +0.2"
  },
  {
    id: "realm_crit",
    icon: "🎯",
    name: "급소 간파",
    effect: { type: "crit_chance", value: 0.02 },
    baseCost: 100,
    description: "레벨당 치명타 확률 +2%"
  },
  {
    id: "realm_lead",
    icon: "🎖️",
    name: "통솔력",
    effect: { type: "cost_capacity", value: 1 },
    baseCost: 150,
    description: "레벨당 편성 코스트 한도 +1"
  }
];

// 경지 다음 레벨 비용 = baseCost × (현재 레벨 + 1)
export function realmCost(realm, currentLevel) {
  return realm.baseCost * (currentLevel + 1);
}

export const PLAYER_BASE = {
  maxHp: 60,
  attack: 3, // 스킬이 준비되지 않았을 때의 맨손/기본 공격 (참격 속성)
  maxFocus: 12,
  focusRegen: 1,
  critChance: 0.05
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

// ── 저주 회랑 (난이도 선택: 몹 강화 ↔ 포인트 배율) ────────
// n단계 해금 조건: 최고 기록 ≥ unlockPer × n
export const CURSE = {
  max: 5,
  unlockPer: 8,
  statMult: 0.4, // 단계당 몹 스탯 +40%
  pointMult: 0.5 // 단계당 포인트 +50%
};

export function curseUnlocked(bestFloor) {
  return Math.min(CURSE.max, Math.floor(bestFloor / CURSE.unlockPer));
}

// ── 업적 (일회성 보상, claimedAch 에 수령 기록) ──────────
export const ACHIEVEMENTS = [
  { id: "ach_first", icon: "🚪", name: "첫 환생", description: "처음으로 환생한다", reward: 50, check: (s) => s.stats.runs >= 1 },
  { id: "ach_floor10", icon: "🏰", name: "수문장을 넘어", description: "10층에 도달한다", reward: 100, check: (s) => s.bestFloor >= 10 },
  { id: "ach_floor20", icon: "🌫️", name: "더 깊은 곳으로", description: "20층에 도달한다", reward: 250, check: (s) => s.bestFloor >= 20 },
  { id: "ach_floor30", icon: "🌑", name: "심연의 끝자락", description: "30층에 도달한다", reward: 500, check: (s) => s.bestFloor >= 30 },
  { id: "ach_kills100", icon: "⚔️", name: "백인참", description: "누적 100마리 처치", reward: 150, check: (s) => s.stats.kills >= 100 },
  { id: "ach_kills500", icon: "💀", name: "오백인참", description: "누적 500마리 처치", reward: 400, check: (s) => s.stats.kills >= 500 },
  { id: "ach_runs10", icon: "🔄", name: "회귀 중독", description: "환생 10회", reward: 200, check: (s) => s.stats.runs >= 10 },
  { id: "ach_collect8", icon: "📖", name: "수집가", description: "카드 8종 수집", reward: 150, check: (s) => Object.keys(s.collection).length >= 8 },
  { id: "ach_collect20", icon: "📚", name: "골동품상", description: "카드 20종 수집", reward: 400, check: (s) => Object.keys(s.collection).length >= 20 },
  { id: "ach_collect_all", icon: "👑", name: "도감 완성", description: "모든 카드 수집", reward: 1500, check: (s) => Object.keys(s.collection).length >= CARDS.length },
  { id: "ach_legend", icon: "🌟", name: "전설과의 조우", description: "전설 카드 획득", reward: 300, check: (s) => CARDS.some((c) => c.rarity === "legendary" && s.collection[c.id]) },
  { id: "ach_bond", icon: "🤝", name: "첫 인연", description: "동료 인연을 발동한 채 환생한다", reward: 200, check: (s) => Boolean(s.stats.bondRun) },
  { id: "ach_curse3", icon: "☠️", name: "고행자", description: "저주 3단계에서 10층 돌파", reward: 400, check: (s) => Boolean(s.stats.curse3Floor10) }
];
