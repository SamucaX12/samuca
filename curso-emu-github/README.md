# Curso Emu — 171 ScreenS

Site do curso de telagem forense. Login Discord + 125 aulas por tier.

## Pasta pra subir no Git

Sobe **só esta pasta** (`171-curso-emu`) — não inclui `.env.local` (já está no `.gitignore`).

```bash
cd 171-curso-emu
git init
git add .
git commit -m "Curso Emu — site completo"
git branch -M main
git remote add origin https://github.com/SEU_USER/curso-emu.git
git push -u origin main
```

## Deploy Vercel

1. [vercel.com](https://vercel.com) → **Add New Project** → importa o repo
2. **Root Directory:** deixa raiz (se o repo é só esta pasta) ou `171-curso-emu` se estiver dentro de monorepo
3. **Framework:** Next.js (detecta automático)
4. Adiciona as env vars abaixo
5. Deploy

### Env vars (Vercel)

```env
NEXT_PUBLIC_APP_URL=https://SEU-PROJETO.vercel.app
AUTH_SECRET=string-aleatoria-minimo-32-caracteres
MONGODB_URI=mongodb+srv://... (mesma do scanner)
DISCORD_CLIENT_ID=1517326799443595344
DISCORD_CLIENT_SECRET=...
DISCORD_GUILD_ID=1501342515180339281
DISCORD_BOT_TOKEN=...
DISCORD_ROLE_TIER1_ID=1502645836117573724
DISCORD_ROLE_TIER2_ID=1517319725988708403
DISCORD_ROLE_TIER3_ID=1517319860835713198
DISCORD_INVITE_URL=https://discord.gg/35Aw934hNh
OWNER_DISCORD_IDS=1312495175376834647
```

**NÃO** coloca `DEV_LOGIN=true` na Vercel — só dev local.

### Discord Developer Portal

No app `1517326799443595344`:

1. **OAuth2 → Redirects** — adiciona:
   - `https://SEU-PROJETO.vercel.app/api/auth/callback/discord`
2. **OAuth2 → Scopes** — `identify`, `email`, `guilds`, `guilds.members.read`
3. **Bot → SERVER MEMBERS INTENT** — ativado (pro sync de cargo)

Depois do 1º deploy, atualiza `NEXT_PUBLIC_APP_URL` com a URL real da Vercel e redeploy.

## MongoDB

Usa a **mesma URI do scanner**. Banco separado automático:

| Projeto | Database |
|---------|----------|
| Scanner | `171screens` |
| Curso | `cursoemu` |

## Planos

| Tier | Preço | Cargo Discord |
|------|-------|---------------|
| Básico | R$ 60 | Curso Básico |
| Advanced | R$ 100 | Curso Advanced |
| Private | R$ 140 | Curso Private |

## Local

```bash
npm install
copy .env.local.example .env.local
npm run dev
```

Preview dashboard sem Discord: `http://localhost:3002/api/auth/dev` (só com `DEV_LOGIN=true` no `.env.local`)

## Bot `/verificar`

Opcional — roda separado em `171-curso-verify-bot`. O site funciona sem ele (login + Sincronizar cargo).
