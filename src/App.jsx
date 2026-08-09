import { useEffect, useRef, useState } from "react";
import { LOADOUT_LIMITS } from "./data.js";
import { REALMS, realmCost } from "./data.js";
import { simulateRun } from "./systems/battleSimulator.js";
import { pullOnce } from "./systems/gacha.js";
import { initStorage, loadSave, saveSave } from "./firebase.js";
import PrepareScreen from "./components/PrepareScreen.jsx";
import BattleScreen from "./components/BattleScreen.jsx";
import GachaScreen from "./components/GachaScreen.jsx";

// 첫 환생자에게 주어지는 것들: 몸에 밴 검격 하나, 낡은 갑옷 한 벌, 약간의 포인트
const NEW_SAVE = {
  points: 300,
  collection: {
    skill_001: { level: 1, shards: 0 },
    equip_001: { level: 1, shards: 0 }
  },
  realmLevels: {},
  loadout: { skill: ["skill_001"], equipment: ["equip_001"], companion: [] },
  bestFloor: 0
};

const TABS = [
  { id: "prepare", label: "출전 준비" },
  { id: "gacha", label: "소환 제단" }
];

export default function App() {
  const [screen, setScreen] = useState("prepare");
  const [save, setSave] = useState(null);
  const [run, setRun] = useState(null);
  const [storageMode, setStorageMode] = useState("local");
  const loaded = useRef(false);

  // 최초 로드: 저장소 초기화 후 세이브 불러오기
  useEffect(() => {
    (async () => {
      const { mode } = await initStorage();
      setStorageMode(mode);
      const data = await loadSave();
      setSave(data ? { ...NEW_SAVE, ...data } : NEW_SAVE);
      loaded.current = true;
    })();
  }, []);

  // 세이브 변경 시 자동 저장
  useEffect(() => {
    if (!loaded.current || !save) return;
    saveSave(save).catch((e) => console.warn("저장 실패:", e));
  }, [save]);

  if (!save) {
    return (
      <div className="flex h-dvh items-center justify-center text-stone-500">
        회랑의 문을 여는 중…
      </div>
    );
  }

  const toggleLoadout = (category, cardId) => {
    setSave((s) => {
      const cur = s.loadout[category];
      const next = cur.includes(cardId)
        ? cur.filter((id) => id !== cardId)
        : cur.length < LOADOUT_LIMITS[category]
          ? [...cur, cardId]
          : cur;
      return { ...s, loadout: { ...s.loadout, [category]: next } };
    });
  };

  const buyRealm = (realmId) => {
    setSave((s) => {
      const realm = REALMS.find((r) => r.id === realmId);
      const level = s.realmLevels[realmId] || 0;
      const cost = realmCost(realm, level);
      if (s.points < cost) return s;
      return {
        ...s,
        points: s.points - cost,
        realmLevels: { ...s.realmLevels, [realmId]: level + 1 }
      };
    });
  };

  const startRun = () => {
    const withLevels = (ids) =>
      ids.map((id) => ({ id, level: save.collection[id]?.level || 1 }));
    const result = simulateRun(
      {
        skill: withLevels(save.loadout.skill),
        equipment: withLevels(save.loadout.equipment),
        companion: withLevels(save.loadout.companion)
      },
      save.realmLevels
    );
    setRun(result);
    setScreen("battle");
  };

  const finishRun = () => {
    setSave((s) => ({
      ...s,
      points: s.points + run.result.points,
      bestFloor: Math.max(s.bestFloor, run.result.floor)
    }));
    setRun(null);
    setScreen("prepare");
  };

  const pull = (times) => {
    const results = [];
    let { points, collection } = save;
    for (let i = 0; i < times; i++) {
      const r = pullOnce(points, collection);
      if (!r) break;
      results.push(r);
      points = r.points;
      collection = r.collection;
    }
    if (results.length > 0) setSave((s) => ({ ...s, points, collection }));
    return results;
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col px-4">
      <header className="flex items-center justify-between py-4">
        <div>
          <h1 className="font-bold text-stone-100">끝없는 회랑</h1>
          <p className="text-[11px] text-stone-600">
            최고 기록 {save.bestFloor}층 · 저장 {storageMode === "firebase" ? "클라우드" : "이 기기"}
          </p>
        </div>
        <div className="rounded-lg border border-amber-900 bg-amber-950/40 px-3 py-1.5 text-sm font-bold text-amber-300">
          {save.points.toLocaleString()}P
        </div>
      </header>

      <main className="flex-1">
        {screen === "prepare" && (
          <PrepareScreen
            collection={save.collection}
            realmLevels={save.realmLevels}
            points={save.points}
            loadout={save.loadout}
            onToggle={toggleLoadout}
            onBuyRealm={buyRealm}
            onStart={startRun}
          />
        )}
        {screen === "battle" && run && <BattleScreen run={run} onFinish={finishRun} />}
        {screen === "gacha" && (
          <GachaScreen points={save.points} collection={save.collection} onPull={pull} />
        )}
      </main>

      {screen !== "battle" && (
        <nav className="fixed inset-x-0 bottom-0 border-t border-stone-800 bg-stone-950/95 backdrop-blur">
          <div className="mx-auto grid max-w-md grid-cols-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setScreen(tab.id)}
                className={`py-3.5 text-sm font-semibold transition ${
                  screen === tab.id ? "text-amber-300" : "text-stone-500"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
