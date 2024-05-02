package models

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
	ListingID     uuid.UUID `gorm:"primaryKey"`
	Category      string
	Title         string
	Description   string
	ProductImage  string
	StartingPrice float64
	EndTime       time.Time
	Active        bool `gorm:"default:true"`
	UserID        uuid.UUID
	Bids          []Bid `gorm:"foreignKey:ListingID"`
	CreatedAt     time.Time
	UpdatedAt     time.Time
}

type User struct {
	UserID       uuid.UUID `gorm:"primaryKey"`
	FirstName    string
	LastName     string
	Username     string `gorm:"unique"`
	Email        string `gorm:"unique"`
	PasswordHash string
	Listings     []Listing `gorm:"foreignKey:UserID"`
	Bids         []Bid     `gorm:"foreignKey:UserID"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

type Bid struct {
	BidID     uuid.UUID `gorm:"primaryKey"`
	Amount    float64
	ListingID uuid.UUID
	UserID    uuid.UUID
}
