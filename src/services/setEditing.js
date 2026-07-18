const EDITABLE_FIELDS = new Set(["kg", "reps"]);

/**
 * Edita uma série e replica somente o campo alterado para as séries seguintes
 * que ainda não foram personalizadas.
 */
export function applySetEdit(sets, index, field, value) {
  if (!Array.isArray(sets)) throw new Error("Séries inválidas.");
  if (!Number.isInteger(index) || index < 0 || index >= sets.length) {
    throw new Error("Índice de série inválido.");
  }
  if (!EDITABLE_FIELDS.has(field)) {
    throw new Error("Campo de série inválido.");
  }

  const parsed = Number.parseFloat(String(value).replace(",", "."));
  const normalized = Number.isFinite(parsed) ? Math.max(0, parsed) : 0;

  return sets.map((set, currentIndex) => {
    if (currentIndex < index) return set;
    if (currentIndex === index) {
      return { ...set, [field]: normalized, touched: true };
    }
    if (set.touched) return set;
    return { ...set, [field]: normalized };
  });
}

export function stripSetEditingMetadata(set) {
  const { touched, ...persisted } = set;
  return persisted;
}
