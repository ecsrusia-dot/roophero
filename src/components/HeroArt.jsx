import { useState } from "react";

// 후드를 쓴 회귀자.
// public/art/hero.png (generate-cards.mjs 로 생성)가 있으면 그 일러스트를,
// 없으면 핸드메이드 벡터 일러스트를 보여준다.
export default function HeroArt({ size = 80, dead = false }) {
  const [imgOk, setImgOk] = useState(true);
  if (imgOk) {
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-full bg-gradient-to-b from-amber-200 via-amber-500 to-amber-800 p-[2px] shadow-[0_0_16px_rgba(240,199,94,0.5)]"
      >
        <img
          src={`${import.meta.env.BASE_URL}art/hero.png`}
          alt="회귀자"
          draggable={false}
          onError={() => setImgOk(false)}
          className="h-full w-full rounded-full object-cover"
          style={dead ? { filter: "grayscale(1) brightness(0.55)" } : undefined}
        />
      </div>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={dead ? { filter: "grayscale(1) brightness(0.6)" } : undefined}
    >
      <defs>
        <radialGradient id="h-aura" cx="50%" cy="42%" r="55%">
          <stop offset="0%" stopColor="#f0c75e" stopOpacity="0.35" />
          <stop offset="70%" stopColor="#f0c75e" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#f0c75e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="h-cape" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3d2f6e" />
          <stop offset="60%" stopColor="#241c46" />
          <stop offset="100%" stopColor="#130e2a" />
        </linearGradient>
        <linearGradient id="h-hood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a3a85" />
          <stop offset="100%" stopColor="#2a2054" />
        </linearGradient>
        <linearGradient id="h-armor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#585f75" />
          <stop offset="45%" stopColor="#333a4e" />
          <stop offset="100%" stopColor="#1d2230" />
        </linearGradient>
        <linearGradient id="h-blade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#eef2ff" />
          <stop offset="50%" stopColor="#9aa8c8" />
          <stop offset="100%" stopColor="#5c6a8a" />
        </linearGradient>
        <filter id="h-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 오라 */}
      <circle cx="50" cy="50" r="48" fill="url(#h-aura)" />

      {/* 검 (등 뒤 대각선) */}
      <g transform="rotate(38 50 50)">
        <rect x="47.6" y="6" width="4.8" height="52" rx="2" fill="url(#h-blade)" />
        <rect x="42" y="55" width="16" height="3.6" rx="1.8" fill="#b8862d" />
        <rect x="47.6" y="58" width="4.8" height="10" rx="2" fill="#5a3d14" />
        <circle cx="50" cy="70" r="3" fill="#f0c75e" />
      </g>

      {/* 망토 */}
      <path
        d="M22 96 Q14 60 32 36 Q42 24 50 24 Q58 24 68 36 Q86 60 78 96 Z"
        fill="url(#h-cape)"
        stroke="#4a3a85"
        strokeWidth="1"
      />
      {/* 망토 안감 하이라이트 */}
      <path d="M30 96 Q26 66 38 46 Q34 70 36 96 Z" fill="#4a3a85" opacity="0.5" />
      <path d="M70 96 Q74 66 62 46 Q66 70 64 96 Z" fill="#4a3a85" opacity="0.5" />

      {/* 흉갑 */}
      <path
        d="M36 62 L50 54 L64 62 L61 92 L39 92 Z"
        fill="url(#h-armor)"
        stroke="#f0c75e"
        strokeWidth="1.1"
      />
      <path d="M50 56 L50 90" stroke="#f0c75e" strokeWidth="0.8" opacity="0.7" />
      <path d="M40 70 L60 70" stroke="#f0c75e" strokeWidth="0.6" opacity="0.5" />
      {/* 문장 */}
      <circle cx="50" cy="66" r="3.2" fill="none" stroke="#f0c75e" strokeWidth="1" />
      <circle cx="50" cy="66" r="1.1" fill="#f0c75e" />

      {/* 후드 */}
      <path
        d="M31 40 Q31 16 50 14 Q69 16 69 40 Q69 52 50 54 Q31 52 31 40 Z"
        fill="url(#h-hood)"
        stroke="#5b48a5"
        strokeWidth="1"
      />
      {/* 후드 그림자 속 얼굴 */}
      <path d="M36 40 Q36 24 50 22 Q64 24 64 40 Q64 49 50 50 Q36 49 36 40 Z" fill="#0d0a1c" />

      {/* 빛나는 눈 */}
      <g filter="url(#h-glow)">
        <path d="M41 38 L47 36.6 L46.2 39.8 Z" fill={dead ? "#666" : "#f0c75e"} />
        <path d="M59 38 L53 36.6 L53.8 39.8 Z" fill={dead ? "#666" : "#f0c75e"} />
      </g>

      {/* 후드 금장 테두리 */}
      <path
        d="M33 38 Q33 18 50 16 Q67 18 67 38"
        fill="none"
        stroke="#f0c75e"
        strokeWidth="1.2"
        opacity="0.85"
      />
    </svg>
  );
}
