import { useState } from "react";

// public/art/<id>.png 가 있으면 이미지를, 없으면 폴백(이모지)을 보여준다.
// 아트는 scripts/generate-cards.mjs 로 생성한다.
export default function ArtImg({ id, fallback, className = "", alt = "" }) {
  const [failed, setFailed] = useState(false);
  if (failed || !id) return <>{fallback}</>;
  return (
    <img
      src={`${import.meta.env.BASE_URL}art/${id}.png`}
      alt={alt}
      draggable={false}
      onError={() => setFailed(true)}
      className={`h-full w-full object-cover ${className}`}
      style={{ imageRendering: "pixelated" }}
    />
  );
}
