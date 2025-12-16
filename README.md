## PENN file uploader (Dockerized)

Container-ready PENN stack with an Express API for uploads, Postgres for storage, and a Next.js client for SEO-friendly rendering.

### Project layout
- `backend/` – Express server, file upload handling, Postgres access.
- `frontend/` – Next.js app that uploads and lists files (SSR-enabled).
- `docker-compose.yml` – builds and runs db + api + web.

### Prerequisites
- Docker + Docker Compose (v2 recommended).

### Environment
1) Root defaults (`.env.example`) – Postgres credentials and the API base URL used at build time. Copy and adjust as needed:
   ```sh
   cp .env.example .env
   ```
2) Backend settings (`backend/.env.example`) – API port, CORS origin, and database connection. Copy to `.env`:
   ```sh
   cp backend/.env.example backend/.env
   ```
   - For Docker, keep `PGHOST=db`. For local development, switch to `PGHOST=localhost`.
3) Frontend settings (`frontend/.env.example`) – needed for local `npm run dev` **and** SSR:
   ```sh
   cp frontend/.env.example frontend/.env
   ```
   - `NEXT_PUBLIC_API_BASE_URL` – the public URL the browser should use (e.g. `http://localhost:5000/api` locally or `https://example.com/api` in prod).
   - `API_BASE_URL` – the URL the Next.js server should use (e.g. `http://localhost:5000/api` locally or `http://backend:5000/api` inside Docker).

### Database bootstrap
Create the table before first run (Docker starts Postgres automatically):
```sql
CREATE TABLE IF NOT EXISTS files (
  id SERIAL PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mimetype TEXT NOT NULL,
  size BIGINT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Run with Docker
Build and start everything:
```sh
docker compose up --build
```
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Postgres: localhost:5432 (data persisted in the `pgdata` volume)
- Uploaded files persist on the host in `backend/uploads`.

Tear down and remove data:
```sh
docker compose down -v
```

### Docker details
- `backend/Dockerfile`: installs Node deps from the root `package-lock.json`, copies `backend/`, exposes `5000`, runs `npm run start:server`.
- `frontend/Dockerfile`: builds the Next.js app with SSR-aware API URLs baked in, then runs `next start` on port `3000`.
- `docker-compose.yml`: orchestrates `db` (Postgres), `backend`, and `frontend`; maps ports `5432`, `5000`, `3000`; mounts `backend/uploads` for persisted uploads; waits for Postgres before starting the API.

### Local (non-Docker) notes
- Install deps at the repo root: `npm install`.
- Run the API locally: `npm run dev:server` (needs Postgres reachable at `PGHOST=localhost`).
- For the Next.js app, install inside `frontend/` (`npm install`) and run `npm run dev` (uses `frontend/.env`).

### Useful commands
- Show container logs: `docker compose logs -f backend` (or `frontend`, `db`).
- Rebuild a single service: `docker compose build backend`.
