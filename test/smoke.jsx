// Smoke test: monta o App num DOM simulado e deixa os efeitos rodarem.
import { JSDOM } from "jsdom";

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: "https://brasafit.test/" });
global.window = dom.window;
global.document = dom.window.document;
Object.defineProperty(global, "navigator", { value: dom.window.navigator, configurable: true });
global.localStorage = dom.window.localStorage;
global.structuredClone = global.structuredClone || ((x) => JSON.parse(JSON.stringify(x)));

// dado antigo (v1) no storage pra exercitar a migração na abertura
const oldCore = {
  waterByDay: { "2026-07-14": 3000 },
  weights: [{ date: "2026-07-01", kg: 78 }],
  sessions: [{ date: "2026-07-13", split: "A", volume: 3200,
    sets: { "supino-reto-barra": [{ kg: 40, reps: 10, done: true }] } }],
  doneDays: {},
  workouts: null,
};
window.localStorage.setItem("brasa-core", JSON.stringify(oldCore));

const errors = [];
window.addEventListener("error", (e) => errors.push(e.error));

const { createRoot } = await import("react-dom/client");
const React = await import("react");
const { default: App } = await import("../src/App.jsx");

const root = createRoot(document.getElementById("root"));
root.render(React.createElement(App));

await new Promise((r) => setTimeout(r, 300)); // efeitos assíncronos

const html = document.body.innerHTML;
console.log("renderizou BrasaFit:", html.includes("Brasa"));
console.log("saiu do loading:", !html.includes("Acendendo a brasa"));
console.log("dashboard visível:", html.includes("Seu dia de treino") || html.includes("Hidratação"));

const savedCore = JSON.parse(window.localStorage.getItem("brasa-core"));
console.log("core migrado p/ v" + savedCore.version, "| plano:", savedCore.activePlanName);
console.log("sessão antiga convertida:", !!savedCore.sessions[0].exercises);

const draft = JSON.parse(window.localStorage.getItem("brasa-active-workout"));
console.log("rascunho criado p/ hoje:", draft?.date, "| treino selecionado:", draft?.sel);

// core realmente novo deve abrir o onboarding e persistir a escolha.
root.unmount();
window.localStorage.clear();
document.body.innerHTML = '<div id="onboarding-root"></div>';
const onboardingRoot = createRoot(document.getElementById("onboarding-root"));
onboardingRoot.render(React.createElement(App));
await new Promise((r) => setTimeout(r, 300));

const onboardingVisible = document.body.textContent.includes("Como você quer começar?");
const chooseButton = [...document.querySelectorAll("button")]
  .find((button) => button.textContent.includes("Escolher plano"));
chooseButton?.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
await new Promise((r) => setTimeout(r, 100));
const chosenCore = JSON.parse(window.localStorage.getItem("brasa-core"));
const onboardingCompleted =
  chosenCore?.planChosen === true &&
  !document.body.textContent.includes("Como você quer começar?");
console.log("onboarding na primeira abertura:", onboardingVisible);
console.log("escolha de plano persistida:", onboardingCompleted);

// A evolução deve separar câmera e galeria.
const progressButton = [...document.querySelectorAll("button")]
  .find((button) => button.textContent.includes("Progresso"));
progressButton?.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
await new Promise((r) => setTimeout(r, 50));
document.querySelector('button[aria-label="Adicionar foto de Frente"]')
  ?.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
await new Promise((r) => setTimeout(r, 20));
const cameraInput = document.querySelector('input[type="file"][capture="environment"]');
const galleryInput = [...document.querySelectorAll('input[type="file"]')]
  .find((input) => !input.hasAttribute("capture"));
const photoSourcesVisible =
  document.body.textContent.includes("Abrir câmera") &&
  document.body.textContent.includes("Escolher da galeria") &&
  Boolean(cameraInput && galleryInput);
console.log("câmera e galeria separadas:", photoSourcesVisible);

// A alternativa "Montar do zero" cria um plano editável sem exercícios.
onboardingRoot.unmount();
window.localStorage.clear();
document.body.innerHTML = '<div id="blank-root"></div>';
const blankRoot = createRoot(document.getElementById("blank-root"));
blankRoot.render(React.createElement(App));
await new Promise((r) => setTimeout(r, 300));
const blankButton = [...document.querySelectorAll("button")]
  .find((button) => button.textContent.includes("Criar meu treino"));
blankButton?.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
await new Promise((r) => setTimeout(r, 100));
const blankCore = JSON.parse(window.localStorage.getItem("brasa-core"));
const blankPlanCreated =
  blankCore?.planChosen === true &&
  blankCore?.activePlanId === "personalizado" &&
  Array.isArray(blankCore?.workouts?.A?.ex) &&
  blankCore.workouts.A.ex.length === 0;
console.log("plano montado do zero:", blankPlanCreated);

console.log("erros de runtime:", errors.length ? errors.map(e => e?.message) : "nenhum");
if (
  errors.length ||
  html.includes("Acendendo a brasa") ||
  !onboardingVisible ||
  !onboardingCompleted ||
  !photoSourcesVisible ||
  !blankPlanCreated
) process.exit(1);
console.log("✅ SMOKE TEST PASSOU");
