package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"

	"github.com/yourusername/mediatracker-go/models"
	"github.com/yourusername/mediatracker-go/services"
)

// MediaHandler handles media management endpoints
type MediaHandler struct {
	mediaService *services.MediaService
}

// NewMediaHandler creates a new media handler
func NewMediaHandler(ms *services.MediaService) *MediaHandler {
	return &MediaHandler{mediaService: ms}
}

// AddMedia handles adding new media
// POST /api/media
func (h *MediaHandler) AddMedia(w http.ResponseWriter, r *http.Request) {
	var req models.AddMediaRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"error": "invalid request body",
		})
		return
	}

	// Add media
	media, err := h.mediaService.AddMedia(&req)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"error": err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusCreated)
	writeJSON(w, http.StatusCreated, media)
}

// SearchMedia handles searching for media
// GET /api/media/search?query=title
func (h *MediaHandler) SearchMedia(w http.ResponseWriter, r *http.Request) {
	query := getStringParam(r, "query")

	// Search
	media, err := h.mediaService.SearchMedia(query)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{
			"error": "search failed",
		})
		return
	}

	if media == nil {
		media = []*models.Media{}
	}

	writeJSON(w, http.StatusOK, media)
}

// GetAllMedia retrieves all media
// GET /api/media
func (h *MediaHandler) GetAllMedia(w http.ResponseWriter, r *http.Request) {
	media, err := h.mediaService.GetAllMedia()
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{
			"error": "failed to retrieve media",
		})
		return
	}

	if media == nil {
		media = []*models.Media{}
	}

	writeJSON(w, http.StatusOK, media)
}

// GetMediaByID retrieves a specific media by ID
// GET /api/media/{id}
func (h *MediaHandler) GetMediaByID(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"error": "media id required",
		})
		return
	}

	// Get media
	media, err := h.mediaService.GetMediaByID(id)
	if err != nil || media == nil {
		writeJSON(w, http.StatusNotFound, map[string]string{
			"error": "media not found",
		})
		return
	}

	writeJSON(w, http.StatusOK, media)
}
