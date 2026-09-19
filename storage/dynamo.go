package storage

import (
	"context"
	"errors"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"

	"github.com/yourusername/mediatracker-go/models"
)

// Store provides DynamoDB-backed persistence for all entities.
// Method signatures match the previous in-memory implementation so
// services and handlers are unchanged.
type Store struct {
	client       *dynamodb.Client
	usersTable   string
	mediaTable   string
	libraryTable string
}

// ==================== DYNAMO ITEM STRUCTS ====================

type userItem struct {
	PK        string `dynamodbav:"PK"`
	SK        string `dynamodbav:"SK"`
	GSI1PK    string `dynamodbav:"GSI1PK"`
	GSI1SK    string `dynamodbav:"GSI1SK"`
	ID        string `dynamodbav:"id"`
	Username  string `dynamodbav:"username"`
	Email     string `dynamodbav:"email"`
	Password  string `dynamodbav:"password"`
	CreatedAt string `dynamodbav:"created_at"`
}

type mediaItem struct {
	PK          string   `dynamodbav:"PK"`
	SK          string   `dynamodbav:"SK"`
	GSI1PK      string   `dynamodbav:"GSI1PK"`
	GSI1SK      string   `dynamodbav:"GSI1SK"`
	ID          string   `dynamodbav:"id"`
	Title       string   `dynamodbav:"title"`
	MediaType   string   `dynamodbav:"media_type"`
	Year        int      `dynamodbav:"year"`
	Genres      []string `dynamodbav:"genres"`
	Description string   `dynamodbav:"description"`
	CreatedAt   string   `dynamodbav:"created_at"`
}

type libraryItem struct {
	PK        string `dynamodbav:"PK"`
	SK        string `dynamodbav:"SK"`
	GSI1PK    string `dynamodbav:"GSI1PK"`
	GSI1SK    string `dynamodbav:"GSI1SK"`
	GSI2PK    string `dynamodbav:"GSI2PK"`
	GSI2SK    string `dynamodbav:"GSI2SK"`
	ID        string `dynamodbav:"id"`
	UserID    string `dynamodbav:"user_id"`
	MediaID   string `dynamodbav:"media_id"`
	Status    string `dynamodbav:"status"`
	Progress  int    `dynamodbav:"progress"`
	Notes     string `dynamodbav:"notes"`
	AddedAt   string `dynamodbav:"added_at"`
	UpdatedAt string `dynamodbav:"updated_at"`
}

// NewStore initializes a DynamoDB-backed store.
// Uses AWS SDK v2 default credential chain (Lambda role, local profile, etc.)
func NewStore() (*Store, error) {
	ctx := context.Background()

	cfg, err := config.LoadDefaultConfig(ctx, config.WithRegion("us-east-1"))
	if err != nil {
		return nil, fmt.Errorf("failed to load AWS config: %v", err)
	}

	var client *dynamodb.Client
	if awsEndpoint := getEnv("AWS_ENDPOINT_URL", ""); awsEndpoint != "" {
		// Allow DynamoDB Local overrides via endpoint resolution options
		client = dynamodb.NewFromConfig(cfg, func(o *dynamodb.Options) {
			o.BaseEndpoint = aws.String(awsEndpoint)
		})
	} else {
		client = dynamodb.NewFromConfig(cfg)
	}

	return &Store{
		client:       client,
		usersTable:   getEnv("USERS_TABLE", "MediaTracker-Users"),
		mediaTable:   getEnv("MEDIA_TABLE", "MediaTracker-Media"),
		libraryTable: getEnv("LIBRARY_TABLE", "MediaTracker-Library"),
	}, nil
}

// ==================== USER OPERATIONS ====================

// SaveUser saves a new user to storage
func (s *Store) SaveUser(user *models.User) error {
	item := userItem{
		PK:        "USER#" + user.ID,
		SK:        "METADATA",
		GSI1PK:    "EMAIL#" + user.Email,
		GSI1SK:    "USER#" + user.ID,
		ID:        user.ID,
		Username:  user.Username,
		Email:     user.Email,
		Password:  user.Password,
		CreatedAt: user.CreatedAt.Format(time.RFC3339),
	}

	av, err := attributevalue.MarshalMap(item)
	if err != nil {
		return fmt.Errorf("failed to marshal user: %v", err)
	}

	_, err = s.client.PutItem(context.Background(), &dynamodb.PutItemInput{
		TableName: aws.String(s.usersTable),
		Item:      av,
	})
	return err
}

// GetUserByID retrieves a user by their ID
func (s *Store) GetUserByID(id string) (*models.User, error) {
	out, err := s.client.GetItem(context.Background(), &dynamodb.GetItemInput{
		TableName: aws.String(s.usersTable),
		Key: map[string]types.AttributeValue{
			"PK": &types.AttributeValueMemberS{Value: "USER#" + id},
			"SK": &types.AttributeValueMemberS{Value: "METADATA"},
		},
	})
	if err != nil {
		return nil, err
	}
	if out.Item == nil {
		return nil, nil
	}

	var item userItem
	if err := attributevalue.UnmarshalMap(out.Item, &item); err != nil {
		return nil, fmt.Errorf("failed to unmarshal user: %v", err)
	}

	return item.toUser(), nil
}

// GetUserByEmail retrieves a user by their email address
func (s *Store) GetUserByEmail(email string) (*models.User, error) {
	out, err := s.client.Query(context.Background(), &dynamodb.QueryInput{
		TableName:              aws.String(s.usersTable),
		IndexName:              aws.String("GSI1"),
		KeyConditionExpression: aws.String("GSI1PK = :pk"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":pk": &types.AttributeValueMemberS{Value: "EMAIL#" + email},
		},
		Limit: aws.Int32(1),
	})
	if err != nil {
		return nil, err
	}
	if len(out.Items) == 0 {
		return nil, nil
	}

	var item userItem
	if err := attributevalue.UnmarshalMap(out.Items[0], &item); err != nil {
		return nil, fmt.Errorf("failed to unmarshal user: %v", err)
	}

	return item.toUser(), nil
}

// ==================== MEDIA OPERATIONS ====================

// SaveMedia saves a new media entry
func (s *Store) SaveMedia(media *models.Media) error {
	item := mediaItem{
		PK:          "MEDIA#" + media.ID,
		SK:          "METADATA",
		GSI1PK:      "TYPE#" + media.MediaType,
		GSI1SK:      "TITLE#" + strings.ToLower(media.Title),
		ID:          media.ID,
		Title:       media.Title,
		MediaType:   media.MediaType,
		Year:        media.Year,
		Genres:      media.Genres,
		Description: media.Description,
		CreatedAt:   media.CreatedAt.Format(time.RFC3339),
	}

	av, err := attributevalue.MarshalMap(item)
	if err != nil {
		return fmt.Errorf("failed to marshal media: %v", err)
	}

	_, err = s.client.PutItem(context.Background(), &dynamodb.PutItemInput{
		TableName: aws.String(s.mediaTable),
		Item:      av,
	})
	return err
}

// GetMediaByID retrieves media by ID
func (s *Store) GetMediaByID(id string) (*models.Media, error) {
	out, err := s.client.GetItem(context.Background(), &dynamodb.GetItemInput{
		TableName: aws.String(s.mediaTable),
		Key: map[string]types.AttributeValue{
			"PK": &types.AttributeValueMemberS{Value: "MEDIA#" + id},
			"SK": &types.AttributeValueMemberS{Value: "METADATA"},
		},
	})
	if err != nil {
		return nil, err
	}
	if out.Item == nil {
		return nil, nil
	}

	var item mediaItem
	if err := attributevalue.UnmarshalMap(out.Item, &item); err != nil {
		return nil, fmt.Errorf("failed to unmarshal media: %v", err)
	}

	return item.toMedia(), nil
}

// GetAllMedia returns all media in the database
func (s *Store) GetAllMedia() ([]*models.Media, error) {
	out, err := s.client.Scan(context.Background(), &dynamodb.ScanInput{
		TableName: aws.String(s.mediaTable),
	})
	if err != nil {
		return nil, err
	}

	result := make([]*models.Media, 0, len(out.Items))
	for _, it := range out.Items {
		var item mediaItem
		if err := attributevalue.UnmarshalMap(it, &item); err != nil {
			return nil, fmt.Errorf("failed to unmarshal media: %v", err)
		}
		result = append(result, item.toMedia())
	}
	return result, nil
}

// SearchMedia searches for media by title (case-insensitive substring match)
// Uses Scan + client-side filter (OpenSearch/ES optional enhancement)
func (s *Store) SearchMedia(query string) ([]*models.Media, error) {
	all, err := s.GetAllMedia()
	if err != nil {
		return nil, err
	}

	lowerQuery := strings.ToLower(query)
	var results []*models.Media
	for _, m := range all {
		if strings.Contains(strings.ToLower(m.Title), lowerQuery) {
			results = append(results, m)
		}
	}
	return results, nil
}

// ==================== LIBRARY OPERATIONS ====================

// SaveLibraryItem saves a new library entry
func (s *Store) SaveLibraryItem(item *models.LibraryItem) error {
	li := libraryItem{
		PK:        "USER#" + item.UserID,
		SK:        "LIBRARY#" + item.ID,
		GSI1PK:    "STATUS#" + item.Status,
		GSI1SK:    "ADDED_AT#" + item.AddedAt.Format(time.RFC3339),
		GSI2PK:    "MEDIA#" + item.MediaID,
		GSI2SK:    "USER#" + item.UserID,
		ID:        item.ID,
		UserID:    item.UserID,
		MediaID:   item.MediaID,
		Status:    item.Status,
		Progress:  item.Progress,
		Notes:     item.Notes,
		AddedAt:   item.AddedAt.Format(time.RFC3339),
		UpdatedAt: item.UpdatedAt.Format(time.RFC3339),
	}

	av, err := attributevalue.MarshalMap(li)
	if err != nil {
		return fmt.Errorf("failed to marshal library item: %v", err)
	}

	_, err = s.client.PutItem(context.Background(), &dynamodb.PutItemInput{
		TableName: aws.String(s.libraryTable),
		Item:      av,
	})
	return err
}

// GetLibraryItem retrieves a library item by ID
func (s *Store) GetLibraryItem(id string) (*models.LibraryItem, error) {
	// We need an index to look up by library item ID alone.
	// Use Scan with a filter (acceptable for hackathon scale).
	out, err := s.client.Scan(context.Background(), &dynamodb.ScanInput{
		TableName:              aws.String(s.libraryTable),
		FilterExpression:       aws.String("id = :id"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":id": &types.AttributeValueMemberS{Value: id},
		},
		Limit: aws.Int32(1),
	})
	if err != nil {
		return nil, err
	}
	if len(out.Items) == 0 {
		return nil, nil
	}

	var item libraryItem
	if err := attributevalue.UnmarshalMap(out.Items[0], &item); err != nil {
		return nil, fmt.Errorf("failed to unmarshal library item: %v", err)
	}
	return item.toLibraryItem(), nil
}

// GetUserLibrary returns all library items for a user
func (s *Store) GetUserLibrary(userID string) ([]*models.LibraryItem, error) {
	out, err := s.client.Query(context.Background(), &dynamodb.QueryInput{
		TableName:              aws.String(s.libraryTable),
		KeyConditionExpression: aws.String("PK = :pk AND begins_with(SK, :sk)"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":pk": &types.AttributeValueMemberS{Value: "USER#" + userID},
			":sk": &types.AttributeValueMemberS{Value: "LIBRARY#"},
		},
	})
	if err != nil {
		return nil, err
	}

	result := make([]*models.LibraryItem, 0, len(out.Items))
	for _, it := range out.Items {
		var item libraryItem
		if err := attributevalue.UnmarshalMap(it, &item); err != nil {
			return nil, fmt.Errorf("failed to unmarshal library item: %v", err)
		}
		result = append(result, item.toLibraryItem())
	}
	return result, nil
}

// GetUserLibraryByStatus returns library items filtered by status
func (s *Store) GetUserLibraryByStatus(userID, status string) ([]*models.LibraryItem, error) {
	out, err := s.client.Query(context.Background(), &dynamodb.QueryInput{
		TableName:              aws.String(s.libraryTable),
		KeyConditionExpression: aws.String("PK = :pk AND begins_with(SK, :sk)"),
		FilterExpression:       aws.String("GSI1PK = :status"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":pk":     &types.AttributeValueMemberS{Value: "USER#" + userID},
			":sk":     &types.AttributeValueMemberS{Value: "LIBRARY#"},
			":status": &types.AttributeValueMemberS{Value: "STATUS#" + status},
		},
	})
	if err != nil {
		return nil, err
	}

	result := make([]*models.LibraryItem, 0, len(out.Items))
	for _, it := range out.Items {
		var item libraryItem
		if err := attributevalue.UnmarshalMap(it, &item); err != nil {
			return nil, fmt.Errorf("failed to unmarshal library item: %v", err)
		}
		result = append(result, item.toLibraryItem())
	}
	return result, nil
}

// UpdateLibraryItem updates an existing library item
func (s *Store) UpdateLibraryItem(item *models.LibraryItem) error {
	li := libraryItem{
		PK:        "USER#" + item.UserID,
		SK:        "LIBRARY#" + item.ID,
		GSI1PK:    "STATUS#" + item.Status,
		GSI1SK:    "ADDED_AT#" + item.AddedAt.Format(time.RFC3339),
		GSI2PK:    "MEDIA#" + item.MediaID,
		GSI2SK:    "USER#" + item.UserID,
		ID:        item.ID,
		UserID:    item.UserID,
		MediaID:   item.MediaID,
		Status:    item.Status,
		Progress:  item.Progress,
		Notes:     item.Notes,
		AddedAt:   item.AddedAt.Format(time.RFC3339),
		UpdatedAt: item.UpdatedAt.Format(time.RFC3339),
	}

	av, err := attributevalue.MarshalMap(li)
	if err != nil {
		return fmt.Errorf("failed to marshal library item: %v", err)
	}

	_, err = s.client.PutItem(context.Background(), &dynamodb.PutItemInput{
		TableName: aws.String(s.libraryTable),
		Item:      av,
	})
	return err
}

// DeleteLibraryItem removes a library item
func (s *Store) DeleteLibraryItem(id, userID string) error {
	_, err := s.client.DeleteItem(context.Background(), &dynamodb.DeleteItemInput{
		TableName: aws.String(s.libraryTable),
		Key: map[string]types.AttributeValue{
			"PK": &types.AttributeValueMemberS{Value: "USER#" + userID},
			"SK": &types.AttributeValueMemberS{Value: "LIBRARY#" + id},
		},
	})
	return err
}

// ==================== UTILITY FUNCTIONS ====================

// MediaExistInUserLibrary checks if a media is already in user's library
func (s *Store) MediaExistInUserLibrary(userID, mediaID string) bool {
	out, err := s.client.Query(context.Background(), &dynamodb.QueryInput{
		TableName:              aws.String(s.libraryTable),
		IndexName:              aws.String("GSI2"),
		KeyConditionExpression: aws.String("GSI2PK = :pk AND GSI2SK = :sk"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":pk": &types.AttributeValueMemberS{Value: "MEDIA#" + mediaID},
			":sk": &types.AttributeValueMemberS{Value: "USER#" + userID},
		},
		Limit: aws.Int32(1),
	})
	if err != nil {
		return false
	}
	return len(out.Items) > 0
}

// CountMediaByStatus counts how many items have a specific status for a user
func (s *Store) CountMediaByStatus(userID, status string) int {
	out, err := s.client.Query(context.Background(), &dynamodb.QueryInput{
		TableName:              aws.String(s.libraryTable),
		KeyConditionExpression: aws.String("PK = :pk AND begins_with(SK, :sk)"),
		FilterExpression:       aws.String("GSI1PK = :status"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":pk":     &types.AttributeValueMemberS{Value: "USER#" + userID},
			":sk":     &types.AttributeValueMemberS{Value: "LIBRARY#"},
			":status": &types.AttributeValueMemberS{Value: "STATUS#" + status},
		},
		Select: types.SelectCount,
	})
	if err != nil {
		return 0
	}
	return int(out.Count)
}

// GetMediaIDsForUser returns all media IDs in user's library
func (s *Store) GetMediaIDsForUser(userID string) []string {
	items, err := s.GetUserLibrary(userID)
	if err != nil {
		return nil
	}
	ids := make([]string, 0, len(items))
	for _, item := range items {
		ids = append(ids, item.MediaID)
	}
	return ids
}

// ==================== CONVERSION HELPERS ====================

func (i *userItem) toUser() *models.User {
	createdAt, _ := time.Parse(time.RFC3339, i.CreatedAt)
	return &models.User{
		ID:        i.ID,
		Username:  i.Username,
		Email:     i.Email,
		Password:  i.Password,
		CreatedAt: createdAt,
	}
}

func (i *mediaItem) toMedia() *models.Media {
	createdAt, _ := time.Parse(time.RFC3339, i.CreatedAt)
	return &models.Media{
		ID:          i.ID,
		Title:       i.Title,
		MediaType:   i.MediaType,
		Year:        i.Year,
		Genres:      i.Genres,
		Description: i.Description,
		CreatedAt:   createdAt,
	}
}

func (i *libraryItem) toLibraryItem() *models.LibraryItem {
	addedAt, _ := time.Parse(time.RFC3339, i.AddedAt)
	updatedAt, _ := time.Parse(time.RFC3339, i.UpdatedAt)
	return &models.LibraryItem{
		ID:        i.ID,
		UserID:    i.UserID,
		MediaID:   i.MediaID,
		Status:    i.Status,
		Progress:  i.Progress,
		Notes:     i.Notes,
		AddedAt:   addedAt,
		UpdatedAt: updatedAt,
	}
}

// getEnv returns the value of an environment variable or a fallback
func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

// ErrNotFound is returned when an item does not exist
var ErrNotFound = errors.New("item not found")