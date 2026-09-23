package models

import "time"

// User represents a registered user in the system
type User struct {
	ID        string    `json:"id"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	Password  string    `json:"-"` // Never return password in JSON
	CreatedAt time.Time `json:"created_at"`
}

// Media represents a movie, anime, or game entry
type Media struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	MediaType   string    `json:"media_type"` // "anime", "movie", "game"
	Year        int       `json:"year"`
	Genres      []string  `json:"genres"` // e.g., ["action", "drama"]
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
}

// LibraryItem represents a user's entry in their personal library
type LibraryItem struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	MediaID   string    `json:"media_id"`
	Status    string    `json:"status"`   // "Watching", "Completed", "Dropped", "Planned"
	Progress  int       `json:"progress"` // Episodes watched or hours played
	Notes     string    `json:"notes"`
	AddedAt   time.Time `json:"added_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// ============== REQUEST PAYLOADS ==============

// RegisterRequest is the payload for user registration
type RegisterRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// LoginRequest is the payload for user login
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// AddMediaRequest is the payload for adding new media
type AddMediaRequest struct {
	Title       string   `json:"title"`
	MediaType   string   `json:"media_type"` // "anime", "movie", "game"
	Year        int      `json:"year"`
	Genres      []string `json:"genres"`
	Description string   `json:"description"`
}

// AddToLibraryRequest is the payload for adding media to user's library
type AddToLibraryRequest struct {
	MediaID  string `json:"media_id"`
	Status   string `json:"status"` // "Watching", "Completed", "Dropped", "Planned"
	Progress int    `json:"progress"`
	Notes    string `json:"notes"`
}

// UpdateLibraryRequest is the payload for updating a library entry
type UpdateLibraryRequest struct {
	Status   string `json:"status"`
	Progress int    `json:"progress"`
	Notes    string `json:"notes"`
}

// ============== RESPONSE PAYLOADS ==============

// LoginResponse contains the JWT token after successful login
type LoginResponse struct {
	Token     string `json:"token"`
	ExpiresIn int64  `json:"expires_in"` // Seconds
	Username  string `json:"username"`
}

// DashboardResponse contains user's statistics and summary
type DashboardResponse struct {
	TotalCompleted int            `json:"total_completed"`
	TotalWatching  int            `json:"total_watching"`
	TotalPlanned   int            `json:"total_planned"`
	TotalDropped   int            `json:"total_dropped"`
	FavoriteGenres map[string]int `json:"favorite_genres"`
	LibrarySummary map[string]int `json:"library_summary"`
}

// RecommendationResponse contains recommended media for the user
type RecommendationResponse struct {
	RecommendedMedia []RecommendedItem `json:"recommended_media"`
}

// RecommendedItem is a single recommendation with match reason
type RecommendedItem struct {
	ID          string   `json:"id"`
	Title       string   `json:"title"`
	MediaType   string   `json:"media_type"`
	Genres      []string `json:"genres"`
	MatchReason string   `json:"match_reason"`
}

// ErrorResponse is the standard error response format
type ErrorResponse struct {
	Error  string `json:"error"`
	Status int    `json:"status"`
}

// SuccessResponse is a generic success response
type SuccessResponse struct {
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}
