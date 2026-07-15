import { describe, it, expect, beforeEach, vi } from "vitest";
import "fake-indexeddb/auto";
import { IDBFactory } from "fake-indexeddb";

// localStorage simples para ambiente node
function makeLocalStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
  };
}

const PHOTO = { date: "2026-07-01", type: "frente", dataUrl: "data:image/jpeg;base64,abc" };

beforeEach(() => {
  globalThis.indexedDB = new IDBFactory(); // banco limpo por teste
  globalThis.localStorage = makeLocalStorage();
  vi.doUnmock("../src/storage/db.js");
  vi.resetModules();
});

describe("migração de fotos localStorage → IndexedDB", () => {
  it("migra fotos antigas e remove a chave legada", async () => {
    localStorage.setItem("brasa-photos", JSON.stringify({ items: [PHOTO] }));
    const { loadPhotos } = await import("../src/storage/photoStorage.js");

    const photos = await loadPhotos();
    expect(photos.items).toHaveLength(1);
    expect(localStorage.getItem("brasa-photos")).toBe(null); // legado removido

    const again = await loadPhotos(); // agora direto do IndexedDB
    expect(again.items[0].dataUrl).toBe(PHOTO.dataUrl);
  });

  it("se o IndexedDB falhar, a chave legada NÃO é apagada", async () => {
    localStorage.setItem("brasa-photos", JSON.stringify({ items: [PHOTO] }));
    vi.doMock("../src/storage/db.js", () => ({
      idbAvailable: () => true,
      idbGet: async () => null,
      idbSet: async () => { throw new Error("quota"); },
      idbDel: async () => {},
    }));
    const { loadPhotos } = await import("../src/storage/photoStorage.js");

    const photos = await loadPhotos();
    expect(photos.items).toEqual([]); // falha vira estado vazio seguro
    expect(localStorage.getItem("brasa-photos")).not.toBe(null); // legado preservado
  });

  it("salva e apaga tudo pela fila (deleteAllPhotos remove a chave)", async () => {
    const { savePhotos, deleteAllPhotos, loadPhotos } = await import("../src/storage/photoStorage.js");
    await savePhotos({ items: [PHOTO] });
    expect((await loadPhotos()).items).toHaveLength(1);
    await deleteAllPhotos();
    expect((await loadPhotos()).items).toEqual([]);
  });
});
