import { C } from "../../constants/theme";
import Card from "../Card";
import Btn from "../Btn";

export default function RestTimer({ seconds, paused, onAdd, onPause, onSkip }) {
  if (seconds <= 0) return null;
  return (
    <Card style={{
      marginBottom: 12, background: C.surface2, border: `1px solid ${C.lineStrong}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div>
        <div style={{ fontSize: 12, color: C.mut, fontWeight: 600, marginBottom: 3 }}>Descanso</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: C.primary, fontVariantNumeric: "tabular-nums" }}>
          {String(Math.floor(seconds / 60))}:{String(seconds % 60).padStart(2, "0")}
          {paused ? " · pausado" : ""}
        </div>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <Btn small ghost onClick={onAdd}>+30s</Btn>
        <Btn small ghost onClick={onPause}>{paused ? "Retomar" : "Pausar"}</Btn>
        <Btn small ghost onClick={onSkip}>Pular</Btn>
      </div>
    </Card>
  );
}
