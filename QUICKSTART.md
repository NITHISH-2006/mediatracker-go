# Quick Start Guide - mediatracker-go

Get started with the mediatracker-go API in 5 minutes!

## Prerequisites

- Go 1.21 or later (download from https://golang.org)
- curl (for testing endpoints)
- A text editor

## Step 1: Download Dependencies

```bash
cd mediatracker-go
go mod download
```

## Step 2: Build the Project

```bash
# Build executable
go build -o mediatracker main.go

# Or run directly
go run main.go
```

## Step 3: Start the Server

```bash
./mediatracker
```

You should see:
```
🚀 Server starting on :8080
```

The API is now running at `http://localhost:8080`

---

## Step 4: Try It Out

Open a new terminal and test the API:

### 1. Register a user
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the token from the response:
```bash
TOKEN="paste-token-here"
```

### 3. Add Media
```bash
curl -X POST http://localhost:8080/api/media \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "My Favorite Show",
    "media_type": "anime",
    "year": 2024,
    "genres": ["action", "drama"],
    "description": "An awesome show"
  }'
```

### 4. View All Media
```bash
curl -X GET http://localhost:8080/api/media \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Add to Your Library
```bash
# Replace MEDIA_ID with the ID from step 3
MEDIA_ID="media-uuid-here"

curl -X POST http://localhost:8080/api/library \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "media_id": "'$MEDIA_ID'",
    "status": "Watching",
    "progress": 5
  }'
```

### 6. Get Your Dashboard
```bash
curl -X GET http://localhost:8080/api/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

### 7. Get Recommendations
```bash
curl -X GET http://localhost:8080/api/recommendations \
  -H "Authorization: Bearer $TOKEN"
```

---

## Project Structure

```
mediatracker-go/
├── main.go                    # Entry point - router setup
├── config/config.go           # Configuration constants
├── models/models.go           # Data structures
├── storage/storage.go         # In-memory data storage
├── services/                  # Business logic
│   ├── auth_service.go
│   ├── media_service.go
│   ├── library_service.go
│   └── recommendation_service.go
├── handlers/                  # HTTP handlers
│   ├── auth.go
│   ├── media.go
│   ├── library.go
│   ├── recommendation.go
│   └── dashboard.go
└── middleware/                # HTTP middleware
    ├── auth.go                # JWT validation
    └── logging.go             # Request logging
```

---

## Key Features

✅ **User Authentication**
- Register with username, email, password
- Login to get JWT token
- Token expires after 24 hours

✅ **Media Management**
- Add anime, movies, or games
- Search by title
- View all media

✅ **Personal Library**
- Track what you're watching/playing
- Mark as: Watching, Completed, Dropped, Planned
- Track progress (episodes, hours, etc)
- Add notes

✅ **Recommendations**
- Get personalized recommendations based on your favorite genres

✅ **Statistics**
- View your dashboard with totals by status
- See your favorite genres
- Track completion stats

---

## Status Values

When adding or updating library items, use these status values:

- **Watching** - Currently watching/playing
- **Completed** - Finished
- **Dropped** - Abandoned
- **Planned** - Want to watch/play

## Media Types

When adding media, use:

- **anime** - Anime series/movies
- **movie** - Movies
- **game** - Video games

---

## API Endpoints Overview

### Public Endpoints (No Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/media` | Get all media |
| GET | `/api/media/search` | Search media by title |
| GET | `/api/media/{id}` | Get specific media |

### Protected Endpoints (Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/media` | Add new media |
| POST | `/api/library` | Add to library |
| GET | `/api/library` | Get your library |
| GET | `/api/library/{id}` | Get specific library item |
| PUT | `/api/library/{id}` | Update library item |
| DELETE | `/api/library/{id}` | Remove from library |
| GET | `/api/recommendations` | Get recommendations |
| GET | `/api/dashboard` | Get statistics |

---

## Troubleshooting

### Port Already in Use
If you get "address already in use", the port 8080 is occupied:

```bash
# Change the port in config/config.go (ServerPort = ":8081")
# Or kill the process on port 8080
lsof -ti:8080 | xargs kill -9
```

### Module not found errors
```bash
go mod tidy
go mod download
```

### Build fails
Ensure you have Go 1.21+ installed:
```bash
go version
```

---

## Next Steps

1. **Read Full Documentation**: See [README.md](README.md)
2. **Curl Examples**: Check [EXAMPLES.md](EXAMPLES.md) for complete examples
3. **Customize**: 
   - Change JWT secret in `config/config.go`
   - Adjust server port
   - Add more validation rules
4. **Extend**:
   - Add database persistence (PostgreSQL/MongoDB)
   - Add more recommendation algorithms
   - Add social features
   - Add review/rating system

---

## Learning Resources

- **Go**: https://golang.org/doc/
- **Chi Router**: https://github.com/go-chi/chi
- **JWT**: https://github.com/golang-jwt/jwt
- **Bcrypt**: https://golang.org/x/crypto

---

## Support

Having issues? Check:

1. Is the server running? (`go run main.go`)
2. Are you using the right token? (Make sure it's saved from login)
3. Is Authorization header format correct? (`Bearer TOKEN`)
4. Check the terminal for error logs

---

Happy tracking! 🎬🎮🌸
