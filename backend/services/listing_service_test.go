package services

import (
	"fmt"
	"math/rand"
	"reflect"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/google/uuid"
	"github.com/menothe/shoptions/models"
	"github.com/menothe/shoptions/structs"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func generateListing(user *models.User) models.Listing {
	listingID := uuid.New()
	return models.Listing{
		ListingID:     listingID,
		Category:      fmt.Sprintf("category %d", rand.Intn(9999)),
		Title:         fmt.Sprintf("title %d", rand.Intn(9999)),
		Description:   fmt.Sprintf("description %d", rand.Intn(9999)),
		ProductImage:  fmt.Sprintf("product_image %d", rand.Intn(9999)),
		StartingPrice: rand.Float64() * float64(rand.Intn(999)),
		EndTime:       time.Now().Add(time.Hour * 24 * 5),
		Active:        true,
		UserID:        user.UserID,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}
}

func generateUser() *models.User {
	userID := uuid.New()
	return &models.User{
		UserID:       userID,
		FirstName:    fmt.Sprintf("first_name %d", rand.Intn(9999)),
		LastName:     fmt.Sprintf("last_name %d", rand.Intn(9999)),
		Username:     fmt.Sprintf("username %d", rand.Intn(9999)),
		Email:        fmt.Sprintf("email %d", rand.Intn(9999)),
		PasswordHash: fmt.Sprintf("password_hash %d", rand.Intn(9999)),
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}
}

func TestCreateListing(t *testing.T) {
	mockDb, mock, _ := sqlmock.New()
	dialector := postgres.New(postgres.Config{
		Conn:       mockDb,
		DriverName: "postgres",
	})
	db, _ := gorm.Open(dialector, &gorm.Config{})
	listingService := NewListingService(db)
	randomUser := generateUser()
	randomListing := generateListing(randomUser)

	listingRequestBody := structs.CreateListingRequestBody{
		Title:       randomListing.Title,
		Description: randomListing.Description,
		Price:       randomListing.StartingPrice,
		Category:    randomListing.Category,
		EndTime:     randomListing.EndTime,
	}

	mock.ExpectBegin()
	mock.ExpectExec("^INSERT INTO \"listings\" (.+)$").WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectCommit()

	createdListing, err := listingService.CreateListing(&listingRequestBody, *randomUser)
	if err != nil {
		t.Errorf("error creating listing %v", err)
	}

	// we make sure that all expectations were met
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}

	// Inside the existing test after the successful creation

	if err == nil {
		// Compare specific fields of createdListing with randomListing
		if !reflect.DeepEqual(createdListing.Title, randomListing.Title) {
			t.Errorf("Expected title %s, got %s", randomListing.Title, createdListing.Title)
		}
		if !reflect.DeepEqual(createdListing.Description, randomListing.Description) {
			t.Errorf("Expected description %s, got %s", randomListing.Description, createdListing.Description)
		}
		if !reflect.DeepEqual(createdListing.StartingPrice, randomListing.StartingPrice) {
			t.Errorf("Expected starting price %f, got %f", randomListing.StartingPrice, createdListing.StartingPrice)
		}
		if !reflect.DeepEqual(createdListing.Category, randomListing.Category) {
			t.Errorf("Expected category %f, got %f", randomListing.StartingPrice, createdListing.StartingPrice)
		}
		if !reflect.DeepEqual(createdListing.EndTime, randomListing.EndTime) {
			t.Errorf("Expected end time %f, got %f", randomListing.StartingPrice, createdListing.StartingPrice)
		}
	}

}

// MIGHT USE IN FUTURE
// func generateBid(listingID, userID uuid.UUID) []models.Bid {
// 	return []models.Bid{
// 		{
// 			BidID:     uuid.New(),
// 			Amount:    rand.Float64() * float64(rand.Intn(999)),
// 			ListingID: listingID,
// 			UserID:    userID,
// 		},
// 	}
// }

// rows := sqlmock.NewRows([]string{
// 	"listing_id",
// 	"category",
// 	"title",
// 	"description",
// 	"product_image",
// 	"starting_price",
// 	"end_time",
// 	"active",
// 	"user_id",
// 	"created_at",
// 	"updated_at",
// })
