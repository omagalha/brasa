const FREE_DB_BASE = "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises";

// Correspondência entre os exercícios em português dos planos BrasaFit e os
// diretórios equivalentes do free-exercise-db (domínio público).
const FREE_DB_SLUG_BY_ID = {
  "supino-reto-barra": "Barbell_Bench_Press_-_Medium_Grip",
  "supino-inclinado-halteres": "Incline_Dumbbell_Press",
  "supino-reto-halteres": "Dumbbell_Bench_Press",
  "supino-maquina": "Leverage_Chest_Press",
  "crucifixo-inclinado": "Incline_Dumbbell_Flyes",
  "desenvolvimento-halteres": "Dumbbell_Shoulder_Press",
  "desenvolvimento-maquina": "Machine_Shoulder_Military_Press",
  "elevacao-lateral": "Side_Lateral_Raise",
  "triceps-corda": "Triceps_Pushdown_-_Rope_Attachment",
  "triceps-barra": "Triceps_Pushdown_-_V-Bar_Attachment",
  "triceps-frances": "Seated_Triceps_Press",
  "triceps-maquina": "Machine_Triceps_Extension",
  "puxada-frente": "Wide-Grip_Lat_Pulldown",
  "remada-baixa": "Seated_Cable_Rows",
  "remada-curvada": "Bent_Over_Barbell_Row",
  "remada-maquina": "Leverage_High_Row",
  "barra-fixa": "Pullups",
  "face-pull": "Face_Pull",
  "rosca-direta": "Barbell_Curl",
  "rosca-martelo": "Hammer_Curls",
  "rosca-alternada": "Dumbbell_Alternate_Bicep_Curl",
  "rosca-cabo": "Standing_Biceps_Cable_Curl",
  "agachamento-livre": "Barbell_Full_Squat",
  "agachamento-goblet": "Goblet_Squat",
  "leg-press": "Leg_Press",
  "cadeira-extensora": "Leg_Extensions",
  "mesa-flexora": "Lying_Leg_Curls",
  "stiff": "Stiff-Legged_Barbell_Deadlift",
  "stiff-halteres": "Stiff-Legged_Dumbbell_Deadlift",
  "panturrilha-em-pe": "Standing_Calf_Raises",
  "prancha": "Plank",
  "abdominal-supra": "Crunches",
};

export function getExerciseMedia(exerciseId) {
  const slug = FREE_DB_SLUG_BY_ID[exerciseId];
  if (!slug) return {};
  const images = [0, 1].map((index) => `${FREE_DB_BASE}/${slug}/${index}.jpg`);
  return { image: images[0], images, imageSource: "free-exercise-db" };
}

export function enrichExerciseMedia(exercise) {
  if (!exercise) return exercise;
  const media = getExerciseMedia(exercise.exerciseId || exercise.id);
  return {
    ...exercise,
    ...media,
    image: exercise.image || media.image || null,
    images: exercise.images?.length ? exercise.images : media.images || (exercise.image ? [exercise.image] : []),
  };
}
