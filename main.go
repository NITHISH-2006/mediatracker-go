package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"

	"github.com/yourusername/mediatracker-go/config"
	"github.com/yourusername/mediatracker-go/handlers"
	"github.com/yourusername/mediatracker-go/middleware"
	"github.com/yourusername/mediatracker-go/services"
	"github.com/yourusername/mediatracker-go/storage"
)

func main() {
	// Initialize storage
	store := storage.NewStore()

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
	router := chi.NewRouter()

	// Global middleware
	router.Use(middleware.LoggingMiddleware)

	// ==================== PUBLIC ROUTES ====================
	// Authentication routes (no auth required)
	router.Post("/api/auth/register", authHandler.Register)
	router.Post("/api/auth/login", authHandler.Login)

	// Media routes (read-only, no auth required)
	router.Get("/api/media", mediaHandler.GetAllMedia)
	router.Get("/api/media/search", mediaHandler.SearchMedia)
	router.Get("/api/media/{id}", mediaHandler.GetMediaByID)

	// ==================== PROTECTED ROUTES ====================
	// Protected routes require authentication
	router.Route("/api", func(r chi.Router) {
		r.Use(middleware.AuthMiddleware(authService))

		// Media management (add media)
		r.Post("/media", mediaHandler.AddMedia)

		// Library routes
		r.Post("/library", libraryHandler.AddMediaToLibrary)
		r.Get("/library", libraryHandler.GetUserLibrary)
		r.Get("/library/{id}", libraryHandler.GetLibraryItem)
		r.Put("/library/{id}", libraryHandler.UpdateLibraryItem)
		r.Delete("/library/{id}", libraryHandler.DeleteLibraryItem)

		// Recommendation routes
		r.Get("/recommendations", recommendationHandler.GetRecommendations)

		// Dashboard routes
		r.Get("/dashboard", dashboardHandler.GetDashboard)
	})

	// Start server
	log.Printf("🚀 Server starting on %s\n", config.ServerPort)
	if err := http.ListenAndServe(config.ServerPort, router); err != nil {
		log.Fatalf("❌ Server failed: %v\n", err)
	}
}
