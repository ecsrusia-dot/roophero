import { cardById, LOADOUT_LIMITS } from "../data.js";
import { computePlayerStats } from "../systems/battleSimulator.js";
import { fmt, power } from "../utils/format.js";
import Card from "./Card.jsx";

const SECTIONS = [
  { category: "skill", title: "스킬", icon: "⚔️" },
  { category: "equipment", title: "장비", icon: "🛡️" },
  { category: "companion", title: "동료", icon: "🐾" }
];

export default function PrepareScreen({ collection, realmLevels, loadout, onToggle, onStart }) {
  const withLevels = (ids) => ids.map((id) => ({ id, level: collection[id]?.level || 1 }));
  const stats = computePlayerStats(
    {
      skill: withLevels(loadout.skill),
      equipment: withLevels(loadout.equipment),
      companion: withLevels(loadout.companion)
    },
    realmLevels
  );

  const ownedByCategory = (category) =>
    Object.entries(collection)
      .map(([id, meta]) => ({ card: cardById(id), ...meta }))
      .filter((e) => e.card && e.card.category === category);

  const canStart = loadout.skill.length > 0;

  return (
    <div className="space-y-5 px-4 pb-32">
      {/* 주인공 패널 */}
      <div className="panel panel-ornate relative overflow-hidden p-4">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(55% 70% at 50% 0%, rgba(124,58,237,0.35), transparent 70%)"
          }}
        />
        <div className="relative flex items-center gap-4">
          <div className="float-y h-20 w-20 shrink-0 rounded-full bg-gradient-to-b from-amber-200 via-amber-500 to-amber-900 p-[3px] shadow-[0_0_24px_rgba(240,199,94,0.55)]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#171233] text-4xl">
              ⚔️
            </div>
          </div>
          <div className="flex-1">
            <div className="font-display text-base font-black text-stone-100">
              이름 없는 회귀자
            </div>
            <div className="mt-0.5 font-display text-sm font-black text-gold-grad">
              🗡 전투력 {fmt(power(stats))}
            </div>
            <div className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] text-stone-400">
              <span>❤️ 체력 {Math.round(stats.maxHp)}</span>
              <span>⚔️ 공격 {Math.round(stats.attack * 10) / 10}</span>
              <span>🔷 정신력 {stats.maxFocus} (+{stats.focusRegen}/초)</span>
              <span>🛡 피해감소 {stats.damageReduction}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="px-1 text-xs leading-relaxed text-violet-200/70">
        환생의 제단 앞. 다시 회랑에 들어서기 전에 몸에 익힐 기술과 챙길 장비를 고른다.
      </p>

      {SECTIONS.map(({ category, title, icon }) => {
        const owned = ownedByCategory(category);
        return (
          <section key={category}>
            <h2 className="mb-2 flex items-baseline gap-1.5 px-1 font-display text-sm font-black text-stone-200">
              <span>{icon}</span> {title}
              <span className="text-[11px] font-normal text-amber-500/80">
                {loadout[category].length}/{LOADOUT_LIMITS[category]}
              </span>
            </h2>
            {owned.length === 0 ? (
              <p className="rounded-xl border border-dashed border-stone-700 py-4 text-center text-xs text-stone-600">
                아직 없다 — 소환 제단에서 카드를 뽑아보자
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {owned.map(({ card, level, shards }) => (
                  <Card
                    key={card.id}
                    card={card}
                    level={level}
                    shards={shards}
                    selected={loadout[category].includes(card.id)}
                    onClick={() => onToggle(category, card.id)}
                  />
                ))}
              </div>
            )}
          </section>
        );
      })}

      <div className="fixed inset-x-0 bottom-16 z-30 mx-auto max-w-md px-4 pb-2">
        <button
          onClick={onStart}
          disabled={!canStart}
          className="btn-gold w-full rounded-xl py-3.5 font-display text-base font-black tracking-wider"
        >
          {canStart ? "⚔ 회랑에 들어선다" : "스킬을 최소 1개 장착하라"}
        </button>
      </div>
    </div>
  );
}
