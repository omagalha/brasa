import { EXERCISES_BY_ID } from "../data/exercises";

export function buildWorkouts(template) {
  const workouts = {};
  for (const [split, workout] of Object.entries(template.workouts)) {
    const occurrences = {};
    workouts[split] = {
      label: workout.label,
      ex: workout.exercises
        .map((exerciseId) => {
          const exercise = EXERCISES_BY_ID[exerciseId];
          if (!exercise) {
            console.warn(`Exercício não encontrado: ${exerciseId}`);
            return null;
          }
          occurrences[exerciseId] = (occurrences[exerciseId] || 0) + 1;
          const instanceId =
            occurrences[exerciseId] > 1
              ? `${exerciseId}-${occurrences[exerciseId]}`
              : exerciseId;
          return {
            id: instanceId,
            exerciseId,
            name: exercise.name,
            sets: exercise.defaultSets,
            reps: exercise.defaultReps,
            kg: exercise.defaultKg,
            restSeconds: exercise.restSeconds,
          };
        })
        .filter(Boolean),
    };
  }
  return workouts;
}
