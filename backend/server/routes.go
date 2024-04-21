package server

import (
	"log"
	"reflect"
)

// utility & helper methods on the server class
func (s *Server) SetupRoutes() {
	s.Router.GET("/listings", s.getListings)
	s.Router.POST("/listing", s.createListing)
	s.Router.POST("/user", s.createUser)

	s.Router.Run("localhost:8080")
}

// database migrations
func (s *Server) RunMigrations() {
	err := s.DB.AutoMigrate(&User{})
	HandleMigrationError(err, User{})

	err = s.DB.AutoMigrate(&Listing{})
	HandleMigrationError(err, Listing{})

	err = s.DB.AutoMigrate(&Bid{})
	HandleMigrationError(err, Bid{})
}

func HandleMigrationError(err error, modelType any) {
	if err != nil {
		log.Fatalf("unable to run database migrations for table: %s", reflect.TypeOf(modelType))
	}
}
