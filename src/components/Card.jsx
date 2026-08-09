import { RARITY_INFO } from "../data.js";

const CATEGORY_LABEL = { skill: "스킬", equipment: "장비", companion: "동료" };

export default function Card({ card, level = 1, shards, selected, onClick, revealed }) {
  const rarity = RARITY_INFO[card.rarity];
  return (
    <button
      onClick={onClick}
      className={`relative w-full rounded-lg border border-stone-700 bg-stone-900 p-3 text-left transition
        ${revealed ? "card-reveal" : ""}
        ${selected ? `ring-2 ${rarity.ring} bg-stone-800` : "hover:bg-stone-800"}
        ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className={`font-semibold ${rarity.color}`}>{card.name}</span>
        <span className="shrink-0 text-xs text-stone-500">
          {CATEGORY_LABEL[card.category]} · {rarity.label}
        </span>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-stone-400">{card.description}</p>
      <div className="mt-2 flex gap-3 text-[11px] text-stone-500">
        <span>Lv.{level}</span>
        {shards !== undefined && <span>재료 {shards}</span>}
        {card.cost !== undefined && <span>정신력 {card.cost}</span>}
        {card.cooldown !== undefined && <span>대기 {card.cooldown}초</span>}
      </div>
    </button>
  );
}
