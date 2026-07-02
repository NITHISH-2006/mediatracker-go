package services

import (
	"fmt"
	"strings"
	"time"

	"github.com/yourusername/mediatracker-go/models"
	"github.com/yourusername/mediatracker-go/storage"
)

// MediaService handles media CRUD operations
type MediaService struct {
	store *storage.Store
}

// NewMediaService creates a new media service instance
func NewMediaService(store *storage.Store) *MediaService {
	return &MediaService{store: store}
}

// AddMedia adds a new media entry to the database
func (ms *MediaService) AddMedia(req *models.AddMediaRequest) (*models.Media, error) {
	// Validate input
	if strings.TrimSpace(req.Title) == "" {
		return nil, fmt.Errorf("title cannot be empty")
	}

	if req.Year < 1900 || req.Year > time.Now().Year()+5 {
		return nil, fmt.Errorf("invalid year")
	}

	if len(req.Genres) == 0 {
		return nil, fmt.Errorf("at least one genre is required")
	}

	// Create media object
	media := &models.Media{
		ID:          generateID(),
		Title:       req.Title,
		MediaType:   strings.ToLower(req.MediaType),
		Year:        req.Year,
		Genres:      req.Genres,
		Description: req.Description,
		CreatedAt:   time.Now().UTC(),
	}

	// Save to storage
	if err := ms.store.SaveMedia(media); err != nil {
		return nil, err
	}

	return media, nil
}

// GetMediaByID retrieves a specific media by ID
func (ms *MediaService) GetMediaByID(id string) (*models.Media, error) {
	return ms.store.GetMediaByID(id)
}

// SearchMedia searches for media by title
func (ms *MediaService) SearchMedia(query string) ([]*models.Media, error) {
	if strings.TrimSpace(query) == "" {
		return ms.GetAllMedia()
	}
	return ms.store.SearchMedia(query)
}

// GetAllMedia returns all media in the database
func (ms *MediaService) GetAllMedia() ([]*models.Media, error) {
	return ms.store.GetAllMedia()
}

// GetMediasByGenre returns all media that contain a specific genre
func (ms *MediaService) GetMediasByGenre(genre string) ([]*models.Media, error) {
	allMedia, err := ms.store.GetAllMedia()
	if err != nil {
		return nil, err
	}

	var results []*models.Media
	lowerGenre := strings.ToLower(genre)

	for _, m := range allMedia {
		for _, g := range m.Genres {
			if strings.ToLower(g) == lowerGenre {
				results = append(results, m)
				break
			}
		}
	}

	return results, nil
}
