package config

import (
	"os"
)

// Configuration loaded from environment variables
// (set these in AWS Lambda environment or .env for local dev)
var (
	// Server config
	ServerPort = ":" + getEnv("PORT", "8080")

	// JWT config
	JWTSecret       = getEnv("JWT_SECRET", "dev-secret-change-in-production")
	TokenExpiration = int64(24 * 60 * 60) // 24 hours in seconds

	// DynamoDB config
	AWSRegion    = getEnv("AWS_REGION", "us-east-1")
	UsersTable   = getEnv("USERS_TABLE", "MediaTracker-Users")
	MediaTable   = getEnv("MEDIA_TABLE", "MediaTracker-Media")
	LibraryTable = getEnv("LIBRARY_TABLE", "MediaTracker-Library")

	// DynamoDB endpoint override (for DynamoDB Local)
	AWSendpoint = getEnv("AWS_ENDPOINT_URL", "")

	// CORS allowed origins (comma-separated)
	AllowedOrigins = getEnv("ALLOWED_ORIGINS", "*")

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

// getEnv returns the value of an environment variable or a fallback
func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}