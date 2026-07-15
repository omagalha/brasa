import { C } from "../../constants/theme";
import { fromKey } from "../../utils/dates";
import OverlayShell from "./OverlayShell";

const fmtKg = (kg) => String(Math.round(kg * 2) / 2).replace(".", ",");

function Stat({ label, value }) {
  return (
    <div style={{
      flex: 1, background: C.surface, border: `1px solid ${C.line}`,
      borderRadius: 12, padding: "12px 10px", textAlign: "center",
    }}>
      <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.4 }}>{value}</div>
      <div style={{ fontSize: 11, color: C.dim, fontWeight: 600, marginTop: 3 }}>{label}</div>
    </div>
  );
}

export default function ExerciseHistory({ exercise, performances, records, onClose }) {
  if (!exercise) return null;
  const hasHistory = performances.length > 0;

  return (
    <OverlayShell title={exercise.name} onClose={onClose}>
      <div style={{ overflowY: "auto", flex: 1, padding: "14px 18px 24px" }}>
        {exercise.image && (
          <img src={exercise.image} alt={exercise.name} loading="lazy" style={{
            width: "100%", maxHeight: 180, objectFit: "cover",
            borderRadius: 12, marginBottom: 14, background: C.surface,
          }} />
        )}
        {!hasHistory && (
          <div style={{ color: C.mut, fontSize: 13.5, padding: "24px 0", textAlign: "center" }}>
            Nenhum registro ainda. Conclua um treino com este exercício para começar o histórico.
          </div>
        )}

        {hasHistory && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <Stat label="Recorde de carga" value={`${fmtKg(records.maxWeight)} kg`} />
              <Stat
                label="Melhor série"
                value={records.bestSet ? `${fmtKg(records.bestSet.kg)}×${records.bestSet.reps}` : "—"}
              />
              <Stat label="1RM estimado" value={`${fmtKg(records.estimatedOneRepMax)} kg`} />
            </div>

            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
              Últimas execuções
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {performances.map((p, i) => {
                const done = p.sets.filter((s) => s.done);
                const isPr =
                  records.bestSet &&
                  p.date === records.bestSet.date &&
                  done.some((s) => s.kg === records.bestSet.kg && s.reps === records.bestSet.reps);
                return (
                  <div key={`${p.date}-${i}`} style={{
                    padding: "11px 0", borderBottom: `1px solid ${C.line}`,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>
                        {fromKey(p.date).toLocaleDateString("pt-BR")}
                        <span style={{ color: C.dim, fontWeight: 600 }}> · Treino {p.split}</span>
                        {isPr && (
                          <span style={{
                            marginLeft: 6, fontSize: 10.5, fontWeight: 800,
                            color: C.warning, letterSpacing: 0.5,
                          }}>PR</span>
                        )}
                      </div>
                      <div style={{ fontSize: 11.5, color: C.dim }}>
                        {done.length}/{p.sets.length} séries
                      </div>
                    </div>
                    <div style={{ fontSize: 12.5, color: C.mut, marginTop: 4 }}>
                      {done.length
                        ? done.map((s) => `${fmtKg(s.kg)}×${s.reps}`).join(" · ")
                        : "nenhuma série concluída"}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </OverlayShell>
  );
}
