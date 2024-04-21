package server

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

//GORM autogenerates IDs for each model with the inclusion of gorm.Model
// createdAt and updatedAt are also generated

// models
type Server struct {
	Router *gin.Engine
	DB     *gorm.DB
}

type ListingEmbed struct {
	gorm.Model
	ListingID uuid.UUID `gorm:"primary_key"` // Unique identifier for a new listing
}

type Listing struct {
	ListingEmbed
	Category      string    `json:"category"`
	Title         string    `json:"title"`                      // Title of the item being auctioned.
	Description   string    `json:"description"`                // Detailed description of the item.
	ProductImage  string    `json:"product_image"`              // image reference to the product
	StartingPrice float64   `json:"starting_price"`             // Starting price of the auction.
	CurrentPrice  float64   `json:"current_price"`              // Current highest bid on the auction (initially same as starting_price).
	EndTime       time.Time `json:"end_time"`                   // Date and time when the auction ends.
	Active        bool      `json:"active" gorm:"default:true"` // Boolean indicating whether the listing is currently active or inactive
	UserID        uuid.UUID `json:"seller_id"`                  // User ID of the seller who created the listing.
	User          User
}

type User struct {
	UserID       uuid.UUID `gorm:"primary_key"`                                    // Unique identifier for each user
	FirstName    string    `json:"first_name"`                                     // User first name
	LastName     string    `json:"last_name"`                                      // User last name
	Username     string    `json:"username" gorm:"unique"`                         // Username for login (should be unique).
	Email        string    `json:"email" gorm:"unique"`                            // User's email address (should be unique).
	PasswordHash string    `json:"password_hash"`                                  // Hashed password for secure storage.
	Listings     []Listing `json:"listings,omitempty" gorm:"foreignKey:ListingID"` // the listings for this particular user
	CreatedAt    time.Time `json:"created_at"`                                     // when the user was created
	UpdatedAt    time.Time `json:"updated_at"`                                     // when the user was updated
}

type BidEmbed struct {
	gorm.Model
	BidID uuid.UUID `gorm:"primary_key"` // unique bid id
}

type Bid struct {
	BidEmbed
	Amount    float64   `json:"amount"`     // Bid amount placed by the user.
	ListingID uuid.UUID `json:"listing_id"` // ID of the auction listing the bid is placed on.
	Listing   Listing
	UserID    uuid.UUID `json:"bidder_id"` // Bidder ID of the bidder who placed the bid.
	User      User
}
