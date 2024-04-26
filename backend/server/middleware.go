package server

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

func (s *Server) requireAuth(c *gin.Context) {
	// Get cookie off request
	log.Println("i made it this far 1")
	tokenString, err := c.Cookie("Authorization")

	if err != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
	}
	log.Println("i made it this far 2")

	// Decode/validate it

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(os.Getenv("SECRET")), nil
	})
	log.Println("i made it this far 3")
	if err != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
	}

	log.Println("i made it this far 4")
	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		// Check the exp
		log.Println("i made it this far 10")
		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			c.AbortWithStatus(http.StatusUnauthorized)
		}

		log.Println("i made it this far 6")
		// Find the user with token sub
		var user User
		s.DB.First(&user, "user_id = ?", claims["sub"])

		log.Println("i made it this far 7")
		if len(user.UserID) == 0 {
			c.AbortWithStatus(http.StatusUnauthorized)
		}
		log.Println("i made it this far 8")

		// Attach to req
		c.Set("user", user)

		log.Println("i made it this far 9")

		// Continue
		c.Next()

	} else {
		log.Println("i made it this far 5")
		c.AbortWithStatus(http.StatusUnauthorized)
	}
}
