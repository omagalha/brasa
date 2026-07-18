import { useState, useEffect, useRef } from "react";
import { C } from "../constants/theme";
import { fromKey } from "../utils/dates";
import { buildWorkouts } from "../services/workoutBuilder";
import { resolveDay } from "../services/schedule";
import { applySetEdit, stripSetEditingMetadata } from "../services/setEditing";
import { suggestProgression } from "../services/progressionEngine";
import { getExercisePerformances, getLastDoneSets } from "../services/workoutHistory";
import { getExerciseRecords } from "../services/personalRecords";
import { EXERCISES_BY_ID } from "../data/exercises";
import { enrichExerciseMedia } from "../data/exerciseMedia";
import ExerciseHistory from "../components/workout/ExerciseHistory";
import Btn from "../components/Btn";
import WorkoutTabs from "../components/workout/WorkoutTabs";
import RestTimer from "../components/workout/RestTimer";
import ExerciseCard from "../components/workout/ExerciseCard";
import ExerciseEditor from "../components/workout/ExerciseEditor";
import ExercisePicker from "../components/workout/ExercisePicker";
import PlanPicker from "../components/workout/PlanPicker";

export default function Treino({ core, upCore, split, today, ws, setWs }) {
  const [editing, setEditing] = useState(false);
  const [pendingRemove, setPendingRemove] = useState(null);
  const [overlay, setOverlay] = useState(null); // "picker" | "templates"
  const [historyEx, setHistoryEx] = useState(null);
  const restRef = useRef(null);

  const { sel, progress, startTs, rest, paused, confirmPartial } = ws;
  const up = (patch) => setWs((w) => ({ ...w, ...patch }));

  const letters = Object.keys(core.workouts);
  const safeSel = core.workouts[sel] ? sel : letters[0];
  const w = core.workouts[safeSel];
  const trainedToday = core.sessions.some(
    (s) => s.date === today && s.split === safeSel && s.completed !== false
  );

  const getSets = (ex) =>
    progress[ex.id] ||
    Array.from({ length: ex.sets }, () => ({ kg: ex.kg, reps: ex.reps, done: false }));

  const totalSets = w.ex.reduce((a, e) => a + e.sets, 0);
  const doneSets = w.ex.reduce((a, e) => a + getSets(e).filter((s) => s.done).length, 0);
  const allDone = doneSets >= totalSets && totalSets > 0;

  const resetSession = (extra = {}) =>
    up({ date: today, progress: {}, startTs: null, rest: 0, paused: false, confirmPartial: false, ...extra });

  useEffect(() => {
    if (rest > 0 && !paused) {
      restRef.current = setTimeout(() => {
        setWs((cur) => {
          const r = Math.max(0, cur.rest - 1);
          if (r === 0 && cur.rest === 1) navigator.vibrate?.([200, 100, 200]);
          return { ...cur, rest: r };
        });
      }, 1000);
      return () => clearTimeout(restRef.current);
    }
  }, [rest, paused]);

  const toggleSet = (ex, i) => {
    const sets = getSets(ex).map((s) => ({ ...s }));
    const done = sets.filter((s) => s.done).length;
    if (sets[i].done) {
      if (i === done - 1) {
        sets[i].done = false;
        up({ progress: { ...progress, [ex.id]: sets }, rest: 0, paused: false, confirmPartial: false });
      }
      return;
    }
    if (i !== done) return;
    sets[i].done = true;
    up({
      date: today,
      progress: { ...progress, [ex.id]: sets },
      startTs: startTs || Date.now(),
      paused: false,
      confirmPartial: false,
      rest: done + 1 < sets.length ? (ex.restSeconds || 90) : 0,
    });
  };

  const editSetField = (ex, i, field, val) => {
    const sets = applySetEdit(getSets(ex), i, field, val);
    up({ progress: { ...progress, [ex.id]: sets } });
  };

  const finish = () => {
    if (doneSets < totalSets && !confirmPartial) {
      up({ confirmPartial: true });
      return;
    }
    let volume = 0;
    const exercisesLog = {};
    w.ex.forEach((e) => {
      const ss = getSets(e).map((set) => ({
        ...stripSetEditingMetadata(set),
        type: set.type || "normal",
      }));
      exercisesLog[e.id] = {
        exerciseId: e.exerciseId || null,
        name: e.name,
        muscle: e.muscle || null,
        secondaryMuscles: e.secondaryMuscles || null,
        sets: ss,
      };
      volume += ss.filter((s) => s.done).reduce((a, s) => a + s.kg * s.reps, 0);
    });
    const durationMin = startTs ? Math.max(1, Math.round((Date.now() - startTs) / 60000)) : 0;
    upCore((c) => {
      const record = {
        id: `sessao-${Date.now()}`,
        date: today,
        planId: c.activePlanId,
        planName: c.activePlanName,
        split: safeSel,
        workoutLabel: w.label,
        volume, durationMin,
        completedSets: doneSets, totalSets,
        completed: doneSets === totalSets,
        exercises: exercisesLog,
      };
      const idx = c.sessions.findIndex((s) => s.date === today && s.split === safeSel);
      if (idx === -1) c.sessions.push(record);
      else if (c.sessions[idx].completed === false) c.sessions[idx] = record; // completa por cima do parcial
      return c;
    });
    resetSession();
  };

  const historyOpts = { planId: core.activePlanId, split: safeSel };

  const suggestionFor = (ex) => {
    if (trainedToday || progress[ex.id]) return null; // já treinou hoje ou já mexeu nas séries
    const performances = getExercisePerformances(core.sessions, ex, { ...historyOpts, limit: 2 });
    if (!performances.length) return null;
    const libExercise =
      (ex.exerciseId && EXERCISES_BY_ID[ex.exerciseId]) ||
      (ex.type ? { type: ex.type } : null);
    const s = suggestProgression({ exercise: ex, libExercise, performances });
    return ["increase", "deload", "reps"].includes(s.action) ? s : null;
  };

  const applySuggestion = (ex, kg) => {
    upEx(ex.id, "kg", kg);
    if (progress[ex.id]) {
      const sets = progress[ex.id].map((s) => (s.done ? s : { ...s, kg }));
      up({ progress: { ...progress, [ex.id]: sets } });
    }
  };

  const upEx = (id, field, val) =>
    upCore((c) => {
      const e = c.workouts[safeSel].ex.find((x) => x.id === id);
      if (e) e[field] = field === "name" ? val : Math.max(0, Number(val) || 0);
      return c;
    });
  const rmEx = (id) =>
    upCore((c) => {
      c.workouts[safeSel].ex = c.workouts[safeSel].ex.filter((e) => e.id !== id);
      return c;
    });
  const moveEx = (id, dir) =>
    upCore((c) => {
      const arr = c.workouts[safeSel].ex;
      const i = arr.findIndex((e) => e.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= arr.length) return c;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return c;
    });

  const addFromLibrary = (libEx) => {
    upCore((c) => {
      const existing = c.workouts[safeSel].ex.map((e) => e.id);
      let iid = libEx.id, n = 2;
      while (existing.includes(iid)) iid = `${libEx.id}-${n++}`;
      c.workouts[safeSel].ex.push({
        id: iid,
        exerciseId: libEx.id,
        name: libEx.name,
        sets: libEx.defaultSets, reps: libEx.defaultReps, kg: libEx.defaultKg,
        restSeconds: libEx.restSeconds,
        // metadados no próprio treino: exercícios da biblioteca estendida
        // não existem em EXERCISES_BY_ID, então recuperação/progressão usam isto
        muscle: libEx.muscle,
        secondaryMuscles: libEx.secondaryMuscles || [],
        type: libEx.type,
        image: libEx.image || null,
      });
      return c;
    });
  };

  const applyTemplate = (tpl) => {
    const nextWorkouts = buildWorkouts(tpl);
    const nextSchedule = structuredClone(tpl.schedule);
    upCore((c) => {
      c.workouts = nextWorkouts;
      c.schedule = nextSchedule;
      c.activePlanId = tpl.id;
      c.activePlanName = tpl.name;
      return c;
    });
    const todayWorkout = resolveDay(nextSchedule, new Date(), nextWorkouts).split;
    const firstWorkout = Object.keys(nextWorkouts)[0];
    resetSession({
      sel: todayWorkout && nextWorkouts[todayWorkout] ? todayWorkout : firstWorkout,
    });
    setEditing(false);
  };

  const lastSession = [...core.sessions]
    .reverse()
    .find((s) => s.split === safeSel && (!s.planId || s.planId === core.activePlanId));

  return (
    <div>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: -0.6 }}>Treinos</h1>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "4px 0 16px" }}>
        <div style={{ color: C.mut, fontSize: 13 }}>
          {core.activePlanName} · {split ? `hoje é o treino ${split}` : "hoje é descanso"}
        </div>
        <button type="button" onClick={() => setOverlay("templates")} style={{
          background: "transparent", border: 0, color: C.primary,
          fontSize: 13, fontWeight: 700, cursor: "pointer", padding: 0, flexShrink: 0,
        }}>Treinos prontos</button>
      </div>

      <WorkoutTabs
        letters={letters}
        selected={safeSel}
        todaySplit={split}
        onSelect={(k) => {
          setEditing(false);
          setPendingRemove(null);
          resetSession({ sel: k });
        }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.3 }}>{w.label}</div>
          {lastSession && (
            <div style={{ fontSize: 12, color: C.mut, marginTop: 3 }}>
              Último: {fromKey(lastSession.date).toLocaleDateString("pt-BR")} · {Math.round(lastSession.volume)} kg de volume
              {lastSession.completed === false ? " · parcial" : ""}
            </div>
          )}
        </div>
        <Btn small ghost onClick={() => { setEditing(!editing); setPendingRemove(null); }}>
          {editing ? "Pronto" : "Editar"}
        </Btn>
      </div>

      <RestTimer
        seconds={rest}
        paused={paused}
        onAdd={() => up({ rest: rest + 30 })}
        onPause={() => up({ paused: !paused })}
        onSkip={() => up({ rest: 0, paused: false })}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {w.ex.map((storedEx, exIdx) => {
          const ex = enrichExerciseMedia(storedEx);
          return (
          editing ? (
            <ExerciseEditor
              key={ex.id}
              exercise={ex}
              index={exIdx}
              count={w.ex.length}
              pendingRemove={pendingRemove === ex.id}
              onRename={(v) => upEx(ex.id, "name", v)}
              onChangeField={(f, v) => upEx(ex.id, f, v)}
              onMove={(dir) => moveEx(ex.id, dir)}
              onRequestRemove={() => setPendingRemove(ex.id)}
              onConfirmRemove={() => { rmEx(ex.id); setPendingRemove(null); }}
            />
          ) : (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              sets={getSets(ex)}
              lastPerformance={getLastDoneSets(core.sessions, ex, historyOpts)}
              suggestion={suggestionFor(ex)}
              onOpenHistory={() => setHistoryEx(ex)}
              onApplySuggestion={(kg) => applySuggestion(ex, kg)}
              onToggleSet={(i) => toggleSet(ex, i)}
              onChangeSet={(i, field, v) => editSetField(ex, i, field, v)}
            />
          )
          );
        })}
      </div>

      {editing && (
        <Btn ghost onClick={() => setOverlay("picker")} style={{ width: "100%", marginTop: 12 }}>
          + Adicionar da biblioteca
        </Btn>
      )}

      {!editing && (
        <div style={{ marginTop: 16 }}>
          <Btn onClick={finish} disabled={doneSets === 0 || trainedToday} style={{ width: "100%" }}>
            {trainedToday
              ? "Treino de hoje já registrado"
              : confirmPartial
              ? `Encerrar parcial com ${doneSets}/${totalSets} séries?`
              : allDone
              ? "Concluir treino"
              : `Concluir treino (${doneSets}/${totalSets} séries)`}
          </Btn>
          {confirmPartial && (
            <div style={{ textAlign: "center", fontSize: 12, color: C.mut, marginTop: 8 }}>
              Toque de novo para confirmar, ou continue as séries.
            </div>
          )}
        </div>
      )}

      <ExercisePicker
        open={overlay === "picker"}
        targetLabel={safeSel}
        onClose={() => setOverlay(null)}
        onAdd={addFromLibrary}
      />
      <PlanPicker
        open={overlay === "templates"}
        activePlanId={core.activePlanId}
        onClose={() => setOverlay(null)}
        onApply={applyTemplate}
      />
      {historyEx && (
        <ExerciseHistory
          exercise={historyEx}
          performances={getExercisePerformances(core.sessions, historyEx, { limit: 20 })}
          records={getExerciseRecords(core.sessions, historyEx)}
          onClose={() => setHistoryEx(null)}
        />
      )}
    </div>
  );
}
