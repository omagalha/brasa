import { describe, it, expect } from "vitest";
import { buildBackup, parseBackup } from "../src/services/workoutBackup";

describe("backup", () => {
  it("round-trip migra o core importado para a versão atual", () => {
    const core = { version: 2, sessions: [{ date: "2026-07-01", split: "A",
      sets: { "rosca-direta": [{ kg: 12, reps: 10, done: true }] } }] };
    const photos = { items: [{ date: "2026-07-01", type: "frente", dataUrl: "data:image/jpeg;base64,abc" }] };
    const parsed = parseBackup(JSON.stringify(buildBackup(core, photos)));
    expect(parsed.core.version).toBe(4);
    expect(parsed.core.sessions[0].exercises).toBeTruthy();
    expect(parsed.photos.items).toHaveLength(1);
  });

  it("rejeita arquivos inválidos com mensagens amigáveis", () => {
    expect(() => parseBackup("not json")).toThrow(/não é um JSON/);
    expect(() => parseBackup('{"app":"outro"}')).toThrow(/não parece ser um backup/);
    expect(() => parseBackup("{}")).toThrow(/não parece ser um backup/);
  });

  it("fotos ausentes ou malformadas viram lista vazia", () => {
    const parsed = parseBackup(JSON.stringify({ app: "brasafit", core: {}, photos: "corrompido" }));
    expect(parsed.photos).toEqual({ items: [] });
  });

  it("rejeita versões futuras e estruturas v4 corrompidas", () => {
    expect(() =>
      parseBackup(JSON.stringify({ app: "brasafit", backupVersion: 2, core: {} }))
    ).toThrow(/Versão de backup incompatível/);
    expect(() =>
      parseBackup(JSON.stringify({ app: "brasafit", coreVersion: 99, core: {} }))
    ).toThrow(/Versão dos dados incompatível/);

    for (const core of [
      { cardio: {} },
      { planChosen: "sim" },
      { updatedAt: "ontem" },
      { schedule: [] },
    ]) {
      expect(() =>
        parseBackup(JSON.stringify({ app: "brasafit", core }))
      ).toThrow(/estrutura dos dados não confere/);
    }
  });

  it("faz round-trip dos campos v4", () => {
    const core = {
      version: 4,
      cardio: [{ id: "walk-1", kind: "caminhada", minutes: 20 }],
      updatedAt: "2026-07-18T12:00:00.000Z",
      planChosen: true,
    };
    const parsed = parseBackup(JSON.stringify(buildBackup(core, { items: [] })));

    expect(parsed.core).toMatchObject(core);
  });
});
