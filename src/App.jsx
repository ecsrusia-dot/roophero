import { useEffect, useRef, useState } from "react";
import {
  LOADOUT_LIMITS,
  REALMS,
  realmCost,
  GACHA_COST,
  BLESSINGS,
  ACHIEVEMENTS,
  curseUnlocked
} from "./data.js";
import { simulateRun, computePlayerStats } from "./systems/battleSimulator.js";
import { pullOnce } from "./systems/gacha.js";
import { initStorage, loadSave, saveSave } from "./firebase.js";
import { power } from "./utils/format.js";
import { sfx, setMuted } from "./utils/sound.js";
import Hud from "./components/Hud.jsx";
import BottomNav from "./components/BottomNav.jsx";
import PrepareScreen from "./components/PrepareScreen.jsx";
import BattleScreen from "./components/BattleScreen.jsx";
import GachaScreen from "./components/GachaScreen.jsx";
import RealmScreen from "./components/RealmScreen.jsx";
import CollectionScreen from "./components/CollectionScreen.jsx";
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
  bestFloor: 0,
  curse: 0,
  soundOn: true,
  stats: { runs: 0, kills: 0, curse3Floor10: false },
  claimedAch: []
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
      const merged = data
        ? { ...NEW_SAVE, ...data, stats: { ...NEW_SAVE.stats, ...(data.stats || {}) } }
        : NEW_SAVE;
      setSave(merged);
      setMuted(!merged.soundOn);
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
  const maxCurse = curseUnlocked(save.bestFloor);
  const curse = Math.min(save.curse, maxCurse);

  const toggleLoadout = (category, cardId) => {
    sfx.click();
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
      sfx.drop();
      return {
        ...s,
        points: s.points - cost,
        realmLevels: { ...s.realmLevels, [realmId]: level + 1 }
      };
    });
  };

  const setCurse = (level) => {
    sfx.click();
    setSave((s) => ({ ...s, curse: level }));
  };

  // 출전 → 축복 3택1 → 시뮬레이션 시작
  const startRun = () => {
    sfx.click();
    const shuffled = [...BLESSINGS].sort(() => Math.random() - 0.5);
    setBlessingChoices(shuffled.slice(0, 3));
  };

  const beginWithBlessing = (blessingId) => {
    sfx.click();
    setBlessingChoices(null);
    setRun(simulateRun(loadoutIds, save.realmLevels, blessingId, curse));
    setScreen("battle");
  };

  const finishRun = (retry = false) => {
    const { floor, kills, points } = run.result;
    setSave((s) => ({
      ...s,
      points: s.points + points,
      bestFloor: Math.max(s.bestFloor, floor),
      stats: {
        ...s.stats,
        runs: s.stats.runs + 1,
        kills: s.stats.kills + kills,
        curse3Floor10: s.stats.curse3Floor10 || (curse >= 3 && floor >= 10)
      }
    }));
    setRun(null);
    setScreen("prepare");
    if (retry) startRun();
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
    if (results.length > 0) {
      setSave((s) => ({ ...s, points, collection }));
      if (results.some((r) => r.card.rarity === "legendary")) sfx.legendary();
      else sfx.gacha();
    }
    return results;
  };

  const claimAch = (achId) => {
    const ach = ACHIEVEMENTS.find((a) => a.id === achId);
    if (!ach || save.claimedAch.includes(achId) || !ach.check(save)) return;
    sfx.achievement();
    setSave((s) => ({
      ...s,
      points: s.points + ach.reward,
      claimedAch: [...s.claimedAch, achId]
    }));
  };

  const toggleSound = () => {
    setSave((s) => {
      setMuted(s.soundOn); // 토글 후 상태 기준
      return { ...s, soundOn: !s.soundOn };
    });
  };

  const cheapestRealm = Math.min(
    ...REALMS.map((r) => realmCost(r, save.realmLevels[r.id] || 0))
  );
  const hasClaimable = ACHIEVEMENTS.some(
    (a) => !save.claimedAch.includes(a.id) && a.check(save)
  );

  return (
    <div className="mx-auto min-h-dvh max-w-md">
      <Hud
        points={save.points}
        bestFloor={save.bestFloor}
        powerValue={power(stats)}
        storageMode={storageMode}
        soundOn={save.soundOn}
        onToggleSound={toggleSound}
      />

      <main className={screen === "battle" ? "" : "pb-16"}>
        {screen === "prepare" && (
          <PrepareScreen
            collection={save.collection}
            realmLevels={save.realmLevels}
            loadout={save.loadout}
            curse={curse}
            maxCurse={maxCurse}
            onSetCurse={setCurse}
            onToggle={toggleLoadout}
            onStart={startRun}
          />
        )}
        {screen === "battle" && run && (
          <BattleScreen
            run={run}
            curse={curse}
            loadoutSkills={save.loadout.skill}
            onFinish={() => finishRun(false)}
            onRetry={() => finishRun(true)}
          />
        )}
        {screen === "realm" && (
          <RealmScreen realmLevels={save.realmLevels} points={save.points} onBuyRealm={buyRealm} />
        )}
        {screen === "gacha" && (
          <GachaScreen points={save.points} collection={save.collection} onPull={pull} />
        )}
        {screen === "collection" && <CollectionScreen save={save} onClaim={claimAch} />}
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
          onChange={(id) => {
            sfx.click();
            setScreen(id);
          }}
          dots={{
            gacha: save.points >= GACHA_COST,
            realm: save.points >= cheapestRealm,
            collection: hasClaimable
          }}
        />
      )}
    </div>
  );
}
