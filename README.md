# mediatracker-go 🎬🎮🌸

**Personal Media Tracker for Anime, Movies & Games**

A clean, simple REST API to track your entertainment journey. Log what you're watching, maintain different lists, get recommendations, and view your stats.

---

## Features

### ✅ Core Features (Must-Have)
- **User Authentication**
  - Register & Login with JWT tokens
  - Secure password hashing with bcrypt
  
- **Media Management**
  - Add/Search media (Anime, Movies, Games)
  - Each media has: title, type, genres, year, description
  - Create and manage your personal library
  
- **Personal Library**
  - Add media with status: `Watching`, `Completed`, `Dropped`, `Planned`
  - Track progress (episodes watched, hours played)
  - Update and delete entries
  
- **Recommendations**
  - Genre-based recommendations
  - Suggests media you haven't completed yet
  
- **Dashboard & Stats**
  - Total completed items count
  - Favorite genre breakdown
  - Quick overview of your activity

### 🚀 Tech Stack
- **Framework**: Chi Router (lightweight HTTP router)
- **Authentication**: JWT + bcrypt
- **Storage**: In-memory (maps and slices)
- **Middleware**: Authentication & Logging
- **Language**: Go 1.21+

---

## Project Structure

```
mediatracker-go/
├── go.mod
├── README.md
├── main.go                    # Entry point, router setup
├── config/
│   └── config.go              # Configuration constants
├── models/
│   └── models.go              # Data structures
├── storage/
│   └── storage.go             # In-memory storage with mutexes
├── services/
│   ├── auth_service.go        # User registration/login logic
│   ├── media_service.go       # Media CRUD operations
│   ├── library_service.go     # User library management
│   └── recommendation_service.go  # Genre-based recommendations
├── handlers/
│   ├── auth.go                # Auth endpoints
│   ├── media.go               # Media endpoints
│   ├── library.go             # Library endpoints
│   ├── recommendation.go      # Recommendation endpoint
│   └── dashboard.go           # Stats/Dashboard endpoint
└── middleware/
    ├── auth.go                # JWT validation middleware
    └── logging.go             # Request logging middleware
```

---

## Getting Started

### Prerequisites
- Go 1.21 or later
- curl (for testing endpoints)

### Installation

```bash
# Clone or navigate to the project
cd mediatracker-go

# Download dependencies
go mod download

# Run the server
go run main.go
```

The API will start on `http://localhost:8080`

---

## API Endpoints

### 🔐 Authentication

#### Register User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "anime_fan",
    "email": "fan@example.com",
    "password": "securepass123"
  }'
```

**Response:**
```json
{
  "id": "uuid-here",
  "username": "anime_fan",
  "email": "fan@example.com",
  "created_at": "2024-01-15T10:30:00Z"
}
```

#### Login User
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "fan@example.com",
    "password": "securepass123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_in": 86400
}
```

---

### 🎬 Media Management

#### Add Media
```bash
curl -X POST http://localhost:8080/api/media \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Attack on Titan",
    "media_type": "anime",
    "year": 2013,
    "genres": ["action", "fantasy", "drama"],
    "description": "Humanity fights back against giant humanoid creatures"
  }'
```

**Response:**
```json
{
  "id": "media-uuid",
  "title": "Attack on Titan",
  "media_type": "anime",
  "year": 2013,
  "genres": ["action", "fantasy", "drama"],
  "description": "Humanity fights back against giant humanoid creatures",
  "created_at": "2024-01-15T11:00:00Z"
}
```

#### Search Media
```bash
curl -X GET "http://localhost:8080/api/media/search?query=Titan" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Get All Media
```bash
curl -X GET http://localhost:8080/api/media \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 📚 Personal Library

#### Add Media to Library
```bash
curl -X POST http://localhost:8080/api/library \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "media_id": "media-uuid",
    "status": "Watching",
    "progress": 12,
    "notes": "Amazing series! Currently on episode 12"
  }'
```

**Response:**
```json
{
  "id": "library-entry-uuid",
  "user_id": "user-uuid",
  "media_id": "media-uuid",
  "status": "Watching",
  "progress": 12,
  "notes": "Amazing series! Currently on episode 12",
  "added_at": "2024-01-15T11:05:00Z"
}
```

#### Update Library Entry
```bash
curl -X PUT http://localhost:8080/api/library/library-entry-uuid \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "status": "Completed",
    "progress": 25,
    "notes": "Finished the series!"
  }'
```

#### Get My Library
```bash
curl -X GET http://localhost:8080/api/library \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Get Library by Status
```bash
curl -X GET "http://localhost:8080/api/library?status=Watching" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Delete Library Entry
```bash
curl -X DELETE http://localhost:8080/api/library/library-entry-uuid \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 💡 Recommendations

#### Get Recommendations
```bash
curl -X GET http://localhost:8080/api/recommendations \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "recommended_media": [
    {
      "id": "media-uuid",
      "title": "My Hero Academia",
      "media_type": "anime",
      "genres": ["action", "fantasy"],
      "match_reason": "Based on your action/fantasy preferences"
    }
  ]
}
```

---

### 📊 Dashboard & Stats

#### Get Dashboard Stats
```bash
curl -X GET http://localhost:8080/api/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "total_completed": 5,
  "total_watching": 3,
  "total_planned": 8,
  "favorite_genres": {
    "action": 3,
    "drama": 2,
    "fantasy": 2
  },
  "library_summary": {
    "watching": 3,
    "completed": 5,
    "dropped": 1,
    "planned": 8
  }
}
```

---

## Status Values

- **Watching**: Currently watching/playing
- **Completed**: Finished
- **Dropped**: Abandoned
- **Planned**: Want to watch/play

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error description",
  "status": 400
}
```

### Common Status Codes
- `200 OK` - Successful request
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing/invalid token
- `404 Not Found` - Resource not found
- `409 Conflict` - User already exists
- `500 Internal Server Error` - Server error

---

## Example Workflow

```bash
# 1. Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "user1", "email": "user1@test.com", "password": "pass123"}'

# 2. Login and save token
TOKEN="<token-from-response>"

# 3. Add some media
curl -X POST http://localhost:8080/api/media \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title": "Demon Slayer", "media_type": "anime", "year": 2019, "genres": ["action", "fantasy"], "description": "Demon hunter story"}'

# 4. Add to library
curl -X POST http://localhost:8080/api/library \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"media_id": "<media-id>", "status": "Watching", "progress": 5}'

# 5. Get dashboard
curl -X GET http://localhost:8080/api/dashboard \
  -H "Authorization: Bearer $TOKEN"

# 6. Get recommendations
curl -X GET http://localhost:8080/api/recommendations \
  -H "Authorization: Bearer $TOKEN"
```

---

## Notes

- All timestamps are in UTC (ISO 8601 format)
- Passwords are hashed using bcrypt before storage
- JWT tokens expire after 24 hours
- In-memory storage means data is lost on server restart (suitable for demo/learning)
- Thread-safe using sync.RWMutex

---

## Future Enhancements

- Database persistence (PostgreSQL/MongoDB)
- Social features (follow users, see their lists)
- Review & rating system
- Advanced filtering and sorting
- User profiles
- Daily reminder notifications
- Social sharing

---

## License

MIT License - Feel free to use for learning and projects!
