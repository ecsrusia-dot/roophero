import { useState } from "react";
import { cardById, LOADOUT_LIMITS, CURSE, deployCostOf, RARITY_INFO } from "../data.js";
import { computePlayerStats } from "../systems/battleSimulator.js";
import { fmt, power } from "../utils/format.js";
import ArtImg from "./ArtImg.jsx";
import HeroArt from "./HeroArt.jsx";
import PickerModal from "./PickerModal.jsx";

const SECTIONS = [
  { category: "skill", title: "스킬", icon: "⚔️" },
  { category: "equipment", title: "장비", icon: "🛡️" },
  { category: "companion", title: "동료", icon: "🐾" }
];

// 장착된 카드 하나를 작은 타일로 보여준다.
function EquippedTile({ card, level }) {
  return (
    <div className={`rframe rframe-${card.rarity}`}>
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[calc(0.8rem-2px)] bg-gradient-to-b from-[#1c1636] to-[#0f0a20] text-2xl">
        <ArtImg id={card.id} fallback={card.icon} alt={card.name} />
        <span className="absolute bottom-0 left-0 rounded-tr-md bg-black/75 px-1 py-px font-display text-[9px] font-black text-amber-300">
          Lv.{level}
        </span>
        <span className="absolute right-0 top-0 rounded-bl-md bg-black/75 px-1 py-px text-[9px] font-bold text-stone-300">
          ⚖{deployCostOf(card)}
        </span>
      </div>
    </div>
  );
}

export default function PrepareScreen({
  collection,
  realmLevels,
  loadout,
  curse,
  maxCurse,
  capacity,
  onSetCurse,
  onToggle,
  onStart
}) {
  const [picker, setPicker] = useState(null); // 열려 있는 편성 카테고리

  const withLevels = (ids) => ids.map((id) => ({ id, level: collection[id]?.level || 1 }));
  const stats = computePlayerStats(
    {
      skill: withLevels(loadout.skill),
      equipment: withLevels(loadout.equipment),
      companion: withLevels(loadout.companion)
    },
    realmLevels
  );

  const usedCost = Object.values(loadout)
    .flat()
    .reduce((sum, id) => sum + deployCostOf(cardById(id)), 0);

  const canStart = loadout.skill.length > 0;

  return (
    <div className="space-y-4 px-4 pb-32">
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
              <span>🔷 정신력 {stats.maxFocus} (+{Math.round(stats.focusRegen * 10) / 10}/초)</span>
              <span>🛡 피해감소 {stats.damageReduction}</span>
              <span>🎯 치명타 {Math.round(stats.critChance * 100)}%</span>
              <span>🌫 회피 {Math.round(stats.dodge * 100)}%</span>
            </div>
          </div>
        </div>
        {/* 발동 중인 인연 */}
        {stats.bonds.length > 0 && (
          <div className="relative mt-2 flex flex-wrap gap-1.5">
            {stats.bonds.map((b) => (
              <span
                key={b.id}
                className="rounded-full border border-amber-600/60 bg-amber-950/40 px-2 py-0.5 text-[10px] font-bold text-amber-200"
                title={b.effectText}
              >
                {b.icon} {b.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 편성 코스트 */}
      <div className="flex items-center gap-2 rounded-xl border border-amber-900/40 bg-black/30 px-3 py-2.5">
        <span className="font-display text-xs font-black text-amber-300">⚖ 편성 코스트</span>
        <div className="bar flex-1">
          <span
            className="bg-gradient-to-r from-amber-300 to-amber-600"
            style={{ width: `${Math.min(100, (usedCost / capacity) * 100)}%` }}
          />
        </div>
        <span
          className={`font-display text-sm font-black ${
            usedCost >= capacity ? "text-red-400" : "text-gold-grad"
          }`}
        >
          {usedCost}/{capacity}
        </span>
      </div>

      {/* 저주 회랑 */}
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

      {/* 장착 현황 (장착된 것만 표시, 편성은 별도 창) */}
      {SECTIONS.map(({ category, title, icon }) => {
        const equippedIds = loadout[category];
        return (
          <section key={category}>
            <div className="mb-1.5 flex items-center justify-between px-1">
              <h2 className="flex items-baseline gap-1.5 font-display text-sm font-black text-stone-200">
                <span>{icon}</span> {title}
                <span className="text-[11px] font-normal text-amber-500/80">
                  {equippedIds.length}/{LOADOUT_LIMITS[category]}
                </span>
              </h2>
              <button
                onClick={() => setPicker(category)}
                className="rounded-lg border border-amber-700/60 bg-amber-950/30 px-2.5 py-1 font-display text-[11px] font-bold text-amber-300 transition hover:bg-amber-900/40"
              >
                편성 ▸
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {equippedIds.map((id) => {
                const card = cardById(id);
                return (
                  <EquippedTile key={id} card={card} level={collection[id]?.level || 1} />
                );
              })}
              {Array.from(
                { length: LOADOUT_LIMITS[category] - equippedIds.length },
                (_, i) => (
                  <button
                    key={`empty-${i}`}
                    onClick={() => setPicker(category)}
                    className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-stone-700 text-lg text-stone-600 transition hover:border-amber-700 hover:text-amber-500"
                  >
                    +
                  </button>
                )
              )}
            </div>
            {/* 카드 이름 라벨 */}
            {equippedIds.length > 0 && (
              <div className="mt-1 grid grid-cols-4 gap-2 px-0.5">
                {equippedIds.map((id) => {
                  const card = cardById(id);
                  return (
                    <div
                      key={id}
                      className={`truncate text-center text-[9px] ${RARITY_INFO[card.rarity].color}`}
                    >
                      {card.name}
                    </div>
                  );
                })}
                {Array.from(
                  { length: LOADOUT_LIMITS[category] - equippedIds.length },
                  (_, i) => (
                    <div key={`pad-${i}`} />
                  )
                )}
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
          {canStart ? "⚔ 회랑에 들어선다" : "스킬을 최소 1개 편성하라"}
        </button>
      </div>

      {picker && (
        <PickerModal
          category={picker}
          collection={collection}
          loadout={loadout}
          usedCost={usedCost}
          capacity={capacity}
          onToggle={onToggle}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  );
}
