// Recuperação muscular estimada por grupo, a partir do histórico de sessões.
// Usa o músculo primário (estímulo cheio) e os secundários (meio estímulo)
// de cada exercício da biblioteca.

import { EXERCISES_BY_ID } from "../data/exercises";
import { dkey, daysBetween } from "../utils/dates";

// horas para recuperação completa de um estímulo primário
const RECOVERY_HOURS = {
  "Peito": 72, "Costas": 72, "Quadríceps": 72, "Posterior": 72, "Glúteos": 72,
  "Ombros": 60,
  "Bíceps": 48, "Tríceps": 48, "Panturrilha": 48, "Abdômen": 48,
};

const SECONDARY_WEIGHT = 0.5;

/**
 * Último estímulo de cada músculo: { [muscle]: { date, weight } }
 * weight 1 = primário, 0.5 = secundário (se ambos no mesmo dia, vale o maior).
 */
export function lastStimulusByMuscle(sessions) {
  const out = {};
  const bump = (muscle, date, weight) => {
    const cur = out[muscle];
    if (!cur || date > cur.date || (date === cur.date && weight > cur.weight)) {
      out[muscle] = { date, weight };
    }
  };
  for (const s of sessions) {
    for (const entry of Object.values(s.exercises || {})) {
      if (!entry.sets?.some((x) => x.done)) continue;
      const lib = entry.exerciseId ? EXERCISES_BY_ID[entry.exerciseId] : null;
      const muscle = lib?.muscle || entry.muscle;
      if (!muscle) continue;
      bump(muscle, s.date, 1);
      const secondary = lib?.secondaryMuscles || entry.secondaryMuscles || [];
      for (const m of secondary) bump(m, s.date, SECONDARY_WEIGHT);
    }
  }
  return out;
}

/**
 * Estado de recuperação, do menos recuperado pro mais.
 * Cada item: { muscle, pct (0-100), daysSince, lastDate, stimulus }
 * Músculos nunca treinados não entram na lista.
 */
export function getMuscleRecovery(sessions, { today = new Date() } = {}) {
  const stimuli = lastStimulusByMuscle(sessions);
  const todayKey = dkey(today);
  const list = [];
  for (const [muscle, { date, weight }] of Object.entries(stimuli)) {
    const daysSince = Math.max(0, daysBetween(todayKey, date));
    const hoursNeeded = (RECOVERY_HOURS[muscle] || 60) * weight;
    const pct = Math.min(100, Math.round(((daysSince * 24) / hoursNeeded) * 100));
    list.push({
      muscle, pct, daysSince, lastDate: date,
      stimulus: weight === 1 ? "primário" : "secundário",
    });
  }
  return list.sort((a, b) => a.pct - b.pct || a.muscle.localeCompare(b.muscle));
}
