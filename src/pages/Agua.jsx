import { C } from "../constants/theme";
import { dkey } from "../utils/dates";
import Card from "../components/Card";
import Btn from "../components/Btn";
import Eyebrow from "../components/Eyebrow";
import Ring from "../components/Ring";

export default function Agua({ core, upCore, today, waterToday }) {
  const add = (ml) =>
    upCore((c) => {
      c.waterByDay[today] = Math.max(0, (c.waterByDay[today] || 0) + ml);
      return c;
    });
  const pct = waterToday / core.waterGoal;

  // últimos 7 dias
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000);
    const k = dkey(d);
    return { k, label: d.toLocaleDateString("pt-BR", { weekday: "short" }).slice(0, 3), ml: core.waterByDay[k] || 0 };
  });
  const maxMl = Math.max(core.waterGoal, ...days.map((d) => d.ml));

  return (
    <div>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: -0.6 }}>Hidratação</h1>
      <div style={{ color: C.mut, fontSize: 13, margin: "4px 0 18px" }}>Meta diária de {(core.waterGoal / 1000).toFixed(1)} litros</div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <Ring pct={pct} size={170} stroke={14}>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>{(waterToday / 1000).toFixed(2)}L</div>
          <div style={{ fontSize: 12, color: C.mut, fontWeight: 700 }}>
            {pct >= 1 ? "meta batida" : `${Math.round(pct * 100)}% da meta`}
          </div>
        </Ring>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <Btn onClick={() => add(250)} style={{ flex: 1 }}>+250ml</Btn>
        <Btn onClick={() => add(500)} style={{ flex: 1 }}>+500ml</Btn>
        <Btn ghost onClick={() => add(-250)} style={{ flex: 0.6 }}>−250</Btn>
      </div>

      <Card style={{ marginTop: 8 }}>
        <Eyebrow>Últimos 7 dias</Eyebrow>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 110, marginTop: 8 }}>
          {days.map((d) => (
            <div key={d.k} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, height: "100%", justifyContent: "flex-end" }}>
              <div style={{
                width: "100%", borderRadius: 6,
                height: `${Math.max(4, (d.ml / maxMl) * 100)}%`,
                background: d.ml >= core.waterGoal ? GRAD : C.panel2,
                border: d.ml >= core.waterGoal ? "none" : `1px solid ${C.line}`,
              }} />
              <div style={{ fontSize: 10, color: d.k === today ? C.ember2 : C.dim, fontWeight: 700 }}>{d.label}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 13.5, color: C.mut, fontWeight: 600 }}>Meta diária</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Btn small ghost onClick={() => upCore((c) => { c.waterGoal = Math.max(1000, c.waterGoal - 250); return c; })}>−</Btn>
          <div style={{ fontWeight: 800, minWidth: 52, textAlign: "center" }}>{(core.waterGoal / 1000).toFixed(2)}L</div>
          <Btn small ghost onClick={() => upCore((c) => { c.waterGoal = Math.min(6000, c.waterGoal + 250); return c; })}>+</Btn>
        </div>
      </Card>
    </div>
  );
}
