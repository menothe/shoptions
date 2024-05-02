package server

import (
	"log"
	"reflect"

	"github.com/gin-gonic/gin"
	"github.com/menothe/shoptions/database"
	"github.com/menothe/shoptions/handlers"
	"github.com/menothe/shoptions/models"
	"gorm.io/gorm"
)

type Server struct {
	UserHandler    *handlers.UserHandler
	ListingHandler *handlers.ListingHandler
	Router         *gin.Engine
}

func NewServer(router *gin.Engine) *Server {
	db, err := database.NewDatabase()

	defer RunMigrations(db)

	if err != nil {
		log.Fatalf("failed to initialize database connection: %s", err)
	}
	userHandler := handlers.NewUserHandler(db)
	listingHandler := handlers.NewListingHandler(db)
	return &Server{userHandler, listingHandler, router}
}

// utility & helper methods on the server class
func (server *Server) SetupRoutes() {
	server.Router.POST("/signup", server.UserHandler.SignUp)
	server.Router.POST("/login", server.UserHandler.Login)
	server.Router.POST("/logout", server.UserHandler.RequireAuth, server.UserHandler.Logout)
	server.Router.GET("/validate", server.UserHandler.RequireAuth, server.UserHandler.Validate)
	server.Router.POST("/listing", server.UserHandler.RequireAuth, server.ListingHandler.CreateListing)
	server.Router.GET("/listings", server.UserHandler.RequireAuth, server.ListingHandler.GetAllListings)

	server.Router.Run("localhost:8080")
}

// database migrations
func RunMigrations(db *gorm.DB) {
	err := db.AutoMigrate(&models.User{})
	HandleMigrationError(err, models.User{})

	err = db.AutoMigrate(&models.Listing{})
	HandleMigrationError(err, models.Listing{})

	err = db.AutoMigrate(&models.Bid{})
	HandleMigrationError(err, models.Bid{})
}

func HandleMigrationError(err error, modelType any) {
	if err != nil {
		log.Fatalf("unable to run database migrations for table: %s", reflect.TypeOf(modelType))
	}
}
