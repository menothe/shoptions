package services

import (
	"errors"
	"sort"
	"time"

	"github.com/google/uuid"
	"github.com/menothe/shoptions/models"
	"gorm.io/gorm"
)

type BidService interface {
	CreateBid(float64, any) (*models.Bid, error)
	DetermineHighestBidder(uuid.UUID) (*uuid.UUID, error)
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
		BidID:     uuid.New(),
		Amount:    bidAmount,
		ListingID: listingID,
		UserID:    bidder.UserID,
	}

	//create the bid
	err := bs.DB.Create(&newBid).Error

	if err != nil {
		return nil, ErrFailedToCreateBid
	}

	//increment the bid count for the listing this bid is for
	var listing models.Listing
	result := bs.DB.First(&listing, "listing_id = ?", listingID)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return nil, ErrRecordNotFound
	}
	*listing.BidCount += 1
	listing.UpdatedAt = time.Now()
	result = bs.DB.Save(&listing)

	if result.Error != nil {
		return nil, ErrFailedUpdateListing
	}
	return &newBid, nil
}

func (bs *BidServiceImpl) DetermineHighestBidder(listingID uuid.UUID) (*uuid.UUID, error) {
	//get all bids for this listing
	var bids []models.Bid
	result := bs.DB.Where("listing_id = ?", listingID).Find(&bids)

	if result.Error != nil {
		return nil, ErrFailedToFetchBidsForListing
	}
	if len(bids) > 0 {
		//sort all the bids in decreasing order
		// Sort the bids slice in decreasing order of price
		sort.Sort(ByPriceDesc(bids))

		highestBid := bids[0] //grab the first one
		userID := highestBid.UserID
		return (*uuid.UUID)(&userID), nil //return the userid off it
	}
	return nil, nil

}

// ByPriceDesc implements sort.Interface based on the Price field in descending order.
type ByPriceDesc []models.Bid

func (a ByPriceDesc) Len() int           { return len(a) }
func (a ByPriceDesc) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
func (a ByPriceDesc) Less(i, j int) bool { return a[i].Amount > a[j].Amount } // Note the '>' for descending order

// ERRORS
var (
	ErrFailedToCreateBid           = errors.New("unable to create a new bid")
	ErrFailedToFetchBidsForListing = errors.New("unable to locate bids for provided listing")
)
