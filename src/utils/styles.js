import { C } from "../constants/theme";

export const inp = (extra = {}) => ({
  background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 10,
  color: C.text, padding: "9px 11px", fontSize: 14, fontWeight: 600, outline: "none", ...extra,
});
