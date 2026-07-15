// Busca de histórico por exercício. O vínculo é o exerciseId (exercício-base),
// então renomear ou duplicar a instância no treino não perde o histórico.

const matches = (entryKey, entry, ex) => {
  const base = ex.exerciseId || null;
  if (entry?.exerciseId && base) return entry.exerciseId === base;
  return entryKey === ex.id;
};

/**
 * Performances mais recentes primeiro.
 * @param opts.planId  filtra pelo plano (sessões antigas sem planId sempre passam)
 * @param opts.split   filtra pelo treino (A/B/C)
 * @param opts.limit   máximo de resultados
 */
export function getExercisePerformances(sessions, ex, opts = {}) {
  const { planId, split, limit = Infinity } = opts;
  const out = [];
  for (let i = sessions.length - 1; i >= 0 && out.length < limit; i--) {
    const s = sessions[i];
    if (planId && s.planId && s.planId !== planId) continue;
    if (split && s.split !== split) continue;
    for (const [key, entry] of Object.entries(s.exercises || {})) {
      if (matches(key, entry, ex)) {
        out.push({
          date: s.date,
          split: s.split,
          planName: s.planName,
          sets: entry.sets || [],
        });
        break;
      }
    }
  }
  return out;
}

/** Séries concluídas da execução mais recente que teve alguma série feita. */
export function getLastDoneSets(sessions, ex, opts = {}) {
  const performances = getExercisePerformances(sessions, ex, { ...opts, limit: 5 });
  for (const p of performances) {
    const done = p.sets.filter((s) => s.done);
    if (done.length) return done;
  }
  return null;
}
