import { C } from "../../constants/theme";
import { inp } from "../../utils/styles";
import Card from "../Card";

export default function ExerciseEditor({
  exercise, index, count, pendingRemove,
  onRename, onChangeField, onMove, onRequestRemove, onConfirmRemove,
}) {
  return (
    <Card style={{ padding: 14 }}>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, flexShrink: 0 }}>
          <button type="button" aria-label="Mover para cima" onClick={() => onMove(-1)} disabled={index === 0} style={{
            width: 26, height: 18, border: 0, background: "transparent",
            color: index === 0 ? C.line : C.mut, cursor: "pointer", fontSize: 11, padding: 0,
          }}>▲</button>
          <button type="button" aria-label="Mover para baixo" onClick={() => onMove(1)} disabled={index === count - 1} style={{
            width: 26, height: 18, border: 0, background: "transparent",
            color: index === count - 1 ? C.line : C.mut, cursor: "pointer", fontSize: 11, padding: 0,
          }}>▼</button>
        </div>
        <input value={exercise.name} onChange={(e) => onRename(e.target.value)} style={inp({ flex: 1, minWidth: 0 })} />
        {pendingRemove ? (
          <button type="button" onClick={onConfirmRemove} style={{
            height: 36, padding: "0 12px", borderRadius: 9, border: `1px solid ${C.danger}`,
            background: "rgba(243,91,91,0.12)", color: C.danger,
            fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0,
          }}>Excluir?</button>
        ) : (
          <button type="button" aria-label={`Excluir ${exercise.name}`} onClick={onRequestRemove} style={{
            width: 36, height: 36, display: "grid", placeItems: "center",
            background: "transparent", border: 0, color: C.danger,
            fontSize: 18, cursor: "pointer", flexShrink: 0,
          }}>✕</button>
        )}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        {[["sets", "séries"], ["reps", "reps"], ["kg", "kg padrão"]].map(([f, l]) => (
          <div key={f} style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: C.dim, fontWeight: 600, marginBottom: 4 }}>{l}</div>
            <input type="number" value={exercise[f]} onChange={(e) => onChangeField(f, e.target.value)} style={inp({ width: "100%" })} />
          </div>
        ))}
      </div>
    </Card>
  );
}
