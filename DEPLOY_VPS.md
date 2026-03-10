# VPS Deploy Runbook

This is the fastest production path for this repo on the current VPS.

## Recommended Path

Use Docker Compose for the app, keep OpenClaw running on the host, then place a reverse proxy in front once the app is verified locally.

## 1. Prepare environment

Create a production env file:

```bash
cp .env.example .env
```

Set at least:

```env
PORT=4000
DATABASE_PATH=/app/data/mission-control.db
WORKSPACE_BASE_PATH=/app/workspace
PROJECTS_PATH=/app/workspace/projects
OPENCLAW_GATEWAY_URL=ws://host.docker.internal:18789
OPENCLAW_GATEWAY_TOKEN=your-gateway-token
MC_API_TOKEN=generate-a-random-token
WEBHOOK_SECRET=generate-a-random-secret
MISSION_CONTROL_URL=https://your-domain.example
```

Generate secrets with:

```bash
openssl rand -hex 32
```

## 2. Build and run

```bash
docker compose up -d --build
```

Check status:

```bash
docker compose ps
docker compose logs -f mission-control
```

## 3. Verify locally on the VPS

Confirm the app answers before putting a domain in front:

```bash
curl -I http://127.0.0.1:4000
curl http://127.0.0.1:4000/api/events
```

Then verify in the UI:

- Open the default workspace
- Create a task
- Confirm the gateway shows online
- Dispatch a task
- Upload a task image

## 4. Put it behind a domain

Install a reverse proxy such as Caddy or Nginx and proxy your domain to `127.0.0.1:4000`.

Minimum requirements:

- TLS enabled
- Forward `Host`, `X-Forwarded-For`, `X-Forwarded-Proto`
- Allow larger request bodies for image uploads

## 5. Backups

Persist and back up:

- Docker volume `mission-control-data`
- Docker volume `mission-control-workspace`

For ad hoc backup:

```bash
docker compose exec mission-control sh -lc 'cp /app/data/mission-control.db /app/data/mission-control.db.backup'
```

## Notes

- `docker-compose.yml` maps `host.docker.internal` to the Linux host gateway, so the container can reach a host-run OpenClaw instance.
- `ecosystem.config.cjs` is kept generic if you later decide to run under PM2 instead of Docker.
