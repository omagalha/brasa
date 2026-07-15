import { describe, it, expect } from "vitest";
import { getExercisePerformances, getLastDoneSets } from "../src/services/workoutHistory";

const sessions = [
  { date: "2026-07-01", split: "A", planId: "ppl",
    exercises: { "supino-reto-barra": { exerciseId: "supino-reto-barra", sets: [{ kg: 35, reps: 10, done: true }] } } },
  { date: "2026-07-08", split: "A", planId: "abcab-hipertrofia",
    exercises: { "supino-reto-barra": { exerciseId: "supino-reto-barra", sets: [{ kg: 40, reps: 10, done: true }] } } },
  { date: "2026-07-10", split: "A", planId: "abcab-hipertrofia",
    exercises: { "renomeado-123": { exerciseId: "supino-reto-barra", sets: [{ kg: 42.5, reps: 8, done: false }] } } },
];

describe("histórico por exercício", () => {
  const ex = { id: "qualquer", exerciseId: "supino-reto-barra" };

  it("casa por exerciseId mesmo com instância renomeada", () => {
    expect(getExercisePerformances(sessions, ex)).toHaveLength(3);
  });

  it("filtra por plano (sessões de outro plano ficam de fora)", () => {
    const ps = getExercisePerformances(sessions, ex, { planId: "abcab-hipertrofia" });
    expect(ps).toHaveLength(2);
    expect(ps[0].date).toBe("2026-07-10");
  });

  it("getLastDoneSets pula execuções sem séries concluídas", () => {
    const last = getLastDoneSets(sessions, ex, { planId: "abcab-hipertrofia" });
    expect(last[0]).toMatchObject({ kg: 40, reps: 10 });
  });

  it("instância legada sem exerciseId casa pela chave", () => {
    const legacy = [{ date: "2026-07-01", split: "A",
      exercises: { "3": { exerciseId: null, sets: [{ kg: 10, reps: 10, done: true }] } } }];
    expect(getExercisePerformances(legacy, { id: "3", exerciseId: null })).toHaveLength(1);
  });
});
