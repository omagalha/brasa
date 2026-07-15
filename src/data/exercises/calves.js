import { createExercise as E } from "./helpers";

export const calfExercises = [
  E("panturrilha-em-pe", "Panturrilha em pé", "Panturrilha", "Máquina", 4, 20, 60, { type: "machine" }),
  E("panturrilha-sentado", "Panturrilha sentado", "Panturrilha", "Máquina", 4, 15, 40, { type: "machine" }),
  E("panturrilha-leg-press", "Panturrilha no leg press", "Panturrilha", "Máquina", 4, 20, 80, { type: "compound", restSeconds: 120 }),
  E("panturrilha-unilateral", "Panturrilha unilateral", "Panturrilha", "Corpo livre", 3, 15, 0, { type: "bodyweight", restSeconds: 60 }),
  E("panturrilha-smith", "Panturrilha no Smith", "Panturrilha", "Smith", 4, 20, 40, { type: "isolation" }),
];
