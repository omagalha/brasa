import { describe, expect, it } from "vitest";
import {
  getCardioGoalProgress,
  getDayCompletion,
  resolveDay,
} from "../src/services/schedule";
import { WORKOUT_TEMPLATES } from "../src/data/workoutTemplates";
import { buildWorkouts } from "../src/services/workoutBuilder";

const monday = new Date(2026, 6, 13);
const workouts = { A: {}, B: {} };

describe("agenda híbrida", () => {
  it("resolve a agenda antiga sem mudar seu significado", () => {
    expect(resolveDay({ 1: "A" }, monday, workouts)).toEqual({
      split: "A",
      cardio: null,
    });
    expect(resolveDay({ 1: "C" }, monday, workouts)).toEqual({
      split: null,
      cardio: null,
    });
  });

  it("resolve dias de força, cardio e híbridos", () => {
    expect(resolveDay({
      1: { split: "A", cardio: { kind: "corrida", minutes: 15 } },
    }, monday, workouts)).toEqual({
      split: "A",
      cardio: { kind: "corrida", minutes: 15 },
    });
    expect(resolveDay({
      1: { cardio: { kind: "caminhada", minutes: 30 } },
    }, monday, workouts)).toEqual({
      split: null,
      cardio: { kind: "caminhada", minutes: 30 },
    });
  });

  it("ignora partes inválidas sem quebrar a outra missão", () => {
    expect(resolveDay({
      1: { split: "C", cardio: { kind: "corrida", minutes: 20 } },
    }, monday, workouts)).toEqual({
      split: null,
      cardio: { kind: "corrida", minutes: 20 },
    });
  });

  it("soma somente o tipo de cardio previsto", () => {
    const progress = getCardioGoalProgress([
      { date: "2026-07-13", kind: "corrida", minutes: 20 },
      { date: "2026-07-13", kind: "corrida", minutes: 15 },
      { date: "2026-07-13", kind: "caminhada", minutes: 60 },
    ], "2026-07-13", { kind: "corrida", minutes: 30 });

    expect(progress).toEqual({ minutes: 35, target: 30, completed: true });
  });

  it("conclui o dia somente quando água e missões estão completas", () => {
    const input = {
      day: { split: "A", cardio: { kind: "corrida", minutes: 30 } },
      dateKey: "2026-07-13",
      sessions: [{ date: "2026-07-13", split: "A", completed: true }],
      cardio: [{ date: "2026-07-13", kind: "corrida", minutes: 30 }],
      water: 3000,
      waterGoal: 3000,
    };
    expect(getDayCompletion(input).completed).toBe(true);
    expect(getDayCompletion({ ...input, cardio: [] }).completed).toBe(false);
    expect(getDayCompletion({ ...input, water: 2000 }).completed).toBe(false);
  });

  it("mantém o template híbrido sem contradição entre agenda e missão", () => {
    const template = WORKOUT_TEMPLATES.find(
      (item) => item.id === "hibrido-forca-corrida"
    );
    const hybridWorkouts = buildWorkouts(template);

    expect(resolveDay(template.schedule, new Date(2026, 6, 13), hybridWorkouts)).toEqual({
      split: "A",
      cardio: { kind: "corrida", minutes: 15 },
    });
    expect(resolveDay(template.schedule, new Date(2026, 6, 14), hybridWorkouts)).toEqual({
      split: null,
      cardio: { kind: "corrida", minutes: 30 },
    });
    expect(resolveDay(template.schedule, new Date(2026, 6, 17), hybridWorkouts)).toEqual({
      split: "C",
      cardio: { kind: "caminhada", minutes: 20 },
    });
  });
});
