import { C } from "../../constants/theme";
import { inp } from "../../utils/styles";

export default function ExerciseSetRow({
  index, set, isNext, canUndo, onToggle, onChangeKg, onChangeReps,
}) {
  return (
    <div style={{
      display: "flex", gap: 8, alignItems: "center",
      opacity: !set.done && !isNext ? 0.45 : 1,
    }}>
      <button type="button" onClick={onToggle} style={{
        width: 34, height: 34, borderRadius: 9, flexShrink: 0,
        cursor: isNext || canUndo ? "pointer" : "default",
        background: set.done ? C.success : isNext ? C.primarySoft : C.surface2,
        color: set.done ? "#08110B" : isNext ? C.primary : C.dim,
        border: `1px solid ${set.done ? C.success : isNext ? C.primary : C.line}`,
        fontWeight: 800, fontSize: 13,
      }}>{set.done ? "✓" : index + 1}</button>
      <input inputMode="decimal" value={set.kg} onChange={(e) => onChangeKg(e.target.value)}
        style={inp({ width: 64, textAlign: "center", padding: "7px 4px" })} />
      <span style={{ fontSize: 11, color: C.dim, fontWeight: 600 }}>kg</span>
      <input inputMode="numeric" value={set.reps} onChange={(e) => onChangeReps(e.target.value)}
        style={inp({ width: 56, textAlign: "center", padding: "7px 4px" })} />
      <span style={{ fontSize: 11, color: C.dim, fontWeight: 600 }}>reps</span>
    </div>
  );
}
