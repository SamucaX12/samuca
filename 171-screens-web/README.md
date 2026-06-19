# 171 ScreenS — Site (Curso + Scanner)

Site completo: curso de telagem, scanner (pins, results, keys, enterprise), admin e owner.

**Login:** Discord only (Google em breve).

## Subir no Git

Use **esta pasta** como raiz do repositório:

```bash
cd 171-screens-web
git init
git add .
git commit -m "171 ScreenS — site produção"
git branch -M main
git remote add origin https://github.com/SEU_USER/171-screens.git
git push -u origin main
```

## Deploy Vercel

1. [vercel.com](https://vercel.com) → **Add New Project** → importa o repo
2. **Framework:** Next.js
3. Copie todas as vars de `.env.example` → Vercel → **Environment Variables**
4. **Build Command:** `npm run build` | **Output:** default
5. Deploy

### Após o 1º deploy

1. Atualize `NEXT_PUBLIC_APP_URL` com a URL real (`https://xxx.vercel.app`)
2. No [Discord Developer Portal](https://discord.com/developers/applications) → OAuth2 → Redirects:
   - `https://SUA-URL.vercel.app/api/auth/callback/discord`
3. Redeploy

### Env vars obrigatórias

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_APP_URL` | URL pública do site |
| `AUTH_SECRET` | JWT secret (32+ chars) |
| `MONGODB_URI` | MongoDB Atlas |
| `DISCORD_CLIENT_ID` | App Discord |
| `DISCORD_CLIENT_SECRET` | App Discord |
| `DISCORD_GUILD_ID` | ID do servidor |
| `DISCORD_BOT_TOKEN` | Bot (sync cargo) |
| `DISCORD_ROLE_TIER1/2/3_ID` | Cargos do curso |
| `DISCORD_ROLE_BOOSTER_ID` | Cargo booster (degustação) |
| `OWNER_DISCORD_IDS` | Seu Discord ID |

### Scanner .exe (download com pin)

Coloque `171-screens.exe` em `public/scanner/` **no deploy** ou configure `SCANNER_EXE_PATH`.

> Arquivos `.exe` não vão pro git (`.gitignore`). Na Vercel, inclua o exe no deploy ou use storage externo.

## MongoDB

| Projeto | Database |
|---------|----------|
| Curso | `cursoemu` |
| Scanner | `171screens` |

## Local (dev)

```bash
npm install
copy .env.local.example .env.local
# preencha .env.local
npm run dev
```

Abre `http://localhost:3007`

## Estrutura

- `/` — Landing
- `/login` — Discord
- `/dashboard` — Hub
- `/dashboard/curso` — Aulas
- `/dashboard/curso/booster` — Degustação booster
- `/dashboard/scanner/*` — Scanner
- `/install/[pin]` — Download scanner + pin
- `/admin` — Painel admin
- `/owner` — Keys scanner
