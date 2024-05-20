package services

import (
	"errors"

	"github.com/google/uuid"
	"github.com/menothe/shoptions/models"
	"gorm.io/gorm"
)

type BidService interface {
	CreateBid(float64, any) (*models.Bid, error)
}

type BidServiceImpl struct {
	DB *gorm.DB
}

func NewBidService(db *gorm.DB) *BidServiceImpl {
	return &BidServiceImpl{db}
}

func (bs *BidServiceImpl) CreateBid(bidAmount float64, listingID uuid.UUID, user any) (*models.Bid, error) {
	bidder := user.(models.User)

	newBid := models.Bid{
		BidID: uuid.New(),
		Amount: bidAmount,
		ListingID: listingID,
		UserID: bidder.UserID,
	}

	err := bs.DB.Create(&newBid).Error

	if err != nil {
		return nil, ErrFailedToCreateBid
	}
	return &newBid, nil
}

//ERRORS
var (
	ErrFailedToCreateBid = errors.New("unable to create a new bid")
)