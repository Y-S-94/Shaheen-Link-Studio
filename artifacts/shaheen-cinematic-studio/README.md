# SHAHEEN CINEMATIC STUDIO

A responsive visual link-in-bio builder with a real-time phone preview, social templates, JSON configuration import/export, and a downloadable standalone `index.html`.

## Features

- Profile name, bio, avatar URL, or local avatar upload
- Obsidian Black, Cyberpunk, and Royal Gold preview themes
- Independent dark and light preview modes
- Tajawal, Cairo, and Cinzel typography
- Fade, Slide, and 3D Coverflow link transitions
- Neon border/text, floating, pulse, and GSAP entrance controls
- Social templates for Instagram, Telegram, WhatsApp, TikTok, Snapchat, Facebook, X, YouTube, GitHub, and LinkedIn
- Custom service links, plus editable, reorderable, and removable social links
- JSON import and export with schema validation
- Standalone `index.html` export with the selected theme, typography, motion settings, and configured links
- Browser-local autosave using `localStorage`
- Responsive React + Vite interface with Tailwind CSS

## Project structure

```text
artifacts/shaheen-cinematic-studio/
├── public/
│   ├── dashboard-background.jpg
│   └── shaheen-Studio.png
├── src/
│   ├── Builder.tsx       # App state, autosave, imports, and export actions
│   ├── Sidebar.tsx       # Profile, theme, effects, templates, and link controls
│   ├── Preview.tsx       # Live smartphone preview and animations
│   ├── data.ts           # Defaults, social templates, and JSON validation
│   ├── exportHtml.ts     # Standalone HTML and JSON download generation
│   ├── types.ts          # Profile, link, and theme types
│   └── index.css         # Tailwind and the cinematic visual system
├── railway.json
├── server.mjs
└── package.json
```

## Run locally

Run these commands from the repository root:

```sh
pnpm install
pnpm --filter @workspace/shaheen-cinematic-studio run dev
```

The Vite server uses `PORT` when provided and otherwise defaults to `3000`. `BASE_PATH` defaults to `/`.

## Build and start

```sh
pnpm --filter @workspace/shaheen-cinematic-studio run build
pnpm --filter @workspace/shaheen-cinematic-studio run start
```

The build writes the static site to `artifacts/shaheen-cinematic-studio/dist/public`. `server.mjs` serves that directory and listens on Railway's `PORT` value, falling back to `3000` for local use.

## Deploy to Railway

1. Push the repository to GitHub.
2. In Railway, create a project and choose **Deploy from GitHub repo**.
3. Set the service root directory to the repository root so Railway can read `pnpm-workspace.yaml` and `pnpm-lock.yaml`.
4. Keep the repository's `railway.json`; it defines the build command, start command, health check, and restart policy.
5. Add `NODE_ENV=production` in the service's Variables panel. Railway assigns `PORT` automatically; do not hard-code a production port.
6. Deploy the service, wait for the health check at `/`, and generate a Railway domain from the service's Networking settings.

### Railway commands

Build:

```sh
pnpm --filter @workspace/shaheen-cinematic-studio run build
```

Start:

```sh
pnpm --filter @workspace/shaheen-cinematic-studio run start
```

The same commands are already set in `railway.json`:

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pnpm --filter @workspace/shaheen-cinematic-studio run build"
  },
  "deploy": {
    "startCommand": "pnpm --filter @workspace/shaheen-cinematic-studio run start",
    "healthcheckPath": "/",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Environment variables

| Variable | Railway value | Required |
| --- | --- | --- |
| `NODE_ENV` | `production` | Recommended for production |
| `PORT` | Automatically assigned by Railway | Supplied by Railway; do not set a fixed value |

No database, API key, or other secret is required. Builder configuration is stored in each visitor's browser; JSON and standalone HTML exports are downloaded directly.

## Package scripts

```json
{
  "dev": "vite --config vite.config.ts --host 0.0.0.0",
  "build": "vite build --config vite.config.ts",
  "start": "node server.mjs"
}
```
