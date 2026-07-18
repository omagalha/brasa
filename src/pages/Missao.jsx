import { C } from "../constants/theme";
import { fromKey } from "../utils/dates";
import Card from "../components/Card";
import Icon from "../components/Icon";
import WeightChart from "../components/WeightChart";

const clamp01 = (value) => Math.max(0, Math.min(1, value));

function SummaryCard({ icon, label, value, detail, accent = C.text, progress, onClick, ariaLabel }) {
  const Component = onClick ? "button" : "div";
  return (
    <Component type={onClick ? "button" : undefined} onClick={onClick} aria-label={ariaLabel} style={{
      minWidth: 0, minHeight: 118, padding: 14, borderRadius: 16,
      background: C.surface, border: `1px solid ${C.line}`,
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      color: C.text, textAlign: "left", cursor: onClick ? "pointer" : "default", fontFamily: "inherit",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ color: C.mut, fontSize: 12, fontWeight: 600 }}>{label}</span>
        <span aria-hidden="true" style={{ color: accent, display: "grid", placeItems: "center" }}>
          <Icon name={icon} size={16} color="currentColor" />
        </span>
      </div>
      <div>
        <div style={{ color: accent, fontSize: 21, lineHeight: 1.1, fontWeight: 800, letterSpacing: -0.5 }}>
          {value}
        </div>
        <div style={{ color: C.dim, fontSize: 12, marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {detail}
        </div>
        {progress !== undefined && (
          <div aria-hidden="true" style={{ height: 4, background: C.surface2, borderRadius: 999, overflow: "hidden", marginTop: 9 }}>
            <div style={{ width: `${clamp01(progress) * 100}%`, height: "100%", borderRadius: 999, background: accent }} />
          </div>
        )}
      </div>
    </Component>
  );
}

function SecondaryTask({ icon, title, description, action, onClick }) {
  return (
    <button type="button" onClick={onClick} aria-label={`${action}: ${title}`} style={{
      width: "100%", minHeight: 76, padding: "13px 14px", borderRadius: 15,
      border: `1px solid ${C.line}`, background: C.surface, color: C.text,
      display: "flex", alignItems: "center", gap: 12, textAlign: "left", cursor: "pointer",
    }}>
      <span aria-hidden="true" style={{
        width: 40, height: 40, flexShrink: 0, borderRadius: 12,
        display: "grid", placeItems: "center", color: C.primary, background: C.primarySoft,
      }}>
        <Icon name={icon} size={19} color="currentColor" />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 14, fontWeight: 700 }}>{title}</span>
        <span style={{ display: "block", color: C.mut, fontSize: 12, lineHeight: 1.4, marginTop: 3 }}>{description}</span>
      </span>
      <span aria-hidden="true" style={{ color: C.primary, fontSize: 18, fontWeight: 700 }}>›</span>
    </button>
  );
}

export default function Missao({
  core, split, restDay, waterToday, waterOK, trainedToday, streak,
  checkinDue, daysSinceWeight, lastWeight, setTab, cardioGoal, dayCompletion,
}) {
  const workout = split ? core.workouts[split] : null;
  const cardioProgress = dayCompletion.cardioProgress;
  const cardioOnly = !split && Boolean(cardioGoal);
  const cardioLabel = cardioGoal
    ? `${cardioGoal.kind[0].toUpperCase()}${cardioGoal.kind.slice(1)}`
    : "";
  const waterGoal = Math.max(1, core.waterGoal);
  const waterPct = clamp01(waterToday / waterGoal);
  const waterRemaining = Math.max(0, waterGoal - waterToday);

  const dailyStates = [
    !restDay && workout ? trainedToday : null,
    cardioGoal ? cardioProgress.completed : null,
    waterOK,
    checkinDue ? false : null,
  ].filter((state) => state !== null);
  const doneCount = dailyStates.filter(Boolean).length;
  const dayPct = dailyStates.length ? doneCount / dailyStates.length : 0;
  const allDone = dailyStates.length === 0 || doneCount === dailyStates.length;

  const secondaryTasks = [
    !waterOK && {
      icon: "drop", title: "Completar hidratação",
      description: `Faltam ${(waterRemaining / 1000).toFixed(2)} L para sua meta`,
      action: "Abrir hidratação", tab: "agua",
    },
    cardioGoal && !cardioProgress.completed && !cardioOnly && {
      icon: "heart", title: `Completar ${cardioLabel.toLowerCase()}`,
      description: `${cardioProgress.minutes} de ${cardioProgress.target} minutos registrados`,
      action: "Abrir cardio", tab: "cardio",
    },
    checkinDue && {
      icon: "camera", title: "Atualizar evolução",
      description: lastWeight ? `Último registro há ${daysSinceWeight} dias` : "Registre seu peso e suas fotos",
      action: "Abrir evolução", tab: "evolucao",
    },
  ].filter(Boolean);

  const workoutStatus = restDay
    ? "Priorize sono, mobilidade e hidratação."
    : cardioOnly
      ? cardioProgress.completed
        ? "Meta de cardio concluída hoje. Excelente trabalho."
        : `${cardioProgress.minutes} de ${cardioProgress.target} minutos registrados.`
    : trainedToday
      ? "Treino finalizado hoje. Excelente trabalho."
      : workout
        ? `${workout.ex.length} exercícios preparados para você.`
        : "Nenhum treino programado para hoje.";

  return (
    <div>
      <header style={{ marginBottom: 20 }}>
        <div style={{ color: C.mut, fontSize: 13, fontWeight: 500, textTransform: "capitalize", marginBottom: 7 }}>
          {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <h1 style={{ margin: 0, color: C.text, fontSize: 31, lineHeight: 1.1, fontWeight: 800, letterSpacing: -1 }}>
            Hoje
          </h1>
          <div aria-label={`Sequência de ${streak} ${streak === 1 ? "dia" : "dias"}`} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "6px 10px",
            color: C.primary, background: C.primarySoft, border: `1px solid rgba(255,90,31,0.18)`,
            borderRadius: 999, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
          }}>
            <Icon name="flame" size={14} color={C.primary} />
            {streak} {streak === 1 ? "dia" : "dias"}
          </div>
        </div>
      </header>

      <button type="button" onClick={() => setTab(cardioOnly ? "cardio" : "treino")} aria-label={
        cardioOnly ? "Abrir cardio de hoje" : restDay ? "Abrir treinos no dia de recuperação" : "Abrir treino de hoje"
      } style={{
        position: "relative", isolation: "isolate", width: "100%", minHeight: 210,
        padding: 20, overflow: "hidden", borderRadius: 20, textAlign: "left", cursor: "pointer",
        color: C.text, border: `1px solid rgba(255,90,31,0.22)`,
        background: "linear-gradient(145deg, #1B1716 0%, #121417 55%, #101114 100%)",
        boxShadow: "0 18px 45px rgba(0,0,0,0.22)",
      }}>
        <span aria-hidden="true" style={{
          position: "absolute", zIndex: -1, width: 190, height: 190, right: -70, top: -75,
          borderRadius: "50%", background: "rgba(255,90,31,0.16)", filter: "blur(3px)",
        }} />
        <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <span style={{ color: C.primary, fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" }}>
            {restDay ? "Recuperação" : cardioOnly ? "Cardio de hoje" : `Treino ${split || "de hoje"}`}
          </span>
          <span aria-hidden="true" style={{
            width: 38, height: 38, borderRadius: 12, display: "grid", placeItems: "center",
            color: C.primary, background: "rgba(255,90,31,0.13)",
          }}>
            <Icon name={restDay ? "moon" : cardioOnly ? "heart" : "dumbbell"} size={20} color="currentColor" />
          </span>
        </span>
        <span style={{ display: "block", maxWidth: 310, marginTop: 24 }}>
          <span style={{ display: "block", fontSize: 25, lineHeight: 1.15, fontWeight: 800, letterSpacing: -0.7 }}>
            {restDay ? "Dia de recuperação" : cardioOnly ? `${cardioLabel} · ${cardioGoal.minutes} min` : workout?.label || "Sem treino programado"}
          </span>
          <span style={{ display: "block", minHeight: 38, color: C.mut, fontSize: 13, lineHeight: 1.45, marginTop: 8 }}>
            {workoutStatus}
          </span>
        </span>
        <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 18 }}>
          <span style={{
            display: "inline-flex", minHeight: 38, padding: "0 15px", alignItems: "center", justifyContent: "center",
            borderRadius: 11, color: (trainedToday || (cardioOnly && cardioProgress.completed)) ? C.success : "#FFFFFF",
            background: (trainedToday || (cardioOnly && cardioProgress.completed)) ? "rgba(70,200,120,0.12)" : restDay ? C.surface2 : C.primary,
            border: `1px solid ${(trainedToday || (cardioOnly && cardioProgress.completed)) ? "rgba(70,200,120,0.22)" : restDay ? C.lineStrong : C.primary}`,
            fontSize: 13, fontWeight: 800,
          }}>
            {trainedToday || (cardioOnly && cardioProgress.completed)
              ? "✓ Concluído"
              : restDay
                ? "Ver treinos"
                : cardioOnly
                  ? "Registrar cardio"
                  : "Iniciar treino"}
          </span>
          {!restDay && workout && (
            <span style={{ color: C.dim, fontSize: 12, fontWeight: 600 }}>{workout.ex.length} exercícios</span>
          )}
        </span>
      </button>

      <section aria-label="Resumo de hoje" style={{ marginTop: 18 }}>
        <div className="home-summary-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
          <SummaryCard icon="flame" label="Sequência" value={`${streak} ${streak === 1 ? "dia" : "dias"}`} detail="Continue em movimento" accent={C.primary} />
          <SummaryCard icon="drop" label="Hidratação" value={`${(waterToday / 1000).toFixed(1)} L`} detail={`Meta ${(waterGoal / 1000).toFixed(1)} L`} accent={waterOK ? C.success : "#58AFFF"} progress={waterPct} onClick={() => setTab("agua")} ariaLabel="Abrir hidratação" />
          <SummaryCard icon="chart" label="Peso atual" value={lastWeight ? `${lastWeight.kg.toFixed(1)} kg` : "--,- kg"} detail={lastWeight ? "Último registro" : "Sem registros"} onClick={() => setTab("evolucao")} ariaLabel="Abrir evolução de peso" />
          <SummaryCard icon="chart" label="Progresso diário" value={`${Math.round(dayPct * 100)}%`} detail={`${doneCount} de ${dailyStates.length} concluídas`} accent={allDone ? C.success : C.primary} progress={dayPct} />
        </div>
      </section>

      <section aria-labelledby="pending-title" style={{ marginTop: 24 }}>
        <div id="pending-title" style={{ color: C.mut, fontSize: 12, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 }}>
          Próximos passos
        </div>
        {secondaryTasks.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {secondaryTasks.map((task) => (
              <SecondaryTask key={task.title} {...task} onClick={() => setTab(task.tab)} />
            ))}
          </div>
        ) : (
          <Card style={{ padding: 14, color: C.mut, fontSize: 13, lineHeight: 1.45 }}>
            Tudo em dia por aqui. Aproveite o restante do seu dia.
          </Card>
        )}
      </section>

      <section aria-labelledby="weight-title" style={{ marginTop: 24 }}>
        <Card style={{ padding: 15 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: core.weights.length >= 2 ? 8 : 12 }}>
            <div>
              <div id="weight-title" style={{ color: C.mut, fontSize: 12, fontWeight: 700 }}>Peso atual</div>
              <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.6, marginTop: 4 }}>
                {lastWeight ? lastWeight.kg.toFixed(1) : "--,-"} <span style={{ color: C.mut, fontSize: 13, fontWeight: 600 }}>kg</span>
              </div>
              <div style={{ color: C.dim, fontSize: 12, marginTop: 4 }}>
                {lastWeight ? fromKey(lastWeight.date).toLocaleDateString("pt-BR") : "Nenhum registro ainda"}
              </div>
            </div>
            <button type="button" onClick={() => setTab("evolucao")} aria-label="Abrir evolução de peso" style={{
              minHeight: 38, padding: "0 12px", flexShrink: 0, borderRadius: 10,
              border: `1px solid ${C.lineStrong}`, color: C.text, background: C.surface2,
              fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}>
              Ver evolução
            </button>
          </div>
          {core.weights.length >= 2 && (
            <div style={{ maxHeight: 76, overflow: "hidden" }}>
              <WeightChart weights={core.weights} />
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
