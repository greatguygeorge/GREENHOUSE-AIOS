# Greenhouse AI-OS — User Interface

The frontend interface for the Greenhouse AI Operating System.

## Architecture

The UI communicates with the Greenhouse AI-OS API through `/api/gateway`.

The local development request flow is:

Browser → Vite proxy → Node API → n8n AI Gateway → AI services

The Gateway API key is held by the server-side API and is not exposed to the browser.

## Local Development

Start the API from the repository's `api` directory:

```bash
npm run dev
```

Start the UI from the `ui` directory:

```bash
npm install
npm run dev
```

## Validation

Run the frontend checks from the `ui` directory:

```bash
npm run lint
npm run build
```

## Important

The current configuration is for local development. Production deployment requires the appropriate authentication, HTTPS, server configuration and environment variables.