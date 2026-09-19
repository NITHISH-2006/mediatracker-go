# MediaTracker 🎬🎮🌸

**Personal Media Tracker for Anime, Movies & Games — Full-Stack on AWS**

Track your entertainment journey. Log what you're watching/playing, maintain lists, get genre-based recommendations, and view your stats.

> **Built for the AWS Zero to Shipped Hackathon.** Go REST API on Lambda + API Gateway, persistent DynamoDB storage, React frontend on Amplify Hosting, developed with AI coding agents (Amazon Q + OpenCode).

---

## Features

- **User Authentication** — Register/Login with JWT + bcrypt
- **Media Management** — Add/Search anime, movies & games (title, type, genres, year, description)
- **Personal Library** — Status lists (`Watching`, `Completed`, `Dropped`, `Planned`), progress + notes
- **Recommendations** — Genre-based suggestions from your Completed/Watching items
- **Dashboard Stats** — Status counts + favorite genre breakdown
- **Recently usable web UI** — React + Tailwind, responsive, loading/empty states

## Architecture

```
React (Amplify) ──► API Gateway (HTTP API) ──► Lambda (Go/chi) ──► DynamoDB
```

| Layer | Tech |
|-------|------|
| Frontend | React + Vite + TypeScript + Tailwind (AWS Amplify Hosting) |
| API | Go 1.26, chi router (AWS Lambda + API Gateway) |
| Storage | DynamoDB (3 tables + GSIs) |
| Auth | JWT (HS256) + bcrypt |
| CI/CD | Amplify (frontend), SAM/AWS CLI (backend) |

## Project Structure

```
mediatracker-go/
├── main.go                  # Local HTTP server entry point
├── lambda/main.go           # AWS Lambda handler (chi adapter)
├── router/                  # Shared router wiring (services+handlers+routes)
├── config/                  # Env-based configuration
├── models/                  # Data structures
├── storage/dynamo.go        # DynamoDB persistence (AWS SDK v2)
├── services/                # Business logic (auth, media, library, recs)
├── handlers/                # HTTP handlers
├── middleware/              # JWT auth, CORS, logging
├── frontend/                # React + Vite + Tailwind app
├── template.yaml            # SAM template (tables + Lambda + API Gateway)
├── Dockerfile               # Builds Lambda container image
├── deploy.sh                # One-command backend deploy
└── amplify.yml              # Amplify Hosting build config
```

## Local Development

### Prerequisites
- Go 1.24+
- Node 20+
- Docker (for DynamoDB Local)

### 1. Start DynamoDB Local
```bash
docker run -d --name dynamodb-local -p 8010:8000 amazon/dynamodb-local
```

### 2. Create the tables
```bash
# Use the create commands in IMPLEMENTATION_PLAN.md (Phase 2.2)
# pointing --endpoint-url at http://localhost:8010
```

### 3. Run the backend
```bash
export AWS_ENDPOINT_URL=http://localhost:8010
export AWS_ACCESS_KEY_ID=local AWS_SECRET_ACCESS_KEY=local AWS_DEFAULT_REGION=us-east-1
export JWT_SECRET=dev-secret

go run main.go
# Server on http://localhost:8080  →  GET /health returns {"status":"ok"}
```

### 4. Run the frontend
```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL defaults to http://localhost:8080
npm run dev
# Open http://localhost:5173
```

## Configuration (Environment Variables)

| Variable | Default | Purpose |
|----------|---------|---------|
| `PORT` | `8080` | HTTP port |
| `JWT_SECRET` | (dev value) | JWT signing secret — **override in prod** |
| `USERS_TABLE` | `MediaTracker-Users` | Users table name |
| `MEDIA_TABLE` | `MediaTracker-Media` | Media table name |
| `LIBRARY_TABLE` | `MediaTracker-Library` | Library table name |
| `AWS_ENDPOINT_URL` | *(empty)* | DynamoDB Local endpoint override |
| `ALLOWED_ORIGINS` | `*` | CORS allow-list (comma-separated) |

Frontend: `VITE_API_URL` (defaults to `http://localhost:8080`).

## API Endpoints

### Public
- `GET /health` — liveness probe
- `POST /api/auth/register` — `{username, email, password}`
- `POST /api/auth/login` — `{email, password}` → `{token, expires_in}`
- `GET /api/media` — all media
- `GET /api/media/search?query=Titan` — search by title
- `GET /api/media/{id}` — media by ID

### Protected (Authorization: Bearer <token>)
- `POST /api/media` — add media `{title, media_type, year, genres, description}`
- `POST /api/library` — add `{media_id, status, progress, notes}`
- `GET /api/library?status=Watching` — user library (optional status filter)
- `GET /api/library/{id}` — library item
- `PUT /api/library/{id}` — update `{status?, progress?, notes?}`
- `DELETE /api/library/{id}` — remove item
- `GET /api/recommendations` — genre-based recommendations
- `GET /api/dashboard` — stats: counts + favorite genres

Status values: `Watching | Completed | Dropped | Planned`
Media types: `anime | movie | game`

## Deployment

### Backend (SAM — tables, Lambda, API Gateway)
```bash
./deploy.sh
# or step-by-step:
sam build --use-container
sam deploy --guided
```
The SAM template creates 3 DynamoDB tables, the Lambda function (container image), and an HTTP API with CORS. See `template.yaml`.

### Frontend (Amplify Hosting)
1. Push this repo to GitHub
2. AWS Console → Amplify Hosting → Create app → Connect GitHub → branch `aws-zero-to-shipped`
3. Amplify picks up `amplify.yml` automatically
4. Add env var: `VITE_API_URL=https://<api-id>.execute-api.<region>.amazonaws.com`
5. Deploy — you get `https://<app-id>.amplifyapp.com`

## Hackathon Documentation

- [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md) — full step-by-step process
- [`hackathon-docs/`](./hackathon-docs/) — agent usage notes + Amazon Q screenshots
  - `amazon-q-screenshots/` — proof of coding agent doing AWS actions
  - `opencode-notes/` — prompts and outputs from OpenCode
  - `architecture/` — architecture diagrams

## Notes

- All timestamps UTC (RFC 3339)
- Passwords hashed with bcrypt; JWT expires after 24h
- DynamoDB tables use `PAY_PER_REQUEST` (Free Tier friendly)
- Lambda `MemorySize: 512MB`, `Timeout: 10s` — fine for this workload

## Future Enhancements

- Cognito auth instead of custom JWT
- Elasticsearch/OpenSearch for media search
- User profiles + social features
- Reviews + ratings
- Export library (CSV/JSON)
- Shareable library links

---

**License**: MIT — free to use for learning and projects