import { describe, expect, it } from "vitest";
import { enrichExerciseMedia, getExerciseMedia } from "../src/data/exerciseMedia";

describe("exerciseMedia", () => {
  it("mapeia exercícios dos planos para as duas posições do free-exercise-db", () => {
    const media = getExerciseMedia("supino-reto-barra");

    expect(media.images).toHaveLength(2);
    expect(media.images[0]).toContain("Barbell_Bench_Press_-_Medium_Grip/0.jpg");
    expect(media.images[1]).toContain("Barbell_Bench_Press_-_Medium_Grip/1.jpg");
  });

  it("enriquece exercícios antigos usando exerciseId sem apagar imagem própria", () => {
    const oldExercise = enrichExerciseMedia({ id: "instancia-2", exerciseId: "prancha", name: "Prancha" });
    const customExercise = enrichExerciseMedia({ id: "prancha", image: "https://example.com/custom.jpg" });

    expect(oldExercise.image).toContain("/Plank/0.jpg");
    expect(customExercise.image).toBe("https://example.com/custom.jpg");
  });
});
