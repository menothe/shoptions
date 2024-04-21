package server

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/menothe/shoptions/database"
)

func NewServer(router *gin.Engine) *Server {
	db, err := database.NewDatabase()

	if err != nil {
		log.Fatalf("failed to initialize database connection: %s", err)
	}
	return &Server{
		Router: router,
		DB:     db,
	}
}

// Users

func (s *Server) createUser(c *gin.Context) {
	var newUser User

	if err := c.BindJSON(&newUser); err != nil {
		return
	}

	result := s.DB.Create(&newUser)

	if result.Error != nil {
		fmt.Println(result.Error)
		c.IndentedJSON(http.StatusInternalServerError, newUser)
		return
	}
	c.IndentedJSON(http.StatusCreated, newUser)
}

// Listings

func (s *Server) getListings(c *gin.Context) {
	var listings []Listing

	rows := s.DB.Find(&listings)

	if rows.Error != nil {
		c.IndentedJSON(http.StatusInternalServerError, listings)
		return
	}

	c.IndentedJSON(http.StatusOK, listings)
}

func (s *Server) createListing(c *gin.Context) {
	var newListing Listing

	if err := c.BindJSON(&newListing); err != nil {
		return
	}

	result := s.DB.Create(&newListing)

	if result.Error != nil {
		fmt.Println(result.Error)
		c.IndentedJSON(http.StatusInternalServerError, newListing)
		return
	}
	c.IndentedJSON(http.StatusCreated, newListing)
}
