package server

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/menothe/shoptions/database"
	"golang.org/x/crypto/bcrypt"
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

func (s *Server) signup(c *gin.Context) {
	// get email/password off request body

	var body struct {
		Email     string `json:"email"`
		Password  string `json:"password"`
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
		Username  string `json:"username"`
	}

	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to read request body",
		})
		return
	}

	fmt.Println("hello there, this is the body: ", body)
	// hash the password
	hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), 10)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to return hashed password",
		})
		return
	}

	// create the user
	newUser := User{
		UserID:       uuid.New(),
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
		Email:        body.Email,
		PasswordHash: string(hash),
		Username:     body.Username,
		FirstName:    body.FirstName,
		LastName:     body.LastName,
	}

	result := s.DB.Create(&newUser)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to create user",
		})
		return
	}

	// respond
	c.JSON(http.StatusOK, gin.H{})
}
