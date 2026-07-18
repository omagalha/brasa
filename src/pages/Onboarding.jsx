import { C } from "../constants/theme";
import PlanList from "../components/workout/PlanList";

export default function Onboarding({ onChoosePlan, onBuildBlank }) {
  return (
    <main style={{
      minHeight: "100vh",
      maxWidth: 480,
      margin: "0 auto",
      padding: "calc(28px + env(safe-area-inset-top)) 18px 32px",
      background: C.bg,
      color: C.text,
      fontFamily: "'Inter', system-ui, sans-serif",
      boxSizing: "border-box",
    }}>
      <div style={{ color: C.primary, fontSize: 13, fontWeight: 800, letterSpacing: 1 }}>
        BRASAFIT
      </div>
      <h1 style={{ fontSize: 30, lineHeight: 1.08, letterSpacing: -1, margin: "8px 0 8px" }}>
        Como você quer começar?
      </h1>
      <p style={{ color: C.mut, fontSize: 14, lineHeight: 1.5, margin: "0 0 20px" }}>
        Escolha um plano pronto ou monte seu próprio treino. Você poderá trocar depois.
      </p>
      <PlanList
        confirmApply={false}
        showBlank
        onApply={onChoosePlan}
        onBuildBlank={onBuildBlank}
      />
    </main>
  );
}
