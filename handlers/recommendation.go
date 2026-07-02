package handlers

import (
	"net/http"

	"github.com/yourusername/mediatracker-go/middleware"
	"github.com/yourusername/mediatracker-go/services"
)

// RecommendationHandler handles recommendation endpoints
type RecommendationHandler struct {
	recommendationService *services.RecommendationService
}

// NewRecommendationHandler creates a new recommendation handler
func NewRecommendationHandler(rs *services.RecommendationService) *RecommendationHandler {
	return &RecommendationHandler{recommendationService: rs}
}

// GetRecommendations returns recommended media for the user
// GET /api/recommendations
func (h *RecommendationHandler) GetRecommendations(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserIDFromContext(r)
	if userID == "" {
		writeJSON(w, http.StatusUnauthorized, map[string]string{
			"error": "unauthorized",
		})
		return
	}

	// Get recommendations
	recommendations, err := h.recommendationService.GetRecommendations(userID)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{
			"error": "failed to get recommendations",
		})
		return
	}

	writeJSON(w, http.StatusOK, recommendations)
}
