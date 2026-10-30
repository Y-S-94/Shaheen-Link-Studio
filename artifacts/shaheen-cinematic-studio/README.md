# SHAHEEN CINEMATIC STUDIO

A visual link-in-bio builder with a real-time smartphone preview and a standalone HTML export.

## Features

- Live profile editing with the SHAHEEN STUDIO image as the starting avatar
- Four themes, three typeface options, and three preview animation modes
- Social links that can be added, edited, reordered, and removed
- Browser-local autosave
- Export of the current profile as a portable `index.html`
- Responsive React + Vite interface

## Run locally

From the repository root:

```sh
pnpm install
pnpm --filter @workspace/shaheen-cinematic-studio run dev
```

The app's development workflow supplies `PORT` and `BASE_PATH`. When running Vite outside that workflow, the port defaults to `3000` and the base path defaults to `/`.

## Build and start

```sh
pnpm --filter @workspace/shaheen-cinematic-studio run build
pnpm --filter @workspace/shaheen-cinematic-studio run start
```

The production build is served from `dist/public` by the small Node.js server in `server.mjs`. The `start` script listens on `process.env.PORT`, falling back to port 3000 for local use.

## Deploy to Railway

1. Create a Railway project from this repository and select the repository root as the service source.
2. Ensure the service's Root Directory is the repository root so pnpm can see the workspace and lockfile.
3. Railway reads `railway.json` for the workspace build command and production start command.
4. Deploy the service and open the generated public domain.

### Environment variables

| Variable | Value | Notes |
| --- | --- | --- |
| `NODE_ENV` | `production` | Set in the Railway service variables. |
| `PORT` | Railway-provided | Railway assigns this automatically; the server uses it. Use `3000` only for local runs when no port is supplied. |

No database, API key, or other secret is required. Builder settings are stored in the visitor's browser; exported pages are independent HTML files.

## Styling

The app uses Tailwind CSS v4 through the Vite plugin. Theme tokens and the custom visual system live alongside the app's CSS; a separate `tailwind.config` file is not required for this setup.
