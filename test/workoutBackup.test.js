import { describe, it, expect } from "vitest";
import { buildBackup, parseBackup } from "../src/services/workoutBackup";

describe("backup", () => {
  it("round-trip migra o core importado para a versão atual", () => {
    const core = { version: 2, sessions: [{ date: "2026-07-01", split: "A",
      sets: { "rosca-direta": [{ kg: 12, reps: 10, done: true }] } }] };
    const photos = { items: [{ date: "2026-07-01", type: "frente", dataUrl: "data:image/jpeg;base64,abc" }] };
    const parsed = parseBackup(JSON.stringify(buildBackup(core, photos)));
    expect(parsed.core.version).toBe(3);
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
});
