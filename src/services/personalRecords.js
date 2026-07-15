import { getExercisePerformances } from "./workoutHistory";

/** 1RM estimado pela fórmula de Epley. */
export function estimateOneRepMax(kg, reps) {
  if (!kg || !reps) return 0;
  if (reps === 1) return kg;
  return kg * (1 + reps / 30);
}

/** Recordes de um exercício em todo o histórico. */
export function getExerciseRecords(sessions, ex) {
  let maxWeight = 0;
  let bestSet = null; // maior kg×reps
  let maxVolumeSet = 0;
  let estimatedOneRepMax = 0;

  for (const p of getExercisePerformances(sessions, ex)) {
    for (const s of p.sets) {
      if (!s.done) continue;
      if (s.kg > maxWeight) maxWeight = s.kg;
      const vol = s.kg * s.reps;
      if (vol > maxVolumeSet) {
        maxVolumeSet = vol;
        bestSet = { kg: s.kg, reps: s.reps, date: p.date };
      }
      const orm = estimateOneRepMax(s.kg, s.reps);
      if (orm > estimatedOneRepMax) estimatedOneRepMax = orm;
    }
  }

  return { maxWeight, maxVolumeSet, bestSet, estimatedOneRepMax };
}
