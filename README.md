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
