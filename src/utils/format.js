export function fmt(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return String(Math.round(n * 10) / 10);
}

// 표시용 전투력 지표
export function power(stats) {
  return Math.round(
    stats.maxHp + stats.attack * 15 + stats.focusRegen * 40 + stats.damageReduction * 25
  );
}
