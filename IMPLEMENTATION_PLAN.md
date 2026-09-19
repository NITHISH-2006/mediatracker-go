# MediaTracker-Go — AWS Zero to Shipped Complete Implementation Plan

**Hackathon**: AWS Zero to Shipped (2026)
**Deadline**: October 2
**Category**: Daily Life Enhancement
**Focus Track**: Community

---

## Overview

Transform the existing backend-only Go REST API into a deployed, full-stack application on AWS:

| Current State | Target State |
|---------------|---------------|
| Backend-only Go API | Full-stack (Go API + React frontend) |
| In-memory storage | Persistent DynamoDB storage |
| Local-only (localhost:8080) | Publicly reachable URL on AWS |
| No coding agent usage | Amazon Q + OpenCode usage (documented) |

---

## Architecture

```
┌─────────────────────────────────────────────┐
│        Browser (React + Vite + Tailwind)    │
│         hosted on AWS Amplify Hosting       │
└──────────────────┬──────────────────────────┘
                   │ HTTPS (public URL)
┌──────────────────▼──────────────────────────┐
│         AWS API Gateway (HTTP API)          │
│              + CORS enabled                 │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         AWS Lambda (Go binary)              │
│    chi router handling all /api routes      │
└──────────────────┬──────────────────────────┘
                   │ AWS SDK v2
┌──────────────────▼──────────────────────────┐
│              DynamoDB (3 tables)            │
│   Users · Media · Library + GSIs            │
└─────────────────────────────────────────────┘
```

---

## Tool Strategy (Hackathon Rule: Coding Agent Connected to AWS)

| Tool | Role |
|------|------|
| **Amazon Q Developer** | MUST-DO: AWS infrastructure tasks + proof screenshots. Use for DynamoDB table creation, IAM policies, Lambda + API Gateway setup, debugging AWS issues. |
| **OpenCode** | Main builder: multi-file code changes (storage rewrite, frontend, refactoring). |

### Documentation Proof Requirements

Every major AWS action performed by a coding agent must be screenshotted:

1. Agent creating DynamoDB tables
2. Agent generating Go DynamoDB code
3. Agent deploying Lambda + API Gateway
4. Agent configuring Amplify
5. Agent fixing a bug

Store screenshots in: `hackathon-docs/amazon-q-screenshots/`

---

## Phase 1 — AWS Setup & Project Prep (Sep 19–20)

### 1.1 AWS Account
- Create AWS account (Free Tier) at https://aws.amazon.com
- IAM user with programmatic access + console access

### 1.2 AWS Builder Center (MANDATORY)
1. Go to https://builder.aws.com
2. Create profile / log in (required for hackathon submission)
3. Create project: **"MediaTracker"**
4. Fill later: live URL, agent proof screenshots, category, focus track

### 1.3 Coding Agent Setup
**Amazon Q Developer:**
1. Install VS Code
2. Install "Amazon Q Developer" extension
3. Sign in with AWS Builder ID
4. Enable AWS Agent toolkit / workspace permissions

**OpenCode:** Already in use (this project).

### 1.4 Git Branch + Folder Structure
```bash
git checkout -b aws-zero-to-shipped
git push -u origin aws-zero-to-shipped

mkdir -p hackathon-docs/amazon-q-screenshots
mkdir -p hackathon-docs/opencode-notes
mkdir -p hackathon-docs/architecture
```

### 1.5 Commit Convention
```bash
git add .
git commit -m "phase1: setup project for AWS Zero to Shipped"
git push
```

Phase commits:
- `phase2: migrate storage layer to DynamoDB`
- `phase3: add React frontend scaffold`
- `phase4: deploy backend to Lambda + API Gateway`
- `phase5: deploy frontend to Amplify`
- `docs: add architecture and agent usage notes`

---

## Phase 2 — Backend: DynamoDB Migration (Sep 21–23)

### 2.1 DynamoDB Table Design (via Amazon Q)

**Table 1: `MediaTracker-Users`**
| Key | Value |
|-----|-------|
| PK | `USER#<userId>` |
| SK | `METADATA` |
| GSI1PK | `EMAIL#<email>` |
| GSI1SK | `USER#<userId>` |
| Attributes | `username`, `password_hash`, `created_at` |

**Table 2: `MediaTracker-Media`**
| Key | Value |
|-----|-------|
| PK | `MEDIA#<mediaId>` |
| SK | `METADATA` |
| GSI1PK | `TYPE#<mediaType>` |
| GSI1SK | `TITLE#<title>` |
| Attributes | `title`, `year`, `genres` (SS), `description`, `created_at` |

**Table 3: `MediaTracker-Library`**
| Key | Value |
|-----|-------|
| PK | `USER#<userId>` |
| SK | `LIBRARY#<libraryId>` |
| GSI1PK | `STATUS#<status>` |
| GSI1SK | `ADDED_AT#<timestamp>` |
| GSI2PK | `MEDIA#<mediaId>` |
| GSI2SK | `USER#<userId>` |
| Attributes | `media_id`, `status`, `progress`, `notes`, `added_at`, `updated_at` |

### 2.2 AWS CLI: Create Tables (agent prompt)

Give to Amazon Q: *"Create these 3 DynamoDB tables in AWS with GSIs according to this schema. Use AWS CLI and generate table definitions."*

```bash
aws dynamodb create-table \
  --table-name MediaTracker-Users \
  --attribute-definitions \
    AttributeName=PK,AttributeType=S \
    AttributeName=SK,AttributeType=S \
    AttributeName=GSI1PK,AttributeType=S \
    AttributeName=GSI1SK,AttributeType=S \
  --key-schema \
    AttributeName=PK,KeyType=HASH \
    AttributeName=SK,KeyType=RANGE \
  --global-secondary-indexes \
    "[{\"IndexName\":\"GSI1\",\"KeySchema\":[{\"AttributeName\":\"GSI1PK\",\"KeyType\":\"HASH\"},{\"AttributeName\":\"GSI1SK\",\"KeyType\":\"RANGE\"}],\"Projection\":{\"ProjectionType\":\"ALL\"}}]" \
  --billing-mode PAY_PER_REQUEST

aws dynamodb create-table \
  --table-name MediaTracker-Media \
  --attribute-definitions \
    AttributeName=PK,AttributeType=S \
    AttributeName=SK,AttributeType=S \
    AttributeName=GSI1PK,AttributeType=S \
    AttributeName=GSI1SK,AttributeType=S \
  --key-schema \
    AttributeName=PK,KeyType=HASH \
    AttributeName=SK,KeyType=RANGE \
  --global-secondary-indexes \
    "[{\"IndexName\":\"GSI1\",\"KeySchema\":[{\"AttributeName\":\"GSI1PK\",\"KeyType\":\"HASH\"},{\"AttributeName\":\"GSI1SK\",\"KeyType\":\"RANGE\"}],\"Projection\":{\"ProjectionType\":\"ALL\"}}]" \
  --billing-mode PAY_PER_REQUEST

aws dynamodb create-table \
  --table-name MediaTracker-Library \
  --attribute-definitions \
    AttributeName=PK,AttributeType=S \
    AttributeName=SK,AttributeType=S \
    AttributeName=GSI1PK,AttributeType=S \
    AttributeName=GSI1SK,AttributeType=S \
    AttributeName=GSI2PK,AttributeType=S \
    AttributeName=GSI2SK,AttributeType=S \
  --key-schema \
    AttributeName=PK,KeyType=HASH \
    AttributeName=SK,KeyType=RANGE \
  --global-secondary-indexes \
    "[{\"IndexName\":\"GSI1\",\"KeySchema\":[{\"AttributeName\":\"GSI1PK\",\"KeyType\":\"HASH\"},{\"AttributeName\":\"GSI1SK\",\"KeyType\":\"RANGE\"}],\"Projection\":{\"ProjectionType\":\"ALL\"}},{\"IndexName\":\"GSI2\",\"KeySchema\":[{\"AttributeName\":\"GSI2PK\",\"KeyType\":\"HASH\"},{\"AttributeName\":\"GSI2SK\",\"KeyType\":\"RANGE\"}],\"Projection\":{\"ProjectionType\":\"ALL\"}}]" \
  --billing-mode PAY_PER_REQUEST
```

### 2.3 Go Code Changes — Config

`config/config.go` — read from environment:
```go
package config

import "os"

var (
    ServerPort   = ":" + getEnv("PORT", "8080")
    AWSRegion    = getEnv("AWS_REGION", "us-east-1")
    UsersTable   = getEnv("USERS_TABLE", "MediaTracker-Users")
    MediaTable   = getEnv("MEDIA_TABLE", "MediaTracker-Media")
    LibraryTable = getEnv("LIBRARY_TABLE", "MediaTracker-Library")
    JWTSecret    = getEnv("JWT_SECRET", "dev-secret-change-in-production")
    TokenExpiration int64 = 24 * 60 * 60
)

func getEnv(key, fallback string) string {
    if v := os.Getenv(key); v != "" {
        return v
    }
    return fallback
}
```

### 2.4 Go Code Changes — Storage Layer

**IMPORTANT:** Keep the same method signatures so services/handlers stay untouched.

`storage/dynamo.go` — new DynamoDB-backed store:

```go
package storage

import (
	"context"
	"fmt"
	"os"
	"strings"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"

	"github.com/yourusername/mediatracker-go/models"
)

type Store struct {
	client       *dynamodb.Client
	usersTable   string
	mediaTable   string
	libraryTable string
}

// DynamoDB item structs
type UserItem struct {
	PK           string `dynamodbav:"PK"`
	SK           string `dynamodbav:"SK"`
	GSI1PK       string `dynamodbav:"GSI1PK"`
	GSI1SK       string `dynamodbav:"GSI1SK"`
	ID           string `dynamodbav:"id"`
	Username     string `dynamodbav:"username"`
	Email        string `dynamodbav:"email"`
	Password     string `dynamodbav:"password"`
	CreatedAt    string `dynamodbav:"created_at"`
}

type MediaItem struct {
	PK          string   `dynamodbav:"PK"`
	SK          string   `dynamodbav:"SK"`
	GSI1PK      string   `dynamodbav:"GSI1PK"`
	GSI1SK      string   `dynamodbav:"GSI1SK"`
	ID          string   `dynamodbav:"id"`
	Title       string   `dynamodbav:"title"`
	MediaType   string   `dynamodbav:"media_type"`
	Year        int      `dynamodbav:"year"`
	Genres      []string `dynamodbav:"genres"`
	Description string   `dynamodbav:"description"`
	CreatedAt   string   `dynamodbav:"created_at"`
}

type LibraryItemItem struct {
	PK        string `dynamodbav:"PK"`
	SK        string `dynamodbav:"SK"`
	GSI1PK    string `dynamodbav:"GSI1PK"`
	GSI1SK    string `dynamodbav:"GSI1SK"`
	GSI2PK    string `dynamodbav:"GSI2PK"`
	GSI2SK    string `dynamodbav:"GSI2SK"`
	ID        string `dynamodbav:"id"`
	UserID    string `dynamodbav:"user_id"`
	MediaID   string `dynamodbav:"media_id"`
	Status    string `dynamodbav:"status"`
	Progress  int    `dynamodbav:"progress"`
	Notes     string `dynamodbav:"notes"`
	AddedAt   string `dynamodbav:"added_at"`
	UpdatedAt string `dynamodbav:"updated_at"`
}

// NewStore creates a DynamoDB-backed store
func NewStore() (*Store, error) {
	cfg, err := config.LoadDefaultConfig(context.Background())
	if err != nil {
		return nil, fmt.Errorf("failed to load AWS config: %v", err)
	}
	client := dynamodb.NewFromConfig(cfg)

	tablePrefix := os.Getenv("MEDIATRACKER_TABLE_PREFIX")
	if tablePrefix == "" {
		tablePrefix = "MediaTracker-"
	}

	return &Store{
		client:       client,
		usersTable:   tablePrefix + "Users",
		mediaTable:   tablePrefix + "Media",
		libraryTable: tablePrefix + "Library",
	}, nil
}
```

Full CRUD operations for all entities must mirror the in-memory implementation but use `dynamodb.PutItem`, `GetItem`, `Query`, and `DeleteItem`. See `storage/dynamo.go` in the final code.

### 2.5 main.go Changes

```go
package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"

	"github.com/yourusername/mediatracker-go/config"
	"github.com/yourusername/mediatracker-go/handlers"
	"github.com/yourusername/mediatracker-go/middleware"
	"github.com/yourusername/mediatracker-go/services"
	"github.com/yourusername/mediatracker-go/storage"
)

func main() {
	store, err := storage.NewStore()
	if err != nil {
		log.Fatalf("❌ Failed to initialize storage: %v\n", err)
	}

	authService := services.NewAuthService(store)
	mediaService := services.NewMediaService(store)
	libraryService := services.NewLibraryService(store, mediaService)
	recommendationService := services.NewRecommendationService(store, libraryService, mediaService)

	authHandler := handlers.NewAuthHandler(authService)
	mediaHandler := handlers.NewMediaHandler(mediaService)
	libraryHandler := handlers.NewLibraryHandler(libraryService)
	recommendationHandler := handlers.NewRecommendationHandler(recommendationService)
	dashboardHandler := handlers.NewDashboardHandler(libraryService, mediaService)

	router := chi.NewRouter()
	router.Use(middleware.LoggingMiddleware)
	router.Use(middleware.CORSMiddleware)

	// ============ PUBLIC ROUTES ============
	router.Get("/health", healthCheck)
	router.Post("/api/auth/register", authHandler.Register)
	router.Post("/api/auth/login", authHandler.Login)
	router.Get("/api/media", mediaHandler.GetAllMedia)
	router.Get("/api/media/search", mediaHandler.SearchMedia)
	router.Get("/api/media/{id}", mediaHandler.GetMediaByID)

	// ============ PROTECTED ROUTES ============
	router.Route("/api", func(r chi.Router) {
		r.Use(middleware.AuthMiddleware(authService))
		r.Post("/media", mediaHandler.AddMedia)
		r.Post("/library", libraryHandler.AddMediaToLibrary)
		r.Get("/library", libraryHandler.GetUserLibrary)
		r.Get("/library/{id}", libraryHandler.GetLibraryItem)
		r.Put("/library/{id}", libraryHandler.UpdateLibraryItem)
		r.Delete("/library/{id}", libraryHandler.DeleteLibraryItem)
		r.Get("/recommendations", recommendationHandler.GetRecommendations)
		r.Get("/dashboard", dashboardHandler.GetDashboard)
	})

	log.Printf("🚀 Server starting on %s\n", config.ServerPort)
	if err := http.ListenAndServe(config.ServerPort, router); err != nil {
		log.Fatalf("❌ Server failed: %v\n", err)
	}
}

func healthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status":"ok"}`))
}
```

### 2.6 go.mod Dependencies
```bash
go get github.com/aws/aws-sdk-go-v2
go get github.com/aws/aws-sdk-go-v2/config
go get github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue
go get github.com/aws/aws-sdk-go-v2/service/dynamodb
```

### 2.7 Local Testing
```bash
# Option A: DynamoDB Local (Docker)
docker run -p 8000:8000 amazon/dynamodb-local
export AWS_ENDPOINT_URL=http://localhost:8000   # or pass endpoint to SDK

# Option B: Real DynamoDB
export AWS_REGION=us-east-1
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...

go run main.go
curl http://localhost:8080/health
```

---

## Phase 3 — Frontend: React + Vite + Tailwind (Sep 24–26)

### 3.1 Scaffold
```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install axios react-router-dom
```

### 3.2 Page Structure
| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `LandingPage` | Hero + features + CTA |
| `/login` | `LoginPage` | Login form |
| `/register` | `RegisterPage` | Register form |
| `/dashboard` | `DashboardPage` | Stats cards + favorite genres |
| `/library` | `LibraryPage` | Tabbed library (All/Watching/Completed/Planned/Dropped) |
| `/search` | `SearchPage` | Search media, add to library |
| `/add-media` | `AddMediaPage` | Add new media (auth) |
| `/recommendations` | `RecommendationsPage` | Recommended cards |

### 3.3 Core Files
```
frontend/src/
├── api/client.ts          # Axios with JWT interceptor
├── context/AuthContext.tsx
├── hooks/useAuth.ts
├── components/            # MediaCard, StatCard, Navbar, etc.
├── pages/                 # 8 pages above
├── types/index.ts         # TS interfaces matching Go models
├── App.tsx                # Routes
└── main.tsx
```

### 3.4 API Client
```typescript
// frontend/src/api/client.ts
import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
```

### 3.5 Environment Config
```
# frontend/.env
VITE_API_URL=https://<api-id>.execute-api.<region>.amazonaws.com
```

---

## Phase 4 — Backend Deployment (Sep 27–28)

### 4.1 Package Go as Lambda
```bash
GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o bootstrap main.go
zip deployment.zip bootstrap
```

Alternatively use container image.

### 4.2 Lambda + API Gateway (via Amazon Q)
Give to Amazon Q: *"Deploy my Go binary as an AWS Lambda function with API Gateway HTTP API, enable CORS, and connect it to my DynamoDB tables. Provide IAM role and policy."*

**IAM Policy for Lambda:**
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:Query",
                "dynamodb:Scan",
                "dynamodb:DeleteItem",
                "dynamodb:UpdateItem"
            ],
            "Resource": "arn:aws:dynamodb:*:*:table/MediaTracker-*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "arn:aws:logs:*:*:*"
        }
    ]
}
```

**Environment Variables for Lambda:**
- `USERS_TABLE=MediaTracker-Users`
- `MEDIA_TABLE=MediaTracker-Media`
- `LIBRARY_TABLE=MediaTracker-Library`
- `JWT_SECRET=<long-random-string>`
- `AWS_REGION=<region>`

**API Gateway:**
- Create **HTTP API**
- Route `ANY /{proxy+}` → Lambda
- Enable CORS: `*`, methods GET/POST/PUT/DELETE, headers Content-Type/Authorization

### 4.3 Lambda Go Adapter Requirement
If packaging chi router into Lambda, use `github.com/aws/aws-lambda-go` and `github.com/awslabs/aws-lambda-go-api-proxy/chi`:

```go
import (
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/awslabs/aws-lambda-go-api-proxy/chi"
)

var chiLambda *chiadapter.ChiLambda

func init() {
	// build your chi router here
	chiLambda = chiadapter.New(router)
}

func Handler(req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	return chiLambda.Proxy(req)
}

func main() {
	lambda.Start(Handler)
}
```

---

## Phase 5 — Frontend Deployment: Amplify (Sep 28–30)

### 5.1 Connect GitHub
1. Push `frontend/` to GitHub repo
2. AWS Console → Amplify Hosting → Create app
3. Connect GitHub repo → branch `aws-zero-to-shipped`

### 5.2 Build Settings
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd frontend && npm ci
    build:
      commands:
        - cd frontend && npm run build
  artifacts:
    baseDirectory: frontend/dist
    files:
      - '**/*'
  cache:
    paths:
      - frontend/node_modules/**/*
```

### 5.3 Environment Variables in Amplify
- `VITE_API_URL=https://<api-id>.execute-api.<region>.amazonaws.com`

### 5.4 Verify
- Open the generated `https://<app-id>.amplifyapp.com`
- Register → Login → Add media → library → dashboard → recommendations

---

## Phase 6 — Polish (Days 11–12 / Oct 1)

### 6.1 Backend Polish
- [ ] Consistent error responses
- [ ] Health check endpoint
- [ ] Request logging with request IDs

### 6.2 Frontend Polish
- [ ] Loading skeletons
- [ ] Error toasts
- [ ] Responsive mobile-first
- [ ] Empty states
- [ ] Feature: "Recently Added" on dashboard

### 6.3 Documentation for Builder Center Submission

**Builder Center Project Page Must Include:**
1. **Live URL**: `https://<app-id>.amplifyapp.com`
2. **Coding Agent Proof**: 5–10 screenshots (Amazon Q taking AWS actions)
3. **Architecture Diagram**
4. **Tech Stack**: Go, React, DynamoDB, Lambda, API Gateway, Amplify
5. **Category**: Daily Life Enhancement
6. **Focus Track**: Community
7. **README** updated for full-stack

---

## Phase 7 — Final Testing & Submission (Oct 1–2)

- [ ] E2E test: Register → Login → Add media → Library → Dashboard → Recommendations
- [ ] Test on mobile browser
- [ ] Verify public URL (no VPN)
- [ ] Submit to Builder Center before **Oct 2 deadline**

---

## Acceptance Criteria (Definition of Done)

1. [ ] `GET /health` returns `200` on deployed URL
2. [ ] Register + Login works on live site
3. [ ] Adding media to library persists after Lambda cold restart (DynamoDB)
4. [ ] Dashboard stats render
5. [ ] Recommendations render
6. [ ] Public URL reachable without VPN
7. [ ] Amazon Q screenshots exist in `hackathon-docs/`
8. [ ] Builder Center project page complete
9. [ ] Submitted before deadline

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| DynamoDB migration bugs | Keep storage interface identical; test every method locally with DynamoDB Local |
| Lambda cold start slow | Pay for provisioned or accept ~1s; use provisioned concurrency if budget allows |
| CORS issues | Test with curl `-H "Origin: ..."` before frontend hits it |
| Time running out | Prioritize core flows; skip polish if needed |
| Amazon Q unavailable | Fallback: Kiro + AWS Agent Toolkit; document whatever agent used |

---

## Quick Reference: Agent Prompts

### Amazon Q Prompts

1. *"Create 3 DynamoDB tables (Users, Media, Library) with GSIs using this schema: [paste schema]. Use AWS CLI."*
2. *"Write an IAM policy that lets a Lambda function read/write these DynamoDB tables and write logs."*
3. *"Deploy this Go binary as a Lambda function behind API Gateway HTTP API with CORS. Give me exact steps."*
4. *"My Lambda can't reach DynamoDB. How do I debug? Show CloudWatch logs."*
5. *"Create an Amplify Hosting app connected to this GitHub repo, with build settings for a Vite React app."*

### OpenCode Prompts

1. *"Migrate the storage layer of this Go project from in-memory maps to DynamoDB using AWS SDK v2. Keep the Store.method signatures identical."*
2. *"Add CORS middleware for a chi router with configurable allowed origins."*
3. *"Scaffold a React + Vite + Tailwind frontend with these 8 pages and AuthContext."*
4. *"Generate environment-based config for this Go app."*

---

*Document version 1.0 — save from 2026-09-19*