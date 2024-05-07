package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/menothe/shoptions/services"
	"github.com/menothe/shoptions/structs"
	"gorm.io/gorm"
)

type ListingHandler struct {
	ListingServiceImpl *services.ListingServiceImpl
}

func NewListingHandler(db *gorm.DB) *ListingHandler {
	listingService := services.NewListingService(db)
	return &ListingHandler{listingService}
}

func (lh *ListingHandler) CreateListing(c *gin.Context) {
	request := structs.CreateListingRequestBody{}
	if err := c.BindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to read request body",
		})
		return
	}
	// grab id of user who created the listing off the context
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "user must be logged in to create listing",
		})
		return
	}
	newListing, err := lh.ListingServiceImpl.CreateListing(&request, user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to create listing",
		})
		return
	}
	c.IndentedJSON(http.StatusOK, newListing)
}

func (lh *ListingHandler) GetAllListings(c *gin.Context) {
	listings, err := lh.ListingServiceImpl.GetAllListings()

	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, listings)
		return
	}

	c.IndentedJSON(http.StatusOK, listings)
}
