import { buildWorkouts } from "../services/workoutBuilder";

export const WORKOUT_TEMPLATES = [
  {
    id: "abcab-hipertrofia", name: "ABCAB — Hipertrofia",
    description: "Cinco dias por semana para ganho de massa: cada grupo é treinado quase duas vezes.",
    level: "Intermediário", frequency: 5,
    schedule: { 0: null, 1: "A", 2: "B", 3: "C", 4: "A", 5: "B", 6: null },
    workouts: {
      A: { label: "Peito · Ombro · Tríceps", exercises: ["supino-reto-barra", "supino-inclinado-halteres", "desenvolvimento-halteres", "elevacao-lateral", "triceps-corda"] },
      B: { label: "Costas · Bíceps", exercises: ["puxada-frente", "remada-baixa", "remada-curvada", "rosca-direta", "rosca-martelo"] },
      C: { label: "Pernas · Abdômen", exercises: ["agachamento-livre", "leg-press", "cadeira-extensora", "mesa-flexora", "panturrilha-em-pe", "prancha"] },
    },
  },
  {
    id: "abc-hipertrofia", name: "ABC — Hipertrofia",
    description: "Três dias por semana com foco em volume e recuperação completa entre sessões.",
    level: "Intermediário", frequency: 3,
    schedule: { 0: null, 1: "A", 2: null, 3: "B", 4: null, 5: "C", 6: null },
    workouts: {
      A: { label: "Peito · Ombro · Tríceps", exercises: ["supino-reto-barra", "crucifixo-inclinado", "desenvolvimento-halteres", "elevacao-lateral", "triceps-frances", "triceps-corda"] },
      B: { label: "Costas · Bíceps", exercises: ["barra-fixa", "puxada-frente", "remada-baixa", "rosca-direta", "rosca-alternada"] },
      C: { label: "Pernas · Abdômen", exercises: ["agachamento-livre", "stiff", "leg-press", "cadeira-extensora", "panturrilha-em-pe", "abdominal-supra"] },
    },
  },
  {
    id: "ppl", name: "Push Pull Legs",
    description: "Empurrar, puxar e pernas: o clássico de seis dias que também funciona em cinco.",
    level: "Intermediário", frequency: 6,
    schedule: { 0: null, 1: "A", 2: "B", 3: "C", 4: "A", 5: "B", 6: "C" },
    workouts: {
      A: { label: "Push — Empurrar", exercises: ["supino-reto-barra", "supino-inclinado-halteres", "desenvolvimento-halteres", "elevacao-lateral", "triceps-corda", "triceps-frances"] },
      B: { label: "Pull — Puxar", exercises: ["barra-fixa", "remada-curvada", "puxada-frente", "face-pull", "rosca-direta", "rosca-martelo"] },
      C: { label: "Legs — Pernas", exercises: ["agachamento-livre", "leg-press", "stiff", "cadeira-extensora", "panturrilha-em-pe", "prancha"] },
    },
  },
  {
    id: "upper-lower", name: "Superior e Inferior",
    description: "Quatro dias alternando parte de cima e de baixo do corpo.",
    level: "Intermediário", frequency: 4,
    schedule: { 0: null, 1: "A", 2: "B", 3: null, 4: "A", 5: "B", 6: null },
    workouts: {
      A: { label: "Superior", exercises: ["supino-reto-barra", "puxada-frente", "desenvolvimento-halteres", "remada-baixa", "rosca-direta", "triceps-corda"] },
      B: { label: "Inferior", exercises: ["agachamento-livre", "stiff", "leg-press", "mesa-flexora", "panturrilha-em-pe", "prancha"] },
    },
  },
  {
    id: "fullbody", name: "Full Body",
    description: "Corpo inteiro em cada sessão. Ideal para 2 a 3 treinos por semana.",
    level: "Todos os níveis", frequency: 3,
    schedule: { 0: null, 1: "A", 2: null, 3: "A", 4: null, 5: "A", 6: null },
    workouts: {
      A: { label: "Corpo inteiro", exercises: ["agachamento-livre", "supino-reto-barra", "remada-curvada", "desenvolvimento-halteres", "rosca-direta", "triceps-corda", "prancha"] },
    },
  },
  {
    id: "iniciante", name: "Treino iniciante",
    description: "Máquinas e movimentos guiados para as primeiras semanas de academia.",
    level: "Iniciante", frequency: 3,
    schedule: { 0: null, 1: "A", 2: null, 3: "B", 4: null, 5: "A", 6: null },
    workouts: {
      A: { label: "Empurrar · Core", exercises: ["supino-maquina", "desenvolvimento-maquina", "triceps-maquina", "cadeira-extensora", "abdominal-supra"] },
      B: { label: "Puxar · Pernas", exercises: ["puxada-frente", "remada-maquina", "rosca-cabo", "leg-press", "prancha"] },
    },
  },
  {
    id: "rapido-40", name: "Treino rápido — 40 minutos",
    description: "Sessões enxutas com exercícios compostos para dias corridos.",
    level: "Todos os níveis", frequency: 3,
    schedule: { 0: null, 1: "A", 2: null, 3: "B", 4: null, 5: "C", 6: null },
    workouts: {
      A: { label: "Peito · Costas", exercises: ["supino-reto-halteres", "puxada-frente", "triceps-corda", "abdominal-supra"] },
      B: { label: "Pernas · Core", exercises: ["agachamento-goblet", "stiff-halteres", "panturrilha-em-pe", "prancha"] },
      C: { label: "Ombros · Braços", exercises: ["desenvolvimento-halteres", "elevacao-lateral", "rosca-alternada", "triceps-barra"] },
    },
  },
];

export const DEFAULT_PLAN = WORKOUT_TEMPLATES[0];
export const DEFAULT_WORKOUTS = buildWorkouts(DEFAULT_PLAN);
