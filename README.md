# BRASA 🔥

App pessoal de academia: Missão do Dia, treino ABCAB com carga/reps por série,
água e evolução corporal (peso + fotos frente/lado/costas).

## Rodar local
```bash
npm install
npm run dev
```

## Deploy na Vercel
```bash
npm i -g vercel
vercel
```
(ou conecte o repositório no painel da Vercel — framework: Vite)

## Instalar no iPhone
1. Abra a URL do deploy no Safari
2. Compartilhar → **Adicionar à Tela de Início**
3. O app abre em tela cheia como PWA

## Notas
- Dados ficam no `localStorage` do navegador (src/utils/storage.js)
- Fotos são comprimidas (~700px JPEG); se acumular muitas, migre fotos
  para IndexedDB ou Supabase Storage
- Divisão ABCAB: seg A · ter B · qua C · qui A · sex B · fds descanso
  (src/utils/dates.js → SPLIT_BY_WEEKDAY)

## Roadmap v0.9 em cinco PRs

1. **Fundação v4:** migração, `cardio`, `updatedAt`, `planChosen` e validação de backup.
2. **Cardio manual:** registro, histórico, exclusão, progresso semanal e heatmap.
3. **Agenda híbrida:** resolução centralizada do dia, metas de cardio, missão diária,
   conclusão e templates híbridos.
4. **Onboarding e galeria:** escolha de plano, montar do zero e câmera versus galeria.
5. **Séries rápidas:** edição imutável de carga e repetições durante o treino.

O template híbrido deve representar explicitamente dias de força, cardio ou ambos:

```js
{
  1: { split: "A", cardio: { kind: "corrida", minutes: 15 } },
  2: { cardio: { kind: "corrida", minutes: 30 } },
  3: { split: "B" },
  4: { cardio: { kind: "corrida", minutes: 30 } },
  5: { split: "C", cardio: { kind: "caminhada", minutes: 20 } }
}
```

Assim, segunda e sexta são híbridas; terça e quinta são somente cardio.
