import { C } from "../constants/theme";

const Btn = ({ children, onClick, ghost = false, small = false, style, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    style={{
      minHeight: small ? 36 : 46,
      padding: small ? "0 13px" : "0 18px",
      borderRadius: 10,
      background: ghost ? C.surface2 : C.primary,
      color: ghost ? C.text : "#FFFFFF",
      border: ghost ? `1px solid ${C.lineStrong}` : `1px solid ${C.primary}`,
      fontWeight: 700,
      fontSize: small ? 12 : 14,
      cursor: disabled ? "default" : "pointer",
      opacity: disabled ? 0.4 : 1,
      ...style,
    }}
  >
    {children}
  </button>
);

export default Btn;
