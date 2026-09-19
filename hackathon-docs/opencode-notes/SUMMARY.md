# OpenCode — Agent Notes

This file documents what the OpenCode coding agent did on this project,
to include in the hackathon submission ("how I used AI coding agents").

## Summary

OpenCode was the primary builder. It executed a 5-phase plan to turn the
in-memory Go API into a deployed full-stack app via these steps:

1. **Phased execution** — implemented the DynamoDB migration, added the frontend,
   and wrote the AWS deployment manifests (SAM, Dockerfile, amplify.yml).
2. **Multi-file refactoring** — rewrote `storage/dynamo.go`, split the router into
   a shared `router` package so both the local server and the Lambda handler reuse it.
3. **Environment-based config** — replaced hardcoded constants with env vars
   (`JWT_SECRET`, table names, CORS origins, port).
4. **CORS middleware** — added for the browser frontend.
5. **React frontend** — scaffolded Vite + React + Tailwind v4, built AuthContext,
   API client with JWT interceptor, and 8 pages.
6. **Lambda support** — created `lambda/main.go` using `chiadapter`.
7. **Verification** — ran the full API against DynamoDB Local (register → login →
   add media → library → dashboard → recommendations → persistence across restart).

## Key Prompts Given to OpenCode

- "Migrate the storage layer to DynamoDB using AWS SDK v2, keep method signatures."
- "Add CORS middleware with configurable allowed origins."
- "Scaffold a React + Vite + Tailwind frontend with login/library/dashboard/search/add-media/recommendations."
- "Create a SAM template + Dockerfile + amplify.yml for deployment."
- "Refactor the router so the local server and Lambda handler share the same wiring."

## Free-Tier-Friendly Decisions

- DynamoDB `PAY_PER_REQUEST` billing
- Lambda 512MB / 10s timeout
- API Gateway **HTTP API** (cheaper than REST API)
- Amplify Hosting for static frontend

## Evidence in Repo

- `IMPLEMENTATION_PLAN.md` — full plan this agent followed
- `storage/dynamo.go` — DynamoDB implementation
- `frontend/` — complete React app
- `template.yaml`, `Dockerfile`, `deploy.sh`, `amplify.yml` — deployment artifacts