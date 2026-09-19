package services

import (
	"fmt"
	"sort"
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

// genrePref is a weighted genre preference for a user.
// weight counts how strongly the user cares about the genre:
// Completed items count double vs. currently Watching.
type genrePref struct {
	genre  string
	weight int
}

// GetRecommendations generates scored recommendations based on the user's library.
// Unseen media is scored by how strongly it matches the user's weighted genre
// preferences; the highest-scoring titles are returned with an explanation.
func (rs *RecommendationService) GetRecommendations(userID string) (*models.RecommendationResponse, error) {
	prefs := rs.getUserGenrePreferences(userID)
	if len(prefs) == 0 {
		return &models.RecommendationResponse{
			RecommendedMedia: []models.RecommendedItem{},
		}, nil
	}

	allMedia, err := rs.ms.GetAllMedia()
	if err != nil {
		return nil, err
	}

	// Exclude media already in the user's library
	userMediaIDs := rs.store.GetMediaIDsForUser(userID)
	userMediaMap := make(map[string]bool, len(userMediaIDs))
	for _, id := range userMediaIDs {
		userMediaMap[id] = true
	}

	// Build a lookup of genre -> weight for scoring
	scoreByGenre := make(map[string]int, len(prefs))
	for _, p := range prefs {
		scoreByGenre[p.genre] = p.weight
	}

	type scored struct {
		item    models.RecommendedItem
		score   int
		matched []genrePref // genres that matched, with weights
	}
	var candidates []scored

	for _, media := range allMedia {
		if userMediaMap[media.ID] {
			continue
		}

		score, matched := mediaScore(media.Genres, scoreByGenre, prefs)
		if score == 0 {
			continue
		}

		candidates = append(candidates, scored{
			item: models.RecommendedItem{
				ID:        media.ID,
				Title:     media.Title,
				MediaType: media.MediaType,
				Genres:    media.Genres,
			},
			score:   score,
			matched: matched,
		})
	}

	// Sort by score descending; stable so ties keep insertion order
	sort.SliceStable(candidates, func(i, j int) bool {
		return candidates[i].score > candidates[j].score
	})

	// Keep the top 10
	if len(candidates) > 10 {
		candidates = candidates[:10]
	}

	recommendations := make([]models.RecommendedItem, 0, len(candidates))
	for i, c := range candidates {
		topGenre := ""
		topWeight := 0
		if len(prefs) > 0 {
			topGenre = prefs[0].genre
			topWeight = prefs[0].weight
		}
		c.item.MatchReason = rs.buildMatchReason(c.matched, topGenre, topWeight, i == 0)
		recommendations = append(recommendations, c.item)
	}

	return &models.RecommendationResponse{
		RecommendedMedia: recommendations,
	}, nil
}

// mediaScore returns how well a media item matches the user's genre
// preferences, plus which genres matched (with their weights).
func mediaScore(mediaGenres []string, scoreByGenre map[string]int, prefs []genrePref) (int, []genrePref) {
	score := 0
	var matched []genrePref
	for _, g := range mediaGenres {
		if w, ok := scoreByGenre[strings.ToLower(g)]; ok {
			score += w
			matched = append(matched, genrePref{genre: strings.ToLower(g), weight: w})
		}
	}
	return score, matched
}

// buildMatchReason explains a recommendation in one line.
// The top recommendation gets the personalized sentence; the rest get a compact reason.
func (rs *RecommendationService) buildMatchReason(matched []genrePref, topGenre string, topWeight int, isTop bool) string {
	if len(matched) == 0 {
		return "You might enjoy this one"
	}

	if isTop && topGenre != "" {
		return fmt.Sprintf("Your #1 pick — matches your %s taste (%s)", topGenre, pluralTitles(topWeight/2))
	}

	if len(matched) == 1 {
		return fmt.Sprintf("Matches your %s preference (%s)", matched[0].genre, pluralTitles(matched[0].weight/2))
	}

	genres := make([]string, 0, len(matched))
	for _, m := range matched {
		genres = append(genres, m.genre)
	}
	return fmt.Sprintf("You enjoy %s", displayList(genres))
}

// getUserGenrePreferences builds a weighted genre preference list,
// sorted by weight descending. Completed titles count double.
func (rs *RecommendationService) getUserGenrePreferences(userID string) []genrePref {
	weights := make(map[string]int)

	// Completed items: weight 2
	if items, err := rs.ls.GetUserLibraryByStatus(userID, "Completed"); err == nil {
		for _, item := range items {
			if media, err := rs.ms.GetMediaByID(item.MediaID); err == nil && media != nil {
				for _, g := range media.Genres {
					weights[strings.ToLower(g)] += 2
				}
			}
		}
	}

	// Watching items: weight 1
	if items, err := rs.ls.GetUserLibraryByStatus(userID, "Watching"); err == nil {
		for _, item := range items {
			if media, err := rs.ms.GetMediaByID(item.MediaID); err == nil && media != nil {
				for _, g := range media.Genres {
					weights[strings.ToLower(g)] += 1
				}
			}
		}
	}

	prefs := make([]genrePref, 0, len(weights))
	for genre, w := range weights {
		prefs = append(prefs, genrePref{genre: genre, weight: w})
	}

	sort.Slice(prefs, func(i, j int) bool {
		return prefs[i].weight > prefs[j].weight
	})

	return prefs
}

// pluralTitles renders "1 title" vs "2 titles"
func pluralTitles(n int) string {
	if n == 1 {
		return "1 title"
	}
	return fmt.Sprintf("%d titles", n)
}

// displayList joins genres with ", " and " & " for the last item
func displayList(items []string) string {
	if len(items) == 0 {
		return ""
	}
	if len(items) == 1 {
		return items[0]
	}
	return fmt.Sprintf("%s & %s", strings.Join(items[:len(items)-1], ", "), items[len(items)-1])
}
