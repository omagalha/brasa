import { C } from "../constants/theme";

const Card = ({ children, style, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: C.surface,
      border: `1px solid ${C.line}`,
      borderRadius: 14,
      padding: 16,
      boxShadow: "0 1px 0 rgba(255,255,255,0.02)",
      ...style,
    }}
  >
    {children}
  </div>
);;

export default Card;
