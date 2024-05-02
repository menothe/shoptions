package services

import (
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"github.com/menothe/shoptions/models"
	"github.com/menothe/shoptions/structs"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserService interface {
	CreateUser(*structs.UserSignupRequestBody) (*uuid.UUID, error)
	LoginUser(*structs.UserLoginCredentials) error
	AuthenticateUser(string) (*models.User, error)
}

type UserServiceImpl struct {
	DB *gorm.DB
}

func NewUserService(db *gorm.DB) *UserServiceImpl {
	return &UserServiceImpl{db}
}

func (us *UserServiceImpl) CreateUser(userBody *structs.UserSignupRequestBody) (uuid.UUID, error) {
	// hash the password
	hash, err := bcrypt.GenerateFromPassword([]byte(userBody.Password), 10)

	if err != nil {
		return uuid.UUID{}, ErrCreatePassword
	}

	// create the user
	newUser := models.User{
		UserID:       uuid.New(),
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
		Email:        userBody.Email,
		PasswordHash: string(hash),
		Username:     userBody.Username,
		FirstName:    userBody.FirstName,
		LastName:     userBody.LastName,
	}

	err = us.DB.Create(&newUser).Error

	if err != nil {
		return uuid.UUID{}, ErrCreateNewUser
	}
	return newUser.UserID, nil
}

func (us *UserServiceImpl) LoginUser(userCredentials *structs.UserLoginCredentials) (*uuid.UUID, error) {
	// lookup the requested user
	var user models.User
	err := us.DB.First(&user, "email = ?", userCredentials.Email).Error

	if err != nil || len(user.UserID) == 0 {
		return nil, ErrUserNotFound
	}

	// Compare sent in password with saved user password hash
	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(userCredentials.Password))
	if err != nil {
		return nil, ErrInvalidCredentials
	}
	return &user.UserID, nil
}

func (us *UserServiceImpl) AuthenticateUser(tokenStr string) (*models.User, error) {
	// Decode/validate it
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(os.Getenv("SECRET")), nil
	})
	if err != nil {
		return nil, ErrFailedUserAuthentication
	}
	var user models.User
	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		// Check the exp
		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			return nil, ErrFailedUserAuthentication
		}
		// Find the user with token sub

		us.DB.First(&user, "user_id = ?", claims["sub"])

		if len(user.UserID) == 0 {
			return nil, ErrFailedUserAuthentication
		}

	} else {
		return nil, ErrFailedUserAuthentication
	}
	return &user, nil
}

// ERRORS
var (
	ErrCreatePassword           = errors.New("failed to create hashed password")
	ErrCreateNewUser            = errors.New("failed to persist user to postgres")
	ErrUserNotFound             = errors.New("failed to locate user id")
	ErrInvalidCredentials       = errors.New("invalid user credentials")
	ErrFailedUserAuthentication = errors.New("failed to authenticate user")
)
