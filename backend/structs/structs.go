package structs

import (
	"time"

	"github.com/google/uuid"
)

type UserSignupRequestBody struct {
	Email     string `json:"email"`
	Password  string `json:"password"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Username  string `json:"username"`
}

type UserLoginCredentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type CreateListingRequestBody struct {
	Title        string    `json:"title"`
	Description  string    `json:"description"`
	Price        float64   `json:"starting_price"`
	Category     string    `json:"category"`
	EndTime      time.Time `json:"end_time"`
	ProductImage string    `json:"product_image,omitempty"`
}

type UpdateListingRequestBody struct {
	ListingID     uuid.UUID `json:"listing_id"`
	Title         string    `json:"title"`
	Description   string    `json:"description"`
	Category      string    `json:"category"`
	ProductImage  string    `json:"product_image"`
	StartingPrice float64   `json:"starting_price"`
	EndTime       time.Time `json:"end_time"`
	Active        bool      `json:"active"`
}
