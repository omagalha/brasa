// Fotos moram no IndexedDB (localStorage tem limite pequeno e trava com base64).
// Migra automaticamente as fotos antigas do localStorage na primeira carga.
// Sem IndexedDB (navegadores antigos, ambientes de teste): cai pro localStorage.

import { idbAvailable, idbGet, idbSet, idbDel } from "./db";
import { notifySaveError } from "../utils/storage";

const IDB_KEY = "photos";
const LEGACY_KEY = "brasa-photos";
const EMPTY = { items: [] };

export async function loadPhotos() {
  try {
    if (idbAvailable()) {
      const fromIdb = await idbGet(IDB_KEY);
      if (fromIdb) return fromIdb;
      // migração: fotos antigas no localStorage
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) {
        const parsed = JSON.parse(legacy);
        await idbSet(IDB_KEY, parsed);
        localStorage.removeItem(LEGACY_KEY);
        return parsed;
      }
      return structuredClone(EMPTY);
    }
    const saved = localStorage.getItem(LEGACY_KEY);
    return saved ? JSON.parse(saved) : structuredClone(EMPTY);
  } catch (error) {
    console.error("Erro ao carregar fotos:", error);
    return structuredClone(EMPTY);
  }
}

// fila de escrita: gravações no IndexedDB são assíncronas e poderiam
// terminar fora de ordem em toques rápidos — a fila serializa tudo
let writeQueue = Promise.resolve();

export function savePhotos(photos) {
  writeQueue = writeQueue.then(async () => {
    try {
      if (idbAvailable()) {
        await idbSet(IDB_KEY, photos);
      } else {
        localStorage.setItem(LEGACY_KEY, JSON.stringify(photos));
      }
      return true;
    } catch (error) {
      console.error("Erro ao salvar fotos:", error);
      notifySaveError("fotos");
      return false;
    }
  });
  return writeQueue;
}

export function deleteAllPhotos() {
  writeQueue = writeQueue.then(async () => {
    try {
      if (idbAvailable()) await idbDel(IDB_KEY);
      localStorage.removeItem(LEGACY_KEY);
      return true;
    } catch (error) {
      console.error("Erro ao apagar fotos:", error);
      notifySaveError("fotos");
      return false;
    }
  });
  return writeQueue;
}
