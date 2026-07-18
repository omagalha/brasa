import { describe, expect, it } from "vitest";
import {
  createCardioActivity,
  getCardioHeatmapWeeks,
  getRecentCardio,
  getWeeklyCardioStats,
} from "../src/services/cardioStats";

const today = new Date(2026, 6, 15);
const activities = [
  { id: "1", date: "2026-07-13", kind: "corrida", minutes: 30, distanceKm: 5 },
  { id: "2", date: "2026-07-14", kind: "caminhada", minutes: 60, distanceKm: 4 },
  { id: "3", date: "2026-07-07", kind: "bicicleta", minutes: 45, distanceKm: 12 },
];

describe("cardio manual", () => {
  it("normaliza uma atividade válida", () => {
    expect(createCardioActivity(
      { kind: " Corrida ", date: "2026-07-15", minutes: "31.4", distanceKm: "5.126" },
      { id: "run-1", createdAt: "2026-07-15T12:00:00.000Z" }
    )).toEqual({
      id: "run-1",
      date: "2026-07-15",
      kind: "corrida",
      minutes: 31,
      distanceKm: 5.13,
      createdAt: "2026-07-15T12:00:00.000Z",
    });
  });

  it("rejeita tipo, data e duração inválidos", () => {
    expect(() => createCardioActivity({ kind: "natação", date: "2026-07-15", minutes: 30 })).toThrow(/tipo/);
    expect(() => createCardioActivity({ kind: "corrida", date: "15/07/2026", minutes: 30 })).toThrow(/data/);
    expect(() => createCardioActivity({ kind: "corrida", date: "2026-02-31", minutes: 30 })).toThrow(/data/);
    expect(() => createCardioActivity({ kind: "corrida", date: "2026-07-15", minutes: 0 })).toThrow(/duração/);
  });

  it("retorna somente as cinco atividades mais recentes", () => {
    const list = Array.from({ length: 7 }, (_, index) => ({
      id: String(index),
      date: `2026-07-${String(index + 1).padStart(2, "0")}`,
    }));
    expect(getRecentCardio(list).map((item) => item.id)).toEqual(["6", "5", "4", "3", "2"]);
  });

  it("agrupa duração, distância e quantidade por semana", () => {
    const weeks = getWeeklyCardioStats(activities, { weeks: 2, today });
    expect(weeks[0]).toMatchObject({ minutes: 45, distanceKm: 12, activities: 1 });
    expect(weeks[1]).toMatchObject({ minutes: 90, distanceKm: 9, activities: 2 });
  });

  it("monta heatmap de 12 semanas por intensidade em minutos", () => {
    const grid = getCardioHeatmapWeeks(activities, { weeks: 12, today });
    expect(grid).toHaveLength(12);
    expect(grid[0]).toHaveLength(7);
    expect(grid[11][0]).toMatchObject({ minutes: 30, level: 2, future: false });
    expect(grid[11][1]).toMatchObject({ minutes: 60, level: 4, future: false });
    expect(grid[11][3].future).toBe(true);
  });
});
