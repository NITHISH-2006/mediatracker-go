package config

// Configuration constants used across the application
const (
	// Server config
	ServerPort = ":8080"

	// JWT config
	JWTSecret       = "your-secret-key-change-in-production" // CHANGE THIS IN PRODUCTION!
	TokenExpiration = 24 * 60 * 60                           // 24 hours in seconds

	// Library statuses
	StatusWatching  = "Watching"
	StatusCompleted = "Completed"
	StatusDropped   = "Dropped"
	StatusPlanned   = "Planned"

	// Media types
	TypeAnime = "anime"
	TypeMovie = "movie"
	TypeGame  = "game"
)

var (
	// Valid statuses for library items
	ValidStatuses = map[string]bool{
		StatusWatching:  true,
		StatusCompleted: true,
		StatusDropped:   true,
		StatusPlanned:   true,
	}

	// Valid media types
	ValidMediaTypes = map[string]bool{
		TypeAnime: true,
		TypeMovie: true,
		TypeGame:  true,
	}
)
