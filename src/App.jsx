import { useState, useEffect, useRef } from "react";
import { C } from "./constants/theme";
import { EMPTY_CORE, migrateCore } from "./storage/migrations";
import { dkey, daysBetween, streakOf } from "./utils/dates";
import { getDayCompletion, resolveDay } from "./services/schedule";
import { buildWorkouts } from "./services/workoutBuilder";
import { loadKey, saveKey, onSaveError } from "./utils/storage";
import { loadPhotos, savePhotos, deleteAllPhotos } from "./storage/photoStorage";
import { usePersistentWorkout, EMPTY_SESSION } from "./hooks/usePersistentWorkout";
import Icon from "./components/Icon";
import Missao from "./pages/Missao";
import Treino from "./pages/Treino";
import Agua from "./pages/Agua";
import Cardio from "./pages/Cardio";
import Evolucao from "./pages/Evolucao";
import Onboarding from "./pages/Onboarding";

export default function App() {
  const [tab, setTab] = useState("missao");
  const [core, setCore] = useState(null);
  const [photos, setPhotos] = useState(null);
  // treino ativo sobrevive à troca de abas E a fechar o app
  const { session: ws, updateSession: setWs, clearSession } = usePersistentWorkout();
  const draftChecked = useRef(false);
  const [saveError, setSaveError] = useState(false);

  useEffect(() => onSaveError(() => setSaveError(true)), []);

  useEffect(() => {
    (async () => {
      const loadedCore = await loadKey("brasa-core", EMPTY_CORE);
      const migratedCore = migrateCore(loadedCore);
      await saveKey("brasa-core", migratedCore);
      setCore(migratedCore);
      setPhotos(await loadPhotos());
    })();
  }, []);

  const upCore = (fn) =>
    setCore((c) => {
      const n = fn(structuredClone(c));
      n.updatedAt = new Date().toISOString();
      saveKey("brasa-core", n);
      return n;
    });
  const upPhotos = (fn) =>
    setPhotos((p) => {
      const n = fn(structuredClone(p));
      savePhotos(n);
      return n;
    });

  const chooseInitialPlan = (template) => {
    const workouts = buildWorkouts(template);
    const schedule = structuredClone(template.schedule);
    upCore((draft) => {
      draft.workouts = workouts;
      draft.schedule = schedule;
      draft.activePlanId = template.id;
      draft.activePlanName = template.name;
      draft.planChosen = true;
      return draft;
    });
    const split = resolveDay(schedule, new Date(), workouts).split;
    clearSession({
      date: dkey(),
      sel: split || Object.keys(workouts)[0] || "A",
    });
  };

  const buildInitialPlanFromScratch = () => {
    const workouts = { A: { label: "Meu treino", ex: [] } };
    const schedule = {
      0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null,
    };
    upCore((draft) => {
      draft.workouts = workouts;
      draft.schedule = schedule;
      draft.activePlanId = "personalizado";
      draft.activePlanName = "Meu treino";
      draft.planChosen = true;
      return draft;
    });
    clearSession({ date: dkey(), sel: "A" });
    setTab("treino");
  };

  // apaga TUDO: core, fotos (inclusive a chave no IndexedDB) e o treino em memória
  const wipeAll = () => {
    const fresh = structuredClone(EMPTY_CORE);
    setCore(fresh);
    saveKey("brasa-core", fresh);
    setPhotos({ items: [] });
    deleteAllPhotos();
    const t = dkey();
    const sp = resolveDay(fresh.schedule, new Date(), fresh.workouts).split;
    clearSession({
      date: t,
      sel: sp && fresh.workouts[sp] ? sp : Object.keys(fresh.workouts)[0],
    });
  };

  // retoma o treino em andamento de hoje, ou descarta rascunho de outro dia
  useEffect(() => {
    if (!core || !ws || draftChecked.current) return;
    draftChecked.current = true;
    const t = dkey();
    const todaySplit = resolveDay(core.schedule, new Date(), core.workouts).split;
    const firstWorkout = Object.keys(core.workouts)[0] || "A";
    const selForToday = todaySplit && core.workouts[todaySplit] ? todaySplit : firstWorkout;
    const hasProgress = ws.startTs || Object.keys(ws.progress || {}).length > 0;
    if (ws.date === t && hasProgress) return; // rascunho de hoje: retomar como está
    clearSession({ date: t, sel: selForToday });
  }, [core, ws, clearSession]);

  // sincroniza a conclusão do dia (marca E desmarca)
  useEffect(() => {
    if (!core) return;
    const todayKey = dkey();
    const todayDay = resolveDay(core.schedule, new Date(), core.workouts);
    const dayCompleted = getDayCompletion({
      day: todayDay,
      dateKey: todayKey,
      sessions: core.sessions,
      cardio: core.cardio,
      water: core.waterByDay[todayKey] || 0,
      waterGoal: core.waterGoal,
    }).completed;
    if (Boolean(core.doneDays[todayKey]) === dayCompleted) return;
    setCore((current) => {
      const next = structuredClone(current);
      if (dayCompleted) next.doneDays[todayKey] = true;
      else delete next.doneDays[todayKey];
      next.updatedAt = new Date().toISOString();
      saveKey("brasa-core", next);
      return next;
    });
  }, [core?.waterByDay, core?.waterGoal, core?.sessions, core?.cardio, core?.schedule]);

  if (!core || !photos || !ws)
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", color: C.mut, fontFamily: "system-ui" }}>
        Acendendo a brasa…
      </div>
    );

  if (!core.planChosen) {
    return (
      <Onboarding
        onChoosePlan={chooseInitialPlan}
        onBuildBlank={buildInitialPlanFromScratch}
      />
    );
  }

  const today = dkey();
  const todayDay = resolveDay(core.schedule, new Date(), core.workouts);
  const split = todayDay.split;
  const waterToday = core.waterByDay[today] || 0;
  const waterOK = waterToday >= core.waterGoal;
  const dayCompletion = getDayCompletion({
    day: todayDay,
    dateKey: today,
    sessions: core.sessions,
    cardio: core.cardio,
    water: waterToday,
    waterGoal: core.waterGoal,
  });
  const trainedToday = dayCompletion.workoutCompleted && Boolean(split);
  const restDay = !split && !todayDay.cardio;
  const streak = streakOf(core.doneDays);

  const lastWeight = core.weights.length ? core.weights[core.weights.length - 1] : null;
  const daysSinceWeight = lastWeight ? daysBetween(today, lastWeight.date) : 99;
  const checkinDue = daysSinceWeight >= 15;

  const tabs = [
    { id: "missao", icon: "flame", label: "Hoje" },
    { id: "treino", icon: "dumbbell", label: "Treinos" },
    { id: "cardio", icon: "heart", label: "Cardio" },
    { id: "agua", icon: "drop", label: "Água" },
    { id: "evolucao", icon: "chart", label: "Progresso" },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.text,
      fontFamily: "'Inter', system-ui, sans-serif",
      maxWidth: 480, margin: "0 auto", position: "relative",
    }}>
      

      {saveError && (
        <div role="alert" aria-live="polite" style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
          margin: "10px 18px 0", padding: "10px 12px", borderRadius: 10,
          background: "rgba(243,91,91,0.12)", border: `1px solid ${C.danger}`,
        }}>
          <div style={{ fontSize: 12.5, color: C.danger, fontWeight: 700 }}>
            Não foi possível salvar os últimos dados. Exporte um backup por segurança.
          </div>
          <button type="button" onClick={() => setSaveError(false)} style={{
            background: "none", border: 0, color: C.danger, fontSize: 15,
            cursor: "pointer", padding: 0, flexShrink: 0,
          }} aria-label="Fechar aviso">✕</button>
        </div>
      )}
      <header style={{ padding: "calc(16px + env(safe-area-inset-top)) 18px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.8 }}>
            Brasa<span style={{ color: C.primary }}>Fit</span>
          </div>
          <div style={{ color: C.dim, fontSize: 12, fontWeight: 500 }}>
            {split && todayDay.cardio
              ? `Treino ${split} + cardio`
              : split
                ? `Treino ${split} hoje`
                : todayDay.cardio
                  ? "Cardio hoje"
                  : "Descanso hoje"}
          </div>
        </div>
      </header>

      <div style={{ padding: "14px 18px 110px" }}>
        {tab === "missao" && (
          <Missao {...{
            core, split, restDay, waterToday, waterOK, trainedToday, streak,
            checkinDue, daysSinceWeight, lastWeight, setTab,
            cardioGoal: todayDay.cardio, dayCompletion,
          }} />
        )}
        {tab === "treino" && <Treino {...{ core, upCore, split, today, ws, setWs }} />}
        {tab === "cardio" && <Cardio {...{ core, upCore, today }} />}
        {tab === "agua" && <Agua {...{ core, upCore, today, waterToday }} />}
        {tab === "evolucao" && <Evolucao {...{ core, upCore, photos, upPhotos, today, onWipeAll: wipeAll }} />}
      </div>

      {/* nav inferior */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480, background: "rgba(9,10,12,0.94)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderTop: `1px solid ${C.line}`, display: "flex", alignItems: "center",
        padding: "8px 12px calc(10px + env(safe-area-inset-bottom))", zIndex: 50,
      }}>
        {tabs.map((t) => {
          const act = tab === t.id;
          return (
            <button key={t.id} type="button" onClick={() => setTab(t.id)} style={{
              flex: 1, minHeight: 54, border: 0, background: "transparent",
              color: act ? C.primary : C.dim, cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: 5,
            }}>
              <Icon name={t.icon} size={21} color={act ? C.primary : C.dim} />
              <span style={{ fontSize: 11, fontWeight: act ? 700 : 600 }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
