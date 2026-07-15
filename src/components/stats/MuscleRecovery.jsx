import { C } from "../../constants/theme";
import Card from "../Card";
import { getMuscleRecovery } from "../../services/muscleRecovery";

const barColor = (pct) => (pct >= 100 ? C.success : pct >= 60 ? C.warning : C.danger);

const sinceLabel = (d) =>
  d === 0 ? "hoje" : d === 1 ? "há 1 dia" : `há ${d} dias`;

export default function MuscleRecovery({ sessions }) {
  const recovery = getMuscleRecovery(sessions);
  if (!recovery.length) return null;

  const ready = recovery.filter((r) => r.pct >= 100).length;

  return (
    <Card style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>Recuperação muscular</div>
        <div style={{ fontSize: 12, color: C.mut }}>
          {ready}/{recovery.length} prontos
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
        {recovery.map((r) => (
          <div key={r.muscle}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700 }}>{r.muscle}</div>
              <div style={{ fontSize: 11.5, color: C.mut }}>
                <span style={{ color: barColor(r.pct), fontWeight: 700 }}>{r.pct}%</span>
                {" · "}{sinceLabel(r.daysSince)}
              </div>
            </div>
            <div style={{ height: 6, borderRadius: 999, background: C.surface2, overflow: "hidden" }}>
              <div style={{
                width: `${r.pct}%`, height: "100%", borderRadius: 999,
                background: barColor(r.pct), transition: "width 300ms ease",
              }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: C.dim, marginTop: 10, lineHeight: 1.5 }}>
        Estimativa pelo tempo desde o último estímulo: grupos grandes ~72h, pequenos ~48h.
        Trabalho secundário conta metade.
      </div>
    </Card>
  );
}
