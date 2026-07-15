import { createExercise as E } from "./helpers";

export const shoulderExercises = [
  E("desenvolvimento-halteres", "Desenvolvimento com halteres", "Ombros", "Halteres", 4, 10, 14, { secondaryMuscles: ["Tríceps"], type: "compound", restSeconds: 120 }),
  E("desenvolvimento-barra", "Desenvolvimento com barra", "Ombros", "Barra", 4, 8, 25, { secondaryMuscles: ["Tríceps"], type: "compound", restSeconds: 120 }),
  E("desenvolvimento-maquina", "Desenvolvimento máquina", "Ombros", "Máquina", 3, 12, 30, { secondaryMuscles: ["Tríceps"], type: "compound", restSeconds: 120 }),
  E("arnold-press", "Arnold press", "Ombros", "Halteres", 3, 10, 12, { secondaryMuscles: ["Tríceps"], type: "compound", restSeconds: 120 }),
  E("elevacao-lateral", "Elevação lateral", "Ombros", "Halteres", 3, 15, 8, { type: "isolation" }),
  E("elevacao-lateral-cabo", "Elevação lateral no cabo", "Ombros", "Cabo", 3, 12, 7, { type: "isolation" }),
  E("elevacao-lateral-maquina", "Elevação lateral máquina", "Ombros", "Máquina", 3, 15, 25, { type: "machine" }),
  E("elevacao-frontal", "Elevação frontal", "Ombros", "Halteres", 3, 12, 8, { type: "isolation" }),
  E("crucifixo-inverso", "Crucifixo inverso", "Ombros", "Halteres", 3, 15, 7, { type: "isolation" }),
  E("crucifixo-inverso-maquina", "Crucifixo inverso máquina", "Ombros", "Máquina", 3, 15, 30, { type: "machine" }),
  E("face-pull", "Face pull", "Ombros", "Cabo", 3, 15, 20, { type: "isolation" }),
  E("desenvolvimento-smith", "Desenvolvimento no Smith", "Ombros", "Smith", 3, 10, 20, { secondaryMuscles: ["Tríceps"], type: "compound", restSeconds: 120 }),
];
