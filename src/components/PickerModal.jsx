import { cardById, deployCostOf, LOADOUT_LIMITS, BONDS } from "../data.js";
import Card from "./Card.jsx";

const CATEGORY_TITLE = { skill: "스킬 편성", equipment: "장비 편성", companion: "동료 편성" };

// 카테고리별 편성 선택창. 코스트 한도와 슬롯 수를 넘지 않는 선에서 장착/해제한다.
export default function PickerModal({
  category,
  collection,
  loadout,
  usedCost,
  capacity,
  onToggle,
  onClose
}) {
  const owned = Object.entries(collection)
    .map(([id, meta]) => ({ card: cardById(id), ...meta }))
    .filter((e) => e.card && e.card.category === category);

  const equipped = loadout[category];
  const equippedCompanions = loadout.companion;

  return (
    <div className="backdrop-in fixed inset-0 z-50 flex flex-col bg-[#0d0a1c]/97">
      {/* 헤더: 코스트 게이지 */}
      <div className="border-b border-white/10 px-4 pb-3 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-black text-gold-grad">
            {CATEGORY_TITLE[category]}
          </h2>
          <span className="text-xs text-stone-400">
            슬롯 {equipped.length}/{LOADOUT_LIMITS[category]}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[10px] font-bold text-amber-300">코스트</span>
          <div className="bar flex-1">
            <span
              className="bg-gradient-to-r from-amber-300 to-amber-600"
              style={{ width: `${Math.min(100, (usedCost / capacity) * 100)}%` }}
            />
          </div>
          <span
            className={`font-display text-xs font-black ${
              usedCost >= capacity ? "text-red-400" : "text-amber-300"
            }`}
          >
            {usedCost}/{capacity}
          </span>
        </div>
      </div>

      {/* 동료 인연 안내 */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {category === "companion" && (
          <section className="mb-4 space-y-1.5">
            <h3 className="px-1 text-[11px] font-bold text-violet-300">
              🤝 인연 — 조합하면 등급을 뛰어넘는다
            </h3>
            {BONDS.map((bond) => {
              const memberStates = bond.members.map((id) => ({
                card: cardById(id),
                owned: Boolean(collection[id]),
                equipped: equippedCompanions.includes(id)
              }));
              const active = memberStates.every((m) => m.equipped);
              const possible = memberStates.every((m) => m.owned);
              return (
                <div
                  key={bond.id}
                  className={`rounded-lg border p-2 ${
                    active
                      ? "border-amber-500/70 bg-amber-950/30 shadow-[0_0_10px_rgba(240,199,94,0.3)]"
                      : possible
                        ? "border-violet-700/50 bg-black/30"
                        : "border-white/5 bg-black/20 opacity-60"
                  }`}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-[11px] font-bold text-stone-200">
                      {bond.icon} {bond.name}
                      {active && <span className="ml-1 text-amber-300">발동 중!</span>}
                    </span>
                    <span className="text-[9px] text-stone-500">
                      {memberStates.filter((m) => m.equipped).length}/{bond.members.length}
                    </span>
                  </div>
                  <div className="mt-0.5 text-[10px] text-emerald-300/90">{bond.effectText}</div>
                  <div className="mt-0.5 flex flex-wrap gap-1">
                    {memberStates.map((m) => (
                      <span
                        key={m.card.id}
                        className={`rounded px-1 py-px text-[9px] ${
                          m.equipped
                            ? "bg-amber-900/60 text-amber-200"
                            : m.owned
                              ? "bg-stone-800 text-stone-300"
                              : "bg-black/40 text-stone-600 line-through"
                        }`}
                      >
                        {m.card.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* 보유 카드 목록 */}
        {owned.length === 0 ? (
          <p className="py-10 text-center text-xs text-stone-600">
            보유한 카드가 없다 — 소환 제단에서 뽑아보자
          </p>
        ) : (
          <div className="space-y-2 pb-4">
            {owned.map(({ card, level, shards }) => {
              const isEquipped = equipped.includes(card.id);
              const cost = deployCostOf(card);
              const slotFull = !isEquipped && equipped.length >= LOADOUT_LIMITS[category];
              const costOver = !isEquipped && usedCost + cost > capacity;
              const blocked = slotFull || costOver;
              return (
                <div key={card.id} className={blocked ? "opacity-45" : ""}>
                  <Card
                    card={card}
                    level={level}
                    shards={shards}
                    selected={isEquipped}
                    onClick={() => !blocked && onToggle(category, card.id)}
                  />
                  {blocked && (
                    <p className="mt-0.5 px-2 text-[9px] text-red-400/80">
                      {slotFull ? "슬롯이 가득 찼다" : "편성 코스트가 부족하다"}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-white/10 p-3">
        <button
          onClick={onClose}
          className="btn-gold w-full rounded-xl py-3 font-display text-sm font-black"
        >
          편성 완료
        </button>
      </div>
    </div>
  );
}
