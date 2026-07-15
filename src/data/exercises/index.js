import { chestExercises } from "./chest";
import { backExercises } from "./back";
import { shoulderExercises } from "./shoulders";
import { bicepsExercises } from "./biceps";
import { tricepsExercises } from "./triceps";
import { quadricepsExercises } from "./quadriceps";
import { hamstringExercises } from "./hamstrings";
import { gluteExercises } from "./glutes";
import { calfExercises } from "./calves";
import { abdominalExercises } from "./abs";

export const EXERCISE_LIBRARY = [
  ...chestExercises,
  ...backExercises,
  ...shoulderExercises,
  ...bicepsExercises,
  ...tricepsExercises,
  ...quadricepsExercises,
  ...hamstringExercises,
  ...gluteExercises,
  ...calfExercises,
  ...abdominalExercises,
];

export const EXERCISES_BY_ID = Object.fromEntries(
  EXERCISE_LIBRARY.map((exercise) => [exercise.id, exercise])
);

export const MUSCLES = [...new Set(EXERCISE_LIBRARY.map((e) => e.muscle))];
export const EQUIPMENTS = [...new Set(EXERCISE_LIBRARY.map((e) => e.equipment))];
