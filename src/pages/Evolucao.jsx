import { useState, useRef } from "react";
import { downloadBackup, parseBackup } from "../services/workoutBackup";
import TrainingStats from "../components/stats/TrainingStats";
import MuscleRecovery from "../components/stats/MuscleRecovery";
import { C } from "../constants/theme";
import { fromKey, daysBetween } from "../utils/dates";
import { compressImage } from "../utils/images";
import { inp } from "../utils/styles";
import Card from "../components/Card";
import Btn from "../components/Btn";
import Eyebrow from "../components/Eyebrow";
import WeightChart from "../components/WeightChart";

const PHOTO_TYPES = [
  { id: "frente", label: "Frente" },
  { id: "lado", label: "Lado" },
  { id: "costas", label: "Costas" },
];

export default function Evolucao({ core, upCore, photos, upPhotos, today, onWipeAll }) {
  const [kgInput, setKgInput] = useState("");
  const [view, setView] = useState("hoje"); // hoje | comparar
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);
  const [pendingType, setPendingType] = useState("frente");
  const [photoChoice, setPhotoChoice] = useState(null);
  const [busy, setBusy] = useState(false);
  const backupRef = useRef(null);
  const [backupMsg, setBackupMsg] = useState(null);
  const [confirmImport, setConfirmImport] = useState(false);
  const [confirmWipe, setConfirmWipe] = useState(false);
  const [confirmPhotoDel, setConfirmPhotoDel] = useState(null);
  const [confirmWeightDel, setConfirmWeightDel] = useState(null);

  const deleteLatestPhoto = (type) => {
    upPhotos((p) => {
      const list = p.items
        .filter((i) => i.type === type)
        .sort((a, b) => (a.date > b.date ? -1 : 1));
      if (list.length) {
        const target = list[0];
        p.items = p.items.filter((i) => !(i.type === target.type && i.date === target.date));
      }
      return p;
    });
    setConfirmPhotoDel(null);
  };

  const deleteWeight = (date) => {
    upCore((c) => {
      c.weights = c.weights.filter((w) => w.date !== date);
      return c;
    });
    setConfirmWeightDel(null);
  };

  const wipeAll = () => {
    onWipeAll();
    setConfirmWipe(false);
    setBackupMsg({ ok: true, text: "Todos os dados foram apagados deste aparelho." });
  };

  const onExport = () => {
    downloadBackup(core, photos);
    setBackupMsg({ ok: true, text: "Backup exportado. Guarde o arquivo em local seguro." });
  };

  const onImportFile = async (ev) => {
    const f = ev.target.files?.[0];
    ev.target.value = "";
    setConfirmImport(false);
    if (!f) return;
    try {
      if (f.size > 25 * 1024 * 1024) {
        throw new Error("O arquivo é grande demais (limite: 25 MB).");
      }
      const text = await f.text();
      const parsed = parseBackup(text);
      upCore(() => parsed.core);
      upPhotos(() => parsed.photos);
      setBackupMsg({ ok: true, text: "Backup restaurado com sucesso." });
    } catch (err) {
      setBackupMsg({ ok: false, text: err.message || "Não foi possível importar o arquivo." });
    }
  };

  const addWeight = () => {
    const kg = parseFloat(kgInput.replace(",", "."));
    if (!kg || kg < 20 || kg > 400) return;
    upCore((c) => {
      c.weights = c.weights.filter((w) => w.date !== today);
      c.weights.push({ date: today, kg });
      c.weights.sort((a, b) => (a.date < b.date ? -1 : 1));
      return c;
    });
    setKgInput("");
  };

  const pickPhoto = (type) => {
    setPendingType(type);
    setPhotoChoice(type);
  };
  const openPhotoSource = (source) => {
    const target = source === "camera" ? cameraRef : galleryRef;
    target.current?.click();
  };
  const onFile = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setPhotoChoice(null);
    setBusy(true);
    try {
      const dataUrl = await compressImage(f);
      upPhotos((p) => {
        p.items = p.items.filter((it) => !(it.date === today && it.type === pendingType));
        p.items.push({ date: today, type: pendingType, dataUrl });
        return p;
      });
    } catch (err) {
      console.error(err);
    }
    setBusy(false);
  };

  const latestOf = (type) =>
    [...photos.items].filter((i) => i.type === type).sort((a, b) => (a.date > b.date ? -1 : 1))[0] || null;
  const oldOf = (type) => {
    const list = [...photos.items].filter((i) => i.type === type).sort((a, b) => (a.date > b.date ? -1 : 1));
    if (list.length < 2) return null;
    // a mais próxima de 30 dias atrás
    return list.slice(1).reduce((best, it) => {
      const target = 30;
      const d = Math.abs(daysBetween(today, it.date) - target);
      const bd = Math.abs(daysBetween(today, best.date) - target);
      return d < bd ? it : best;
    }, list[1]);
  };

  const first = core.weights[0];
  const last = core.weights[core.weights.length - 1];
  const delta = first && last && core.weights.length > 1 ? last.kg - first.kg : null;

  return (
    <div>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: -0.6 }}>Evolução</h1>
      <div style={{ color: C.mut, fontSize: 13, margin: "4px 0 16px" }}>Peso e fotos a cada 15 dias</div>

      {/* PESO */}
      <Card style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <Eyebrow>Peso corporal</Eyebrow>
          {delta !== null && (
            <div style={{ fontSize: 12.5, fontWeight: 800, color: C.gold }}>
              {delta > 0 ? "+" : ""}{delta.toFixed(1)} kg desde o início
            </div>
          )}
        </div>
        {last ? (
          <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: -0.8, margin: "4px 0 8px" }}>
            {last.kg.toFixed(1)} <span style={{ fontSize: 18, color: C.mut }}>kg</span>
          </div>
        ) : (
          <div style={{ color: C.mut, fontSize: 13.5, margin: "6px 0 10px" }}>Registre seu primeiro peso pra começar a linha do tempo.</div>
        )}
        <WeightChart weights={core.weights} />
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <input
            value={kgInput}
            onChange={(e) => setKgInput(e.target.value)}
            placeholder="Ex: 78.4"
            inputMode="decimal"
            style={inp({ flex: 1 })}
          />
          <Btn small onClick={addWeight}>Registrar hoje</Btn>
        </div>
      </Card>

      {/* ESTATÍSTICAS DE TREINO */}
      <TrainingStats sessions={core.sessions} />
      <MuscleRecovery sessions={core.sessions} />

      {/* FOTOS */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <Eyebrow>Fotos do corpo</Eyebrow>
          <div style={{ display: "flex", gap: 6 }}>
            {["hoje", "comparar"].map((v) => (
              <button key={v} onClick={() => setView(v)} style={{
                background: view === v ? C.panel2 : "transparent",
                border: `1px solid ${view === v ? C.ember : C.line}`,
                color: view === v ? C.ember2 : C.dim,
                borderRadius: 9, padding: "5px 10px", fontSize: 11.5, fontWeight: 800,
                letterSpacing: 0.5, cursor: "pointer", fontFamily: "inherit",
              }}>{v === "hoje" ? "Registrar" : "Hoje × 30 dias"}</button>
            ))}
          </div>
        </div>

        <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={onFile} style={{ display: "none" }} />
        <input ref={galleryRef} type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} />

        {view === "hoje" && photoChoice && (
          <div role="dialog" aria-label={`Adicionar foto: ${PHOTO_TYPES.find((type) => type.id === photoChoice)?.label}`} style={{
            padding: 12, marginBottom: 10, borderRadius: 12,
            background: C.panel2, border: `1px solid ${C.line}`,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 9 }}>
              Adicionar foto de {PHOTO_TYPES.find((type) => type.id === photoChoice)?.label.toLowerCase()}
            </div>
            <div style={{ display: "flex", gap: 7 }}>
              <Btn small onClick={() => openPhotoSource("camera")} style={{ flex: 1 }}>
                Abrir câmera
              </Btn>
              <Btn small ghost onClick={() => openPhotoSource("gallery")} style={{ flex: 1 }}>
                Escolher da galeria
              </Btn>
              <Btn small ghost onClick={() => setPhotoChoice(null)}>
                Cancelar
              </Btn>
            </div>
          </div>
        )}

        {view === "hoje" && (
          <div style={{ display: "flex", gap: 8 }}>
            {PHOTO_TYPES.map((t) => {
              const ph = photos.items.find((i) => i.date === today && i.type === t.id) || latestOf(t.id);
              const isToday = ph && ph.date === today;
              return (
                <div key={t.id} style={{ flex: 1 }}>
                  <button type="button" aria-label={`Adicionar foto de ${t.label}`} onClick={() => pickPhoto(t.id)} disabled={busy} style={{
                    width: "100%", aspectRatio: "3/4", borderRadius: 12, overflow: "hidden",
                    background: C.panel2, border: `1px dashed ${isToday ? C.ember : C.line}`,
                    cursor: "pointer", padding: 0, position: "relative",
                  }}>
                    {ph ? (
                      <img src={ph.dataUrl} alt={t.label} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: isToday ? 1 : 0.45 }} />
                    ) : (
                      <div style={{ color: C.dim, fontSize: 22 }}>+</div>
                    )}
                    {ph && !isToday && (
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: C.text, fontSize: 20, fontWeight: 800 }}>+</div>
                    )}
                  </button>
                  <div style={{ textAlign: "center", fontSize: 11.5, fontWeight: 800, color: isToday ? C.primary : C.dim, marginTop: 5, letterSpacing: 1 }}>
                    {t.label}
                  </div>
                  {ph && (
                    <button type="button" onClick={() =>
                      confirmPhotoDel === t.id ? deleteLatestPhoto(t.id) : setConfirmPhotoDel(t.id)
                    } style={{
                      display: "block", margin: "3px auto 0", background: "none", border: 0,
                      color: confirmPhotoDel === t.id ? C.danger : C.dim,
                      fontSize: 10.5, fontWeight: 700, cursor: "pointer", padding: 2,
                    }}>
                      {confirmPhotoDel === t.id ? "confirmar exclusão" : "remover última"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {view === "comparar" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {PHOTO_TYPES.map((t) => {
              const now = latestOf(t.id);
              const old = oldOf(t.id);
              if (!now) return null;
              return (
                <div key={t.id}>
                  <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 1.5, color: C.dim, marginBottom: 6 }}>{t.label}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[old, now].map((ph, i) => (
                      <div key={i} style={{ flex: 1 }}>
                        <div style={{ aspectRatio: "3/4", borderRadius: 12, overflow: "hidden", background: C.panel2, border: `1px solid ${i === 1 ? C.ember : C.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {ph ? <img src={ph.dataUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ color: C.dim, fontSize: 12, padding: 10, textAlign: "center" }}>ainda sem foto antiga</div>}
                        </div>
                        <div style={{ textAlign: "center", fontSize: 11, color: C.mut, marginTop: 4, fontWeight: 700 }}>
                          {ph ? `${fromKey(ph.date).toLocaleDateString("pt-BR")} · há ${daysBetween(today, ph.date)}d` : "—"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {photos.items.length === 0 && (
              <div style={{ color: C.mut, fontSize: 13.5 }}>Nenhuma foto ainda. Registre as de hoje pra ter com o que comparar daqui a 15/30 dias.</div>
            )}
          </div>
        )}
      </Card>

      {/* HISTÓRICO DE PESO */}
      {core.weights.length > 0 && (
        <Card style={{ marginTop: 12 }}>
          <Eyebrow>Histórico</Eyebrow>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
            {[...core.weights].reverse().slice(0, 8).map((w) => (
              <div key={w.date} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, borderBottom: `1px solid ${C.line}`, paddingBottom: 6 }}>
                <span style={{ color: C.mut, flex: 1 }}>{fromKey(w.date).toLocaleDateString("pt-BR")}</span>
                <span style={{ fontWeight: 800 }}>{w.kg.toFixed(1)} kg</span>
                <button type="button" aria-label={`Excluir peso de ${w.date}`} onClick={() =>
                  confirmWeightDel === w.date ? deleteWeight(w.date) : setConfirmWeightDel(w.date)
                } style={{
                  background: "none", border: 0, cursor: "pointer", padding: "2px 4px",
                  color: confirmWeightDel === w.date ? C.danger : C.dim,
                  fontSize: confirmWeightDel === w.date ? 11 : 14, fontWeight: 700,
                }}>
                  {confirmWeightDel === w.date ? "confirmar" : "✕"}
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}
      {/* BACKUP */}
      <Card style={{ marginTop: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>Backup dos dados</div>
        <div style={{ fontSize: 12.5, color: C.mut, marginTop: 4, lineHeight: 1.5 }}>
          Treinos, histórico, peso e fotos ficam salvos apenas neste aparelho. Exporte um
          arquivo de vez em quando para não perder nada.
        </div>
        <div style={{ fontSize: 11.5, color: C.warning, marginTop: 6, lineHeight: 1.5 }}>
          O backup inclui suas fotos corporais e não é criptografado — guarde o arquivo em
          local privado, ou exporte sem fotos.
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <Btn small ghost onClick={onExport} style={{ flex: 1 }}>Exportar dados</Btn>
          <Btn small ghost onClick={() => {
            downloadBackup(core, photos, { includePhotos: false });
            setBackupMsg({ ok: true, text: "Backup sem fotos exportado." });
          }} style={{ flex: 1 }}>Sem fotos</Btn>
          {confirmImport ? (
            <Btn small onClick={() => backupRef.current?.click()} style={{ flex: 1 }}>
              Substituir tudo?
            </Btn>
          ) : (
            <Btn small ghost onClick={() => setConfirmImport(true)} style={{ flex: 1 }}>
              Importar backup
            </Btn>
          )}
        </div>
        {confirmImport && (
          <div style={{ fontSize: 11.5, color: C.dim, marginTop: 8, textAlign: "center" }}>
            Importar substitui todos os dados atuais pelos do arquivo.
          </div>
        )}
        {backupMsg && (
          <div style={{
            fontSize: 12.5, marginTop: 10, fontWeight: 600,
            color: backupMsg.ok ? C.success : C.danger,
          }}>
            {backupMsg.text}
          </div>
        )}
        <input ref={backupRef} type="file" accept="application/json,.json" onChange={onImportFile} style={{ display: "none" }} />
        <button type="button" onClick={() => (confirmWipe ? wipeAll() : setConfirmWipe(true))} style={{
          display: "block", margin: "14px auto 0", background: "none", border: 0,
          color: confirmWipe ? C.danger : C.dim, fontSize: 12, fontWeight: 700,
          cursor: "pointer", padding: 4,
        }}>
          {confirmWipe ? "Toque de novo para apagar TUDO deste aparelho" : "Limpar todos os dados"}
        </button>
      </Card>
    </div>
  );
}
