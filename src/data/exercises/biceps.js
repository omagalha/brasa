import { createExercise as E } from "./helpers";

export const bicepsExercises = [
  E("rosca-direta", "Rosca direta", "Bíceps", "Barra", 4, 10, 12, { type: "isolation" }),
  E("rosca-alternada", "Rosca alternada", "Bíceps", "Halteres", 3, 12, 10, { type: "isolation" }),
  E("rosca-martelo", "Rosca martelo", "Bíceps", "Halteres", 3, 12, 10, { type: "isolation" }),
  E("rosca-scott", "Rosca Scott", "Bíceps", "Máquina", 3, 10, 20, { type: "machine" }),
  E("rosca-concentrada", "Rosca concentrada", "Bíceps", "Halteres", 3, 12, 10, { type: "isolation" }),
  E("rosca-cabo", "Rosca no cabo", "Bíceps", "Cabo", 3, 12, 20, { type: "isolation" }),
  E("rosca-21", "Rosca 21", "Bíceps", "Barra", 3, 21, 10, { type: "isolation" }),
  E("rosca-inversa", "Rosca inversa", "Bíceps", "Barra", 3, 12, 10, { type: "isolation" }),
  E("rosca-banco-inclinado", "Rosca em banco inclinado", "Bíceps", "Halteres", 3, 10, 8, { type: "isolation" }),
  E("rosca-spider", "Rosca spider", "Bíceps", "Halteres", 3, 12, 8, { type: "isolation" }),
];
