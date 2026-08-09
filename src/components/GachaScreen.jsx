import { useState } from "react";
import { GACHA_COST, GACHA_RATES, RARITY_INFO } from "../data.js";
import Card from "./Card.jsx";

export default function GachaScreen({ points, collection, onPull }) {
  const [results, setResults] = useState([]);

  const pull = (times) => {
    const pulled = onPull(times);
    if (pulled.length > 0) setResults(pulled);
  };

  return (
    <div className="space-y-5 pb-6">
      <p className="text-sm leading-relaxed text-stone-400">
        제단의 불꽃에 환생 포인트를 바치면, 전생의 기억이 카드가 되어 떠오른다.
      </p>

      <div className="flex justify-center gap-4 text-xs text-stone-500">
        {Object.entries(GACHA_RATES).map(([rarity, rate]) => (
          <span key={rarity} className={RARITY_INFO[rarity].color}>
            {RARITY_INFO[rarity].label} {Math.round(rate * 100)}%
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => pull(1)}
          disabled={points < GACHA_COST}
          className="rounded-xl bg-violet-950 py-3 font-bold text-violet-200 transition enabled:hover:bg-violet-900 disabled:opacity-40"
        >
          1회 소환
          <div className="text-xs font-normal opacity-70">{GACHA_COST}P</div>
        </button>
        <button
          onClick={() => pull(10)}
          disabled={points < GACHA_COST * 10}
          className="rounded-xl bg-violet-900 py-3 font-bold text-violet-100 transition enabled:hover:bg-violet-800 disabled:opacity-40"
        >
          10회 소환
          <div className="text-xs font-normal opacity-70">{GACHA_COST * 10}P</div>
        </button>
      </div>

      {results.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-stone-300">소환 결과</h2>
          {results.map((r, i) => (
            <div key={i} className="relative">
              <Card
                card={r.card}
                level={collection[r.card.id]?.level || 1}
                shards={collection[r.card.id]?.shards}
                revealed
              />
              <span className="absolute right-2 top-2 rounded bg-stone-800 px-1.5 py-0.5 text-[10px] text-stone-300">
                {r.isNew ? "신규!" : r.leveledUp ? "강화 레벨업!" : "재료 +1"}
              </span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
