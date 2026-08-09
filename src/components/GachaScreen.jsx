import { useState } from "react";
import { GACHA_COST, GACHA_RATES, RARITY_INFO } from "../data.js";
import { fmt } from "../utils/format.js";
import Card from "./Card.jsx";

export default function GachaScreen({ points, collection, onPull }) {
  const [results, setResults] = useState(null);

  const pull = (times) => {
    const pulled = onPull(times);
    if (pulled.length > 0) setResults(pulled);
  };

  const bestRarity = results?.some((r) => r.card.rarity === "legendary")
    ? "legendary"
    : results?.some((r) => r.card.rarity === "epic")
      ? "epic"
      : null;

  return (
    <div className="space-y-5 px-4 pb-24">
      <p className="px-1 text-center text-xs leading-relaxed text-violet-200/70">
        제단의 불꽃에 환생 포인트를 바치면,
        <br />
        전생의 기억이 카드가 되어 떠오른다.
      </p>

      {/* 소환 오브 */}
      <div className="relative mx-auto flex h-52 w-52 items-center justify-center">
        <div className="spin-slow absolute inset-0 rounded-full border-2 border-dashed border-violet-500/40" />
        <div className="spin-slow-rev absolute inset-3 rounded-full border border-violet-400/30" />
        {["✦", "✧", "✦", "✧"].map((s, i) => (
          <span
            key={i}
            className="absolute font-display text-violet-300/70"
            style={{
              transform: `rotate(${i * 90}deg) translateY(-6.6rem)`
            }}
          >
            {s}
          </span>
        ))}
        <div className="orb flex h-32 w-32 items-center justify-center rounded-full">
          <span className="font-display text-4xl font-black text-white/90 drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]">
            ✦
          </span>
        </div>
      </div>

      {/* 확률표 */}
      <div className="flex justify-center gap-3 text-[10px]">
        {Object.entries(GACHA_RATES).map(([rarity, rate]) => (
          <span key={rarity} className={`font-bold ${RARITY_INFO[rarity].color}`}>
            {RARITY_INFO[rarity].label} {Math.round(rate * 100)}%
          </span>
        ))}
      </div>

      {/* 소환 버튼 */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => pull(1)}
          disabled={points < GACHA_COST}
          className="btn-violet rounded-xl py-3 font-display text-sm font-black"
        >
          1회 소환
          <div className="text-[11px] font-bold opacity-85">💎 {fmt(GACHA_COST)}</div>
        </button>
        <button
          onClick={() => pull(10)}
          disabled={points < GACHA_COST * 10}
          className="btn-gold rounded-xl py-3 font-display text-sm font-black"
        >
          10회 소환
          <div className="text-[11px] font-bold opacity-85">💎 {fmt(GACHA_COST * 10)}</div>
        </button>
      </div>

      {/* 소환 결과 오버레이 */}
      {results && (
        <div
          className="backdrop-in fixed inset-0 z-50 overflow-y-auto bg-black/85 px-4 py-8"
          onClick={() => setResults(null)}
        >
          {bestRarity && (
            <div
              className={`pointer-events-none fixed inset-0 opacity-40 ${
                bestRarity === "legendary"
                  ? "bg-[radial-gradient(60%_50%_at_50%_30%,rgba(255,184,51,0.5),transparent_75%)]"
                  : "bg-[radial-gradient(60%_50%_at_50%_30%,rgba(168,85,247,0.45),transparent_75%)]"
              }`}
            />
          )}
          <div className="mx-auto max-w-md">
            <h2 className="mb-4 text-center font-display text-xl font-black text-gold-grad">
              — 소환 결과 —
            </h2>
            <div className="space-y-2.5">
              {results.map((r, i) => (
                <div key={i} className="relative">
                  <Card
                    card={r.card}
                    level={collection[r.card.id]?.level || 1}
                    shards={collection[r.card.id]?.shards}
                    revealed
                    delay={i * 140}
                  />
                  <span
                    className={`absolute -right-1 -top-1.5 z-10 rounded-md px-1.5 py-0.5 text-[10px] font-black shadow-lg ${
                      r.isNew
                        ? "bg-gradient-to-b from-amber-300 to-amber-600 text-amber-950"
                        : r.leveledUp
                          ? "bg-gradient-to-b from-emerald-300 to-emerald-600 text-emerald-950"
                          : "bg-stone-700 text-stone-200"
                    }`}
                  >
                    {r.isNew ? "NEW!" : r.leveledUp ? "LEVEL UP!" : "재료 +1"}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-center text-[11px] tracking-widest text-stone-500">
              화면을 누르면 닫힌다
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
