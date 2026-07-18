import { useState } from "react";
import { C } from "../../constants/theme";
import { EXERCISES_BY_ID } from "../../data/exercises";
import { WORKOUT_TEMPLATES } from "../../data/workoutTemplates";
import Card from "../Card";
import Btn from "../Btn";

export default function PlanList({
  activePlanId = null,
  onApply,
  confirmApply = true,
  showBlank = false,
  onBuildBlank,
}) {
  const [expanded, setExpanded] = useState(null);
  const [confirming, setConfirming] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {WORKOUT_TEMPLATES.map((template) => {
        const isActive = activePlanId === template.id;
        const isOpen = expanded === template.id;
        const needsConfirmation = confirmApply && confirming !== template.id;
        return (
          <Card key={template.id} style={{ padding: 15 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
              <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.3 }}>
                {template.name}
              </div>
              <div style={{ fontSize: 11.5, color: C.dim, flexShrink: 0 }}>
                {template.level} · {template.frequency}x/semana
              </div>
            </div>
            <div style={{ fontSize: 13, color: C.mut, marginTop: 4 }}>
              {template.description}
            </div>
            <div style={{ marginTop: 8 }}>
              {Object.entries(template.workouts).map(([key, workout]) => (
                <div key={key} style={{ fontSize: 12.5, color: C.mut, marginTop: 2 }}>
                  <span style={{ color: C.text, fontWeight: 700 }}>{key}</span> — {workout.label}
                  {isOpen && (
                    <div style={{ color: C.dim, fontSize: 12, margin: "2px 0 6px 14px" }}>
                      {workout.exercises
                        .map((id) => EXERCISES_BY_ID[id]?.name || id)
                        .join(" · ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <Btn
                small
                ghost
                onClick={() => setExpanded(isOpen ? null : template.id)}
                style={{ flex: 1 }}
              >
                {isOpen ? "Ocultar exercícios" : "Ver exercícios"}
              </Btn>
              {isActive && confirmApply ? (
                <Btn small ghost disabled style={{ flex: 1, color: C.success }}>
                  Plano ativo
                </Btn>
              ) : needsConfirmation ? (
                <Btn
                  small
                  ghost
                  onClick={() => setConfirming(template.id)}
                  style={{ flex: 1, color: C.primary }}
                >
                  Usar este plano
                </Btn>
              ) : (
                <Btn
                  small
                  onClick={() => {
                    onApply(template);
                    setConfirming(null);
                  }}
                  style={{ flex: 1 }}
                >
                  {confirmApply ? "Substituir plano atual?" : "Escolher plano"}
                </Btn>
              )}
            </div>
          </Card>
        );
      })}

      {showBlank && (
        <Card style={{ padding: 15, borderColor: C.lineStrong }}>
          <div style={{ fontSize: 15, fontWeight: 800 }}>Montar do zero</div>
          <div style={{ color: C.mut, fontSize: 13, lineHeight: 1.45, marginTop: 4 }}>
            Comece com um treino vazio e adicione apenas os exercícios que quiser.
          </div>
          <Btn ghost onClick={onBuildBlank} style={{ width: "100%", marginTop: 12 }}>
            Criar meu treino
          </Btn>
        </Card>
      )}
    </div>
  );
}
