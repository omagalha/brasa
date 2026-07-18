import { useState } from "react";
import { C } from "../constants/theme";
import { fromKey } from "../utils/dates";
import { inp } from "../utils/styles";
import {
  createCardioActivity,
  getCardioHeatmapWeeks,
  getRecentCardio,
  getWeeklyCardioStats,
} from "../services/cardioStats";
import Card from "../components/Card";
import Btn from "../components/Btn";
import Eyebrow from "../components/Eyebrow";

const KINDS = [
  ["corrida", "Corrida"],
  ["caminhada", "Caminhada"],
  ["bicicleta", "Bicicleta"],
  ["outro", "Outro"],
];

const LEVEL_COLORS = [
  "rgba(255,255,255,0.05)",
  "rgba(255,90,31,0.22)",
  "rgba(255,90,31,0.42)",
  "rgba(255,90,31,0.68)",
  C.primary,
];

const kindLabel = (kind) =>
  KINDS.find(([id]) => id === kind)?.[1] || "Cardio";

export default function Cardio({ core, upCore, today }) {
  const [kind, setKind] = useState("corrida");
  const [date, setDate] = useState(today);
  const [minutes, setMinutes] = useState("");
  const [distance, setDistance] = useState("");
  const [message, setMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const activities = core.cardio || [];
  const recent = getRecentCardio(activities);
  const weeks = getWeeklyCardioStats(activities);
  const current = weeks[weeks.length - 1];
  const maxMinutes = Math.max(1, ...weeks.map((week) => week.minutes));
  const heatmap = getCardioHeatmapWeeks(activities);

  const addActivity = () => {
    try {
      const activity = createCardioActivity({
        kind,
        date,
        minutes: minutes.replace(",", "."),
        distanceKm: distance.replace(",", "."),
      });
      upCore((draft) => {
        draft.cardio.push(activity);
        return draft;
      });
      setMinutes("");
      setDistance("");
      setMessage("Atividade registrada.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const deleteActivity = (id) => {
    upCore((draft) => {
      draft.cardio = draft.cardio.filter((activity) => activity.id !== id);
      return draft;
    });
    setConfirmDelete(null);
    setMessage("Atividade excluída.");
  };

  return (
    <div>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: -0.6 }}>
        Cardio
      </h1>
      <div style={{ color: C.mut, fontSize: 13, margin: "4px 0 16px" }}>
        Registre corridas, caminhadas e pedaladas
      </div>

      <Card style={{ marginBottom: 12 }}>
        <Eyebrow>Nova atividade</Eyebrow>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
          <select value={kind} onChange={(event) => setKind(event.target.value)} style={inp()}>
            {KINDS.map(([id, label]) => (
              <option key={id} value={id}>{label}</option>
            ))}
          </select>
          <input
            type="date"
            value={date}
            max={today}
            onChange={(event) => setDate(event.target.value)}
            style={inp()}
          />
          <input
            value={minutes}
            onChange={(event) => setMinutes(event.target.value)}
            inputMode="numeric"
            placeholder="Minutos"
            aria-label="Duração em minutos"
            style={inp()}
          />
          <input
            value={distance}
            onChange={(event) => setDistance(event.target.value)}
            inputMode="decimal"
            placeholder="Distância km (opcional)"
            aria-label="Distância em quilômetros"
            style={inp()}
          />
        </div>
        <Btn onClick={addActivity} style={{ width: "100%", marginTop: 10 }}>
          Registrar atividade
        </Btn>
        {message && (
          <div role="status" style={{ color: C.mut, fontSize: 12, marginTop: 8, textAlign: "center" }}>
            {message}
          </div>
        )}
      </Card>

      <Card style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Esta semana</div>
          <div style={{ color: C.primary, fontWeight: 800, fontSize: 13 }}>
            {current.minutes} min
          </div>
        </div>
        <div style={{ color: C.mut, fontSize: 12, marginTop: 4 }}>
          {current.activities} {current.activities === 1 ? "atividade" : "atividades"}
          {current.distanceKm > 0 ? ` · ${current.distanceKm.toFixed(2).replace(".", ",")} km` : ""}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 76, marginTop: 12 }}>
          {weeks.map((week, index) => (
            <div key={week.startKey} style={{
              flex: 1, height: "100%", display: "flex", flexDirection: "column",
              justifyContent: "flex-end", alignItems: "center", gap: 4,
            }}>
              <div style={{
                width: "100%",
                minHeight: 3,
                height: `${Math.max(4, (week.minutes / maxMinutes) * 100)}%`,
                borderRadius: 4,
                background: index === weeks.length - 1 ? C.primary : "rgba(255,90,31,0.32)",
              }} />
              <span style={{ color: C.dim, fontSize: 9 }}>{week.label}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Consistência</div>
          <div style={{ color: C.mut, fontSize: 12 }}>{activities.length} registros</div>
        </div>
        <div style={{ display: "flex", gap: 3, marginTop: 12, justifyContent: "space-between" }}>
          {heatmap.map((week, weekIndex) => (
            <div key={weekIndex} style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
              {week.map((day) => (
                <div
                  key={day.key}
                  title={`${day.key}: ${day.minutes} min`}
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    borderRadius: 3,
                    background: day.future ? "transparent" : LEVEL_COLORS[day.level],
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <Eyebrow>Últimas atividades</Eyebrow>
        {!recent.length && (
          <div style={{ color: C.mut, fontSize: 13, marginTop: 8 }}>
            Nenhuma atividade registrada ainda.
          </div>
        )}
        {recent.map((activity) => (
          <div key={activity.id} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 0", borderBottom: `1px solid ${C.line}`,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700 }}>{kindLabel(activity.kind)}</div>
              <div style={{ color: C.mut, fontSize: 11.5, marginTop: 2 }}>
                {fromKey(activity.date).toLocaleDateString("pt-BR")} · {activity.minutes} min
                {activity.distanceKm ? ` · ${activity.distanceKm.toFixed(2).replace(".", ",")} km` : ""}
              </div>
            </div>
            <button
              type="button"
              aria-label={`Excluir ${kindLabel(activity.kind)} de ${activity.date}`}
              onClick={() =>
                confirmDelete === activity.id
                  ? deleteActivity(activity.id)
                  : setConfirmDelete(activity.id)
              }
              style={{
                background: "none", border: 0, cursor: "pointer", padding: 4,
                color: confirmDelete === activity.id ? C.danger : C.dim,
                fontSize: confirmDelete === activity.id ? 11 : 15, fontWeight: 700,
              }}
            >
              {confirmDelete === activity.id ? "confirmar" : "×"}
            </button>
          </div>
        ))}
      </Card>
    </div>
  );
}
