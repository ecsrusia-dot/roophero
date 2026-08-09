import { RARITY_INFO, ELEMENT_INFO } from "../data.js";

const CATEGORY_LABEL = { skill: "스킬", equipment: "장비", companion: "동료" };

// 등급 프레임 + 아이콘 타일 + 정보로 구성된 카드.
// revealed 는 소환 연출(뒤집히며 등장)에 사용.
export default function Card({ card, level = 1, shards, selected, onClick, revealed, delay }) {
  const rarity = RARITY_INFO[card.rarity];
  const element = ELEMENT_INFO[card.element || card.effect?.element];
  const fancy = card.rarity === "epic" || card.rarity === "legendary";
  return (
    <div
      className={`rframe rframe-${card.rarity} ${fancy ? "shine" : ""} ${revealed ? "reveal" : ""} ${
        selected ? "scale-[1.01] drop-shadow-[0_0_10px_rgba(240,199,94,0.5)]" : ""
      } transition`}
      style={delay !== undefined ? { animationDelay: `${delay}ms` } : undefined}
    >
      <button
        onClick={onClick}
        className={`flex w-full items-center gap-3 rounded-[calc(0.8rem-2px)] p-2.5 text-left transition ${
          selected
            ? "bg-gradient-to-b from-[#2e2452] to-[#191231]"
            : "bg-gradient-to-b from-[#1c1636] to-[#110c24] hover:from-[#241c42]"
        } ${onClick ? "cursor-pointer" : "cursor-default"}`}
      >
        {/* 아이콘 타일 */}
        <div className={`rframe rframe-${card.rarity} shrink-0`}>
          <div className="relative flex h-14 w-14 items-center justify-center rounded-[calc(0.8rem-2px)] bg-gradient-to-b from-[#241c46] to-[#0f0a20] text-2xl">
            {card.icon}
            <span className="absolute bottom-0 left-0 rounded-tr-md rounded-bl-[calc(0.8rem-2px)] bg-black/75 px-1 py-px font-display text-[9px] font-black text-amber-300">
              Lv.{level}
            </span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className={`truncate font-display text-sm font-bold ${rarity.color}`}>
              {card.name}
            </span>
            <span className="shrink-0 text-[10px] text-stone-500">
              {CATEGORY_LABEL[card.category]} · {rarity.label}
            </span>
          </div>
          <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-stone-400">
            {card.description}
          </p>
          <div className="mt-1 flex gap-2.5 text-[10px] text-stone-500">
            {element && (
              <span className={`font-bold ${element.color}`}>
                {element.icon} {element.label}
              </span>
            )}
            {card.cost !== undefined && <span>🔷 {card.cost}</span>}
            {card.cooldown !== undefined && <span>⏳ {card.cooldown}초</span>}
            {shards !== undefined && shards > 0 && (
              <span className="text-emerald-400">재료 {shards}</span>
            )}
            {selected && <span className="ml-auto font-bold text-amber-300">✔ 장착</span>}
          </div>
        </div>
      </button>
    </div>
  );
}
