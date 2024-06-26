package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/menothe/shoptions/services"
	"gorm.io/gorm"
)

type BidHandlerBehavior interface {
	CreateBid(* gin.Context)
	GetHighestBidder(* gin.Context)
}

type BidHandler struct {
	BidServiceImpl *services.BidServiceImpl
}

func NewBidHandler(db *gorm.DB) *BidHandler {
	bidService := services.NewBidService(db)
	return &BidHandler{bidService}
}

func (bh *BidHandler) CreateBid(c *gin.Context) {
	request := struct{
		Amount float64 `json:"bid_amount"`
		ListingID uuid.UUID `json:"listing_id"`
	}{}
	if err := c.BindJSON(&request); err != nil {
		println("first err block")
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to read request body",
		})
		return
	}
	// grab id of user who placed the bid off the context
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "user must be logged in to perform this action",
		})
		return
	}

	newBid, err := bh.BidServiceImpl.CreateBid(request.Amount, request.ListingID, user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to create bid",
		})
		return
	}

	c.IndentedJSON(http.StatusOK, newBid)
}

func (bh *BidHandler) GetHighestBidder(c * gin.Context) {
	id := c.Param("id")
	listingID, err := uuid.Parse(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to update listing",
		})
		return
	}
	_, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "user must be logged in to perform this action",
		})
		return
	}
	userID, err := bh.BidServiceImpl.DetermineHighestBidder(listingID)

	if userID == nil {
		c.JSON(http.StatusOK, gin.H{})
		return
	}

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to determine highest bidder",
		})
		return
	}
	highestBidder := struct{
		UserID uuid.UUID `json:"user_id"`
	}{
		UserID: *userID,
	}
	c.IndentedJSON(http.StatusOK, highestBidder)

}