import { createExercise as E } from "./helpers";

export const gluteExercises = [
  E("elevacao-pelvica", "Elevação pélvica com barra", "Glúteos", "Barra", 4, 10, 50, { secondaryMuscles: ["Posterior"], type: "compound", restSeconds: 120 }),
  E("ponte-gluteo", "Ponte de glúteo", "Glúteos", "Corpo livre", 3, 15, 0, { secondaryMuscles: ["Posterior"], type: "bodyweight", restSeconds: 60 }),
  E("agachamento-sumo", "Agachamento sumô", "Glúteos", "Halteres", 3, 12, 20, { secondaryMuscles: ["Posterior"], type: "compound", restSeconds: 120 }),
  E("coice-cabo", "Coice no cabo", "Glúteos", "Cabo", 3, 12, 10, { type: "isolation" }),
  E("coice-maquina", "Coice na máquina", "Glúteos", "Máquina", 3, 12, 30, { type: "machine" }),
  E("abducao-maquina", "Abdução de quadril máquina", "Glúteos", "Máquina", 3, 15, 40, { type: "machine" }),
  E("abducao-caneleira", "Abdução com caneleira", "Glúteos", "Corpo livre", 3, 15, 3, { type: "isolation" }),
  E("afundo-gluteo", "Afundo com ênfase em glúteo", "Glúteos", "Halteres", 3, 12, 10, { type: "compound", restSeconds: 120 }),
];
