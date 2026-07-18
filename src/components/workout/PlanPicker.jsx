import { C } from "../../constants/theme";
import OverlayShell from "./OverlayShell";
import PlanList from "./PlanList";

export default function PlanPicker({ open, activePlanId, onClose, onApply }) {
  if (!open) return null;

  return (
    <OverlayShell title="Treinos prontos" onClose={onClose}>
      <div style={{ overflowY: "auto", flex: 1, padding: "14px 18px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
        <PlanList
          activePlanId={activePlanId}
          onApply={(template) => {
            onApply(template);
            onClose();
          }}
        />
        <div style={{ fontSize: 12, color: C.dim, textAlign: "center", marginTop: 4 }}>
          Aplicar um plano substitui seus treinos atuais. O histórico de sessões é mantido.
        </div>
      </div>
    </OverlayShell>
  );
}
