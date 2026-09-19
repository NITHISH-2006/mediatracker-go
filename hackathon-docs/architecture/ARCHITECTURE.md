# MediaTracker — Architecture Diagram

## System Overview

```
                         ┌─────────────────────────────────────────────┐
                         │          AWS Amplify Hosting                │
                         │   React + Vite + Tailwind (SPA)             │
                         │   https://<app-id>.amplifyapp.com           │
                         └───────────────────┬─────────────────────────┘
                                             │ HTTPS + JWT (Authorization header)
                                             ▼
                         ┌─────────────────────────────────────────────┐
                         │       AWS API Gateway (HTTP API)            │
                         │   Routes: ANY /{proxy+}                    │
                         │   CORS: * , GET/POST/PUT/DELETE/OPTIONS    │
                         └───────────────────┬─────────────────────────┘
                                             │
                                             ▼
                         ┌─────────────────────────────────────────────┐
                         │   AWS Lambda  "MediaTracker" (Go 1.26)      │
                         │   container: provided.al2023                │
                         │   chi router → handlers → services           │
                         │   JWT auth middleware                       │
                         └───────────────┬──────────┬──────────────────┘
                                         │          │
                     AWS SDK Go v2        │          │
                                         ▼          ▼
┌─────────────────────────────┐  ┌────────────────┐  ┌─────────────────┐
│  MediaTracker-Users         │  │ MediaTracker-  │  │ MediaTracker-   │
│  PK user / GSI1 email       │  │ Media          │  │ Library         │
│  (register, login)          │  │ PK media / GSI  │  │ PK user / 2 GSIs│
└─────────────────────────────┘  └────────────────┘  └─────────────────┘
                     All tables: PAY_PER_REQUEST (Free Tier)
```

## Request Flow (example: add media to library)

1. Browser (React) sends `POST /api/library {media_id, status, ...}` with `Authorization: Bearer <jwt>`
2. API Gateway forwards to Lambda (route `ANY /{proxy+}`)
3. `chiadapter` converts APIGW event → http.Request, chi routes to `LibraryHandler`
4. `AuthMiddleware` validates the JWT, extracts `user_id`
5. `LibraryService` validates media exists + status is valid
6. `Store` writes the item to `MediaTracker-Library` (PK `USER#<id>`, SK `LIBRARY#<item>`)
7. Response flows back through API Gateway to the browser

## Security

- JWT HMAC-SHA256, 24h expiry, secret via `JWT_SECRET` env var (never in code)
- Passwords bcrypt-hashed, never returned in JSON
- Lambda execution role scoped to `MediaTracker-*` tables + CloudWatch logs
- CORS restricted to the Amplify domain in production (`ALLOWED_ORIGINS`)

## Scalability / Cost

- Serverless: auto-scales to zero, no servers to patch
- DynamoDB on-demand billing: only pay per request
- Cold start mitigated with `provided.al2023` Go runtime (~10–40 ms init)