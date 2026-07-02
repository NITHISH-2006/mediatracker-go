package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"

	"github.com/yourusername/mediatracker-go/middleware"
	"github.com/yourusername/mediatracker-go/models"
	"github.com/yourusername/mediatracker-go/services"
)

// LibraryHandler handles user library endpoints
type LibraryHandler struct {
	libraryService *services.LibraryService
}

// NewLibraryHandler creates a new library handler
func NewLibraryHandler(ls *services.LibraryService) *LibraryHandler {
	return &LibraryHandler{libraryService: ls}
}

// AddMediaToLibrary adds media to user's library
// POST /api/library
func (h *LibraryHandler) AddMediaToLibrary(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserIDFromContext(r)
	if userID == "" {
		writeJSON(w, http.StatusUnauthorized, map[string]string{
			"error": "unauthorized",
		})
		return
	}

	var req models.AddToLibraryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"error": "invalid request body",
		})
		return
	}

	// Validate request
	if req.MediaID == "" || req.Status == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"error": "media_id and status are required",
		})
		return
	}

	// Add to library
	item, err := h.libraryService.AddMediaToLibrary(userID, &req)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"error": err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusCreated)
	writeJSON(w, http.StatusCreated, item)
}

// GetUserLibrary returns all items in user's library
// GET /api/library
func (h *LibraryHandler) GetUserLibrary(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserIDFromContext(r)
	if userID == "" {
		writeJSON(w, http.StatusUnauthorized, map[string]string{
			"error": "unauthorized",
		})
		return
	}

	// Check for status filter
	status := getStringParam(r, "status")
	var items []*models.LibraryItem
	var err error

	if status != "" {
		items, err = h.libraryService.GetUserLibraryByStatus(userID, status)
	} else {
		items, err = h.libraryService.GetUserLibrary(userID)
	}

	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"error": err.Error(),
		})
		return
	}

	if items == nil {
		items = []*models.LibraryItem{}
	}

	writeJSON(w, http.StatusOK, items)
}

// UpdateLibraryItem updates a library entry
// PUT /api/library/{id}
func (h *LibraryHandler) UpdateLibraryItem(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserIDFromContext(r)
	if userID == "" {
		writeJSON(w, http.StatusUnauthorized, map[string]string{
			"error": "unauthorized",
		})
		return
	}

	itemID := chi.URLParam(r, "id")
	if itemID == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"error": "library item id required",
		})
		return
	}

	var req models.UpdateLibraryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"error": "invalid request body",
		})
		return
	}

	// Update
	item, err := h.libraryService.UpdateLibraryItem(userID, itemID, &req)
	if err != nil {
		if err.Error() == "unauthorized" {
			writeJSON(w, http.StatusForbidden, map[string]string{
				"error": "unauthorized",
			})
		} else {
			writeJSON(w, http.StatusBadRequest, map[string]string{
				"error": err.Error(),
			})
		}
		return
	}

	writeJSON(w, http.StatusOK, item)
}

// DeleteLibraryItem removes an item from library
// DELETE /api/library/{id}
func (h *LibraryHandler) DeleteLibraryItem(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserIDFromContext(r)
	if userID == "" {
		writeJSON(w, http.StatusUnauthorized, map[string]string{
			"error": "unauthorized",
		})
		return
	}

	itemID := chi.URLParam(r, "id")
	if itemID == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"error": "library item id required",
		})
		return
	}

	// Delete
	if err := h.libraryService.DeleteLibraryItem(userID, itemID); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"error": err.Error(),
		})
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{
		"message": "library item deleted successfully",
	})
}

// GetLibraryItem retrieves a specific library item
// GET /api/library/{id}
func (h *LibraryHandler) GetLibraryItem(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserIDFromContext(r)
	if userID == "" {
		writeJSON(w, http.StatusUnauthorized, map[string]string{
			"error": "unauthorized",
		})
		return
	}

	itemID := chi.URLParam(r, "id")
	if itemID == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"error": "library item id required",
		})
		return
	}

	// Get item
	item, err := h.libraryService.GetLibraryItem(userID, itemID)
	if err != nil {
		writeJSON(w, http.StatusForbidden, map[string]string{
			"error": "unauthorized",
		})
		return
	}

	writeJSON(w, http.StatusOK, item)
}
