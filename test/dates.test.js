import { describe, it, expect } from "vitest";
import { dkey, fromKey, daysBetween, splitOfDate, streakOf } from "../src/utils/dates";

describe("datas", () => {
  it("dkey/fromKey são inversos", () => {
    const d = new Date(2026, 6, 15);
    expect(dkey(d)).toBe("2026-07-15");
    expect(dkey(fromKey("2026-07-15"))).toBe("2026-07-15");
  });

  it("daysBetween conta dias de calendário", () => {
    expect(daysBetween("2026-07-15", "2026-07-13")).toBe(2);
    expect(daysBetween("2026-08-01", "2026-07-31")).toBe(1);
  });

  it("splitOfDate segue a agenda e valida o treino", () => {
    const schedule = { 0: null, 1: "A", 2: "B", 3: "C", 4: "A", 5: "B", 6: null };
    const workouts = { A: {}, B: {}, C: {} };
    expect(splitOfDate(new Date(2026, 6, 15), schedule, workouts)).toBe("C"); // quarta
    expect(splitOfDate(new Date(2026, 6, 18), schedule, workouts)).toBe(null); // sábado
    expect(splitOfDate(new Date(2026, 6, 15), schedule, { A: {} })).toBe(null); // C não existe
    expect(splitOfDate(new Date(2026, 6, 15), null, workouts)).toBe(null);
  });

  it("streakOf conta dias consecutivos até hoje/ontem", () => {
    const today = dkey();
    const y1 = dkey(new Date(Date.now() - 86400000));
    const y2 = dkey(new Date(Date.now() - 2 * 86400000));
    expect(streakOf({ [today]: true, [y1]: true, [y2]: true })).toBe(3);
    expect(streakOf({ [y1]: true, [y2]: true })).toBe(2); // hoje ainda não fechou
    expect(streakOf({})).toBe(0);
  });
});
