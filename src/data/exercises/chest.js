import { createExercise as E } from "./helpers";

export const chestExercises = [
  E("supino-reto-barra", "Supino reto com barra", "Peito", "Barra", 4, 10, 40, { secondaryMuscles: ["Tríceps", "Ombros"], type: "compound", restSeconds: 120 }),
  E("supino-inclinado-barra", "Supino inclinado com barra", "Peito", "Barra", 4, 10, 30, { secondaryMuscles: ["Tríceps", "Ombros"], type: "compound", restSeconds: 120 }),
  E("supino-reto-halteres", "Supino reto com halteres", "Peito", "Halteres", 4, 10, 18, { secondaryMuscles: ["Tríceps", "Ombros"], type: "compound", restSeconds: 120 }),
  E("supino-inclinado-halteres", "Supino inclinado com halteres", "Peito", "Halteres", 3, 12, 16, { secondaryMuscles: ["Tríceps", "Ombros"], type: "compound", restSeconds: 120 }),
  E("crucifixo-reto", "Crucifixo reto", "Peito", "Halteres", 3, 12, 10, { secondaryMuscles: ["Ombros"], type: "isolation" }),
  E("crucifixo-inclinado", "Crucifixo inclinado", "Peito", "Halteres", 3, 12, 8, { secondaryMuscles: ["Ombros"], type: "isolation" }),
  E("crossover", "Crossover", "Peito", "Cabo", 3, 12, 15, { secondaryMuscles: ["Tríceps", "Ombros"], type: "isolation" }),
  E("peck-deck", "Peck deck (voador)", "Peito", "Máquina", 3, 12, 40, { secondaryMuscles: ["Ombros"], type: "machine" }),
  E("supino-maquina", "Supino máquina", "Peito", "Máquina", 3, 12, 35, { secondaryMuscles: ["Tríceps", "Ombros"], type: "compound", restSeconds: 120 }),
  E("flexao", "Flexão de braço", "Peito", "Corpo livre", 3, 15, 0, { secondaryMuscles: ["Tríceps", "Ombros"], type: "bodyweight", restSeconds: 60 }),
  E("paralelas-peito", "Paralelas (ênfase peito)", "Peito", "Corpo livre", 3, 10, 0, { secondaryMuscles: ["Tríceps", "Ombros"], type: "bodyweight", restSeconds: 60 }),
  E("pullover", "Pullover", "Peito", "Halteres", 3, 12, 14, { secondaryMuscles: ["Ombros"], type: "isolation" }),
];
