package middleware

import (
	"net/http"
	"strings"

	"github.com/yourusername/mediatracker-go/config"
)

// CORSMiddleware adds CORS headers and handles preflight OPTIONS requests
func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		allowedOrigins := strings.Split(config.AllowedOrigins, ",")

		// If origin is allowed (or wildcard), set CORS headers
		originAllowed := config.AllowedOrigins == "*"
		for _, o := range allowedOrigins {
			if strings.TrimSpace(o) == origin {
				originAllowed = true
				break
			}
		}

		if originAllowed {
			if config.AllowedOrigins == "*" {
				w.Header().Set("Access-Control-Allow-Origin", "*")
			} else {
				w.Header().Set("Access-Control-Allow-Origin", origin)
				w.Header().Set("Vary", "Origin")
			}
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			w.Header().Set("Access-Control-Max-Age", "86400")
		}

		// Handle preflight
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}