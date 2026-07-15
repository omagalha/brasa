import { C } from "../../constants/theme";
import Card from "../Card";
import ExerciseSetRow from "./ExerciseSetRow";

const fmtKg = (kg) => String(kg).replace(".", ",");

export default function ExerciseCard({
  exercise, sets, lastPerformance, suggestion, onApplySuggestion, onOpenHistory, onToggleSet, onChangeSet,
}) {
  const done = sets.filter((s) => s.done).length;
  return (
    <Card style={{ padding: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <button type="button" onClick={onOpenHistory} style={{
          background: "none", border: 0, padding: 0, textAlign: "left", cursor: "pointer",
          color: C.text, fontSize: 15, fontWeight: 700, letterSpacing: -0.2, fontFamily: "inherit",
        }}>
          {exercise.name} <span style={{ color: C.dim, fontWeight: 600 }}>›</span>
        </button>
        <div style={{ fontSize: 12, color: C.dim }}>meta {exercise.sets}×{exercise.reps}</div>
      </div>
      {lastPerformance && (
        <div style={{ fontSize: 12, color: C.mut, marginTop: 3 }}>
          Último: {lastPerformance.map((s) => `${s.kg}kg×${s.reps}`).join(" · ")}
        </div>
      )}
      {suggestion && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8, marginTop: 8,
          padding: "8px 10px", borderRadius: 9,
          background: suggestion.action === "deload" ? "rgba(244,183,64,0.10)" : C.primarySoft,
        }}>
          <div style={{ flex: 1, fontSize: 12, color: C.mut, lineHeight: 1.4 }}>
            <span style={{
              fontWeight: 800,
              color: suggestion.action === "deload" ? C.warning : C.primary,
            }}>
              {suggestion.action === "increase" && `↑ ${fmtKg(suggestion.suggestedKg)} kg`}
              {suggestion.action === "deload" && `↓ ${fmtKg(suggestion.suggestedKg)} kg`}
              {suggestion.action === "reps" && "↑ +1 rep por série"}
            </span>
            {" · "}{suggestion.reason}
          </div>
          {suggestion.action !== "reps" && (
            <button type="button" onClick={() => onApplySuggestion(suggestion.suggestedKg)} style={{
              border: 0, background: "transparent", padding: "4px 6px",
              color: suggestion.action === "deload" ? C.warning : C.primary,
              fontSize: 12.5, fontWeight: 800, cursor: "pointer", flexShrink: 0,
            }}>Aplicar</button>
          )}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
        {sets.map((s, i) => (
          <ExerciseSetRow
            key={i}
            index={i}
            set={s}
            isNext={i === done && !s.done}
            canUndo={s.done && i === done - 1}
            onToggle={() => onToggleSet(i)}
            onChangeKg={(v) => onChangeSet(i, "kg", v)}
            onChangeReps={(v) => onChangeSet(i, "reps", v)}
          />
        ))}
      </div>
    </Card>
  );
}
