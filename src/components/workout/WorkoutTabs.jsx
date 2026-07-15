import { C } from "../../constants/theme";

export default function WorkoutTabs({ letters, selected, todaySplit, onSelect }) {
  return (
    <div style={{
      display: "flex", gap: 4, background: C.surface, padding: 4,
      borderRadius: 12, border: `1px solid ${C.line}`, marginBottom: 20,
    }}>
      {letters.map((k) => {
        const active = selected === k;
        return (
          <button key={k} type="button" onClick={() => onSelect(k)} style={{
            flex: 1, height: 42, border: 0, borderRadius: 9,
            background: active ? C.elevated : "transparent",
            color: active ? C.text : C.dim,
            fontSize: 14, fontWeight: 700, cursor: "pointer",
            boxShadow: active
              ? "0 1px 3px rgba(0,0,0,0.3)"
              : k === todaySplit
              ? `inset 0 0 0 1px ${C.primary}`
              : "none",
          }}>Treino {k}</button>
        );
      })}
    </div>
  );
}
