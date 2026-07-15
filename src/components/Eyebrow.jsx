import { C } from "../constants/theme";

export const SectionLabel = ({ children, style }) => (
  <div style={{ color: C.mut, fontSize: 13, lineHeight: 1.4, fontWeight: 600, marginBottom: 8, ...style }}>
    {children}
  </div>
);
const Eyebrow = SectionLabel;

export default Eyebrow;
