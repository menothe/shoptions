package server

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// models
type Server struct {
	Router *gin.Engine
	DB     *gorm.DB
}

type Listing struct {
	gorm.Model
	Category     string    `json:"category"`
	SellerID     uuid.UUID `json:"sellerId"`
	Title        string    `json:"title"`
	ProductImage string    `json:"productImage"`
}

// methods
func (s *Server) SetupRoutes() {
	s.Router.GET("/listings", s.getListings)
	s.Router.POST("/listing", s.createListing)

	s.Router.Run("localhost:8080")
}

func (s *Server) RunMigrations() {
	err := s.DB.AutoMigrate(&Listing{})
	if err != nil {
		log.Fatal("unable to run database migrations")
	}
}
