import { DEFAULT_PLAN, DEFAULT_WORKOUTS } from "../data/workoutTemplates";
import { EXERCISES_BY_ID } from "../data/exercises";

export const CURRENT_CORE_VERSION = 4;

export const EMPTY_CORE = {
  version: CURRENT_CORE_VERSION,
  waterByDay: {},
  waterGoal: 3000,
  weights: [],
  workouts: DEFAULT_WORKOUTS,
  activePlanId: DEFAULT_PLAN.id,
  activePlanName: DEFAULT_PLAN.name,
  schedule: structuredClone(DEFAULT_PLAN.schedule),
  sessions: [],
  cardio: [],
  doneDays: {},
  updatedAt: null,
  planChosen: false,
};

// tenta descobrir o exercício-base a partir do id da instância ("supino-reto-barra-2")
function resolveBaseId(instanceKey) {
  const key = String(instanceKey);
  if (EXERCISES_BY_ID[key]) return key;
  const m = key.match(/^(.*)-\d+$/);
  if (m && EXERCISES_BY_ID[m[1]]) return m[1];
  return null;
}

export function migrateCore(savedCore) {
  const core = structuredClone(savedCore || {});
  if (!core.version) core.version = 1;

  if (core.version < 2) {
    core.schedule ||= structuredClone(DEFAULT_PLAN.schedule);
    core.activePlanId ||= DEFAULT_PLAN.id;
    core.activePlanName ||= DEFAULT_PLAN.name;
    if (!core.workouts || !Object.keys(core.workouts).length) {
      core.workouts = structuredClone(DEFAULT_WORKOUTS);
    }
    core.version = 2;
  }

  if (core.version < 3) {
    core.sessions = (core.sessions || []).map((s) => {
      if (s.exercises || !s.sets) {
        return { id: s.id || `sessao-${s.date}-${s.split}`, ...s };
      }
      const exercises = {};
      for (const [key, sets] of Object.entries(s.sets)) {
        const base = resolveBaseId(key);
        exercises[key] = {
          exerciseId: base,
          name: base ? EXERCISES_BY_ID[base].name : String(key),
          sets: (sets || []).map((x) => ({ ...x, type: x.type || "normal" })),
        };
      }
      const { sets, ...rest } = s;
      return { id: s.id || `sessao-${s.date}-${s.split}`, ...rest, exercises };
    });
    core.version = 3;
  }

  if (core.version < 4) {
    core.cardio = Array.isArray(core.cardio) ? core.cardio : [];
    core.updatedAt =
      typeof core.updatedAt === "string" && !Number.isNaN(Date.parse(core.updatedAt))
        ? core.updatedAt
        : null;
    // Quem já usava uma versão anterior deve continuar direto no app.
    core.planChosen =
      typeof core.planChosen === "boolean" ? core.planChosen : true;
    core.version = 4;
  }

  core.waterGoal ||= 3000;
  core.waterByDay ||= {};
  core.weights ||= [];
  core.sessions ||= [];
  core.cardio = Array.isArray(core.cardio) ? core.cardio : [];
  core.doneDays ||= {};
  core.updatedAt =
    typeof core.updatedAt === "string" && !Number.isNaN(Date.parse(core.updatedAt))
      ? core.updatedAt
      : null;
  core.planChosen =
    typeof core.planChosen === "boolean" ? core.planChosen : false;
  return core;
}
