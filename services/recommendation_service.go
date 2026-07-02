package services

import (
	"fmt"
	"strings"

	"github.com/yourusername/mediatracker-go/models"
	"github.com/yourusername/mediatracker-go/storage"
)

// RecommendationService provides personalized recommendations
type RecommendationService struct {
	store *storage.Store
	ls    *LibraryService
	ms    *MediaService
}

// NewRecommendationService creates a new recommendation service instance
func NewRecommendationService(store *storage.Store, ls *LibraryService, ms *MediaService) *RecommendationService {
	return &RecommendationService{
		store: store,
		ls:    ls,
		ms:    ms,
	}
}

// GetRecommendations generates recommendations based on user's library
func (rs *RecommendationService) GetRecommendations(userID string) (*models.RecommendationResponse, error) {
	// Get user's favorite genres from completed and watching items
	favoriteGenres := rs.getUserFavoriteGenres(userID)
	if len(favoriteGenres) == 0 {
		// If no favorites yet, return popular recommendations
		return &models.RecommendationResponse{
			RecommendedMedia: []models.RecommendedItem{},
		}, nil
	}

	// Get all media
	allMedia, err := rs.ms.GetAllMedia()
	if err != nil {
		return nil, err
	}

	// Get user's media IDs to exclude what they already have
	userMediaIDs := rs.store.GetMediaIDsForUser(userID)
	userMediaMap := make(map[string]bool)
	for _, id := range userMediaIDs {
		userMediaMap[id] = true
	}

	// Find recommendations
	var recommendations []models.RecommendedItem
	for _, media := range allMedia {
		// Skip if user already has this media
		if userMediaMap[media.ID] {
			continue
		}

		// Check if media matches user's favorite genres
		matchCount := 0
		for _, genre := range media.Genres {
			if favoriteGenres[strings.ToLower(genre)] {
				matchCount++
			}
		}

		// If there's a genre match, add to recommendations (limit to 10)
		if matchCount > 0 && len(recommendations) < 10 {
			matchReason := fmt.Sprintf("Based on your %s interests", rs.getMostFrequentGenre(favoriteGenres))
			recommendations = append(recommendations, models.RecommendedItem{
				ID:          media.ID,
				Title:       media.Title,
				MediaType:   media.MediaType,
				Genres:      media.Genres,
				MatchReason: matchReason,
			})
		}
	}

	return &models.RecommendationResponse{
		RecommendedMedia: recommendations,
	}, nil
}

// ==================== HELPER FUNCTIONS ====================

// getUserFavoriteGenres extracts genres from user's completed and watching items
func (rs *RecommendationService) getUserFavoriteGenres(userID string) map[string]bool {
	favoriteGenres := make(map[string]bool)

	// Get completed items
	completed, _ := rs.ls.GetUserLibraryByStatus(userID, "Completed")
	for _, item := range completed {
		media, _ := rs.ms.GetMediaByID(item.MediaID)
		if media != nil {
			for _, genre := range media.Genres {
				favoriteGenres[strings.ToLower(genre)] = true
			}
		}
	}

	// Get watching items
	watching, _ := rs.ls.GetUserLibraryByStatus(userID, "Watching")
	for _, item := range watching {
		media, _ := rs.ms.GetMediaByID(item.MediaID)
		if media != nil {
			for _, genre := range media.Genres {
				favoriteGenres[strings.ToLower(genre)] = true
			}
		}
	}

	return favoriteGenres
}

// getMostFrequentGenre returns the most common genre from favorites
func (rs *RecommendationService) getMostFrequentGenre(favorites map[string]bool) string {
	if len(favorites) == 0 {
		return "entertainment"
	}

	// For simplicity, return the first genre
	for genre := range favorites {
		return genre
	}
	return "entertainment"
}
