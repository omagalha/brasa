export async function loadKey(key, fallback) {
  try {
    if (window.storage?.get) {
      const result = await window.storage.get(key);
      return result?.value ? JSON.parse(result.value) : structuredClone(fallback);
    }
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : structuredClone(fallback);
  } catch (error) {
    console.error(`Erro ao carregar ${key}:`, error);
    return structuredClone(fallback);
  }
}
// ---- notificação central de falha de salvamento ----
const saveErrorListeners = new Set();
export function onSaveError(cb) {
  saveErrorListeners.add(cb);
  return () => saveErrorListeners.delete(cb);
}
export function notifySaveError(what) {
  for (const cb of saveErrorListeners) cb(what);
}

export async function saveKey(key, value) {
  try {
    const serialized = JSON.stringify(value);
    if (window.storage?.set) {
      await window.storage.set(key, serialized);
      return;
    }
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Erro ao salvar ${key}:`, error);
    notifySaveError(key);
  }
}
