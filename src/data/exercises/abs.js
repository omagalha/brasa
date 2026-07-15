import { createExercise as E } from "./helpers";

export const abdominalExercises = [
  E("prancha", "Prancha (segundos)", "Abdômen", "Corpo livre", 3, 45, 0, { type: "bodyweight", restSeconds: 60 }),
  E("prancha-lateral", "Prancha lateral (segundos)", "Abdômen", "Corpo livre", 3, 30, 0, { type: "bodyweight", restSeconds: 60 }),
  E("abdominal-supra", "Abdominal supra", "Abdômen", "Corpo livre", 3, 20, 0, { type: "bodyweight", restSeconds: 60 }),
  E("abdominal-infra", "Abdominal infra", "Abdômen", "Corpo livre", 3, 15, 0, { type: "bodyweight", restSeconds: 60 }),
  E("abdominal-obliquo", "Abdominal oblíquo", "Abdômen", "Corpo livre", 3, 15, 0, { type: "bodyweight", restSeconds: 60 }),
  E("elevacao-pernas", "Elevação de pernas", "Abdômen", "Corpo livre", 3, 12, 0, { type: "bodyweight", restSeconds: 60 }),
  E("abdominal-maquina", "Abdominal máquina", "Abdômen", "Máquina", 3, 15, 30, { type: "machine" }),
  E("abdominal-corda", "Abdominal na corda", "Abdômen", "Cabo", 3, 15, 20, { type: "isolation" }),
  E("russian-twist", "Russian twist", "Abdômen", "Corpo livre", 3, 20, 5, { type: "isolation" }),
  E("roda-abdominal", "Roda abdominal", "Abdômen", "Corpo livre", 3, 10, 0, { type: "bodyweight", restSeconds: 60 }),
];
