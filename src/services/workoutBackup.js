// Exporta e importa todos os dados do app em um único JSON.

import { CURRENT_CORE_VERSION, migrateCore } from "../storage/migrations";

export function buildBackup(core, photos) {
  return {
    app: "brasafit",
    backupVersion: 1,
    coreVersion: CURRENT_CORE_VERSION,
    exportedAt: new Date().toISOString(),
    core,
    photos,
  };
}

export function downloadBackup(core, photos, { includePhotos = true } = {}) {
  const payload = buildBackup(core, includePhotos ? photos : { items: [] });
  const data = JSON.stringify(payload);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `brasafit-backup-${date}${includePhotos ? "" : "-sem-fotos"}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Valida e normaliza um backup importado. Lança erro com mensagem amigável. */
export function parseBackup(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Arquivo inválido: não é um JSON.");
  }
  if (data?.app !== "brasafit" || !data.core || typeof data.core !== "object" || Array.isArray(data.core)) {
    throw new Error("Este arquivo não parece ser um backup do BrasaFit.");
  }
  if (
    data.backupVersion != null &&
    (!Number.isInteger(data.backupVersion) || data.backupVersion < 1 || data.backupVersion > 1)
  ) {
    throw new Error("Versão de backup incompatível com esta versão do BrasaFit.");
  }
  if (
    data.coreVersion != null &&
    (!Number.isInteger(data.coreVersion) || data.coreVersion < 1 || data.coreVersion > CURRENT_CORE_VERSION)
  ) {
    throw new Error("Versão dos dados incompatível com esta versão do BrasaFit.");
  }
  const core = data.core;
  // estrutura mínima: coleções precisam ter o tipo certo (ou estar ausentes)
  const badShape =
    (core.sessions != null && !Array.isArray(core.sessions)) ||
    (core.cardio != null && !Array.isArray(core.cardio)) ||
    (core.weights != null && !Array.isArray(core.weights)) ||
    (core.waterByDay != null && (typeof core.waterByDay !== "object" || Array.isArray(core.waterByDay))) ||
    (core.doneDays != null && (typeof core.doneDays !== "object" || Array.isArray(core.doneDays))) ||
    (core.workouts != null && (typeof core.workouts !== "object" || Array.isArray(core.workouts))) ||
    (core.schedule != null && (typeof core.schedule !== "object" || Array.isArray(core.schedule))) ||
    (core.planChosen != null && typeof core.planChosen !== "boolean") ||
    (core.updatedAt != null &&
      (typeof core.updatedAt !== "string" || Number.isNaN(Date.parse(core.updatedAt))));
  if (badShape) {
    throw new Error("Backup corrompido: a estrutura dos dados não confere.");
  }
  // pesos: mantém apenas registros válidos
  if (Array.isArray(core.weights)) {
    core.weights = core.weights.filter(
      (w) => w && typeof w.date === "string" && typeof w.kg === "number" && w.kg > 20 && w.kg < 400
    );
  }
  // fotos: mantém apenas itens com os campos esperados
  const rawItems = Array.isArray(data.photos?.items) ? data.photos.items : [];
  const photos = {
    items: rawItems.filter(
      (i) =>
        i && typeof i.date === "string" && typeof i.type === "string" &&
        typeof i.dataUrl === "string" && i.dataUrl.startsWith("data:image/")
    ),
  };
  return { core: migrateCore(core), photos };
}
