package config

import (
	"os"
)

// Configuration loaded from environment variables
// (set these in AWS Lambda environment or .env for local dev)
var (
	// Server config
	ServerPort = ":" + getEnv("PORT", "8080")

	// Application environment: "dev", "staging", "production"
	AppEnv = getEnv("APP_ENV", "dev")

	// JWT config
	JWTSecret = getEnv("JWT_SECRET", "dev-secret-change-in-production")

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

const defaultJWTSecret = "dev-secret-change-in-production"

// TokenExpiration is the JWT lifetime in seconds (24 hours)
const TokenExpiration = int64(24 * 60 * 60)

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

// ValidateConfig fails fast on unsafe production configuration.
// Call it from main so a misconfigured deployment never starts.
func ValidateConfig() {
	if AppEnv != "dev" && JWTSecret == defaultJWTSecret {
		panic("refusing to start with the default JWT_SECRET outside the dev environment")
	}
}

// getEnv returns the value of an environment variable or a fallback
func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
