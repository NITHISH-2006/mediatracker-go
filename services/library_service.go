package services

import (
	"fmt"
	"time"

	"github.com/yourusername/mediatracker-go/config"
	"github.com/yourusername/mediatracker-go/models"
	"github.com/yourusername/mediatracker-go/storage"
)

// LibraryService handles user library operations
type LibraryService struct {
	store *storage.Store
	ms    *MediaService
}

// NewLibraryService creates a new library service instance
func NewLibraryService(store *storage.Store, ms *MediaService) *LibraryService {
	return &LibraryService{
		store: store,
		ms:    ms,
	}
}

// AddMediaToLibrary adds a media item to a user's personal library
func (ls *LibraryService) AddMediaToLibrary(userID string, req *models.AddToLibraryRequest) (*models.LibraryItem, error) {
	// Validate media exists
	media, err := ls.ms.GetMediaByID(req.MediaID)
	if err != nil || media == nil {
		return nil, fmt.Errorf("media not found")
	}

	// Validate status
	if !config.ValidStatuses[req.Status] {
		return nil, fmt.Errorf("invalid status: %s", req.Status)
	}

	// Check if already in library
	if ls.store.MediaExistInUserLibrary(userID, req.MediaID) {
		return nil, fmt.Errorf("media already in your library")
	}

	// Create library item
	item := &models.LibraryItem{
		ID:        generateID(),
		UserID:    userID,
		MediaID:   req.MediaID,
		Status:    req.Status,
		Progress:  req.Progress,
		Notes:     req.Notes,
		AddedAt:   time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
	}

	// Save to storage
	if err := ls.store.SaveLibraryItem(item); err != nil {
		return nil, err
	}

	return item, nil
}

// GetUserLibrary returns all library items for a user
func (ls *LibraryService) GetUserLibrary(userID string) ([]*models.LibraryItem, error) {
	return ls.store.GetUserLibrary(userID)
}

// GetUserLibraryByStatus returns library items filtered by status
func (ls *LibraryService) GetUserLibraryByStatus(userID, status string) ([]*models.LibraryItem, error) {
	if !config.ValidStatuses[status] {
		return nil, fmt.Errorf("invalid status: %s", status)
	}
	return ls.store.GetUserLibraryByStatus(userID, status)
}

// UpdateLibraryItem updates an existing library entry
func (ls *LibraryService) UpdateLibraryItem(userID, itemID string, req *models.UpdateLibraryRequest) (*models.LibraryItem, error) {
	// Get the item
	item, err := ls.store.GetLibraryItem(itemID)
	if err != nil || item == nil {
		return nil, fmt.Errorf("library item not found")
	}

	// Verify ownership
	if item.UserID != userID {
		return nil, fmt.Errorf("unauthorized")
	}

	// Validate status
	if req.Status != "" && !config.ValidStatuses[req.Status] {
		return nil, fmt.Errorf("invalid status: %s", req.Status)
	}

	// Update fields
	if req.Status != "" {
		item.Status = req.Status
	}
	if req.Progress >= 0 {
		item.Progress = req.Progress
	}
	if req.Notes != "" {
		item.Notes = req.Notes
	}
	item.UpdatedAt = time.Now().UTC()

	// Save changes
	if err := ls.store.UpdateLibraryItem(item); err != nil {
		return nil, err
	}

	return item, nil
}

// DeleteLibraryItem removes an item from user's library
func (ls *LibraryService) DeleteLibraryItem(userID, itemID string) error {
	// Get the item to verify ownership
	item, err := ls.store.GetLibraryItem(itemID)
	if err != nil || item == nil {
		return fmt.Errorf("library item not found")
	}

	// Verify ownership
	if item.UserID != userID {
		return fmt.Errorf("unauthorized")
	}

	// Delete
	return ls.store.DeleteLibraryItem(itemID, userID)
}

// GetLibraryItem retrieves a specific library item
func (ls *LibraryService) GetLibraryItem(userID, itemID string) (*models.LibraryItem, error) {
	item, err := ls.store.GetLibraryItem(itemID)
	if err != nil || item == nil {
		return nil, fmt.Errorf("library item not found")
	}

	// Verify ownership
	if item.UserID != userID {
		return nil, fmt.Errorf("unauthorized")
	}

	return item, nil
}

// CountByStatus returns count of items for each status
func (ls *LibraryService) CountByStatus(userID string) map[string]int {
	return map[string]int{
		config.StatusWatching:  ls.store.CountMediaByStatus(userID, config.StatusWatching),
		config.StatusCompleted: ls.store.CountMediaByStatus(userID, config.StatusCompleted),
		config.StatusDropped:   ls.store.CountMediaByStatus(userID, config.StatusDropped),
		config.StatusPlanned:   ls.store.CountMediaByStatus(userID, config.StatusPlanned),
	}
}
