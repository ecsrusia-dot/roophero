import { useEffect, useRef, useState } from "react";
import { LOADOUT_LIMITS, REALMS, realmCost, GACHA_COST, BLESSINGS } from "./data.js";
import { simulateRun, computePlayerStats } from "./systems/battleSimulator.js";
import { pullOnce } from "./systems/gacha.js";
import { initStorage, loadSave, saveSave } from "./firebase.js";
import { power } from "./utils/format.js";
import Hud from "./components/Hud.jsx";
import BottomNav from "./components/BottomNav.jsx";
import PrepareScreen from "./components/PrepareScreen.jsx";
import BattleScreen from "./components/BattleScreen.jsx";
import GachaScreen from "./components/GachaScreen.jsx";
import RealmScreen from "./components/RealmScreen.jsx";
import BlessingModal from "./components/BlessingModal.jsx";

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

export default function App() {
  const [screen, setScreen] = useState("prepare");
  const [save, setSave] = useState(null);
  const [run, setRun] = useState(null);
  const [blessingChoices, setBlessingChoices] = useState(null);
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
      <div className="flex h-dvh flex-col items-center justify-center gap-3">
        <div className="orb flex h-16 w-16 items-center justify-center rounded-full text-2xl text-white/90">
          ✦
        </div>
        <span className="text-xs tracking-widest text-violet-300/70">
          회랑의 문을 여는 중…
        </span>
      </div>
    );
  }

  const withLevels = (ids) => ids.map((id) => ({ id, level: save.collection[id]?.level || 1 }));
  const loadoutIds = {
    skill: withLevels(save.loadout.skill),
    equipment: withLevels(save.loadout.equipment),
    companion: withLevels(save.loadout.companion)
  };
  const stats = computePlayerStats(loadoutIds, save.realmLevels);

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

  // 출전 → 축복 3택1 → 시뮬레이션 시작
  const startRun = () => {
    const shuffled = [...BLESSINGS].sort(() => Math.random() - 0.5);
    setBlessingChoices(shuffled.slice(0, 3));
  };

  const beginWithBlessing = (blessingId) => {
    setBlessingChoices(null);
    setRun(simulateRun(loadoutIds, save.realmLevels, blessingId));
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

  const cheapestRealm = Math.min(
    ...REALMS.map((r) => realmCost(r, save.realmLevels[r.id] || 0))
  );

  return (
    <div className="mx-auto min-h-dvh max-w-md">
      <Hud
        points={save.points}
        bestFloor={save.bestFloor}
        powerValue={power(stats)}
        storageMode={storageMode}
      />

      <main className={screen === "battle" ? "" : "pb-16"}>
        {screen === "prepare" && (
          <PrepareScreen
            collection={save.collection}
            realmLevels={save.realmLevels}
            loadout={save.loadout}
            onToggle={toggleLoadout}
            onStart={startRun}
          />
        )}
        {screen === "battle" && run && (
          <BattleScreen run={run} loadoutSkills={save.loadout.skill} onFinish={finishRun} />
        )}
        {screen === "realm" && (
          <RealmScreen realmLevels={save.realmLevels} points={save.points} onBuyRealm={buyRealm} />
        )}
        {screen === "gacha" && (
          <GachaScreen points={save.points} collection={save.collection} onPull={pull} />
        )}
      </main>

      {blessingChoices && (
        <BlessingModal
          blessings={blessingChoices}
          onPick={beginWithBlessing}
          onSkip={() => beginWithBlessing(null)}
        />
      )}

      {screen !== "battle" && (
        <BottomNav
          screen={screen}
          onChange={setScreen}
          dots={{
            gacha: save.points >= GACHA_COST,
            realm: save.points >= cheapestRealm
          }}
        />
      )}
    </div>
  );
}
