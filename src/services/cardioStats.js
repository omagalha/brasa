import { dkey } from "../utils/dates";

const DAY = 86400000;

const mondayOf = (date) => {
  const value = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = (value.getDay() + 6) % 7;
  return new Date(value.getTime() - diff * DAY);
};

const finitePositive = (value) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
};

export function createCardioActivity(input, { id, createdAt } = {}) {
  const kind = String(input.kind || "").trim().toLowerCase();
  const date = String(input.date || "");
  const minutes = Math.round(finitePositive(input.minutes));
  const distanceKm = Math.round(finitePositive(input.distanceKm) * 100) / 100;

  if (!["corrida", "caminhada", "bicicleta", "outro"].includes(kind)) {
    throw new Error("Escolha um tipo de cardio válido.");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Informe uma data válida.");
  }
  const [year, month, day] = date.split("-").map(Number);
  const parsedDate = new Date(year, month - 1, day);
  if (dkey(parsedDate) !== date) {
    throw new Error("Informe uma data válida.");
  }
  if (minutes < 1 || minutes > 1440) {
    throw new Error("A duração deve ficar entre 1 e 1440 minutos.");
  }
  if (distanceKm > 1000) {
    throw new Error("A distância deve ser menor que 1000 km.");
  }

  return {
    id:
      id ||
      globalThis.crypto?.randomUUID?.() ||
      `cardio-${date}-${Date.now()}`,
    date,
    kind,
    minutes,
    ...(distanceKm ? { distanceKm } : {}),
    createdAt: createdAt || new Date().toISOString(),
  };
}

export function getRecentCardio(activities, { limit = 5 } = {}) {
  return [...activities]
    .sort((a, b) =>
      b.date.localeCompare(a.date) ||
      String(b.createdAt || "").localeCompare(String(a.createdAt || ""))
    )
    .slice(0, limit);
}

export function getWeeklyCardioStats(
  activities,
  { weeks = 8, today = new Date() } = {}
) {
  const start = mondayOf(
    new Date(today.getTime() - (weeks - 1) * 7 * DAY)
  );
  const buckets = Array.from({ length: weeks }, (_, index) => {
    const date = new Date(start.getTime() + index * 7 * DAY);
    return {
      startKey: dkey(date),
      label: `${String(date.getDate()).padStart(2, "0")}/${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`,
      minutes: 0,
      distanceKm: 0,
      activities: 0,
    };
  });

  for (const activity of activities) {
    for (let index = weeks - 1; index >= 0; index--) {
      if (activity.date >= buckets[index].startKey) {
        buckets[index].minutes += finitePositive(activity.minutes);
        buckets[index].distanceKm += finitePositive(activity.distanceKm);
        buckets[index].activities += 1;
        break;
      }
    }
  }

  return buckets.map((bucket) => ({
    ...bucket,
    distanceKm: Math.round(bucket.distanceKm * 100) / 100,
  }));
}

export function getCardioHeatmapWeeks(
  activities,
  { weeks = 12, today = new Date() } = {}
) {
  const minutesByDay = {};
  for (const activity of activities) {
    minutesByDay[activity.date] =
      (minutesByDay[activity.date] || 0) + finitePositive(activity.minutes);
  }
  const max = Math.max(0, ...Object.values(minutesByDay));
  const todayKey = dkey(today);
  const start = mondayOf(
    new Date(today.getTime() - (weeks - 1) * 7 * DAY)
  );

  return Array.from({ length: weeks }, (_, week) =>
    Array.from({ length: 7 }, (_, day) => {
      const date = new Date(start.getTime() + (week * 7 + day) * DAY);
      const key = dkey(date);
      const minutes = minutesByDay[key] || 0;
      const ratio = max ? minutes / max : 0;
      const level = !minutes
        ? 0
        : ratio > 0.75
          ? 4
          : ratio > 0.5
            ? 3
            : ratio > 0.25
              ? 2
              : 1;
      return { key, minutes, level, future: key > todayKey };
    })
  );
}
