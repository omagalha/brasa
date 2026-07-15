import { useId } from "react";
import { C } from "../constants/theme";

export default function WeightChart({ weights }) {
  const gradientId = useId();
  if (weights.length < 2) return <div style={{ height: 8 }} />;
  const W = 320, H = 90, pad = 6;
  const visible = weights.slice(-12);
  const kgs = visible.map((item) => item.kg);
  const min = Math.min(...kgs) - 0.5;
  const max = Math.max(...kgs) + 0.5;
  const range = Math.max(1, max - min);
  const x = (i) => pad + (i / Math.max(1, visible.length - 1)) * (W - pad * 2);
  const y = (kg) => H - pad - ((kg - min) / range) * (H - pad * 2);
  const path = visible.map((w, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(w.kg).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} aria-label="Gráfico de evolução do peso" style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={C.primary} />
          <stop offset="100%" stopColor="#FF8A5B" />
        </linearGradient>
      </defs>
      <path d={path} fill="none" stroke={`url(#${gradientId})`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {visible.map((w, i) => {
        const last = i === visible.length - 1;
        return <circle key={`${w.date}-${i}`} cx={x(i)} cy={y(w.kg)} r={last ? 4 : 2.5} fill={last ? C.warning : C.primary} />;
      })}
    </svg>
  );
}
