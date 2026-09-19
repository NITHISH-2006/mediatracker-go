# Development Log

Document every major step with a coding agent. For each entry use this template.

## Log Template

| Field | Value |
|-------|-------|
| Date | YYYY-MM-DD |
| Tool | Amazon Q / OpenCode / Kiro |
| Task | What you asked the agent to do |
| Prompt | The exact prompt |
| Agent action | What the agent did |
| What changed | Files/resources modified |
| Testing | How you verified it |
| Result | Pass / Fail / Notes |

## Entries

### 2026-09-19 — Backend hardening (OpenCode)

- **Task:** Security hardening + recommendation upgrade + media profile analytics
- **Prompt:** "Do all the things that are needed now and complete the project."
- **Agent action:** Added `config.ValidateConfig()` prod guard, parametrized
  `ALLOWED_ORIGINS` in `template.yaml`, rewrote the recommendation service with
  weighted genre scoring + "why" reasons, extended the dashboard with
  `media_profile` + `completion_rate`, added the Media Profile UI section.
- **What changed:** `config/config.go`, `template.yaml`, `deploy.sh`,
  `services/recommendation_service.go`, `handlers/dashboard.go`,
  `frontend/src/pages/DashboardPage.tsx`.
- **Testing:** `go build`/`go vet`, `npm run build`, full E2E vs DynamoDB Local
  (register → login → library → dashboard → recommendations).
- **Result:** ✅ Pass

### 2026-09-19 — DynamoDB storage migration (OpenCode)

- **Task:** Replace in-memory store with DynamoDB, keep API signatures
- **Prompt:** "Migrate the storage layer to DynamoDB using AWS SDK v2, keep method signatures."
- **Agent action:** Wrote `storage/dynamo.go`, env-based config, CORS middleware.
- **What changed:** `storage/dynamo.go`, `config/config.go`, `main.go`, `middleware/cors.go`.
- **Testing:** E2E vs DynamoDB Local incl. persistence across restart.
- **Result:** ✅ Pass

### 2026-09-20 — (deploy) — Amazon Q

| Field | Value |
|-------|-------|
| Task | Deploy backend stack |
| Prompt | "Run `sam build --use-container` and `sam deploy --guided`, confirm API URL" |
| Agent action | *(fill after doing it)* |
| What changed | Stack + tables + lambda + api gateway |
| Testing | `curl <api-url>/health` |
| Result | |

### 2026-09-20 — (deploy frontend) — Amazon Q

| Field | Value |
|-------|-------|
| Task | Deploy React app to Amplify Hosting |
| Prompt | "Connect my GitHub repo to Amplify, set VITE_API_URL, deploy" |
| Agent action | *(fill after doing it)* |
| What changed | Amplify app + env var |
| Testing | Open `<app>.amplifyapp.com` full journey |
| Result | |