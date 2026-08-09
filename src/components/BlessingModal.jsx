// 런 시작 전, 회랑이 내미는 세 가지 축복 중 하나를 고른다.
export default function BlessingModal({ blessings, onPick, onSkip }) {
  return (
    <div className="backdrop-in fixed inset-0 z-50 flex flex-col justify-center bg-black/85 px-5">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(60% 45% at 50% 25%, rgba(124,58,237,0.4), transparent 75%)"
        }}
      />
      <div className="relative mx-auto w-full max-w-md">
        <h2 className="text-center font-display text-xl font-black text-gold-grad">
          회랑의 축복
        </h2>
        <p className="mt-1 text-center text-[11px] text-violet-200/70">
          문 너머의 무언가가 세 갈래 길을 내민다. 하나만 취할 수 있다.
        </p>

        <div className="mt-5 space-y-3">
          {blessings.map((b, i) => (
            <button
              key={b.id}
              onClick={() => onPick(b.id)}
              className="reveal rframe rframe-legendary shine w-full text-left"
              style={{ animationDelay: `${i * 130}ms` }}
            >
              <div className="flex items-center gap-3 rounded-[calc(0.8rem-2px)] bg-gradient-to-b from-[#221a44] to-[#120c26] p-3.5 transition hover:from-[#2c2258]">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-amber-900/50 to-black/40 text-2xl ring-1 ring-amber-600/60">
                  {b.icon}
                </div>
                <div>
                  <div className="font-display text-sm font-black text-amber-200">{b.name}</div>
                  <div className="mt-0.5 text-[11px] leading-snug text-stone-300">
                    {b.description}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onSkip}
          className="mx-auto mt-5 block text-[11px] tracking-widest text-stone-500 underline-offset-4 hover:underline"
        >
          축복 없이 들어선다
        </button>
      </div>
    </div>
  );
}
