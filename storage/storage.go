package storage

import (
	"strings"
	"sync"

	"github.com/yourusername/mediatracker-go/models"
)

// Store manages all in-memory data storage with thread-safe operations
// Uses sync.RWMutex to prevent concurrent map access issues
type Store struct {
	// Maps keyed by ID
	users        map[string]*models.User
	media        map[string]*models.Media
	libraryItems map[string]*models.LibraryItem

	// Email to User ID index for quick lookups
	emailIndex map[string]string

	// User ID to Library Items for quick user library access
	userLibrary map[string][]*models.LibraryItem

	// Thread-safe synchronization
	mu sync.RWMutex
}

// NewStore initializes and returns a new Store instance
func NewStore() *Store {
	return &Store{
		users:        make(map[string]*models.User),
		media:        make(map[string]*models.Media),
		libraryItems: make(map[string]*models.LibraryItem),
		emailIndex:   make(map[string]string),
		userLibrary:  make(map[string][]*models.LibraryItem),
	}
}

// ==================== USER OPERATIONS ====================

// SaveUser saves a new user to storage
func (s *Store) SaveUser(user *models.User) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.users[user.ID] = user
	s.emailIndex[user.Email] = user.ID
	return nil
}

// GetUserByID retrieves a user by their ID
func (s *Store) GetUserByID(id string) (*models.User, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	user, exists := s.users[id]
	if !exists {
		return nil, nil
	}
	return user, nil
}

// GetUserByEmail retrieves a user by their email address
func (s *Store) GetUserByEmail(email string) (*models.User, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	userID, exists := s.emailIndex[email]
	if !exists {
		return nil, nil
	}
	return s.users[userID], nil
}

// ==================== MEDIA OPERATIONS ====================

// SaveMedia saves a new media entry
func (s *Store) SaveMedia(media *models.Media) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.media[media.ID] = media
	return nil
}

// GetMediaByID retrieves media by ID
func (s *Store) GetMediaByID(id string) (*models.Media, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	media, exists := s.media[id]
	if !exists {
		return nil, nil
	}
	return media, nil
}

// GetAllMedia returns all media in the database
func (s *Store) GetAllMedia() ([]*models.Media, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	result := make([]*models.Media, 0, len(s.media))
	for _, media := range s.media {
		result = append(result, media)
	}
	return result, nil
}

// SearchMedia searches for media by title (case-insensitive substring match)
func (s *Store) SearchMedia(query string) ([]*models.Media, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var results []*models.Media
	lowerQuery := strings.ToLower(query)

	for _, media := range s.media {
		if strings.Contains(strings.ToLower(media.Title), lowerQuery) {
			results = append(results, media)
		}
	}
	return results, nil
}

// ==================== LIBRARY OPERATIONS ====================

// SaveLibraryItem saves a new library entry
func (s *Store) SaveLibraryItem(item *models.LibraryItem) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.libraryItems[item.ID] = item
	s.userLibrary[item.UserID] = append(s.userLibrary[item.UserID], item)
	return nil
}

// GetLibraryItem retrieves a library item by ID
func (s *Store) GetLibraryItem(id string) (*models.LibraryItem, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	item, exists := s.libraryItems[id]
	if !exists {
		return nil, nil
	}
	return item, nil
}

// GetUserLibrary returns all library items for a user
func (s *Store) GetUserLibrary(userID string) ([]*models.LibraryItem, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	items := s.userLibrary[userID]
	if items == nil {
		return []*models.LibraryItem{}, nil
	}
	return items, nil
}

// GetUserLibraryByStatus returns library items filtered by status
func (s *Store) GetUserLibraryByStatus(userID, status string) ([]*models.LibraryItem, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var results []*models.LibraryItem
	items := s.userLibrary[userID]

	for _, item := range items {
		if item.Status == status {
			results = append(results, item)
		}
	}
	return results, nil
}

// UpdateLibraryItem updates an existing library item
func (s *Store) UpdateLibraryItem(item *models.LibraryItem) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if _, exists := s.libraryItems[item.ID]; !exists {
		return nil // Item doesn't exist
	}
	s.libraryItems[item.ID] = item

	// Update in user library list
	userItems := s.userLibrary[item.UserID]
	for i, existingItem := range userItems {
		if existingItem.ID == item.ID {
			userItems[i] = item
			break
		}
	}
	return nil
}

// DeleteLibraryItem removes a library item
func (s *Store) DeleteLibraryItem(id, userID string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	delete(s.libraryItems, id)

	// Remove from user library list
	userItems := s.userLibrary[userID]
	for i, item := range userItems {
		if item.ID == id {
			s.userLibrary[userID] = append(userItems[:i], userItems[i+1:]...)
			break
		}
	}
	return nil
}

// ==================== UTILITY FUNCTIONS ====================

// MediaExistInUserLibrary checks if a media is already in user's library
func (s *Store) MediaExistInUserLibrary(userID, mediaID string) bool {
	s.mu.RLock()
	defer s.mu.RUnlock()

	userItems := s.userLibrary[userID]
	for _, item := range userItems {
		if item.MediaID == mediaID {
			return true
		}
	}
	return false
}

// CountMediaByStatus counts how many items have a specific status for a user
func (s *Store) CountMediaByStatus(userID, status string) int {
	s.mu.RLock()
	defer s.mu.RUnlock()

	count := 0
	userItems := s.userLibrary[userID]
	for _, item := range userItems {
		if item.Status == status {
			count++
		}
	}
	return count
}

// GetMediaIDsForUser returns all media IDs in user's library
func (s *Store) GetMediaIDsForUser(userID string) []string {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var ids []string
	userItems := s.userLibrary[userID]
	for _, item := range userItems {
		ids = append(ids, item.MediaID)
	}
	return ids
}
