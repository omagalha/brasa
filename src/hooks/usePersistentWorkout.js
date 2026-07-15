import { useCallback, useEffect, useState } from "react";
import { loadKey, saveKey } from "../utils/storage";

export const EMPTY_SESSION = {
  date: null,
  sel: "A",
  progress: {},
  startTs: null,
  rest: 0,
  paused: false,
  confirmPartial: false,
};

const KEY = "brasa-active-workout";

export function usePersistentWorkout() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    loadKey(KEY, EMPTY_SESSION).then(setSession);
  }, []);

  const updateSession = useCallback((update) => {
    setSession((current) => {
      const next =
        typeof update === "function" ? update(current) : { ...current, ...update };
      saveKey(KEY, next);
      return next;
    });
  }, []);

  const clearSession = useCallback((extra = {}) => {
    const next = { ...structuredClone(EMPTY_SESSION), ...extra };
    saveKey(KEY, next);
    setSession(next);
    return next;
  }, []);

  return { session, updateSession, clearSession };
}
