import { createExercise as E } from "./helpers";

export const backExercises = [
  E("puxada-frente", "Puxada frente", "Costas", "Máquina", 4, 10, 50, { secondaryMuscles: ["Bíceps"], type: "compound", restSeconds: 120 }),
  E("puxada-triangulo", "Puxada com triângulo", "Costas", "Máquina", 3, 12, 45, { secondaryMuscles: ["Bíceps"], type: "compound", restSeconds: 120 }),
  E("puxada-supinada", "Puxada supinada", "Costas", "Máquina", 3, 10, 45, { secondaryMuscles: ["Bíceps"], type: "compound", restSeconds: 120 }),
  E("barra-fixa", "Barra fixa", "Costas", "Corpo livre", 4, 8, 0, { secondaryMuscles: ["Bíceps"], type: "bodyweight", restSeconds: 60 }),
  E("remada-baixa", "Remada baixa", "Costas", "Cabo", 4, 10, 45, { secondaryMuscles: ["Bíceps"], type: "compound", restSeconds: 120 }),
  E("remada-curvada", "Remada curvada", "Costas", "Barra", 3, 12, 30, { secondaryMuscles: ["Bíceps"], type: "compound", restSeconds: 120 }),
  E("remada-unilateral", "Remada unilateral (serrote)", "Costas", "Halteres", 3, 10, 18, { secondaryMuscles: ["Bíceps"], type: "compound", restSeconds: 120 }),
  E("remada-cavalinho", "Remada cavalinho", "Costas", "Barra", 3, 10, 30, { secondaryMuscles: ["Bíceps"], type: "compound", restSeconds: 120 }),
  E("remada-maquina", "Remada máquina", "Costas", "Máquina", 3, 12, 40, { secondaryMuscles: ["Bíceps"], type: "compound", restSeconds: 120 }),
  E("pulldown-braco-reto", "Pulldown braço reto", "Costas", "Cabo", 3, 12, 25, { secondaryMuscles: ["Bíceps"], type: "isolation" }),
  E("levantamento-terra", "Levantamento terra", "Costas", "Barra", 4, 6, 60, { secondaryMuscles: ["Glúteos", "Posterior"], type: "compound", restSeconds: 120 }),
  E("hiperextensao", "Hiperextensão lombar", "Costas", "Corpo livre", 3, 15, 0, { type: "bodyweight", restSeconds: 60 }),
  E("encolhimento-barra", "Encolhimento com barra", "Costas", "Barra", 3, 15, 40, { type: "isolation" }),
  E("encolhimento-halteres", "Encolhimento com halteres", "Costas", "Halteres", 3, 15, 20, { type: "isolation" }),
  E("remada-alta", "Remada alta", "Costas", "Barra", 3, 12, 20, { secondaryMuscles: ["Bíceps"], type: "compound", restSeconds: 120 }),
];
