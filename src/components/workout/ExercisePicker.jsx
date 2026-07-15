import { useState, useEffect, useMemo } from "react";
import { C } from "../../constants/theme";
import { inp } from "../../utils/styles";
import { norm } from "../../utils/normalize";
import { EXERCISE_LIBRARY } from "../../data/exercises";
import { loadExtendedLibrary } from "../../data/extendedLibrary";
import Btn from "../Btn";
import OverlayShell from "./OverlayShell";

const chip = (active) => ({
  padding: "7px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600,
  whiteSpace: "nowrap", cursor: "pointer",
  background: active ? C.primarySoft : C.surface2,
  color: active ? C.primary : C.mut,
  border: `1px solid ${active ? C.primary : C.line}`,
});

export default function ExercisePicker({ open, targetLabel, onClose, onAdd }) {
  const [search, setSearch] = useState("");
  const [muscleF, setMuscleF] = useState("Todos");
  const [eqF, setEqF] = useState("Todos");
  const [extended, setExtended] = useState([]);
  const [loadingExt, setLoadingExt] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoadingExt(true);
    loadExtendedLibrary().then((list) => {
      setExtended(list);
      setLoadingExt(false);
    });
  }, [open]);

  const all = useMemo(
    () => [...new Map([...EXERCISE_LIBRARY, ...extended].map((e) => [e.id, e])).values()],
    [extended]
  );
  const muscles = useMemo(() => [...new Set(all.map((e) => e.muscle))], [all]);
  const equipments = useMemo(() => [...new Set(all.map((e) => e.equipment))], [all]);

  if (!open) return null;

  const filtered = all.filter((e) => {
    if (muscleF !== "Todos" && e.muscle !== muscleF) return false;
    if (eqF !== "Todos" && e.equipment !== eqF) return false;
    if (search) {
      const q = norm(search);
      const hit = norm(e.name).includes(q) || (e.nameEn && norm(e.nameEn).includes(q));
      if (!hit) return false;
    }
    return true;
  }).slice(0, 120);

  return (
    <OverlayShell title={`Adicionar ao treino ${targetLabel}`} onClose={onClose}>
      <div style={{ padding: "12px 18px 0" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Buscar em ${all.length} exercícios...`}
          style={inp({ width: "100%" })}
        />
        <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "10px 0 4px" }}>
          {["Todos", ...muscles].map((m) => (
            <button key={m} type="button" onClick={() => setMuscleF(m)} style={chip(muscleF === m)}>{m}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "2px 0 10px" }}>
          {["Todos", ...equipments].map((eq) => (
            <button key={eq} type="button" onClick={() => setEqF(eq)} style={chip(eqF === eq)}>{eq}</button>
          ))}
        </div>
      </div>
      <div style={{ overflowY: "auto", flex: 1, padding: "0 18px 24px" }}>
        {loadingExt && (
          <div style={{ color: C.dim, fontSize: 12, padding: "8px 0", textAlign: "center" }}>
            Carregando biblioteca completa…
          </div>
        )}
        {filtered.length === 0 && !loadingExt && (
          <div style={{ color: C.mut, fontSize: 13.5, padding: "24px 0", textAlign: "center" }}>
            Nenhum exercício encontrado com esses filtros.
          </div>
        )}
        {filtered.map((e) => (
          <div key={e.id} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 0", borderBottom: `1px solid ${C.line}`,
          }}>
            {e.image ? (
              <img src={e.image} alt="" loading="lazy" style={{
                width: 46, height: 46, borderRadius: 10, objectFit: "cover",
                background: C.surface2, flexShrink: 0,
              }} />
            ) : (
              <div style={{
                width: 46, height: 46, borderRadius: 10, background: C.surface2,
                border: `1px solid ${C.line}`, flexShrink: 0,
                display: "grid", placeItems: "center", color: C.dim, fontSize: 16, fontWeight: 800,
              }}>{e.muscle[0]}</div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: -0.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.name}</div>
              <div style={{ fontSize: 11.5, color: C.mut, marginTop: 2 }}>
                {e.muscle} · {e.equipment} · {e.defaultSets}×{e.defaultReps}
              </div>
            </div>
            <Btn small ghost onClick={() => onAdd(e)} style={{ color: C.primary }}>Adicionar</Btn>
          </div>
        ))}
        {all.length > 0 && filtered.length === 120 && (
          <div style={{ color: C.dim, fontSize: 11.5, padding: "10px 0", textAlign: "center" }}>
            Mostrando os 120 primeiros — refine a busca ou os filtros.
          </div>
        )}
      </div>
    </OverlayShell>
  );
}
