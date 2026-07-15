import { createExercise as E } from "./helpers";

export const hamstringExercises = [
  E("mesa-flexora", "Mesa flexora", "Posterior", "Máquina", 3, 12, 35, { secondaryMuscles: ["Glúteos"], type: "machine" }),
  E("cadeira-flexora", "Cadeira flexora", "Posterior", "Máquina", 3, 12, 35, { secondaryMuscles: ["Glúteos"], type: "machine" }),
  E("flexora-em-pe", "Flexora em pé", "Posterior", "Máquina", 3, 12, 20, { secondaryMuscles: ["Glúteos"], type: "machine" }),
  E("stiff", "Stiff com barra", "Posterior", "Barra", 4, 10, 40, { secondaryMuscles: ["Glúteos", "Costas"], type: "compound", restSeconds: 120 }),
  E("stiff-halteres", "Stiff com halteres", "Posterior", "Halteres", 3, 12, 16, { secondaryMuscles: ["Glúteos", "Costas"], type: "compound", restSeconds: 120 }),
  E("terra-romeno", "Levantamento terra romeno", "Posterior", "Barra", 3, 10, 40, { secondaryMuscles: ["Glúteos", "Costas"], type: "compound", restSeconds: 120 }),
  E("good-morning", "Good morning", "Posterior", "Barra", 3, 12, 20, { secondaryMuscles: ["Glúteos", "Costas"], type: "compound", restSeconds: 120 }),
  E("nordic-curl", "Nordic curl", "Posterior", "Corpo livre", 3, 6, 0, { secondaryMuscles: ["Glúteos"], type: "bodyweight", restSeconds: 60 }),
];
