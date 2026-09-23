# MediaTracker — Run, Test, Showcase & Deploy Guide

Everything you need to run this project locally, test it, demo it, and ship it to AWS
**for free** (Free Tier). Commands below were validated end‑to‑end on 2026‑09‑22.

> **Version: v1.0.0** (branch `aws-zero-to-shipped`) — see `PROJECT_STATUS.md §12 Current Version`
> for the exact change list behind this release.

> Branch: `aws-zero-to-shipped` · Hackathon: **AWS Zero to Shipped** (deadline Oct 2)

---

## 1. Prerequisites

| Tool | Version | Why |
|------|---------|-----|
| Go | **1.26** (see note) | Backend (matches `go.mod`) |
| Node.js | 20+ | Frontend (Vite 8 / React 19) |
| Docker | any recent | DynamoDB Local for local dev/testing |
| AWS CLI v2 | any recent | Local table setup + backend deploy |
| AWS SAM CLI | latest | Backend deploy (`deploy.sh`) |

**Go 1.26 note:** if your installed Go is older (e.g. 1.22), that's fine — the Go toolchain
will auto‑download 1.26 on first `go` command. If not, pin it explicitly:

```bash
export GOTOOLCHAIN=go1.26.0
go version   # → go1.26.0 linux/amd64
```

**AWS CLI credentials note:** when talking to DynamoDB **Local** you do *not* need real
credentials — use dummy ones (see below). Real credentials are only needed for the AWS deploy
step and must stay out of the repo (`.env`/`.env.local` are gitignored).

---

## 2. Run Locally

### 2.1 Start DynamoDB Local

```bash
docker run -d --name dynamodb-local -p 8010:8000 amazon/dynamodb-local
```

### 2.2 Create the 3 tables

```bash
export AWS_ACCESS_KEY_ID=local AWS_SECRET_ACCESS_KEY=local AWS_DEFAULT_REGION=us-east-1
EP="--endpoint-url http://localhost:8010"

aws dynamodb $EP create-table --table-name MediaTracker-Users \
  --attribute-definitions AttributeName=PK,AttributeType=S AttributeName=SK,AttributeType=S \
    AttributeName=GSI1PK,AttributeType=S AttributeName=GSI1SK,AttributeType=S \
  --key-schema AttributeName=PK,KeyType=HASH AttributeName=SK,KeyType=RANGE \
  --global-secondary-indexes "[{\"IndexName\":\"GSI1\",\"KeySchema\":[{\"AttributeName\":\"GSI1PK\",\"KeyType\":\"HASH\"},{\"AttributeName\":\"GSI1SK\",\"KeyType\":\"RANGE\"}],\"Projection\":{\"ProjectionType\":\"ALL\"}}]" \
  --billing-mode PAY_PER_REQUEST

aws dynamodb $EP create-table --table-name MediaTracker-Media \
  --attribute-definitions AttributeName=PK,AttributeType=S AttributeName=SK,AttributeType=S \
    AttributeName=GSI1PK,AttributeType=S AttributeName=GSI1SK,AttributeType=S \
  --key-schema AttributeName=PK,KeyType=HASH AttributeName=SK,KeyType=RANGE \
  --global-secondary-indexes "[{\"IndexName\":\"GSI1\",\"KeySchema\":[{\"AttributeName\":\"GSI1PK\",\"KeyType\":\"HASH\"},{\"AttributeName\":\"GSI1SK\",\"KeyType\":\"RANGE\"}],\"Projection\":{\"ProjectionType\":\"ALL\"}}]" \
  --billing-mode PAY_PER_REQUEST

aws dynamodb $EP create-table --table-name MediaTracker-Library \
  --attribute-definitions AttributeName=PK,AttributeType=S AttributeName=SK,AttributeType=S \
    AttributeName=GSI1PK,AttributeType=S AttributeName=GSI1SK,AttributeType=S \
    AttributeName=GSI2PK,AttributeType=S AttributeName=GSI2SK,AttributeType=S \
  --key-schema AttributeName=PK,KeyType=HASH AttributeName=SK,KeyType=RANGE \
  --global-secondary-indexes "[{\"IndexName\":\"GSI1\",\"KeySchema\":[{\"AttributeName\":\"GSI1PK\",\"KeyType\":\"HASH\"},{\"AttributeName\":\"GSI1SK\",\"KeyType\":\"RANGE\"}],\"Projection\":{\"ProjectionType\":\"ALL\"}},{\"IndexName\":\"GSI2\",\"KeySchema\":[{\"AttributeName\":\"GSI2PK\",\"KeyType\":\"HASH\"},{\"AttributeName\":\"GSI2SK\",\"KeyType\":\"RANGE\"}],\"Projection\":{\"ProjectionType\":\"ALL\"}}]" \
  --billing-mode PAY_PER_REQUEST

aws dynamodb $EP list-tables   # → MediaTracker-Library, MediaTracker-Media, MediaTracker-Users
```

### 2.3 Run the backend

```bash
export AWS_ACCESS_KEY_ID=local AWS_SECRET_ACCESS_KEY=local AWS_DEFAULT_REGION=us-east-1
export AWS_ENDPOINT_URL=http://localhost:8010
export JWT_SECRET=dev-secret

go run main.go
# 🚀 Server starting on :8080
curl http://localhost:8080/health   # → {"status":"ok"}
```

### 2.4 Run the frontend

```bash
cd frontend
npm install
cp .env.example .env          # VITE_API_URL=http://localhost:8080 (already the default)
npm run dev                   # Open http://localhost:5173
```

**Demo on your phone (same Wi‑Fi):** serve on all interfaces —

```bash
npm run dev -- --host          # shows your LAN IP, e.g. http://192.168.1.23:5173
```

---

## 3. Test

There are **no automated tests** in the repo yet (see §5 “Changes needed”). Two ways to test
right now:

### 3.1 Build / static checks (fast)

```bash
# Frontend: type-check + production build + lint
cd frontend
npm run build          # tsc -b && vite build  → expects 0 errors
npm run lint           # oxlint  (4 warnings = ok, no errors)

# Backend: compile + vet + (empty) test run
cd ..
GOTOOLCHAIN=go1.26.0 go build ./...
GOTOOLCHAIN=go1.26.0 go vet ./...
GOTOOLCHAIN=go1.26.0 go test ./...   # currently "[no test files]" everywhere
```

### 3.2 API smoke test (hands‑on, run against local backend from §2)

```bash
B=http://localhost:8080

# 1) Register
curl -s -X POST $B/api/auth/register -H 'Content-Type: application/json' \
  -d '{"username":"demo","email":"demo@example.com","password":"secret123"}'

# 2) Login → capture token
TOKEN=$(curl -s -X POST $B/api/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"demo@example.com","password":"secret123"}' \
  | python3 -c 'import sys,json;print(json.load(sys.stdin)["token"])')

# 3) Add media (catalog)
curl -s -X POST $B/api/media -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"title":"Attack on Titan","media_type":"anime","year":2013,"genres":["Action","Dark Fantasy"],"description":"Humanity fights titans."}'
curl -s -X POST $B/api/media -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"title":"Interstellar","media_type":"movie","year":2014,"genres":["Sci-Fi","Drama"],"description":"Space epic."}'

# 4) Search
curl -s "$B/api/media/search?query=Attack"

# 5) Add to library & complete it (so recommendations/dashboard have data)
LIB_ID=$(curl -s "$B/api/media/search?query=Attack" | python3 -c 'import sys,json;print(json.load(sys.stdin)[0]["id"])')
curl -s -X POST $B/api/library -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d "{\"media_id\":\"$LIB_ID\",\"status\":\"Watching\",\"progress\":12,\"notes\":\"Riveting!\"}"
LIB_ITEM=$(curl -s $B/api/library -H "Authorization: Bearer $TOKEN" | python3 -c 'import sys,json;print(json.load(sys.stdin)[0]["id"])')
curl -s -X PUT $B/api/library/$LIB_ITEM -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"status":"Completed","progress":25}'

# 6) Dashboard + Recommendations
curl -s $B/api/dashboard       -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
curl -s $B/api/recommendations -H "Authorization: Bearer $TOKEN" | python3 -m json.tool

# 7) Auth guard (expects 401)
curl -s -o /dev/null -w "%{http_code}\n" $B/api/library
# ... 401
```

**This is the “Ship‑Gate” checklist** used for the hackathon. Take screenshots of each
step for `hackathon-docs/agent-proof/` and `hackathon-docs/testing/`.

---

## 4. Showcase / Demo

1. **Pre‑seed the demo** so the dashboard, library, and recommendations look alive:
   - Add 6–10 media items across anime / movie / game (via the Add Media page at
     `http://localhost:5173/add-media` or the API calls in §3.2).
   - Mark 2–3 as **Completed**, 1–2 as **Watching** — genre overlap unlocks “Why these
     recommendations?” cards.
2. **Run the frontend** (`npm run dev -- --host`) and the backend (§2) side by side.
3. **Demo story (90 seconds):**
   - Landing → painterly hero (Van Gogh theme: `from-sunflower`, night/cream palette).
   - Register → auto‑login → Dashboard: stat cards + Media Profile + completion ring.
   - Library: expand a card to flip status / progress / notes (live updates).
   - Search → “+ Add” a title; Recommendations → “Add to Library”.
4. **Visual theme checkpoints** to capture for the submission:
   - Canvas texture/night overlay, floating stars, swirl hover effects.
   - Consistent typography (`.text-display` / `.font-display` vs body).
   - Responsive behavior on mobile width (DevTools).

If the host machine is the demo machine, `vite preview` also works on the built bundle:

```bash
cd frontend && npm run build && npm run preview -- --host
```

---

## 5. Changes Needed (before/while deploying)

| # | Change | Why | Where |
|---|--------|-----|-------|
| 1 | **Go 1.26 toolchain** | `go.mod` says `go 1.26` | root — or `GOTOOLCHAIN=go1.26.0` per command |
| 2 | **Add automated tests** | `go test ./...` currently has no test files; add at least storage/service tests + a frontend smoke test | `*_test.go` in `storage/`, `services/`, `handlers/`; optional `vitest` in `frontend` |
| 3 | **Set a real JWT secret** in prod (`openssl rand -hex 32`) | `config.ValidateConfig()` refuses to start outside `dev` with the default secret | `deploy.sh` already generates one; keep it persisted across redeploys |
| 4 | **Lock `AllowedOrigin` to the Amplify URL** in prod (not `*`) | CORS security; template param `AllowedOrigin` | `deploy.sh` env `ALLOWED_ORIGIN` |
| 5 | **VITE_API_URL** in Amplify | Frontend must point at the live API Gateway URL | Amplify env vars |
| 6 | **Ship-gate screenshots** | Hackathon requires agent + testing evidence | `hackathon-docs/{agent-proof,testing}/` |
| 7 | **Track non-README markdown** | `.gitignore` currently blocks all `*.md` except `README.md` — un-ignore this guide if you want it committed | `.gitignore`: add `!RUN_TEST_SHOWCASE.md` |
| 8 | Go 1.26 base image | `Dockerfile` uses `golang:1.26-alpine` (matches go.mod) | `Dockerfile` |

**Known behavior notes (not bugs):**
- Recommendations stay empty until you have **Completed/Watching** items whose genres
  *don’t* already cover the whole catalog — that’s the scoring by design.
- `VgButton` renders a `<button>`; links are handled with `useNavigate`, not `<a>`.
- Tailwind v4 preflight via `@import "tailwindcss"` lives in `frontend/src/index.css`
  (which also imports `styles/van-gogh.css` theme tokens).

---

## 6. Deploy to AWS — Free Tier (≈ $0)

All resources already use free‑tier-friendly settings: DynamoDB `PAY_PER_REQUEST`
(on‑demand → $0 when idle), Lambda 512 MB/10 s, HTTP API, Amplify Hosting.

### 6.1 One‑time setup

```bash
# 1) IAM user with Access key + Secret (or `aws configure sso`)
aws configure            # default region us-east-1

# 2) SAM CLI (brew on macOS / install script on Linux)
brew install aws-sam-cli          # macOS
# Linux: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html
```

### 6.2 Backend (SAM → DynamoDB + Lambda + API Gateway HTTP API)

```bash
./deploy.sh
# validations:
#   ✔ sam build --use-container (Docker builds the Go Lambda image)
#   ✔ sam deploy --stack-name media-tracker --capabilities CAPABILITY_IAM
#
# NOTE: if you want a persisted JWT secret, set ENVIRONMENT / JWT_SECRET / ALLOWED_ORIGIN:
ENVIRONMENT=prod JWT_SECRET=$(openssl rand -hex 32) ALLOWED_ORIGIN='https://<app>.amplifyapp.com' ./deploy.sh
```

After deploy, grab the URL:

```bash
sam list stack-outputs --stack-name media-tracker --region us-east-1
# → ApiUrl: https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com
curl https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/health   # {"status":"ok"}
```

### 6.3 Frontend (Amplify Hosting — free tier: 1000 build min / 100 GB mo)

1. Push this repo to **GitHub** (branch `aws-zero-to-shipped`).
2. AWS Console → **Amplify** → **Create app** → **Host web app** → connect GitHub →
   select `aws-zero-to-shipped`.
3. Amplify auto-detects `amplify.yml` (build command `npm ci && npm run build`,
   artifact `frontend/dist`).
4. **Env variables** (App settings → Environment variables):
   ```
   VITE_API_URL=https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com
   ```
5. **Save & deploy** → done in ~2–3 min → open `https://<app-id>.amplifyapp.com`.
6. Back in `deploy.sh`/SAM, set `AllowedOrigin` to that Amplify URL and redeploy the
   backend once (so CORS is locked to your domain).

### 6.4 Cost expectations on Free Tier

| Service | Free Tier | Used here |
|---------|-----------|-----------|
| Lambda | 1M requests + 400,000 GB‑s / mo (12 mo) | tiny: a few GB‑s / mo |
| API Gateway (HTTP) | 1M requests / mo (12 mo) | demo traffic only |
| DynamoDB | 25 GB storage + on‑demand (PAY_PER_REQUEST = $0 when idle) | KB of data |
| Amplify Hosting | 1000 build min + 100 GB / mo | 1 repo, ~2 builds / mo |

Total expected for a demo/hackathon workload: **$0.00**.

### 6.5 Manual alternatives (no SAM)

If SAM is unavailable, the equivalent is: build with Docker, `docker push` to ECR, create
a Lambda from the image (`Handler: bootstrap`, `provided.al2023`), create the 3 DynamoDB
tables with the CLI commands from §2.2 (real names), create an HTTP API, wire routes/authorizer,
and set the Lambda env vars (`USERS_TABLE`, `MEDIA_TABLE`, `LIBRARY_TABLE`, `JWT_SECRET`,
`AWS_REGION`, `ALLOWED_ORIGINS`). `template.yaml` is the source of truth for all of this.

---

## 7. Teardown (keep it at $0)

```bash
aws cloudformation delete-stack --stack-name media-tracker
# Amplify: delete the app in the console
docker rm -f dynamodb-local          # local cleanup
```

If you ever want the on-demand DynamoDB tables gone immediately: delete them in the console
or `aws dynamodb delete-table --table-name <name>`.

---

## Quick Reference

```bash
docker run -d --name dynamodb-local -p 8010:8000 amazon/dynamodb-local          # DB
go run main.go                                                                  # API  :8080
cd frontend && npm run dev                                                      # UI   :5173
cd frontend && npm run build && npm run lint                                    # CI checks
GOTOOLCHAIN=go1.26.0 go build ./... && go vet ./... && go test ./...            # Go checks
./deploy.sh                                                                     # AWS backend
```