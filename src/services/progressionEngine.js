// "IA BrasaFit" — progressão por regras, validada pelo modelo do Liftosaur.
// Função pura: recebe o exercício e as últimas performances, devolve uma sugestão.

const RULES = {
  compound: { increment: 2.5, deloadPercent: 10 },
  isolation: { increment: 1, deloadPercent: 10 },
  machine: { increment: 5, deloadPercent: 10 },
  bodyweight: { increment: 0, deloadPercent: 0 },
};

const roundHalf = (x) => Math.round(x * 2) / 2;
const isComplete = (p) => p.sets.length > 0 && p.sets.every((s) => s.done);

/**
 * @param exercise      instância do treino ({ kg, reps, ... })
 * @param libExercise   exercício da biblioteca (traz o `type`), pode ser null p/ legados
 * @param performances  últimas execuções, mais recente primeiro: [{ sets: [{kg,reps,done}] }]
 */
export function suggestProgression({ exercise, libExercise, performances }) {
  if (!performances?.length) {
    return { action: "none", reason: "Sem histórico suficiente." };
  }

  const type =
    libExercise?.type || (Number(exercise.kg) === 0 ? "bodyweight" : "isolation");
  const rule = RULES[type] || RULES.isolation;

  const last = performances[0];
  const doneKgs = last.sets.filter((s) => s.done).map((s) => s.kg);
  const lastKg = doneKgs.length ? Math.max(...doneKgs) : Number(exercise.kg) || 0;

  if (type === "bodyweight") {
    if (isComplete(last)) {
      return { action: "reps", suggestedKg: 0, reason: "Completou tudo — tente +1 repetição por série." };
    }
    return { action: "maintain", suggestedKg: 0, reason: "Mantenha até completar todas as séries." };
  }

  const failedTwice =
    performances.length >= 2 && !isComplete(performances[0]) && !isComplete(performances[1]);

  if (failedTwice) {
    return {
      action: "deload",
      suggestedKg: roundHalf(lastKg * (1 - rule.deloadPercent / 100)),
      reason: "Falhou em dois treinos seguidos — reduza para recuperar.",
    };
  }

  if (isComplete(last)) {
    return {
      action: "increase",
      suggestedKg: roundHalf(lastKg + rule.increment),
      reason: "Completou todas as séries no último treino.",
    };
  }

  return {
    action: "maintain",
    suggestedKg: lastKg,
    reason: "Mantenha a carga até completar todas as séries.",
  };
}
