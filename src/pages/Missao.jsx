import { C } from "../constants/theme";
import { fromKey } from "../utils/dates";
import Card from "../components/Card";
import Btn from "../components/Btn";
import Icon from "../components/Icon";
import { SectionLabel } from "../components/Eyebrow";
import WeightChart from "../components/WeightChart";

function TaskCard({ icon, title, description, meta, done, action, onClick, progress }) {
  const Component = onClick ? "button" : "div";
  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      style={{
        width: "100%", padding: 0, border: `1px solid ${C.line}`,
        borderRadius: 14, background: C.surface, color: C.text,
        textAlign: "left", overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: 15 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 11, display: "grid",
          placeItems: "center", flexShrink: 0,
          background: done ? "rgba(70,200,120,0.12)" : C.surface2,
          color: done ? C.success : C.primary,
        }}>
          {done ? <span style={{ fontSize: 18, fontWeight: 800 }}>✓</span> : <Icon name={icon} size={20} color="currentColor" />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.2 }}>{title}</div>
          <div style={{ color: C.mut, fontSize: 13, marginTop: 3 }}>{description}</div>
          {meta && <div style={{ color: C.dim, fontSize: 12, marginTop: 3 }}>{meta}</div>}
        </div>
        {(action || done) && (
          <div style={{ color: done ? C.success : C.primary, fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
            {done ? "Concluído" : action}
          </div>
        )}
      </div>
      {progress !== undefined && (
        <div style={{ height: 3, background: C.surface2 }}>
          <div style={{ width: `${Math.min(1, progress) * 100}%`, height: "100%", background: C.primary, transition: "width 300ms ease" }} />
        </div>
      )}
    </Component>
  );
}

export default function Missao({ core, split, restDay, waterToday, waterOK, trainedToday, streak, checkinDue, daysSinceWeight, lastWeight, setTab }) {
  const w = split ? core.workouts[split] : null;
  const waterPct = Math.min(1, waterToday / core.waterGoal);

  const items = [
    !restDay && w && {
      done: trainedToday, icon: "dumbbell",
      title: `Treino ${split}`, sub: w.label,
      sub2: trainedToday ? "Finalizado hoje" : `${w.ex.length} exercícios`,
      action: "Começar", go: "treino",
    },
    {
      done: waterOK, icon: "drop",
      title: "Hidratação",
      sub: `${(waterToday / 1000).toFixed(2)} de ${(core.waterGoal / 1000).toFixed(2)} litros`,
      sub2: waterOK ? "Meta diária alcançada" : `Faltam ${((core.waterGoal - waterToday) / 1000).toFixed(2)} litros`,
      action: "Registrar", go: "agua", bar: waterPct,
    },
    checkinDue && {
      done: false, icon: "camera",
      title: "Atualizar evolução",
      sub: lastWeight ? `Último registro há ${daysSinceWeight} dias` : "Registre seu peso e suas fotos",
      action: "Registrar", go: "evolucao",
    },
  ].filter(Boolean);

  const doneCount = items.filter((i) => i.done).length;
  const dayPct = items.length ? doneCount / items.length : 0;
  const allDone = doneCount === items.length;

  return (
    <div>
      {/* topo */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ color: C.mut, fontSize: 13, fontWeight: 500, textTransform: "capitalize", marginBottom: 8 }}>
          {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16 }}>
          <div>
            <h1 style={{ margin: 0, color: C.text, fontSize: 30, lineHeight: 1.15, fontWeight: 800, letterSpacing: -1 }}>
              Seu dia de treino
            </h1>
            <div style={{ color: C.mut, fontSize: 14, marginTop: 6 }}>
              {allDone ? "Tudo concluído por hoje." : `${items.length - doneCount} ${items.length - doneCount === 1 ? "tarefa restante" : "tarefas restantes"}`}
            </div>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 7,
            background: C.primarySoft, color: C.primary,
            borderRadius: 999, padding: "8px 12px", fontSize: 13, fontWeight: 700,
            whiteSpace: "nowrap",
          }}>
            <Icon name="flame" size={16} color={C.primary} />
            {streak} {streak === 1 ? "dia" : "dias"}
          </div>
        </div>
      </div>

      {restDay && (
        <Card style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, display: "grid", placeItems: "center",
            borderRadius: 10, background: C.surface2, color: C.mut,
          }}>
            <Icon name="moon" size={20} color="currentColor" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Dia de recuperação</div>
            <div style={{ color: C.mut, fontSize: 12, marginTop: 3 }}>Seu próximo treino começa na segunda-feira.</div>
          </div>
        </Card>
      )}

      {/* progresso */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Progresso de hoje</div>
            <div style={{ fontSize: 12, color: C.mut, marginTop: 3 }}>{doneCount} de {items.length} concluídas</div>
          </div>
          <div style={{ fontSize: 14, color: dayPct === 1 ? C.success : C.text, fontWeight: 700 }}>
            {Math.round(dayPct * 100)}%
          </div>
        </div>
        <div style={{ height: 6, background: C.surface2, borderRadius: 999, overflow: "hidden" }}>
          <div style={{ width: `${dayPct * 100}%`, height: "100%", background: dayPct === 1 ? C.success : C.primary, borderRadius: 999, transition: "width 300ms ease" }} />
        </div>
      </Card>

      {/* tarefas */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((it) => (
          <TaskCard
            key={it.title}
            icon={it.icon}
            title={it.title}
            description={it.sub}
            meta={it.sub2}
            done={it.done}
            action={it.action}
            progress={it.bar}
            onClick={it.go ? () => setTab(it.go) : undefined}
          />
        ))}
      </div>

      {/* peso atual */}
      <Card style={{ marginTop: 12 }}>
        <SectionLabel>Peso atual</SectionLabel>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: -0.8, lineHeight: 1 }}>
              {lastWeight ? lastWeight.kg.toFixed(1) : "--,-"}{" "}
              <span style={{ fontSize: 15, color: C.mut, fontWeight: 600 }}>kg</span>
            </div>
            <div style={{ fontSize: 12, color: C.dim, marginTop: 6 }}>
              {lastWeight ? `Registrado em ${fromKey(lastWeight.date).toLocaleDateString("pt-BR")}` : "Nenhum registro ainda"}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {core.weights.length >= 2 ? (
              <WeightChart weights={core.weights} />
            ) : (
              <svg viewBox="0 0 120 44" style={{ width: "100%", opacity: 0.3 }}>
                <path d="M4 36 L20 28 L32 32 L48 20 L62 24 L78 14 L94 18 L116 6" fill="none" stroke={C.dim} strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
          <Btn small ghost onClick={() => setTab("evolucao")}>Ver evolução</Btn>
        </div>
      </Card>
    </div>
  );
}
