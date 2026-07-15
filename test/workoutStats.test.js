import { describe, it, expect } from "vitest";
import { getHeatmapWeeks, getWeeklyVolumes } from "../src/services/workoutStats";

const today = new Date(2026, 6, 15); // quarta
const sessions = [
  { date: "2026-07-13", volume: 3000 },
  { date: "2026-07-14", volume: 4000 },
  { date: "2026-07-07", volume: 2000 },
];

describe("estatísticas", () => {
  it("heatmap: 12 semanas × 7 dias, níveis por volume relativo", () => {
    const grid = getHeatmapWeeks(sessions, { weeks: 12, today });
    expect(grid).toHaveLength(12);
    expect(grid[0]).toHaveLength(7);
    const last = grid[11];
    expect(last[0].level).toBe(3); // 3000/4000
    expect(last[1].level).toBe(4); // máximo
    expect(last[2].level).toBe(0); // hoje sem treino
    expect(last[3].future).toBe(true); // quinta ainda não chegou
  });

  it("volume semanal agrupa por semana seg→dom", () => {
    const weeks = getWeeklyVolumes(sessions, { weeks: 8, today });
    expect(weeks).toHaveLength(8);
    expect(weeks[7]).toMatchObject({ volume: 7000, sessions: 2 });
    expect(weeks[6]).toMatchObject({ volume: 2000, sessions: 1 });
  });
});
