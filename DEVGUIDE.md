# Developer Guide - mediatracker-go

Complete guide for developers who want to understand and extend the project.

## Architecture Overview

The project uses a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────┐
│                 HTTP Handlers                        │ ← Route handlers
│          (handlers/ - converts HTTP → logic)         │
├─────────────────────────────────────────────────────┤
│                   Middleware                         │ ← Auth, Logging
│        (middleware/ - cross-cutting concerns)        │
├─────────────────────────────────────────────────────┤
│                    Services                          │ ← Business logic
│        (services/ - application-specific logic)      │
├─────────────────────────────────────────────────────┤
│                    Storage                           │ ← Data persistence
│        (storage/ - thread-safe in-memory store)      │
├─────────────────────────────────────────────────────┤
│                     Models                           │ ← Data structures
│           (models/ - request/response DTOs)          │
└─────────────────────────────────────────────────────┘
```

---

## Directory Structure

### `/handlers` - HTTP Request Handlers

Converts HTTP requests to service calls and formats responses.

**Files:**
- `auth.go` - Register, Login
- `media.go` - Add, Search, Get media
- `library.go` - CRUD operations for user library
- `recommendation.go` - Get recommendations
- `dashboard.go` - Get statistics

**Key Function Pattern:**
```go
func (h *Handler) HandleRequest(w http.ResponseWriter, r *http.Request) {
    // 1. Parse request
    // 2. Validate input
    // 3. Call service
    // 4. Write response
}
```

### `/services` - Business Logic

Core application logic, independent of HTTP and storage.

**Files:**
- `auth_service.go` - Authentication (register, login, token validation)
- `media_service.go` - Media operations (add, search, filter)
- `library_service.go` - User library management
- `recommendation_service.go` - Recommendation algorithm

**Key Pattern:**
```go
type XyzService struct {
    store *storage.Store
}

func (s *XyzService) MethodName(args) (result, error) {
    // Business logic here
}
```

### `/storage` - Data Persistence Layer

Thread-safe in-memory storage using sync.RWMutex.

**Data Structures:**
- `users` - Map of User ID → User
- `media` - Map of Media ID → Media
- `libraryItems` - Map of Item ID → LibraryItem
- `emailIndex` - Quick email → User ID lookup
- `userLibrary` - Quick User ID → Library Items lookup

**Key Pattern:**
```go
// All methods use RWMutex for thread safety
func (s *Store) GetData(key string) (*Data, error) {
    s.mu.RLock()
    defer s.mu.RUnlock()
    // Safe read operation
}
```

### `/middleware` - Cross-Cutting Concerns

Request processing before/after handlers.

**Files:**
- `auth.go` - JWT validation, extracts user ID from context
- `logging.go` - Log all HTTP requests with duration

### `/models` - Data Structures

Request/Response DTOs and domain models.

**Pattern:**
```go
// Domain models
type User struct { ... }
type Media struct { ... }
type LibraryItem struct { ... }

// Request payloads
type AddMediaRequest struct { ... }

// Response payloads
type LoginResponse struct { ... }
```

### `/config` - Configuration

Constants and configuration values.

---

## How It Works

### 1. User Registration Flow

```
HTTP POST /api/auth/register
    ↓
AuthHandler.Register()
    ↓
AuthService.Register()
    ├─ Hash password with bcrypt
    ├─ Check for duplicate email
    ├─ Create User object
    └─ Store.SaveUser()
         └─ Save to in-memory maps + emailIndex
    ↓
Return User (without password)
```

### 2. Authentication Flow

```
HTTP POST /api/auth/login
    ↓
AuthHandler.Login()
    ↓
AuthService.Login()
    ├─ Find user by email
    ├─ Verify password with bcrypt
    └─ Generate JWT token
    ↓
Return JWT token
```

### 3. Protected Request Flow

```
HTTP GET /api/dashboard with Authorization header
    ↓
LoggingMiddleware (logs request)
    ↓
AuthMiddleware (validates JWT)
    ├─ Extract token from header
    ├─ Validate with AuthService.ValidateToken()
    └─ Add userID to request context
    ↓
DashboardHandler.GetDashboard()
    ├─ Extract userID from context
    ├─ Call LibraryService methods
    └─ Format response
    ↓
Return dashboard stats as JSON
```

### 4. Add to Library Flow

```
HTTP POST /api/library
    ↓
LibraryHandler.AddMediaToLibrary()
    ├─ Get userID from context
    ├─ Parse request body
    ├─ Validate input
    └─ Call LibraryService.AddMediaToLibrary()
         ├─ Verify media exists
         ├─ Validate status value
         ├─ Check not already in library
         ├─ Create LibraryItem
         └─ Store.SaveLibraryItem()
             ├─ Save to libraryItems map
             └─ Append to userLibrary[userID]
    ↓
Return created LibraryItem
```

---

## Key Concepts

### Thread Safety

All storage operations use `sync.RWMutex`:

```go
type Store struct {
    mu sync.RWMutex
    data map[string]*Item
}

func (s *Store) Get(id string) (*Item, error) {
    s.mu.RLock()        // ← Read lock
    defer s.mu.RUnlock()
    return s.data[id]
}

func (s *Store) Save(item *Item) error {
    s.mu.Lock()        // ← Write lock
    defer s.mu.Unlock()
    s.data[item.ID] = item
}
```

### JWT Token Handling

Tokens include user ID and expiration:

```go
// Create token
token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
    "user_id": user.ID,
    "exp": expiration.Unix(),
})

// Validate token
func ValidateToken(tokenString string) (userID string, error) {
    // Parse token
    // Check signature with secret
    // Extract user_id from claims
}
```

### Error Handling

Services return errors for invalid operations:

```go
func (s *Service) DoSomething() (result, error) {
    if validation_failed {
        return nil, fmt.Errorf("descriptive error message")
    }
    // success case
}

// Handler checks error
if err != nil {
    writeJSON(w, http.StatusBadRequest, map[string]string{
        "error": err.Error(),
    })
}
```

---

## Adding New Features

### Example: Add Review/Rating System

**Step 1: Add models** (`models/models.go`)

```go
type Review struct {
    ID        string
    UserID    string
    MediaID   string
    Rating    int    // 1-5
    Comment   string
    CreatedAt time.Time
}

type AddReviewRequest struct {
    MediaID string `json:"media_id"`
    Rating  int    `json:"rating"`
    Comment string `json:"comment"`
}
```

**Step 2: Add storage** (`storage/storage.go`)

```go
type Store struct {
    // ... existing fields
    reviews map[string]*models.Review
    mu sync.RWMutex
}

func (s *Store) SaveReview(review *models.Review) error {
    s.mu.Lock()
    defer s.mu.Unlock()
    s.reviews[review.ID] = review
    return nil
}
```

**Step 3: Add service** (`services/review_service.go`)

```go
type ReviewService struct {
    store *storage.Store
}

func (rs *ReviewService) AddReview(userID string, req *models.AddReviewRequest) (*models.Review, error) {
    // Validate
    // Create review
    // Store
    // Return
}
```

**Step 4: Add handler** (`handlers/review.go`)

```go
type ReviewHandler struct {
    reviewService *services.ReviewService
}

func (h *ReviewHandler) AddReview(w http.ResponseWriter, r *http.Request) {
    // Parse request
    // Call service
    // Write response
}
```

**Step 5: Add routes** (`main.go`)

```go
reviewService := services.NewReviewService(store)
reviewHandler := handlers.NewReviewHandler(reviewService)

router.Route("/api", func(r chi.Router) {
    r.Use(middleware.AuthMiddleware(authService))
    r.Post("/reviews", reviewHandler.AddReview)
    // ... other routes
})
```

---

## Testing

### Manual Testing with curl

See `EXAMPLES.md` for extensive curl examples.

### Unit Testing Pattern

```go
// Example: test_services/auth_service_test.go
func TestRegister(t *testing.T) {
    store := storage.NewStore()
    authService := services.NewAuthService(store)
    
    req := &models.RegisterRequest{
        Username: "testuser",
        Email: "test@example.com",
        Password: "pass123",
    }
    
    user, err := authService.Register(req)
    
    if err != nil {
        t.Errorf("Register failed: %v", err)
    }
    
    if user.Email != "test@example.com" {
        t.Errorf("Email mismatch")
    }
}
```

---

## Performance Considerations

### Current Implementation
- **In-memory storage** - Fast reads/writes
- **Thread-safe with mutex** - Safe concurrent access
- **O(n) searches** - Linear scan for searches (acceptable for demo)

### For Production
1. **Replace in-memory storage** with database (PostgreSQL/MongoDB)
2. **Add indexing** for faster searches
3. **Add caching** for frequently accessed data
4. **Connection pooling** for database
5. **Rate limiting** on endpoints
6. **Request validation** and sanitization

---

## Security Considerations

### Current Implementation
- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens with expiration
- ✅ Bearer token validation
- ✅ Ownership verification for library items

### For Production
1. **HTTPS only** - Use TLS certificates
2. **Rate limiting** - Prevent brute force attacks
3. **Input validation** - Sanitize all inputs
4. **CORS** - Configure allowed origins
5. **Environment variables** - Don't hardcode secrets
6. **Audit logging** - Log security events

### Change JWT Secret in Production!

In `config/config.go`:
```go
JWTSecret = "your-secret-key-change-in-production"
```

**IMPORTANT:** Use a strong random secret and don't commit it to git!

---

## Extending the Project

### Add Database Support
- Replace `storage/storage.go` with database client
- Keep the same interface (GetUser, SaveMedia, etc)
- Other layers don't need changes

### Add More Media Types
- Add to `config.ValidMediaTypes`
- Services automatically handle all types

### Add Filtering/Sorting
- Extend `MediaService.SearchMedia()`
- Add query parameter parsing in handlers
- Filter results in service layer

### Add Notifications
- Create `NotificationService`
- Add goroutine in `main.go` for background tasks
- Send notifications to users

---

## Code Style

### Naming Conventions
- Package names: lowercase (`handlers`, `services`)
- Function names: PascalCase public, camelCase private
- Variable names: short and descriptive
- Constants: UPPER_CASE

### Comments
- Exported functions/types need doc comments
- Complex logic needs inline comments
- Comments start with name/function being described

```go
// SaveUser saves a user to storage
func (s *Store) SaveUser(user *User) error {
    // Use mutex for thread safety
    s.mu.Lock()
    defer s.mu.Unlock()
    
    s.users[user.ID] = user
    return nil
}
```

### Error Handling
- Return errors explicitly
- Use fmt.Errorf() for context
- Handle errors in each layer

```go
if err != nil {
    return nil, fmt.Errorf("operation failed: %w", err)
}
```

---

## Common Tasks

### Modify a Response Field
1. Change struct in `models/models.go`
2. Update handler to populate field
3. Test with curl

### Add Validation
1. Add check in service before operation
2. Return error with message
3. Handler converts error to HTTP response

### Change Server Port
1. Update `ServerPort` in `config/config.go`
2. Rebuild/restart

### Add Logging
1. Add `log.Printf()` where needed
2. Include relevant context (userID, mediaID, etc)
3. Check terminal output

---

## Troubleshooting Development

### "Port already in use"
```bash
lsof -i :8080
kill -9 <PID>
```

### Import errors after changes
```bash
go mod tidy
go build ./...
```

### Inconsistent behavior
- Check for mutex locking issues
- Verify error handling
- Check for nil pointers

### Memory issues (shouldn't happen)
- Ensure goroutines are cleaned up
- Check for memory leaks
- Profile with pprof if needed

---

## Resources

- Go Documentation: https://golang.org/doc/
- Chi Router: https://github.com/go-chi/chi
- JWT: https://github.com/golang-jwt/jwt
- Bcrypt: https://golang.org/x/crypto/bcrypt

---

Happy coding! 🚀
