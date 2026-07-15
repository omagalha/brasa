import { C } from "../../constants/theme";
import Btn from "../Btn";

export default function OverlayShell({ title, onClose, children }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(9,10,12,0.72)", display: "flex", justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 480, marginTop: 48,
          background: C.bg, border: `1px solid ${C.lineStrong}`,
          borderRadius: "16px 16px 0 0",
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}
      >
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 18px 12px", borderBottom: `1px solid ${C.line}`,
        }}>
          <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.4 }}>{title}</div>
          <Btn small ghost onClick={onClose}>Fechar</Btn>
        </div>
        {children}
      </div>
    </div>
  );
}
