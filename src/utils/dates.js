export const dkey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
export const fromKey = (k) => {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
};
export const daysBetween = (a, b) =>
  Math.round((fromKey(a) - fromKey(b)) / 86400000);

export const splitOfDate = (d = new Date(), schedule, workouts) => {
  return resolveDay(schedule, d, workouts).split;
};

export const streakOf = (doneDays) => {
  let s = 0;
  const today = dkey();
  let cur = doneDays[today] ? today : dkey(new Date(Date.now() - 86400000));
  while (doneDays[cur]) {
    s++;
    cur = dkey(new Date(fromKey(cur).getTime() - 86400000));
  }
  return s;
};
import { resolveDay } from "../services/schedule";
