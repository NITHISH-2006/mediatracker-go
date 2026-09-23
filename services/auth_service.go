package services

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"github.com/yourusername/mediatracker-go/config"
	"github.com/yourusername/mediatracker-go/models"
	"github.com/yourusername/mediatracker-go/storage"
)

// AuthService handles user authentication and JWT operations
type AuthService struct {
	store *storage.Store
}

// NewAuthService creates a new auth service instance
func NewAuthService(store *storage.Store) *AuthService {
	return &AuthService{store: store}
}

// Register creates a new user account
func (as *AuthService) Register(req *models.RegisterRequest) (*models.User, error) {
	// Check if email already exists
	existingUser, _ := as.store.GetUserByEmail(req.Email)
	if existingUser != nil {
		return nil, fmt.Errorf("email already registered")
	}

	// Hash password with bcrypt
	hashedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(req.Password),
		bcrypt.DefaultCost,
	)
	if err != nil {
		return nil, fmt.Errorf("password hashing failed: %v", err)
	}

	// Create new user
	user := &models.User{
		ID:        generateID(),
		Username:  req.Username,
		Email:     req.Email,
		Password:  string(hashedPassword),
		CreatedAt: time.Now().UTC(),
	}

	// Save to storage
	if err := as.store.SaveUser(user); err != nil {
		return nil, err
	}

	return user, nil
}

// Login authenticates a user and returns a JWT token
func (as *AuthService) Login(req *models.LoginRequest) (*models.LoginResponse, error) {
	// Get user by email
	user, _ := as.store.GetUserByEmail(req.Email)
	if user == nil {
		return nil, fmt.Errorf("invalid email or password")
	}

	// Compare password with hash
	err := bcrypt.CompareHashAndPassword(
		[]byte(user.Password),
		[]byte(req.Password),
	)
	if err != nil {
		return nil, fmt.Errorf("invalid email or password")
	}

	// Generate JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":  user.ID,
		"email":    user.Email,
		"username": user.Username,
		"exp":      time.Now().Add(time.Duration(config.TokenExpiration) * time.Second).Unix(),
		"iat":      time.Now().Unix(),
	})

	tokenString, err := token.SignedString([]byte(config.JWTSecret))
	if err != nil {
		return nil, fmt.Errorf("token generation failed: %v", err)
	}

	return &models.LoginResponse{
		Token:     tokenString,
		ExpiresIn: config.TokenExpiration,
		Username:  user.Username,
	}, nil
}

// ValidateToken validates a JWT token and returns the user ID
func (as *AuthService) ValidateToken(tokenString string) (string, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("invalid signing method")
		}
		return []byte(config.JWTSecret), nil
	})

	if err != nil {
		return "", fmt.Errorf("invalid token: %v", err)
	}

	if !token.Valid {
		return "", fmt.Errorf("token is not valid")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return "", fmt.Errorf("invalid token claims")
	}

	userID, ok := claims["user_id"].(string)
	if !ok {
		return "", fmt.Errorf("user_id not found in token")
	}

	return userID, nil
}

// ==================== HELPER FUNCTIONS ====================

// generateID creates a unique ID using SHA256 hash of timestamp + random string
func generateID() string {
	hash := sha256.Sum256([]byte(fmt.Sprintf("%d-%d", time.Now().UnixNano(), time.Now().UnixMicro())))
	return hex.EncodeToString(hash[:])[:16] // First 16 chars of hex
}
