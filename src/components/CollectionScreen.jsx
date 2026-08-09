import { CARDS, RARITY_INFO, ACHIEVEMENTS } from "../data.js";
import { fmt } from "../utils/format.js";
import ArtImg from "./ArtImg.jsx";

const CATEGORY_TITLE = { skill: "스킬", equipment: "장비", companion: "동료" };

// 도감: 누적 기록 + 업적 + 카드 수집 현황
export default function CollectionScreen({ save, onClaim }) {
  const owned = Object.keys(save.collection).length;

  return (
    <div className="space-y-5 px-4 pb-24">
      {/* 누적 기록 */}
      <div className="panel panel-ornate p-4">
        <div className="text-center font-display text-base font-black text-gold-grad">
          회귀자의 기록
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2 text-center">
          {[
            ["환생", `${save.stats.runs}회`],
            ["최고 기록", `${save.bestFloor}층`],
            ["누적 처치", fmt(save.stats.kills)]
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-black/30 py-2">
              <div className="text-[10px] text-stone-500">{label}</div>
              <div className="font-display text-sm font-black text-stone-100">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 업적 */}
      <section>
        <h2 className="mb-2 px-1 font-display text-sm font-black text-stone-200">
          🏆 업적{" "}
          <span className="text-[11px] font-normal text-amber-500/80">
            {save.claimedAch.length}/{ACHIEVEMENTS.length}
          </span>
        </h2>
        <div className="space-y-2">
          {ACHIEVEMENTS.map((a) => {
            const claimed = save.claimedAch.includes(a.id);
            const achieved = a.check(save);
            return (
              <div
                key={a.id}
                className={`flex items-center gap-3 rounded-xl border p-2.5 ${
                  claimed
                    ? "border-stone-800 bg-black/20 opacity-60"
                    : achieved
                      ? "border-amber-600/70 bg-amber-950/30 shadow-[0_0_12px_rgba(240,199,94,0.25)]"
                      : "border-white/5 bg-black/25"
                }`}
              >
                <span className="text-xl">{a.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-xs font-bold text-stone-200">{a.name}</div>
                  <div className="text-[10px] text-stone-500">{a.description}</div>
                </div>
                {claimed ? (
                  <span className="shrink-0 text-xs text-emerald-500">✔ 수령</span>
                ) : achieved ? (
                  <button
                    onClick={() => onClaim(a.id)}
                    className="btn-gold shrink-0 rounded-lg px-2.5 py-1.5 font-display text-[11px] font-black"
                  >
                    💎{a.reward} 받기
                  </button>
                ) : (
                  <span className="shrink-0 text-[10px] text-stone-600">💎{a.reward}</span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 카드 도감 */}
      <section>
        <h2 className="mb-2 px-1 font-display text-sm font-black text-stone-200">
          📖 카드 도감{" "}
          <span className="text-[11px] font-normal text-amber-500/80">
            {owned}/{CARDS.length}
          </span>
        </h2>
        {Object.entries(CATEGORY_TITLE).map(([category, title]) => (
          <div key={category} className="mb-3">
            <div className="mb-1.5 px-1 text-[11px] font-bold text-stone-500">{title}</div>
            <div className="grid grid-cols-4 gap-2">
              {CARDS.filter((c) => c.category === category).map((card) => {
                const meta = save.collection[card.id];
                return (
                  <div key={card.id} className={`rframe rframe-${meta ? card.rarity : "common"}`}>
                    <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[calc(0.8rem-2px)] bg-gradient-to-b from-[#1c1636] to-[#0f0a20] text-2xl">
                      <ArtImg
                        id={card.id}
                        fallback={card.icon}
                        alt={card.name}
                        className={meta ? "" : "opacity-30 grayscale"}
                      />
                      {meta && (
                        <span className="absolute bottom-0 left-0 rounded-tr-md bg-black/75 px-1 py-px font-display text-[9px] font-black text-amber-300">
                          Lv.{meta.level}
                        </span>
                      )}
                      {!meta && (
                        <span className="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 text-center text-[9px] text-stone-500">
                          ???
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-1 grid grid-cols-4 gap-2 px-0.5">
              {CARDS.filter((c) => c.category === category).map((card) => (
                <div
                  key={card.id}
                  className={`truncate text-center text-[9px] ${
                    save.collection[card.id] ? RARITY_INFO[card.rarity].color : "text-stone-700"
                  }`}
                >
                  {save.collection[card.id] ? card.name : "미확인"}
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
