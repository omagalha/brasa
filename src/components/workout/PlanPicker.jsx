import { useState } from "react";
import { C } from "../../constants/theme";
import { EXERCISES_BY_ID } from "../../data/exercises";
import { WORKOUT_TEMPLATES } from "../../data/workoutTemplates";
import Card from "../Card";
import Btn from "../Btn";
import OverlayShell from "./OverlayShell";

export default function PlanPicker({ open, activePlanId, onClose, onApply }) {
  const [expanded, setExpanded] = useState(null);
  const [confirming, setConfirming] = useState(null);

  if (!open) return null;

  const close = () => {
    setExpanded(null);
    setConfirming(null);
    onClose();
  };

  return (
    <OverlayShell title="Treinos prontos" onClose={close}>
      <div style={{ overflowY: "auto", flex: 1, padding: "14px 18px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
        {WORKOUT_TEMPLATES.map((t) => {
          const isActive = activePlanId === t.id;
          const isOpen = expanded === t.id;
          return (
            <Card key={t.id} style={{ padding: 15 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.3 }}>{t.name}</div>
                <div style={{ fontSize: 11.5, color: C.dim, flexShrink: 0 }}>{t.level} · {t.frequency}x/semana</div>
              </div>
              <div style={{ fontSize: 13, color: C.mut, marginTop: 4 }}>{t.description}</div>
              <div style={{ marginTop: 8 }}>
                {Object.entries(t.workouts).map(([k, tw]) => (
                  <div key={k} style={{ fontSize: 12.5, color: C.mut, marginTop: 2 }}>
                    <span style={{ color: C.text, fontWeight: 700 }}>{k}</span> — {tw.label}
                    {isOpen && (
                      <div style={{ color: C.dim, fontSize: 12, margin: "2px 0 6px 14px" }}>
                        {tw.exercises.map((id) => EXERCISES_BY_ID[id]?.name || id).join(" · ")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <Btn small ghost onClick={() => setExpanded(isOpen ? null : t.id)} style={{ flex: 1 }}>
                  {isOpen ? "Ocultar exercícios" : "Ver exercícios"}
                </Btn>
                {isActive ? (
                  <Btn small ghost disabled style={{ flex: 1, color: C.success }}>Plano ativo</Btn>
                ) : confirming === t.id ? (
                  <Btn small onClick={() => { onApply(t); close(); }} style={{ flex: 1 }}>Substituir plano atual?</Btn>
                ) : (
                  <Btn small ghost onClick={() => setConfirming(t.id)} style={{ flex: 1, color: C.primary }}>Usar este treino</Btn>
                )}
              </div>
            </Card>
          );
        })}
        <div style={{ fontSize: 12, color: C.dim, textAlign: "center", marginTop: 4 }}>
          Aplicar um plano substitui seus treinos atuais. O histórico de sessões é mantido.
        </div>
      </div>
    </OverlayShell>
  );
}
