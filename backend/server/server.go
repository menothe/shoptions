package server

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/menothe/shoptions/database"
)

type Server struct {
	router *gin.Engine
	db     *sql.DB
}

type Listing struct {
	Category     string    `json:"category"`
	SellerID     uuid.UUID `json:"sellerId"`
	Title        string    `json:"title"`
	ProductImage string    `json:"productImage"`
}

func NewServer(router *gin.Engine) *Server {
	db, err := database.NewDatabase()

	if err != nil {
		log.Fatalf("failed to initialize database connection: %s", err)
	}
	return &Server{
		router,
		db,
	}
}

func (s *Server) SetupRoutes() {
	s.router.GET("/listings", getListings)
	s.router.POST("/listing", createListing)

	s.router.Run("localhost:8080")
}

func getListings(c *gin.Context) {
	var listings []Listing

	if err := c.BindJSON(&listings); err != nil {
		return
	}

	c.IndentedJSON(http.StatusOK, listings)
}

func createListing(c *gin.Context) {
	var newListing Listing

	// Call BindJSON to bind the received JSON to
	// newAlbum.
	if err := c.BindJSON(&newListing); err != nil {
		return
	}

	// Add the new album to the slice.
	listings = append(listings, newListing)
	c.IndentedJSON(http.StatusCreated, newListing)
}

// albums slice to seed record album data.
var listings = []Listing{}
