import { describe, expect, it } from "vitest";
import {
  applySetEdit,
  stripSetEditingMetadata,
} from "../src/services/setEditing";

const sets = [
  { kg: 20, reps: 10, done: true },
  { kg: 20, reps: 10, done: false },
  { kg: 25, reps: 8, done: false, touched: true },
  { kg: 20, reps: 10, done: false },
];

describe("séries rápidas", () => {
  it("não muta o array nem as séries originais", () => {
    const original = structuredClone(sets);
    const edited = applySetEdit(sets, 1, "kg", 22.5);

    expect(edited).not.toBe(sets);
    expect(sets).toEqual(original);
  });

  it("replica apenas o campo alterado nas séries seguintes não tocadas", () => {
    const edited = applySetEdit(sets, 1, "kg", "22,5");

    expect(edited[0]).toEqual(sets[0]);
    expect(edited[1]).toEqual({ kg: 22.5, reps: 10, done: false, touched: true });
    expect(edited[2]).toEqual(sets[2]);
    expect(edited[3]).toEqual({ kg: 22.5, reps: 10, done: false });
  });

  it("preserva done e marca touched somente na série editada", () => {
    const edited = applySetEdit(sets, 0, "reps", 12);

    expect(edited.map((set) => set.done)).toEqual([true, false, false, false]);
    expect(edited[0].touched).toBe(true);
    expect(edited[1].touched).toBeUndefined();
    expect(edited[2].touched).toBe(true);
    expect(edited[3].touched).toBeUndefined();
    expect(edited.map((set) => set.kg)).toEqual([20, 20, 25, 20]);
  });

  it("preserva personalizações anteriores em edições posteriores", () => {
    const firstEdit = applySetEdit(sets, 1, "kg", 22);
    const secondEdit = applySetEdit(firstEdit, 3, "kg", 30);

    expect(secondEdit[1].kg).toBe(22);
    expect(secondEdit[2].kg).toBe(25);
    expect(secondEdit[3]).toMatchObject({ kg: 30, touched: true });
  });

  it("normaliza valores e rejeita campo ou índice inválidos", () => {
    expect(applySetEdit(sets, 1, "reps", "-5")[1].reps).toBe(0);
    expect(applySetEdit(sets, 1, "kg", "")[1].kg).toBe(0);
    expect(() => applySetEdit(sets, 99, "kg", 20)).toThrow(/Índice/);
    expect(() => applySetEdit(sets, 1, "done", true)).toThrow(/Campo/);
  });

  it("remove touched antes de persistir a sessão final", () => {
    expect(stripSetEditingMetadata({
      kg: 22,
      reps: 10,
      done: true,
      touched: true,
      type: "normal",
    })).toEqual({
      kg: 22,
      reps: 10,
      done: true,
      type: "normal",
    });
  });
});
