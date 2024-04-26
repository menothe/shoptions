package server

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// models
type Server struct {
	Router *gin.Engine
	DB     *gorm.DB
}

type Listing struct {
	ListingID     uuid.UUID `gorm:"primary_key"`
	Category      string
	Title         string
	Description   string
	ProductImage  string
	StartingPrice float64
	Bid           Bid
	BidID         uuid.UUID
	EndTime       time.Time
	Active        bool `gorm:"default:true"`
	SellerID      uuid.UUID
	CreatedAt     time.Time
	UpdatedAt     time.Time
}

type User struct {
	UserID       uuid.UUID `gorm:"primary_key"`
	FirstName    string
	LastName     string
	Username     string `gorm:"unique"`
	Email        string `gorm:"unique"`
	PasswordHash string
	Listings     []Listing `gorm:"foreignKey:ListingID"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

type Bid struct {
	BidID  uuid.UUID `gorm:"primary_key"`
	Amount float64
	User   User
	UserID uuid.UUID
}
