// Estatísticas de treino para a aba Progresso (referência: dashboards da comunidade Hevy).

import { dkey } from "../utils/dates";

const DAY = 86400000;

const mondayOf = (d) => {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = (x.getDay() + 6) % 7; // seg=0 ... dom=6
  return new Date(x.getTime() - diff * DAY);
};

/** Soma o volume por dia: { "2026-07-14": 3240, ... } */
export function volumeByDay(sessions) {
  const map = {};
  for (const s of sessions) {
    map[s.date] = (map[s.date] || 0) + (s.volume || 0);
  }
  return map;
}

/**
 * Grade do heatmap: `weeks` colunas (semanas, seg→dom), terminando na semana atual.
 * Cada célula: { key, level (0-4), future }
 */
export function getHeatmapWeeks(sessions, { weeks = 12, today = new Date() } = {}) {
  const vols = volumeByDay(sessions);
  const max = Math.max(0, ...Object.values(vols));
  const level = (v) => {
    if (!v) return 0;
    if (!max) return 1;
    const r = v / max;
    return r > 0.75 ? 4 : r > 0.5 ? 3 : r > 0.25 ? 2 : 1;
  };
  const todayKey = dkey(today);
  const start = mondayOf(new Date(today.getTime() - (weeks - 1) * 7 * DAY));
  const grid = [];
  for (let w = 0; w < weeks; w++) {
    const col = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(start.getTime() + (w * 7 + d) * DAY);
      const key = dkey(date);
      col.push({ key, level: level(vols[key]), future: key > todayKey });
    }
    grid.push(col);
  }
  return grid;
}

/**
 * Volume das últimas `weeks` semanas (seg→dom), da mais antiga pra atual.
 * Cada item: { startKey, label, volume, sessions }
 */
export function getWeeklyVolumes(sessions, { weeks = 8, today = new Date() } = {}) {
  const start = mondayOf(new Date(today.getTime() - (weeks - 1) * 7 * DAY));
  const buckets = Array.from({ length: weeks }, (_, i) => {
    const d = new Date(start.getTime() + i * 7 * DAY);
    return {
      startKey: dkey(d),
      label: `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`,
      volume: 0,
      sessions: 0,
    };
  });
  for (const s of sessions) {
    for (let i = weeks - 1; i >= 0; i--) {
      if (s.date >= buckets[i].startKey) {
        buckets[i].volume += s.volume || 0;
        buckets[i].sessions += 1;
        break;
      }
    }
  }
  return buckets;
}
