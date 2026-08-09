import { fmt } from "../utils/format.js";
import HeroArt from "./HeroArt.jsx";

export default function Hud({ points, bestFloor, powerValue, storageMode }) {
  return (
    <header className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2.5">
        <div className="relative h-11 w-11 shrink-0 rounded-full bg-gradient-to-b from-amber-200 via-amber-500 to-amber-800 p-[2px] shadow-[0_0_12px_rgba(240,199,94,0.45)]">
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#171233]">
            <HeroArt size={38} />
          </div>
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#0d0a1c] px-1 text-[9px] font-bold text-amber-300 ring-1 ring-amber-700">
            {bestFloor}층
          </span>
        </div>
        <div>
          <div className="font-display text-sm font-black tracking-wide text-gold-grad">
            끝없는 회랑
          </div>
          <div className="flex items-center gap-1 text-[10px] text-violet-300/80">
            <span className="text-amber-400">🗡</span> 전투력 {fmt(powerValue)}
            <span className="ml-1 text-[9px] text-stone-500">
              {storageMode === "firebase" ? "☁" : "📱"}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 rounded-full border border-amber-700/60 bg-gradient-to-b from-[#241a3f] to-[#120c26] px-3 py-1.5 shadow-[0_0_10px_rgba(240,199,94,0.25)]">
        <span className="text-sm">💎</span>
        <span className="font-display text-sm font-black text-gold-grad">{fmt(points)}</span>
      </div>
    </header>
  );
}
