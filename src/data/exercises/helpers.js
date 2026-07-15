export const createExercise = (
  id, name, muscle, equipment, defaultSets, defaultReps, defaultKg, extra = {}
) => ({
  id, name, muscle, equipment, defaultSets, defaultReps, defaultKg,
  secondaryMuscles: [],
  level: "Intermediário",
  type: "isolation",
  restSeconds: 90,
  ...extra,
});
