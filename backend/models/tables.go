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
	ListingID     uuid.UUID `json:"listingID" gorm:"primaryKey"`
	Category      string    `json:"category"`
	Title         string    `json:"title"`
	Description   string    `json:"description"`
	ProductImage  string    `json:"productImage"`
	StartingPrice float64   `json:"startingPrice"`
	EndTime       time.Time `json:"endTime"`
	Duration      uint8     `json:"duration"`
	Active        bool      `gorm:"default:true" json:"active"`
	UserID        uuid.UUID `json:"userID"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}

type User struct {
	UserID       uuid.UUID `gorm:"primaryKey"`
	FirstName    string    `json:"firstName"`
	LastName     string    `json:"lastName"`
	Username     string    `gorm:"unique" json:"username"`
	Email        string    `gorm:"unique" json:"email"`
	PasswordHash string    `json:"passwordHash"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

type Bid struct {
	BidID     uuid.UUID `gorm:"primaryKey" json:"bidID"`
	Amount    float64   `json:"amount"`
	ListingID uuid.UUID `json:"listingID"`
	UserID    uuid.UUID `json:"userID"`
}

//user - listing: one to many
//user - bid: one to many
//listing - bid: one to many
