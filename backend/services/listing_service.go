package services

import (
	"errors"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/menothe/shoptions/models"
	"github.com/menothe/shoptions/structs"
	"gorm.io/gorm"
)

type ListingService interface {
	CreateListing(*structs.CreateListingRequestBody, any) (*models.Listing, error)
	GetAllListings() ([]models.Listing, error)
	GetUsersListings(uuid.UUID)
	UpdateListing(*structs.UpdateListingRequestBody, uuid.UUID) error
	DeleteListing(uuid.UUID) error
	SearchListingsByQuery(string) (*models.Listing, error)
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
		Duration:      listingRequest.Duration,
		EndTime:       listingRequest.EndTime,
		ProductImage:  listingRequest.ProductImage,
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

func (ls *ListingServiceImpl) UpdateListing(updateRequest *structs.UpdateListingRequestBody, listingID uuid.UUID) error {
	var listing models.Listing
	result := ls.DB.First(&listing, "listing_id = ?", listingID)

	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return ErrRecordNotFound
	}

	listing.Category = updateRequest.Category
	listing.Title = updateRequest.Title
	listing.Description = updateRequest.Description
	listing.ProductImage = updateRequest.ProductImage
	listing.StartingPrice = updateRequest.StartingPrice
	listing.EndTime = updateRequest.EndTime
	listing.Active = updateRequest.Active
	listing.Duration = updateRequest.Duration
	listing.UpdatedAt = time.Now()

	result = ls.DB.Save(&listing)

	if result.Error != nil {
		return ErrFailedUpdateListing
	}

	return nil
}

func (ls *ListingServiceImpl) DeleteListing(listingID uuid.UUID) error {
	var listing models.Listing
	result := ls.DB.First(&listing, "listing_id = ?", listingID)

	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return ErrRecordNotFound
	}

	result = ls.DB.Delete(&listing)

	if result.Error != nil {
		return ErrFailedUpdateListing
	}

	return nil
}

func (ls *ListingServiceImpl) GetUsersListings(userID uuid.UUID) ([]models.Listing, error) {
	var listings []models.Listing

	result := ls.DB.Where("user_id = ?", userID).Find(&listings)

	if result.Error != nil {
		return []models.Listing{}, ErrFailedToFetchUsersListings
	}

	return listings, nil
}

func (ls *ListingServiceImpl) SearchListingsByQuery(query string) ([]models.Listing, error) {
	var listings []models.Listing

	lowercased := "%" + strings.ToLower(query) + "%"

	result := ls.DB.Raw("SELECT * FROM listings WHERE LOWER(title) LIKE ? OR LOWER(description) LIKE ?", lowercased, lowercased).Scan(&listings)

	if result.Error != nil {
		return []models.Listing{}, ErrFailedToFetchUsersListings
	}

	return listings, nil
}



// ERRORS

var (
	ErrFailedToCreateListing      = errors.New("unable to create new listing")
	ErrFailedToFetchAllListings   = errors.New("unable to return all listings")
	ErrRecordNotFound             = errors.New("record does not exist")
	ErrFailedUpdateListing        = errors.New("failure updating listing")
	ErrFailedDeleteListing        = errors.New("failed to delete listing")
	ErrFailedToFetchUsersListings = errors.New("unable to fetch users listings")
)
