import { cardById, LOADOUT_LIMITS, CURSE } from "../data.js";
import { computePlayerStats } from "../systems/battleSimulator.js";
import { fmt, power } from "../utils/format.js";
import Card from "./Card.jsx";
import HeroArt from "./HeroArt.jsx";

const SECTIONS = [
  { category: "skill", title: "스킬", icon: "⚔️" },
  { category: "equipment", title: "장비", icon: "🛡️" },
  { category: "companion", title: "동료", icon: "🐾" }
];

export default function PrepareScreen({
  collection,
  realmLevels,
  loadout,
  curse,
  maxCurse,
  onSetCurse,
  onToggle,
  onStart
}) {
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
          <div className="float-y shrink-0">
            <HeroArt size={96} />
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
              <span>🎯 치명타 {Math.round(stats.critChance * 100)}%</span>
              <span>🌫 회피 {Math.round(stats.dodge * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      <p className="px-1 text-xs leading-relaxed text-violet-200/70">
        환생의 제단 앞. 다시 회랑에 들어서기 전에 몸에 익힐 기술과 챙길 장비를 고른다.
      </p>

      {/* 저주 회랑: 위험할수록 더 많은 포인트 */}
      <section className="rounded-xl border border-red-900/50 bg-gradient-to-b from-[#2a1020]/80 to-[#150a14]/80 p-3">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-sm font-black text-red-300">☠ 저주 회랑</h2>
          {curse > 0 ? (
            <span className="text-[10px] text-red-300/90">
              몹 +{Math.round(curse * CURSE.statMult * 100)}% · 포인트 +
              {Math.round(curse * CURSE.pointMult * 100)}%
            </span>
          ) : (
            <span className="text-[10px] text-stone-500">평범한 회랑</span>
          )}
        </div>
        <div className="mt-2 flex gap-1.5">
          {Array.from({ length: CURSE.max + 1 }, (_, lv) => {
            const locked = lv > maxCurse;
            return (
              <button
                key={lv}
                disabled={locked}
                onClick={() => onSetCurse(lv)}
                className={`flex h-9 flex-1 items-center justify-center rounded-lg text-sm font-black transition ${
                  curse === lv
                    ? "bg-gradient-to-b from-red-600/70 to-red-950 text-red-100 ring-2 ring-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                    : locked
                      ? "bg-black/30 text-stone-700"
                      : "bg-black/40 text-stone-400 hover:text-red-300"
                }`}
              >
                {locked ? "🔒" : lv === 0 ? "—" : `☠${lv}`}
              </button>
            );
          })}
        </div>
        {maxCurse < CURSE.max && (
          <p className="mt-1.5 text-[10px] text-stone-600">
            다음 단계 해금: 최고 기록 {(maxCurse + 1) * CURSE.unlockPer}층
          </p>
        )}
      </section>

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
