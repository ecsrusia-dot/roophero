import { REALMS, realmCost } from "../data.js";
import { fmt } from "../utils/format.js";

// 경지: 뽑기 운과 무관한 영구 스탯 수련
export default function RealmScreen({ realmLevels, points, onBuyRealm }) {
  return (
    <div className="space-y-4 px-4 pb-24">
      <div className="panel panel-ornate p-4 text-center">
        <div className="font-display text-base font-black text-gold-grad">경지 수련</div>
        <p className="mt-1 text-[11px] leading-relaxed text-violet-200/70">
          제단의 고요 속에서 스스로를 벼린다. 여기서 쌓은 힘은 환생해도 사라지지 않는다.
        </p>
      </div>

      <div className="space-y-2.5">
        {REALMS.map((realm) => {
          const level = realmLevels[realm.id] || 0;
          const cost = realmCost(realm, level);
          const affordable = points >= cost;
          return (
            <div key={realm.id} className="rframe rframe-legendary">
              <div className="flex items-center gap-3 rounded-[calc(0.8rem-2px)] bg-gradient-to-b from-[#1c1636] to-[#110c24] p-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-amber-900/40 to-black/40 text-2xl ring-1 ring-amber-700/50">
                  {realm.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display text-sm font-bold text-stone-100">
                      {realm.name}
                    </span>
                    <span className="font-display text-[11px] font-black text-amber-400">
                      Lv.{level}
                    </span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-stone-400">{realm.description}</div>
                  {level > 0 && (
                    <div className="mt-0.5 text-[10px] text-emerald-400">
                      현재 보너스 +{Math.round(realm.effect.value * level * 10) / 10}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => onBuyRealm(realm.id)}
                  disabled={!affordable}
                  className="btn-gold shrink-0 rounded-lg px-3 py-2 font-display text-xs font-black"
                >
                  수련
                  <div className="text-[10px] font-bold opacity-80">💎{fmt(cost)}</div>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
