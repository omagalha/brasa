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
});
