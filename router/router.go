// Package router wires the application (services, handlers, middleware, routes)
// so it can be reused by both the local HTTP server and the AWS Lambda handler.
package router

import (
	"net/http"

	"github.com/go-chi/chi/v5"

	"github.com/yourusername/mediatracker-go/handlers"
	"github.com/yourusername/mediatracker-go/middleware"
	"github.com/yourusername/mediatracker-go/services"
	"github.com/yourusername/mediatracker-go/storage"
)

// New builds the chi router with all routes wired to a store.
func New(store *storage.Store) *chi.Mux {
	// Initialize services
	authService := services.NewAuthService(store)
	mediaService := services.NewMediaService(store)
	libraryService := services.NewLibraryService(store, mediaService)
	recommendationService := services.NewRecommendationService(store, libraryService, mediaService)

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(authService)
	mediaHandler := handlers.NewMediaHandler(mediaService)
	libraryHandler := handlers.NewLibraryHandler(libraryService)
	recommendationHandler := handlers.NewRecommendationHandler(recommendationService)
	dashboardHandler := handlers.NewDashboardHandler(libraryService, mediaService)

	// Setup router
	r := chi.NewRouter()

	// Global middleware
	r.Use(middleware.LoggingMiddleware)
	r.Use(middleware.CORSMiddleware)

	// Health check
	r.Get("/health", healthCheck)

	// ==================== PUBLIC ROUTES ====================
	r.Post("/api/auth/register", authHandler.Register)
	r.Post("/api/auth/login", authHandler.Login)

	// Media routes (read-only, no auth required)
	r.Get("/api/media", mediaHandler.GetAllMedia)
	r.Get("/api/media/search", mediaHandler.SearchMedia)
	r.Get("/api/media/{id}", mediaHandler.GetMediaByID)

	// ==================== PROTECTED ROUTES ====================
	r.Route("/api", func(pr chi.Router) {
		pr.Use(middleware.AuthMiddleware(authService))

		pr.Post("/media", mediaHandler.AddMedia)

		pr.Post("/library", libraryHandler.AddMediaToLibrary)
		pr.Get("/library", libraryHandler.GetUserLibrary)
		pr.Get("/library/{id}", libraryHandler.GetLibraryItem)
		pr.Put("/library/{id}", libraryHandler.UpdateLibraryItem)
		pr.Delete("/library/{id}", libraryHandler.DeleteLibraryItem)

		pr.Get("/recommendations", recommendationHandler.GetRecommendations)
		pr.Get("/dashboard", dashboardHandler.GetDashboard)
	})

	return r
}

// healthCheck is a simple liveness probe
func healthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status":"ok"}`))
}