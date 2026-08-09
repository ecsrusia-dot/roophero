import { useEffect, useRef, useState } from "react";

const TYPE_STYLE = {
  run_start: "text-stone-300 italic",
  floor_start: "text-amber-300 font-semibold",
  floor_clear: "text-emerald-400",
  skill: "text-sky-300",
  attack: "text-stone-300",
  companion: "text-violet-300",
  enemy_attack: "text-red-400",
  kill: "text-emerald-300",
  drop: "text-amber-200",
  death: "text-red-500 font-bold",
  reward: "text-amber-300 font-bold"
};

const REPLAY_INTERVAL = 220; // ms, 로그 한 줄 재생 간격

export default function BattleScreen({ run, onFinish }) {
  const { log, result } = run;
  const [count, setCount] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const scrollRef = useRef(null);

  const done = count >= log.length;

  useEffect(() => {
    if (done || skipped) return;
    const t = setTimeout(() => setCount((c) => c + 1), REPLAY_INTERVAL);
    return () => clearTimeout(t);
  }, [count, done, skipped]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [count, skipped]);

  const visible = skipped ? log : log.slice(0, count);
  const latest = visible[visible.length - 1];

  return (
    <div className="flex h-[calc(100dvh-7.5rem)] flex-col">
      <div className="mb-2 flex items-center justify-between rounded-lg border border-stone-700 bg-stone-900 px-3 py-2 text-sm">
        <span className="text-amber-300">{latest ? `${latest.floor}층` : "—"}</span>
        <span className={latest && latest.hp <= 15 ? "text-red-400" : "text-emerald-300"}>
          체력 {latest ? latest.hp : "—"}
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-lg border border-stone-800 bg-stone-950 p-3 text-[13px] leading-relaxed"
      >
        {visible.map((e, i) => (
          <p key={i} className={`log-line ${TYPE_STYLE[e.type] || "text-stone-400"}`}>
            {e.message}
          </p>
        ))}
      </div>

      <div className="mt-3 space-y-2">
        {(done || skipped) && (
          <div className="rounded-lg border border-amber-800 bg-amber-950/40 p-3 text-center text-sm text-amber-200">
            도달 {result.floor}층 · 처치 {result.kills} · 전리품 {result.items.length}개
            <div className="mt-1 text-lg font-bold">환생 포인트 +{result.points}</div>
          </div>
        )}
        {done || skipped ? (
          <button
            onClick={onFinish}
            className="w-full rounded-xl bg-amber-900 py-3 font-bold text-amber-100 transition hover:bg-amber-800"
          >
            환생한다
          </button>
        ) : (
          <button
            onClick={() => setSkipped(true)}
            className="w-full rounded-xl border border-stone-700 py-2 text-sm text-stone-400 transition hover:bg-stone-900"
          >
            결과 바로 보기
          </button>
        )}
      </div>
    </div>
  );
}
