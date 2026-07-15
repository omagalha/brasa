import { createExercise as E } from "./helpers";

export const tricepsExercises = [
  E("triceps-corda", "Tríceps corda", "Tríceps", "Cabo", 4, 12, 25, { type: "isolation" }),
  E("triceps-barra", "Tríceps na barra reta", "Tríceps", "Cabo", 3, 12, 25, { type: "isolation" }),
  E("triceps-frances", "Tríceps francês", "Tríceps", "Halteres", 3, 12, 12, { type: "isolation" }),
  E("triceps-testa", "Tríceps testa", "Tríceps", "Barra", 3, 10, 15, { type: "isolation" }),
  E("triceps-coice", "Tríceps coice", "Tríceps", "Halteres", 3, 12, 8, { type: "isolation" }),
  E("paralelas", "Paralelas (mergulho)", "Tríceps", "Corpo livre", 3, 10, 0, { secondaryMuscles: ["Peito", "Ombros"], type: "bodyweight", restSeconds: 60 }),
  E("triceps-banco", "Tríceps no banco", "Tríceps", "Corpo livre", 3, 12, 0, { type: "bodyweight", restSeconds: 60 }),
  E("triceps-unilateral-cabo", "Tríceps unilateral no cabo", "Tríceps", "Cabo", 3, 12, 10, { type: "isolation" }),
  E("supino-fechado", "Supino fechado", "Tríceps", "Barra", 3, 10, 30, { secondaryMuscles: ["Peito", "Ombros"], type: "compound", restSeconds: 120 }),
  E("triceps-maquina", "Tríceps máquina", "Tríceps", "Máquina", 3, 12, 30, { type: "machine" }),
];
