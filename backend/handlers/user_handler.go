package handlers

import (
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"github.com/menothe/shoptions/services"
	"github.com/menothe/shoptions/structs"
	"gorm.io/gorm"
)

type UserHandler struct {
	UserServiceImpl *services.UserServiceImpl
}

func NewUserHandler(db *gorm.DB) *UserHandler {
	userService := services.NewUserService(db)
	return &UserHandler{userService}
}

func (uh *UserHandler) SignUp(c *gin.Context) {
	// get email/password off request body
	request := structs.UserSignupRequestBody{}

	if err := c.BindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to read request body",
		})
		return
	}

	id, err := uh.UserServiceImpl.CreateUser(&request)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to create user",
		})
		return
	}

	// create cookie for future requests from the client side
	createCookie(c, id)

	// respond
	c.JSON(http.StatusOK, gin.H{})
}

func (uh *UserHandler) Login(c *gin.Context) {
	request := structs.UserLoginCredentials{}

	if err := c.BindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "failed to read request body",
		})
		return
	}
	id, err := uh.UserServiceImpl.LoginUser(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid email or password",
		})
		return
	}

	createCookie(c, *id)

	c.JSON(http.StatusOK, gin.H{})
}

func (uh *UserHandler) Logout(c *gin.Context) {
	// Clear the JWT cookie by setting it to an empty value and setting its expiration to a past time
	c.SetCookie("Authorization", "", -1, "", "", false, true)

	// Respond with a success message
	c.JSON(http.StatusOK, gin.H{"message": "User logged out successfully"})
}

// middleware for authenticating incoming requests (after user login)
func (uh *UserHandler) RequireAuth(c *gin.Context) {
	// Get cookie off request
	tokenString, err := c.Cookie("Authorization")

	if err != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	user, err := uh.UserServiceImpl.AuthenticateUser(tokenString)

	if err != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	// Attach the user to the request
	c.Set("user", *user)

	// Continue to the next handler
	c.Next()
}

// helper method for cookie creation
func createCookie(c *gin.Context, userID uuid.UUID) {
	// Generate a jwt token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": userID,
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
}
