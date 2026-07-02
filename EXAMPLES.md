# mediatracker-go - API Examples

Complete curl examples for all endpoints.

## 1. Authentication

### Register New User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "anime_lover",
    "email": "user@example.com",
    "password": "securepass123"
  }'
```

**Response:**
```json
{
  "id": "a1b2c3d4e5f6",
  "username": "anime_lover",
  "email": "user@example.com",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepass123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 86400
}
```

**Save the token for authenticated requests:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 2. Media Management

### Add New Media
```bash
curl -X POST http://localhost:8080/api/media \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Attack on Titan",
    "media_type": "anime",
    "year": 2013,
    "genres": ["action", "fantasy", "drama", "dark"],
    "description": "Humanity fights against giant humanoid creatures called Titans"
  }'
```

**Response:**
```json
{
  "id": "m1n2o3p4q5r6",
  "title": "Attack on Titan",
  "media_type": "anime",
  "year": 2013,
  "genres": ["action", "fantasy", "drama", "dark"],
  "description": "Humanity fights against giant humanoid creatures called Titans",
  "created_at": "2024-01-15T11:00:00Z"
}
```

### Add More Media Examples
```bash
# Anime
curl -X POST http://localhost:8080/api/media \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Demon Slayer",
    "media_type": "anime",
    "year": 2019,
    "genres": ["action", "adventure", "dark"],
    "description": "A young man becomes a demon slayer to save his sister"
  }'

# Movie
curl -X POST http://localhost:8080/api/media \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Inception",
    "media_type": "movie",
    "year": 2010,
    "genres": ["sci-fi", "thriller", "action"],
    "description": "A thief who steals corporate secrets through dream-sharing technology"
  }'

# Game
curl -X POST http://localhost:8080/api/media \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Elden Ring",
    "media_type": "game",
    "year": 2022,
    "genres": ["action-rpg", "fantasy", "open-world"],
    "description": "An open-world action RPG in a fantasy land"
  }'
```

### Search Media
```bash
curl -X GET "http://localhost:8080/api/media/search?query=Titan" \
  -H "Authorization: Bearer $TOKEN"
```

### Get All Media
```bash
curl -X GET http://localhost:8080/api/media \
  -H "Authorization: Bearer $TOKEN"
```

### Get Specific Media
```bash
curl -X GET http://localhost:8080/api/media/m1n2o3p4q5r6 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 3. Personal Library Management

### Add Media to Library
```bash
# Get media ID from previous response, then add to library
MEDIA_ID="m1n2o3p4q5r6"

curl -X POST http://localhost:8080/api/library \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "media_id": "'$MEDIA_ID'",
    "status": "Watching",
    "progress": 12,
    "notes": "Amazing series! Currently on episode 12"
  }'
```

**Response:**
```json
{
  "id": "lib123abc",
  "user_id": "a1b2c3d4e5f6",
  "media_id": "m1n2o3p4q5r6",
  "status": "Watching",
  "progress": 12,
  "notes": "Amazing series! Currently on episode 12",
  "added_at": "2024-01-15T11:05:00Z",
  "updated_at": "2024-01-15T11:05:00Z"
}
```

### Add Multiple Items to Library
```bash
# Save a couple media IDs
MEDIA_ID1="m1n2o3p4q5r6"
MEDIA_ID2="m7s8t9u0v1w2"

# Add first
curl -X POST http://localhost:8080/api/library \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "media_id": "'$MEDIA_ID1'",
    "status": "Watching",
    "progress": 12
  }'

# Add second
curl -X POST http://localhost:8080/api/library \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "media_id": "'$MEDIA_ID2'",
    "status": "Completed",
    "progress": 10,
    "notes": "Finished watching!"
  }'
```

### Get My Library
```bash
curl -X GET http://localhost:8080/api/library \
  -H "Authorization: Bearer $TOKEN"
```

### Get Library by Status
```bash
# Get all watching items
curl -X GET "http://localhost:8080/api/library?status=Watching" \
  -H "Authorization: Bearer $TOKEN"

# Get all completed items
curl -X GET "http://localhost:8080/api/library?status=Completed" \
  -H "Authorization: Bearer $TOKEN"

# Get all planned items
curl -X GET "http://localhost:8080/api/library?status=Planned" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Specific Library Item
```bash
ITEM_ID="lib123abc"

curl -X GET http://localhost:8080/api/library/$ITEM_ID \
  -H "Authorization: Bearer $TOKEN"
```

### Update Library Entry
```bash
ITEM_ID="lib123abc"

curl -X PUT http://localhost:8080/api/library/$ITEM_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "Completed",
    "progress": 25,
    "notes": "Finished the entire series! So good!"
  }'
```

### Delete Library Entry
```bash
ITEM_ID="lib123abc"

curl -X DELETE http://localhost:8080/api/library/$ITEM_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## 4. Recommendations

### Get Personalized Recommendations
```bash
curl -X GET http://localhost:8080/api/recommendations \
  -H "Authorization: Bearer $TOKEN"
```

**Response Example:**
```json
{
  "recommended_media": [
    {
      "id": "m3o4p5q6r7s8",
      "title": "My Hero Academia",
      "media_type": "anime",
      "genres": ["action", "fantasy"],
      "match_reason": "Based on your action/fantasy interests"
    },
    {
      "id": "m9t0u1v2w3x4",
      "title": "Jujutsu Kaisen",
      "media_type": "anime",
      "genres": ["action", "dark", "adventure"],
      "match_reason": "Based on your action/dark interests"
    }
  ]
}
```

---

## 5. Dashboard & Statistics

### Get Dashboard Stats
```bash
curl -X GET http://localhost:8080/api/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "total_completed": 5,
  "total_dropped": 1,
  "total_planned": 8,
  "total_watching": 3,
  "favorite_genres": {
    "action": 4,
    "drama": 3,
    "fantasy": 3,
    "adventure": 2
  },
  "library_summary": {
    "Completed": 5,
    "Dropped": 1,
    "Planned": 8,
    "Watching": 3
  }
}
```

---

## Complete Workflow Example

```bash
#!/bin/bash

# 1. Register
echo "📝 Registering user..."
REGISTER=$(curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "anime_fan",
    "email": "fan@example.com",
    "password": "mypass123"
  }')
echo $REGISTER

# 2. Login
echo -e "\n🔑 Logging in..."
LOGIN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "fan@example.com",
    "password": "mypass123"
  }')
TOKEN=$(echo $LOGIN | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"

# 3. Add media
echo -e "\n📺 Adding anime..."
MEDIA=$(curl -s -X POST http://localhost:8080/api/media \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "One Piece",
    "media_type": "anime",
    "year": 1999,
    "genres": ["adventure", "action"],
    "description": "A pirate adventure story"
  }')
MEDIA_ID=$(echo $MEDIA | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
echo "Media ID: $MEDIA_ID"

# 4. Add to library
echo -e "\n📚 Adding to library..."
LIBRARY=$(curl -s -X POST http://localhost:8080/api/library \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "media_id": "'$MEDIA_ID'",
    "status": "Watching",
    "progress": 150
  }')
echo $LIBRARY

# 5. Get dashboard
echo -e "\n📊 Getting dashboard..."
curl -s -X GET http://localhost:8080/api/dashboard \
  -H "Authorization: Bearer $TOKEN" | json_pp

# 6. Get recommendations
echo -e "\n💡 Getting recommendations..."
curl -s -X GET http://localhost:8080/api/recommendations \
  -H "Authorization: Bearer $TOKEN" | json_pp
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error description",
  "status": 400
}
```

### Common Errors

**Missing Token:**
```bash
curl -X GET http://localhost:8080/api/library
```
Response: 401 Unauthorized - `{"error":"missing authorization header"}`

**Invalid Token:**
```bash
curl -X GET http://localhost:8080/api/library \
  -H "Authorization: Bearer invalid-token"
```
Response: 401 Unauthorized - `{"error":"invalid or expired token"}`

**Media Not Found:**
```bash
curl -X GET http://localhost:8080/api/media/nonexistent \
  -H "Authorization: Bearer $TOKEN"
```
Response: 404 Not Found - `{"error":"media not found"}`

**Duplicate Email:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user2",
    "email": "fan@example.com",
    "password": "pass123"
  }'
```
Response: 409 Conflict - `{"error":"email already registered"}`

---

## Tips

- Always save the JWT token after login
- Token expires after 24 hours
- Use `Bearer` prefix in Authorization header
- Status values: `Watching`, `Completed`, `Dropped`, `Planned`
- Media types: `anime`, `movie`, `game`
- Genres are lowercase strings in arrays
- Progress is tracked as integer (episodes, hours, etc)
