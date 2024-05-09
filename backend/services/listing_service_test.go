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

func TestCreateListing(t *testing.T) {
	listingService, mock := setupDatabaseAndListingService(t)
	randomUser := generateUser()
	randomListing := generateListing(randomUser)

	listingRequestBody := structs.CreateListingRequestBody{
		Title:        randomListing.Title,
		ProductImage: randomListing.ProductImage,
		Description:  randomListing.Description,
		Price:        randomListing.StartingPrice,
		Category:     randomListing.Category,
		EndTime:      randomListing.EndTime,
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

	listingAssertions(t, *createdListing, randomListing)
}

func TestGetAllListings(t *testing.T) {
	listingService, mock := setupDatabaseAndListingService(t)
	randomUser := generateUser()
	randomListing1 := generateListing(randomUser)
	randomListing2 := generateListing(randomUser)

	rows := sqlmock.NewRows([]string{
		"listing_id",
		"category",
		"title",
		"description",
		"product_image",
		"starting_price",
		"end_time",
		"active",
		"user_id",
		"created_at",
		"updated_at",
	}).AddRow(
		randomListing1.ListingID, randomListing1.Category, randomListing1.Title, randomListing1.Description,
		randomListing1.ProductImage, randomListing1.StartingPrice, randomListing1.EndTime, randomListing1.Active,
		randomListing1.UserID, randomListing1.CreatedAt, randomListing1.UpdatedAt,
	).AddRow(
		randomListing2.ListingID, randomListing2.Category, randomListing2.Title, randomListing2.Description,
		randomListing2.ProductImage, randomListing2.StartingPrice, randomListing2.EndTime, randomListing2.Active,
		randomListing2.UserID, randomListing2.CreatedAt, randomListing2.UpdatedAt,
	)

	mock.ExpectQuery("^SELECT (.+) FROM \"listings\"$").WillReturnRows(rows)

	listings, err := listingService.GetAllListings()

	if err != nil || len(listings) != 2 {
		t.Errorf("error fetching all listings %v", err)
	}
	listing1 := listings[0]
	listing2 := listings[1]

	listingAssertions(t, listing1, randomListing1)
	listingAssertions(t, listing2, randomListing2)

}

// HELPER METHODS
func setupDatabaseAndListingService(t *testing.T) (*ListingServiceImpl, sqlmock.Sqlmock) {
	mockDb, mock, err := sqlmock.New()
	if err != nil {
		t.Errorf("unable to initialize mock database: %s", err)
	}
	dialector := postgres.New(postgres.Config{
		Conn:       mockDb,
		DriverName: "postgres",
	})
	db, _ := gorm.Open(dialector, &gorm.Config{})
	listingService := NewListingService(db)
	return listingService, mock
}

func listingAssertions(t *testing.T, actual, expected models.Listing) {
	if !reflect.DeepEqual(actual.Category, expected.Category) {
		t.Errorf("Expected category %s, got %s", expected.Category, actual.Category)
	}
	if !reflect.DeepEqual(actual.Title, expected.Title) {
		t.Errorf("Expected title %s, got %s", expected.Title, actual.Title)
	}
	if !reflect.DeepEqual(actual.Description, expected.Description) {
		t.Errorf("Expected description %s, got %s", expected.Description, actual.Description)
	}
	if !reflect.DeepEqual(actual.ProductImage, expected.ProductImage) {
		t.Errorf("Expected product image %s, got %s", expected.ProductImage, actual.ProductImage)
	}
	if !reflect.DeepEqual(actual.StartingPrice, expected.StartingPrice) {
		t.Errorf("Expected starting price %f, got %f", expected.StartingPrice, actual.StartingPrice)
	}
	if !reflect.DeepEqual(actual.EndTime, expected.EndTime) {
		t.Errorf("Expected end time %v, got %v", expected.EndTime, actual.EndTime)
	}
	if !reflect.DeepEqual(actual.Active, expected.Active) {
		t.Errorf("Expected active %v, got %v", expected.Active, actual.Active)
	}
	if !reflect.DeepEqual(actual.UserID, expected.UserID) {
		t.Errorf("Expected user id %s, got %s", expected.UserID, actual.UserID)
	}
}

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
