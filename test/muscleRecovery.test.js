import { describe, it, expect } from "vitest";
import { getMuscleRecovery } from "../src/services/muscleRecovery";

const S = (date, id) => ({ date, exercises: { [id]: { exerciseId: id, sets: [{ kg: 40, reps: 10, done: true }] } } });

describe("recuperação muscular", () => {
  const today = new Date(2026, 6, 15);

  it("primário 72h: 1 dia = 33%, secundário conta metade", () => {
    const rec = getMuscleRecovery([S("2026-07-14", "agachamento-livre")], { today });
    const quad = rec.find((r) => r.muscle === "Quadríceps");
    const glut = rec.find((r) => r.muscle === "Glúteos");
    expect(quad.pct).toBe(33);
    expect(glut).toMatchObject({ pct: 67, stimulus: "secundário" });
  });

  it("treino de hoje = 0%; séries não concluídas não geram estímulo", () => {
    const rec = getMuscleRecovery([S("2026-07-15", "rosca-direta")], { today });
    expect(rec.find((r) => r.muscle === "Bíceps").pct).toBe(0);
    const noDone = [{ date: "2026-07-15", exercises: { x: { exerciseId: "rosca-direta", sets: [{ kg: 10, reps: 10, done: false }] } } }];
    expect(getMuscleRecovery(noDone, { today })).toHaveLength(0);
  });

  it("usa metadados da sessão quando o exercício não está na biblioteca curada", () => {
    const rec = getMuscleRecovery([{ date: "2026-07-14",
      exercises: { "x-Foo": { exerciseId: "x-Foo", muscle: "Peito", secondaryMuscles: ["Tríceps"], sets: [{ kg: 20, reps: 10, done: true }] } } }], { today });
    expect(rec.find((r) => r.muscle === "Peito").pct).toBe(33);
    expect(rec.find((r) => r.muscle === "Tríceps").stimulus).toBe("secundário");
  });
});
