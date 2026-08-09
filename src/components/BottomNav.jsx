const TABS = [
  { id: "prepare", label: "출전", icon: "⚔️" },
  { id: "realm", label: "경지", icon: "👑" },
  { id: "gacha", label: "소환", icon: "🔮" }
];

export default function BottomNav({ screen, onChange, dots = {} }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-amber-900/40 bg-[#0a0716]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <div className="mx-auto grid max-w-md grid-cols-3">
        {TABS.map((tab) => {
          const active = screen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="relative flex flex-col items-center gap-0.5 py-2.5"
            >
              <span
                className={`relative flex h-9 w-9 items-center justify-center rounded-full text-lg transition ${
                  active
                    ? "bg-gradient-to-b from-amber-300/30 to-amber-700/20 shadow-[0_0_14px_rgba(240,199,94,0.4)] ring-1 ring-amber-500/60"
                    : "opacity-55 grayscale-[0.4]"
                }`}
              >
                {tab.icon}
                {dots[tab.id] && (
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.9)]" />
                )}
              </span>
              <span
                className={`font-display text-[11px] font-bold ${
                  active ? "text-gold-grad" : "text-stone-500"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
