// Biblioteca estendida (free-exercise-db, domínio público): 873 exercícios com imagem.
// Carregada sob demanda pra não pesar o bundle inicial.

let cache = null;
let loading = null;

export function loadExtendedLibrary() {
  if (cache) return Promise.resolve(cache);
  if (loading) return loading;
  loading = fetch("/exercises-extended.json")
    .then((r) => {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then((list) => {
      cache = Array.isArray(list) ? list : [];
      return cache;
    })
    .catch((err) => {
      console.warn("Biblioteca estendida indisponível:", err.message);
      loading = null; // permite tentar de novo
      return [];
    });
  return loading;
}
