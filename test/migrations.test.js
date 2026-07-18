import { describe, it, expect } from "vitest";
import { migrateCore, CURRENT_CORE_VERSION, EMPTY_CORE } from "../src/storage/migrations";

describe("migrações", () => {
  it("dados v1 chegam à versão atual com defaults", () => {
    const c = migrateCore({ waterByDay: { "2026-07-01": 2000 } });
    expect(c.version).toBe(CURRENT_CORE_VERSION);
    expect(c.activePlanId).toBeTruthy();
    expect(c.schedule).toBeTruthy();
    expect(Object.keys(c.workouts).length).toBeGreaterThan(0);
    expect(c.waterByDay["2026-07-01"]).toBe(2000);
    expect(c.cardio).toEqual([]);
    expect(c.updatedAt).toBe(null);
    expect(c.planChosen).toBe(true);
  });

  it("converte sessões sets{} para exercises{} resolvendo instâncias", () => {
    const c = migrateCore({
      version: 2,
      sessions: [{ date: "2026-07-10", split: "A",
        sets: { "supino-reto-barra-2": [{ kg: 30, reps: 12, done: true }], "7": [{ kg: 10, reps: 10, done: true }] } }],
    });
    const s = c.sessions[0];
    expect(s.exercises["supino-reto-barra-2"].exerciseId).toBe("supino-reto-barra");
    expect(s.exercises["7"].exerciseId).toBe(null);
    expect("sets" in s).toBe(false);
    expect(s.exercises["supino-reto-barra-2"].sets[0].type).toBe("normal");
  });

  it("é idempotente", () => {
    const once = migrateCore(structuredClone(EMPTY_CORE));
    const twice = migrateCore(once);
    expect(twice).toEqual(once);
  });

  it("preserva os dados antigos ao adicionar a fundação v4", () => {
    const legacy = {
      version: 3,
      waterByDay: { "2026-07-01": 2200 },
      weights: [{ date: "2026-07-01", kg: 80 }],
      sessions: [{ id: "s1", date: "2026-07-01", split: "A", exercises: {} }],
      doneDays: { "2026-07-01": true },
    };

    const c = migrateCore(legacy);

    expect(c).toMatchObject({
      version: 4,
      waterByDay: legacy.waterByDay,
      weights: legacy.weights,
      sessions: legacy.sessions,
      doneDays: legacy.doneDays,
      cardio: [],
      updatedAt: null,
      planChosen: true,
    });
  });

  it("mantém campos v4 válidos", () => {
    const updatedAt = "2026-07-18T12:00:00.000Z";
    const cardio = [{ id: "run-1", kind: "corrida", minutes: 30 }];
    const c = migrateCore({ version: 4, cardio, updatedAt, planChosen: false });

    expect(c.cardio).toEqual(cardio);
    expect(c.updatedAt).toBe(updatedAt);
    expect(c.planChosen).toBe(false);
  });
});
