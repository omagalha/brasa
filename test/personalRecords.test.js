import { describe, it, expect } from "vitest";
import { estimateOneRepMax, getExerciseRecords } from "../src/services/personalRecords";

describe("recordes", () => {
  it("Epley: 1RM de 80kg×8 ≈ 101,3 | 1 rep = a própria carga", () => {
    expect(estimateOneRepMax(80, 8)).toBeCloseTo(101.33, 1);
    expect(estimateOneRepMax(100, 1)).toBe(100);
    expect(estimateOneRepMax(0, 10)).toBe(0);
  });

  it("varre o histórico ignorando séries não concluídas", () => {
    const sessions = [
      { date: "2026-07-01", exercises: { a: { exerciseId: "supino-reto-barra",
        sets: [{ kg: 40, reps: 10, done: true }, { kg: 60, reps: 1, done: false }] } } },
      { date: "2026-07-08", exercises: { a: { exerciseId: "supino-reto-barra",
        sets: [{ kg: 42.5, reps: 10, done: true }] } } },
    ];
    const r = getExerciseRecords(sessions, { id: "a", exerciseId: "supino-reto-barra" });
    expect(r.maxWeight).toBe(42.5);
    expect(r.bestSet).toMatchObject({ kg: 42.5, reps: 10, date: "2026-07-08" });
    expect(r.maxVolumeSet).toBe(425);
  });
});
