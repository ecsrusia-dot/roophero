import { useEffect, useRef, useState } from "react";
import { cardById, ELEMENT_INFO } from "../data.js";
import { fmt } from "../utils/format.js";
import HeroArt from "./HeroArt.jsx";
import ArtImg from "./ArtImg.jsx";

// 적 유닛 배치 (최대 3마리, 원근감을 위한 스케일 차이)
const FOE_POS = [
  { className: "right-[7%] bottom-3", scale: 1 },
  { className: "right-[30%] bottom-14", scale: 0.85 },
  { className: "right-[3%] bottom-20", scale: 0.75 }
];

const EVENT_TOAST = {
  event_heal: { icon: "⛲", cls: "text-emerald-300" },
  event_trap: { icon: "🪤", cls: "text-red-300" },
  event_treasure: { icon: "🎁", cls: "text-amber-300" },
  event_shrine: { icon: "🕯️", cls: "text-violet-300" }
};

let numId = 0;

export default function BattleScreen({ run, loadoutSkills, onFinish }) {
  const { log, result, stats } = run;
  const [idx, setIdx] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [skipped, setSkipped] = useState(false);

  const [floor, setFloor] = useState(0);
  const [foes, setFoes] = useState([]);
  const [nums, setNums] = useState([]); // 떠오르는 숫자/문구 {id, target:'hero'|number, text, cls}
  const [heroFx, setHeroFx] = useState(false);
  const [hitFoe, setHitFoe] = useState(null);
  const [atkFoe, setAtkFoe] = useState(null);
  const [chargeFoe, setChargeFoe] = useState(null);
  const [shaking, setShaking] = useState(false);
  const [banner, setBanner] = useState(null);
  const [castSkill, setCastSkill] = useState(null);
  const [loots, setLoots] = useState([]);
  const [dead, setDead] = useState(false);

  const timers = useRef([]);
  const after = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const cur = idx > 0 ? log[Math.min(idx, log.length) - 1] : log[0];
  const done = idx >= log.length || skipped;

  const spawnNum = (target, text, cls) => {
    const id = ++numId;
    setNums((n) => [...n.slice(-9), { id, target, text, cls }]);
  };

  const hitNumClass = (tags = [], base = "text-amber-300 text-2xl") => {
    if (tags.includes("crit")) return "text-yellow-200 text-3xl";
    if (tags.includes("weak")) return "text-orange-300 text-2xl";
    if (tags.includes("resist")) return "text-stone-400 text-lg";
    return base;
  };

  const process = (e) => {
    switch (e.type) {
      case "floor_start":
        setFloor(e.floor);
        setFoes(e.foes.map((f) => ({ ...f, dead: false, enraged: false })));
        setChargeFoe(null);
        setBanner({
          key: `f${e.floor}`,
          text: `${e.floor}층`,
          cls: e.foes.some((f) => f.boss) ? "text-red-400" : "text-gold-grad"
        });
        break;
      case "skill":
      case "attack":
      case "companion": {
        setHeroFx(true);
        after(() => setHeroFx(false), 330);
        if (e.card) {
          setCastSkill(e.card);
          after(() => setCastSkill(null), 500);
        }
        if (e.target !== undefined && e.target >= 0) {
          setHitFoe(e.target);
          after(() => setHitFoe(null), 280);
          const prefix = e.tags?.includes("weak") ? "약점 " : "";
          spawnNum(
            e.target,
            `${prefix}${fmt(e.value)}${e.tags?.includes("crit") ? "!" : ""}`,
            hitNumClass(e.tags, e.type === "companion" ? "text-violet-300 text-lg" : undefined)
          );
          setFoes((fs) => fs.map((f, i) => (i === e.target ? { ...f, hp: e.foeHp } : f)));
        }
        break;
      }
      case "thorns":
        if (e.target !== undefined && e.target >= 0) {
          spawnNum(e.target, fmt(e.value), "text-lime-300 text-base");
          setFoes((fs) => fs.map((f, i) => (i === e.target ? { ...f, hp: e.foeHp } : f)));
        }
        break;
      case "skill_heal":
      case "companion_heal":
        spawnNum("hero", `+${fmt(e.value)}`, "text-emerald-300 text-xl");
        break;
      case "enemy_attack":
      case "boss_smash": {
        const smash = e.type === "boss_smash";
        setAtkFoe(e.attacker);
        setChargeFoe(null);
        after(() => setAtkFoe(null), 330);
        setShaking(true);
        after(() => setShaking(false), smash ? 500 : 330);
        spawnNum(
          "hero",
          `-${fmt(e.value)}${smash ? "!!" : ""}`,
          smash ? "text-red-300 text-3xl" : "text-red-400 text-xl"
        );
        break;
      }
      case "boss_charge":
        setChargeFoe(e.attacker);
        setBanner({ key: `c${idx}`, text: "⚠ 강타 예고", cls: "text-red-400" });
        break;
      case "dodge":
        spawnNum("hero", "회피!", "text-cyan-300 text-xl");
        break;
      case "enrage":
        setFoes((fs) => fs.map((f, i) => (i === e.target ? { ...f, enraged: true } : f)));
        spawnNum(e.target, "광폭화!", "text-red-400 text-base");
        break;
      case "kill":
        setFoes((fs) => fs.map((f, i) => (i === e.target ? { ...f, dead: true } : f)));
        break;
      case "drop":
        setLoots((l) => [
          ...l.slice(-2),
          { id: ++numId, icon: "✦", text: "전리품", cls: "text-amber-200" }
        ]);
        break;
      case "event_heal":
      case "event_trap":
      case "event_treasure":
      case "event_shrine": {
        const t = EVENT_TOAST[e.type];
        setLoots((l) => [
          ...l.slice(-2),
          { id: ++numId, icon: t.icon, text: e.message.split(".")[0], cls: t.cls }
        ]);
        if (e.type === "event_heal") spawnNum("hero", `+${fmt(e.value)}`, "text-emerald-300 text-xl");
        if (e.type === "event_trap") spawnNum("hero", `-${fmt(e.value)}`, "text-red-400 text-xl");
        break;
      }
      case "death":
        setDead(true);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (done) return;
    const t = setTimeout(
      () => {
        process(log[idx]);
        setIdx((i) => i + 1);
      },
      idx === 0 ? 250 : 420 / speed
    );
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, done, speed]);

  const hp = skipped ? 0 : (cur?.hp ?? stats.maxHp);
  const focus = skipped ? 0 : (cur?.focus ?? stats.maxFocus);
  const visibleLog = log.slice(Math.max(0, idx - 3), idx);

  return (
    <div className="flex h-[calc(100dvh-4.2rem)] flex-col px-3 pb-3">
      {/* 층수 / 웨이브 표시 */}
      <div className="mb-1.5 flex items-center justify-between px-1">
        <span className="font-display text-lg font-black text-gold-grad">
          {floor > 0 ? `${floor}층` : "—"}
        </span>
        <div className="flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1">
          {foes.map((f, i) => (
            <span key={i} className={`text-xs ${f.dead ? "text-emerald-400" : ""}`}>
              {f.dead ? "✕" : f.boss ? "👑" : "💀"}
            </span>
          ))}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setSpeed((s) => (s === 1 ? 2 : 1))}
            className="rounded-md border border-amber-800/60 bg-black/40 px-2 py-0.5 text-[11px] font-bold text-amber-300"
          >
            x{speed}
          </button>
          {!done && (
            <button
              onClick={() => setSkipped(true)}
              className="rounded-md border border-stone-700 bg-black/40 px-2 py-0.5 text-[11px] text-stone-400"
            >
              스킵
            </button>
          )}
        </div>
      </div>

      {/* 전투 스테이지 */}
      <div
        className={`relative h-60 shrink-0 overflow-hidden rounded-xl border border-amber-900/40 ${shaking ? "shake" : ""}`}
        style={{
          background:
            "linear-gradient(180deg,#3b1420 0%,#5e1f1a 34%,#7a3113 52%,#2b1030 78%,#150a20 100%)"
        }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-2/3 opacity-70"
          style={{
            background:
              "radial-gradient(60% 45% at 70% 20%, rgba(255,120,40,0.4), transparent 70%), radial-gradient(40% 35% at 20% 35%, rgba(255,60,60,0.25), transparent 70%)"
          }}
        />
        <div className="pointer-events-none absolute bottom-0 h-14 w-full bg-gradient-to-t from-black/70 to-transparent" />

        {banner && (
          <div
            key={banner.key}
            className={`banner-pop pointer-events-none absolute inset-x-0 top-8 z-40 text-center font-display text-4xl font-black ${banner.cls}`}
            style={{ textShadow: "0 3px 12px rgba(0,0,0,.8)" }}
          >
            {banner.text}
          </div>
        )}

        {/* 주인공 */}
        <div className={`absolute bottom-3 left-[7%] z-10 ${heroFx ? "lunge-r" : "float-y"}`}>
          <div className="relative">
            {nums
              .filter((n) => n.target === "hero")
              .map((n) => (
                <span key={n.id} className={`dmg ${n.cls}`}>
                  {n.text}
                </span>
              ))}
            <HeroArt size={84} dead={dead} />
            <div className="mx-auto -mt-1 h-1.5 w-16 rounded-full bg-black/50">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-emerald-600 transition-all duration-300"
                style={{ width: `${Math.max(0, (hp / stats.maxHp) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* 적들 */}
        {foes.map((f, i) => {
          const pos = FOE_POS[i] || FOE_POS[0];
          const charging = chargeFoe === i;
          return (
            <div
              key={`${floor}-${i}`}
              className={`absolute z-10 ${pos.className} ${f.dead ? "foe-die" : atkFoe === i ? "lunge-l" : "float-y"}`}
              style={{ scale: String(pos.scale * (f.boss ? 1.35 : 1)) }}
            >
              <div className={`relative ${hitFoe === i ? "hit-flash" : ""}`}>
                {nums
                  .filter((n) => n.target === i)
                  .map((n) => (
                    <span key={n.id} className={`dmg ${n.cls}`}>
                      {n.text}
                    </span>
                  ))}
                <div
                  className={`flex h-14 w-14 items-center justify-center overflow-hidden rounded-full text-3xl transition ${
                    f.boss
                      ? "bg-gradient-to-b from-red-500/40 to-red-950/60 shadow-[0_0_22px_rgba(239,68,68,0.7)] ring-2 ring-red-500"
                      : f.enraged
                        ? "bg-gradient-to-b from-red-700/50 to-black/60 shadow-[0_0_14px_rgba(239,68,68,0.6)] ring-2 ring-red-600"
                        : "bg-gradient-to-b from-red-900/40 to-black/50 ring-1 ring-red-800/70"
                  } ${charging ? "hit-flash" : ""}`}
                  style={
                    charging ? { boxShadow: "0 0 26px 6px rgba(255,80,80,0.8)" } : undefined
                  }
                >
                  <ArtImg id={f.art} fallback={f.icon} alt={f.name} />
                </div>
                {!f.dead && (
                  <>
                    <div className="mx-auto mt-1 h-1 w-12 rounded-full bg-black/50">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-red-400 to-red-700 transition-all duration-300"
                        style={{ width: `${Math.max(0, ((f.hp ?? f.max) / f.max) * 100)}%` }}
                      />
                    </div>
                    {f.weak && (
                      <div className="mt-0.5 text-center text-[9px] text-stone-400">
                        약점 {ELEMENT_INFO[f.weak].icon}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}

        {/* 전리품/이벤트 토스트 */}
        <div className="absolute bottom-2 left-2 z-20 max-w-[60%] space-y-1">
          {loots.map((l) => (
            <div
              key={l.id}
              className={`log-line truncate rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold ${l.cls}`}
            >
              {l.icon} {l.text}
            </div>
          ))}
        </div>

        {dead && (
          <div className="backdrop-in absolute inset-0 z-30 flex items-center justify-center bg-black/60">
            <span className="font-display text-2xl font-black text-red-400">
              — 환생의 어둠이 감싼다 —
            </span>
          </div>
        )}
      </div>

      {/* 플레이어 자원 바 */}
      <div className="mt-2 space-y-1.5 rounded-xl border border-white/5 bg-black/30 p-2.5">
        <div className="flex items-center gap-2">
          <span className="w-10 text-[10px] font-bold text-emerald-300">체력</span>
          <div className="bar bar-hp flex-1">
            <span style={{ width: `${Math.max(0, (hp / stats.maxHp) * 100)}%` }} />
          </div>
          <span className="w-14 text-right font-display text-[11px] font-bold text-emerald-200">
            {Math.max(0, hp)}/{Math.round(stats.maxHp)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-10 text-[10px] font-bold text-sky-300">정신력</span>
          <div className="bar bar-focus flex-1">
            <span style={{ width: `${Math.max(0, (focus / stats.maxFocus) * 100)}%` }} />
          </div>
          <span className="w-14 text-right font-display text-[11px] font-bold text-sky-200">
            {Math.max(0, focus)}/{Math.round(stats.maxFocus)}
          </span>
        </div>
      </div>

      {/* 스킬 아이콘 바 */}
      <div className="mt-2 flex justify-center gap-2.5">
        {loadoutSkills.map((id) => {
          const c = cardById(id);
          const casting = castSkill === id;
          return (
            <div
              key={id}
              className={`flex h-11 w-11 items-center justify-center rounded-full text-xl transition ${
                casting
                  ? "scale-110 bg-gradient-to-b from-amber-300/50 to-amber-800/40 shadow-[0_0_16px_rgba(240,199,94,0.8)] ring-2 ring-amber-400"
                  : "bg-gradient-to-b from-[#241c46] to-[#0f0a20] ring-1 ring-white/10"
              }`}
            >
              {c?.icon}
            </div>
          );
        })}
      </div>

      {/* 전투 로그 */}
      <div className="mt-2 min-h-0 flex-1 overflow-hidden rounded-xl border border-white/5 bg-black/30 px-3 py-2">
        {visibleLog.map((e, i) => (
          <p
            key={idx - visibleLog.length + i}
            className="log-line truncate text-[11px] leading-relaxed text-stone-400"
          >
            {e.message}
          </p>
        ))}
      </div>

      {/* 결과 / 환생 */}
      <div className="mt-2">
        {done ? (
          <div className="space-y-2">
            <div className="panel panel-ornate p-3 text-center">
              <div className="text-[11px] tracking-widest text-violet-300/80">— 원정 결과 —</div>
              <div className="mt-1 flex justify-center gap-4 font-display text-sm font-bold text-stone-200">
                <span>🏰 {result.floor}층</span>
                <span>⚔ {result.kills}</span>
                <span>🎁 {result.items.length}</span>
              </div>
              <div className="mt-1 font-display text-xl font-black text-gold-grad">
                환생 포인트 +{fmt(result.points)}
              </div>
            </div>
            <button
              onClick={onFinish}
              className="btn-gold w-full rounded-xl py-3 font-display text-base font-black"
            >
              환생한다
            </button>
          </div>
        ) : (
          <div className="py-1 text-center text-[10px] tracking-widest text-stone-600">
            자동 전투 진행 중…
          </div>
        )}
      </div>
    </div>
  );
}
