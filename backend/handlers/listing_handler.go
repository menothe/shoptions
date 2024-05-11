package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/menothe/shoptions/services"
	"github.com/menothe/shoptions/structs"
	"gorm.io/gorm"
)

type ListingHandlerBehavior interface {
	CreateListing(*gin.Context)
	GetAllListings(*gin.Context)
	UpdateListing(*gin.Context)
	DeleteListing(*gin.Context)
}

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
	user := checkUserExists(c)

	newListing, err := lh.ListingServiceImpl.CreateListing(&request, user)
	checkForError(c, err)

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

func (lh *ListingHandler) UpdateListing(c *gin.Context) {
	request := structs.UpdateListingRequestBody{}

	id := c.Param("id")
	listingID, err := uuid.Parse(id)
	checkForError(c, err)

	if err := c.BindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to read request body",
		})
		return
	}

	checkUserExists(c)

	err = lh.ListingServiceImpl.UpdateListing(&request, listingID)
	checkForError(c, err)

	c.JSON(http.StatusOK, gin.H{})

}

func (lh *ListingHandler) DeleteListing(c *gin.Context) {
	id := c.Param("id")
	listingID, err := uuid.Parse(id)
	checkForError(c, err)

	checkUserExists(c)

	err = lh.ListingServiceImpl.DeleteListing(listingID)
	checkForError(c, err)

	c.JSON(http.StatusAccepted, gin.H{})

}

func checkUserExists(c *gin.Context) any {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "user must be logged in to perform this action",
		})
		return nil
	}
	return user
}

func checkForError(c *gin.Context, err error) {
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to complete request",
		})
		return
	}
}
