const CARDIO_KINDS = new Set(["corrida", "caminhada", "bicicleta", "outro"]);

const normalizeCardioGoal = (cardio) => {
  if (!cardio || typeof cardio !== "object" || Array.isArray(cardio)) return null;
  const kind = String(cardio.kind || "").toLowerCase();
  const minutes = Math.round(Number(cardio.minutes));
  if (!CARDIO_KINDS.has(kind) || !Number.isFinite(minutes) || minutes < 1) {
    return null;
  }
  return { kind, minutes };
};

/**
 * Resolve qualquer formato de agenda para uma forma única.
 * Legado: schedule[weekday] = "A"
 * Híbrido: schedule[weekday] = { split: "A", cardio: { kind, minutes } }
 */
export function resolveDay(schedule, date = new Date(), workouts = {}) {
  const raw = schedule?.[date.getDay()];
  if (!raw) return { split: null, cardio: null };

  if (typeof raw === "string") {
    return { split: workouts[raw] ? raw : null, cardio: null };
  }
  if (typeof raw !== "object" || Array.isArray(raw)) {
    return { split: null, cardio: null };
  }

  return {
    split:
      typeof raw.split === "string" && workouts[raw.split]
        ? raw.split
        : null,
    cardio: normalizeCardioGoal(raw.cardio),
  };
}

export function getCardioGoalProgress(activities, dateKey, goal) {
  if (!goal) return { minutes: 0, target: 0, completed: true };
  const minutes = activities
    .filter(
      (activity) =>
        activity.date === dateKey && (!goal.kind || activity.kind === goal.kind)
    )
    .reduce((total, activity) => total + (Number(activity.minutes) || 0), 0);
  return {
    minutes,
    target: goal.minutes,
    completed: minutes >= goal.minutes,
  };
}

export function getDayCompletion({
  day,
  dateKey,
  sessions = [],
  cardio = [],
  water = 0,
  waterGoal = 0,
}) {
  const workoutCompleted = day.split
    ? sessions.some(
        (session) =>
          session.date === dateKey &&
          session.split === day.split &&
          session.completed !== false
      )
    : true;
  const cardioProgress = getCardioGoalProgress(cardio, dateKey, day.cardio);
  const waterCompleted = water >= waterGoal;

  return {
    workoutCompleted,
    cardioProgress,
    waterCompleted,
    completed:
      workoutCompleted && cardioProgress.completed && waterCompleted,
  };
}
