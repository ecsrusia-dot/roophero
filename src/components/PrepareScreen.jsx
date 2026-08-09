import { cardById, LOADOUT_LIMITS, REALMS, realmCost } from "../data.js";
import Card from "./Card.jsx";

const SECTIONS = [
  { category: "skill", title: "스킬" },
  { category: "equipment", title: "장비" },
  { category: "companion", title: "동료" }
];

export default function PrepareScreen({
  collection,
  realmLevels,
  points,
  loadout,
  onToggle,
  onBuyRealm,
  onStart
}) {
  const ownedByCategory = (category) =>
    Object.entries(collection)
      .map(([id, meta]) => ({ card: cardById(id), ...meta }))
      .filter((e) => e.card && e.card.category === category);

  const canStart = loadout.skill.length > 0;

  return (
    <div className="space-y-6 pb-28">
      <p className="text-sm leading-relaxed text-stone-400">
        환생의 제단 앞. 다시 회랑에 들어서기 전에 몸에 익힐 기술과 챙길 장비를 고른다.
      </p>

      {SECTIONS.map(({ category, title }) => {
        const owned = ownedByCategory(category);
        return (
          <section key={category}>
            <h2 className="mb-2 text-sm font-bold text-stone-300">
              {title}{" "}
              <span className="font-normal text-stone-500">
                {loadout[category].length}/{LOADOUT_LIMITS[category]}
              </span>
            </h2>
            {owned.length === 0 ? (
              <p className="text-xs text-stone-600">
                아직 없다. 환생 포인트로 카드를 뽑아보자.
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

      <section>
        <h2 className="mb-2 text-sm font-bold text-stone-300">
          경지 <span className="font-normal text-stone-500">영구 성장 · 포인트로 수련</span>
        </h2>
        <div className="space-y-2">
          {REALMS.map((realm) => {
            const level = realmLevels[realm.id] || 0;
            const cost = realmCost(realm, level);
            return (
              <div
                key={realm.id}
                className="flex items-center justify-between rounded-lg border border-stone-700 bg-stone-900 p-3"
              >
                <div>
                  <div className="text-sm font-semibold text-stone-200">
                    {realm.name} <span className="text-xs text-stone-500">Lv.{level}</span>
                  </div>
                  <div className="text-xs text-stone-400">{realm.description}</div>
                </div>
                <button
                  onClick={() => onBuyRealm(realm.id)}
                  disabled={points < cost}
                  className="shrink-0 rounded-md border border-amber-700 px-3 py-1.5 text-xs text-amber-300 transition enabled:hover:bg-amber-900/40 disabled:opacity-40"
                >
                  수련 {cost}P
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-14 mx-auto max-w-md px-4">
        <button
          onClick={onStart}
          disabled={!canStart}
          className="w-full rounded-xl bg-red-900 py-3 font-bold text-red-100 shadow-lg transition enabled:hover:bg-red-800 disabled:opacity-40"
        >
          {canStart ? "회랑에 들어선다" : "스킬을 최소 1개 선택"}
        </button>
      </div>
    </div>
  );
}
