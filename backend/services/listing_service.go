package services

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/menothe/shoptions/models"
	"github.com/menothe/shoptions/structs"
	"gorm.io/gorm"
)

type ListingService interface {
	CreateListing(*structs.CreateListingRequestBody, any) (*models.Listing, error)
	GetAllListings() ([]models.Listing, error)
}

type ListingServiceImpl struct {
	DB *gorm.DB
}

func NewListingService(db *gorm.DB) *ListingServiceImpl {
	return &ListingServiceImpl{db}
}

func (ls *ListingServiceImpl) CreateListing(listingRequest *structs.CreateListingRequestBody, user any) (*models.Listing, error) {
	// cast the user to a User type
	seller := user.(models.User)

	// create the listing
	newListing := models.Listing{
		ListingID:     uuid.New(),
		Category:      listingRequest.Category,
		Title:         listingRequest.Title,
		Description:   listingRequest.Description,
		StartingPrice: listingRequest.Price,
		EndTime:       listingRequest.EndTime,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
		UserID:        seller.UserID,
	}

	err := ls.DB.Create(&newListing).Error

	if err != nil {
		return nil, ErrFailedToCreateListing
	}
	return &newListing, nil
}

func (ls *ListingServiceImpl) GetAllListings() ([]models.Listing, error) {
	var listings []models.Listing

	rows := ls.DB.Find(&listings)

	if rows.Error != nil {
		return listings, ErrFailedToFetchAllListings
	}
	return listings, nil
}

// ERRORS

var (
	ErrFailedToCreateListing    = errors.New("unable to create new listing")
	ErrFailedToFetchAllListings = errors.New("unable to return all listings")
)
