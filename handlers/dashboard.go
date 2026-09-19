package handlers

import (
	"net/http"

	"github.com/yourusername/mediatracker-go/middleware"
	"github.com/yourusername/mediatracker-go/services"
)

// DashboardHandler handles dashboard/stats endpoints
type DashboardHandler struct {
	libraryService *services.LibraryService
	mediaService   *services.MediaService
}

// NewDashboardHandler creates a new dashboard handler
func NewDashboardHandler(ls *services.LibraryService, ms *services.MediaService) *DashboardHandler {
	return &DashboardHandler{
		libraryService: ls,
		mediaService:   ms,
	}
}

// GetDashboard returns user's dashboard statistics
// GET /api/dashboard
func (h *DashboardHandler) GetDashboard(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserIDFromContext(r)
	if userID == "" {
		writeJSON(w, http.StatusUnauthorized, map[string]string{
			"error": "unauthorized",
		})
		return
	}

	// Get counts by status
	statusCounts := h.libraryService.CountByStatus(userID)

	// Get all library items to extract genres
	libraryItems, err := h.libraryService.GetUserLibrary(userID)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{
			"error": "failed to retrieve statistics",
		})
		return
	}

	// Count genres
	genreCount := make(map[string]int)
	typeCount := make(map[string]int)
	for _, item := range libraryItems {
		media, _ := h.mediaService.GetMediaByID(item.MediaID)
		if media != nil {
			for _, genre := range media.Genres {
				genreCount[genre]++
			}
			typeCount[media.MediaType]++
		}
	}

	// Completion rate (% of library with a Completed status)
	totalItems := len(libraryItems)
	completionRate := 0.0
	if totalItems > 0 {
		completionRate = float64(statusCounts["Completed"]) / float64(totalItems) * 100
	}

	// Build response
	response := map[string]interface{}{
		"total_completed": statusCounts["Completed"],
		"total_watching":  statusCounts["Watching"],
		"total_planned":   statusCounts["Planned"],
		"total_dropped":   statusCounts["Dropped"],
		"total_items":     totalItems,
		"completion_rate": completionRate,
		"favorite_genres": genreCount,
		"library_summary": statusCounts,
		"media_profile":   typeCount,
	}

	writeJSON(w, http.StatusOK, response)
}
