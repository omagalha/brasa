import { C } from "../../constants/theme";
import Card from "../Card";
import { getHeatmapWeeks, getWeeklyVolumes } from "../../services/workoutStats";

const LEVEL_COLORS = [
  "rgba(255,255,255,0.05)",
  "rgba(255,90,31,0.22)",
  "rgba(255,90,31,0.42)",
  "rgba(255,90,31,0.68)",
  "#FF5A1F",
];

const fmtVol = (v) =>
  v >= 1000 ? `${(v / 1000).toFixed(1).replace(".", ",")}k` : String(Math.round(v));

export function TrainingHeatmap({ sessions }) {
  const grid = getHeatmapWeeks(sessions, { weeks: 12 });
  const trained = sessions.length;
  return (
    <Card style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>Frequência</div>
        <div style={{ fontSize: 12, color: C.mut }}>{trained} treinos registrados</div>
      </div>
      <div style={{ display: "flex", gap: 3, marginTop: 12, justifyContent: "space-between" }}>
        {grid.map((week, w) => (
          <div key={w} style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
            {week.map((day) => (
              <div key={day.key} title={day.key} style={{
                width: "100%", aspectRatio: "1", borderRadius: 3,
                background: day.future ? "transparent" : LEVEL_COLORS[day.level],
              }} />
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 10, justifyContent: "flex-end" }}>
        <span style={{ fontSize: 10.5, color: C.dim }}>menos</span>
        {LEVEL_COLORS.map((c, i) => (
          <div key={i} style={{ width: 9, height: 9, borderRadius: 2, background: c }} />
        ))}
        <span style={{ fontSize: 10.5, color: C.dim }}>mais</span>
      </div>
    </Card>
  );
}

export function WeeklyVolume({ sessions }) {
  const weeks = getWeeklyVolumes(sessions, { weeks: 8 });
  const max = Math.max(1, ...weeks.map((w) => w.volume));
  const current = weeks[weeks.length - 1];
  return (
    <Card style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>Volume semanal</div>
        <div style={{ fontSize: 12, color: C.mut }}>
          esta semana: <span style={{ color: C.text, fontWeight: 700 }}>{fmtVol(current.volume)} kg</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 96, marginTop: 12 }}>
        {weeks.map((w, i) => {
          const isCurrent = i === weeks.length - 1;
          return (
            <div key={w.startKey} style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", gap: 4, height: "100%", justifyContent: "flex-end",
            }}>
              {w.volume > 0 && (
                <div style={{ fontSize: 9.5, color: C.dim, fontWeight: 600 }}>{fmtVol(w.volume)}</div>
              )}
              <div style={{
                width: "100%", borderRadius: 5,
                height: `${Math.max(3, (w.volume / max) * 100)}%`,
                background: isCurrent ? C.primary : "rgba(255,90,31,0.35)",
              }} />
              <div style={{ fontSize: 9.5, color: isCurrent ? C.primary : C.dim, fontWeight: 600 }}>
                {w.label}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default function TrainingStats({ sessions }) {
  if (!sessions.length) return null;
  return (
    <>
      <TrainingHeatmap sessions={sessions} />
      <WeeklyVolume sessions={sessions} />
    </>
  );
}
