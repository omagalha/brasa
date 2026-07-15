import { describe, it, expect } from "vitest";
import { suggestProgression } from "../src/services/progressionEngine";

const P = (sets) => ({ sets });
const done = (kg, reps) => ({ kg, reps, done: true });
const fail = (kg, reps) => ({ kg, reps, done: false });

describe("progressão", () => {
  it("completou tudo (composto) → +2,5 kg", () => {
    const s = suggestProgression({ exercise: { kg: 80 }, libExercise: { type: "compound" },
      performances: [P([done(80, 8), done(80, 8), done(80, 8)])] });
    expect(s).toMatchObject({ action: "increase", suggestedKg: 82.5 });
  });

  it("máquina → +5 kg | isolado → +1 kg", () => {
    expect(suggestProgression({ exercise: { kg: 40 }, libExercise: { type: "machine" },
      performances: [P([done(40, 12)])] }).suggestedKg).toBe(45);
    expect(suggestProgression({ exercise: { kg: 14 }, libExercise: { type: "isolation" },
      performances: [P([done(14, 12)])] }).suggestedKg).toBe(15);
  });

  it("falhou 2x seguidas → deload de 10% arredondado em 0,5", () => {
    const s = suggestProgression({ exercise: { kg: 14 }, libExercise: { type: "isolation" },
      performances: [P([done(14, 12), fail(14, 8)]), P([done(14, 12), fail(14, 9)])] });
    expect(s).toMatchObject({ action: "deload", suggestedKg: 12.5 });
  });

  it("falhou só 1x → manter", () => {
    const s = suggestProgression({ exercise: { kg: 14 }, libExercise: { type: "isolation" },
      performances: [P([fail(14, 9)]), P([done(14, 12)])] });
    expect(s.action).toBe("maintain");
  });

  it("corpo livre completo → +1 rep | sem histórico → none", () => {
    expect(suggestProgression({ exercise: { kg: 0 }, libExercise: { type: "bodyweight" },
      performances: [P([done(0, 15)])] }).action).toBe("reps");
    expect(suggestProgression({ exercise: { kg: 40 }, performances: [] }).action).toBe("none");
  });
});
