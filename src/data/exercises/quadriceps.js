import { createExercise as E } from "./helpers";

export const quadricepsExercises = [
  E("agachamento-livre", "Agachamento livre", "Quadríceps", "Barra", 4, 10, 50, { secondaryMuscles: ["Glúteos"], type: "compound", restSeconds: 120 }),
  E("agachamento-smith", "Agachamento no Smith", "Quadríceps", "Smith", 4, 10, 40, { secondaryMuscles: ["Glúteos"], type: "compound", restSeconds: 120 }),
  E("agachamento-frontal", "Agachamento frontal", "Quadríceps", "Barra", 3, 8, 35, { secondaryMuscles: ["Glúteos"], type: "compound", restSeconds: 120 }),
  E("agachamento-goblet", "Agachamento goblet", "Quadríceps", "Halteres", 3, 12, 16, { secondaryMuscles: ["Glúteos"], type: "compound", restSeconds: 120 }),
  E("agachamento-bulgaro", "Agachamento búlgaro", "Quadríceps", "Halteres", 3, 10, 12, { secondaryMuscles: ["Glúteos"], type: "compound", restSeconds: 120 }),
  E("leg-press", "Leg press", "Quadríceps", "Máquina", 4, 12, 120, { secondaryMuscles: ["Glúteos"], type: "compound", restSeconds: 120 }),
  E("hack-machine", "Hack machine", "Quadríceps", "Máquina", 3, 10, 60, { secondaryMuscles: ["Glúteos"], type: "compound", restSeconds: 120 }),
  E("cadeira-extensora", "Cadeira extensora", "Quadríceps", "Máquina", 3, 15, 40, { type: "machine" }),
  E("afundo", "Afundo", "Quadríceps", "Halteres", 3, 12, 10, { secondaryMuscles: ["Glúteos"], type: "compound", restSeconds: 120 }),
  E("passada", "Passada (caminhando)", "Quadríceps", "Halteres", 3, 20, 10, { secondaryMuscles: ["Glúteos"], type: "compound", restSeconds: 120 }),
];
