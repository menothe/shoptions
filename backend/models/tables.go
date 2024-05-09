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
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

type Bid struct {
	BidID     uuid.UUID `gorm:"primaryKey"`
	Amount    float64
	ListingID uuid.UUID
	UserID    uuid.UUID
}

//user - listing: one to many
//user - bid: one to many
//listing - bid: one to many
