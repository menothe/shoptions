package server

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
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
	var requestBody struct {
		Title       string    `json:"title"`
		Description string    `json:"description"`
		Price       float64   `json:"starting_price"`
		Category    string    `json:"category"`
		EndTime     time.Time `json:"end_time"`
	}

	if err := c.BindJSON(&requestBody); err != nil {
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

	// cast to a User type
	seller := user.(User)

	newListing := Listing{
		ListingID:     uuid.New(),
		Category:      requestBody.Category,
		Title:         requestBody.Title,
		Description:   requestBody.Description,
		StartingPrice: requestBody.Price,
		EndTime:       requestBody.EndTime,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
		UserID:        seller.UserID,
	}

	result := s.DB.Create(&newListing)

	if result.Error != nil {
		println("create listing error: ", result.Error.Error())
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to create listing",
		})
		return
	}

	// respond
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
	})
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
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
	})
}

func (s *Server) login(c *gin.Context) {
	// Get the email and pass off the request body
	var credentials struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.BindJSON(&credentials); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to read request body",
		})
		return
	}

	// Look up the requested user
	var user User
	s.DB.First(&user, "email = ?", credentials.Email)

	if len(user.UserID) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid email or password",
		})
		return
	}

	// Compare sent in password with saved user password hash
	err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(credentials.Password))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid email or password",
		})
		return
	}

	// Generate a jwt token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.UserID,
		"exp": time.Now().Add(time.Hour * 24 * 30).Unix(),
	})

	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := token.SignedString([]byte(os.Getenv("SECRET")))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to create token",
		})
		return
	}

	//set in local storage or cookie, we set in cookie
	c.SetSameSite(http.SameSiteNoneMode)
	c.SetCookie("Authorization", tokenString, 3600*24*30, "/", "localhost", true, true)

	// send it back
	c.JSON(http.StatusOK, gin.H{})

}

func (s *Server) logout(c *gin.Context) {
	// Clear the JWT cookie by setting it to an empty value and setting its expiration to a past time
	c.SetCookie("Authorization", "", -1, "", "", false, true)

	// Respond with a success message
	c.JSON(http.StatusOK, gin.H{"message": "User logged out successfully"})
}

func (s *Server) validate(c *gin.Context) {
	user, _ := c.Get("user")

	c.JSON(http.StatusOK, gin.H{
		"message": user,
	})
}
