# Amazon Q Developer — Usage Guide (Proof of Agent)

This file documents every AWS-connected action performed with a coding agent.
Keep this updated and add screenshots to `hackathon-docs/amazon-q-screenshots/`.

## What Goes in the Screenshots

For EACH documented step, capture:
1. The prompt you typed into Amazon Q
2. Amazon Q's response / generated code
3. The resulting resource in the AWS Console (if applicable)

## Prompt Library (copy-paste these)

### 1. Create DynamoDB Tables
```
I have a Go project called MediaTracker. Create 3 DynamoDB tables for me
with this single-table design (PK/SK + GSIs). Use AWS CLI commands.

Table "MediaTracker-Users":
  PK = "USER#<userId>", SK = "METADATA"
  GSI1: GSI1PK = "EMAIL#<email>", GSI1SK = "USER#<userId>"
  attrs: id, username, email, password, created_at

Table "MediaTracker-Media":
  PK = "MEDIA#<mediaId>", SK = "METADATA"
  GSI1: GSI1PK = "TYPE#<type>", GSI1SK = "TITLE#<title>"
  attrs: id, title, media_type, year, genres(SS), description, created_at

Table "MediaTracker-Library":
  PK = "USER#<userId>", SK = "LIBRARY#<libraryId>"
  GSI1: STATUS#<status> / ADDED_AT#<ts>
  GSI2: MEDIA#<mediaId> / USER#<userId>
  attrs: id, user_id, media_id, status, progress, notes, added_at, updated_at
```

### 2. IAM Policy for Lambda
```
Write an IAM policy that lets a Lambda function read/write the three
MediaTracker DynamoDB tables (GetItem, PutItem, Query, Scan, DeleteItem,
UpdateItem) and publish logs to CloudWatch.
```

### 3. Deploy Go Binary as Lambda
```
I built my Go API binary (bootstrap). Walk me through deploying it as an
AWS Lambda function behind an API Gateway HTTP API with CORS enabled so a
React app on Amplify can call it. Include the runtime, handler, memory,
timeout, and environment variables. I'm using the container image
public.ecr.aws/lambda/provided:al2023.
```

### 4. Debug Lambda → DynamoDB
```
My Lambda times out / can't reach DynamoDB. Show me how to check
CloudWatch logs and what IAM role/permissions are needed.
```

### 5. Amplify Hosting Setup
```
Create an Amplify Hosting app from my GitHub repo (branch aws-zero-to-shipped).
My repo has amplify.yml with these build steps...
Tell me exactly where to add the VITE_API_URL environment variable.
```

## Log of Agent Interactions

| # | Date | Prompt (brief) | Tool | AWS Action | Screenshot? | Notes |
|---|------|----------------|------|-----------|-------------|-------|
| 1 | 2026-09-19 | Create 3 DynamoDB tables with GSI | Amazon Q | Create tables | ☐ | |
| 2 | 2026-09-19 | IAM policy for Lambda | Amazon Q | — | ☐ | |
| 3 | 2026-09-20 | Deploy Lambda + API Gateway | Amazon Q | Deploy | ☐ | |
| 4 | 2026-09-21 | Amplify build settings | Amazon Q | Amplify | ☐ | |
| 5 |          | Debug issue: ... | Amazon Q | — | ☐ | |