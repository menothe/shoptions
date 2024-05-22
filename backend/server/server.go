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
	BidHandler *handlers.BidHandler
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
	bidHandler := handlers.NewBidHandler(db)
	return &Server{userHandler, listingHandler, bidHandler, router}
}

// utility & helper methods on the server class
func (server *Server) SetupRoutes() {
	apiGroup := server.Router.Group("/api")

	//users
	userGroup := apiGroup.Group("/users")
	userGroup.Use(func(c *gin.Context) {
		// Skip authentication for login and signup
		if c.Request.URL.Path == "/api/users/login" || c.Request.URL.Path == "api/users/signup" {
			c.Next()
			return
		}
		server.UserHandler.RequireAuth(c)
	})
	userGroup.POST("/signup", server.UserHandler.SignUp)
	userGroup.POST("/login", server.UserHandler.Login)
	userGroup.POST("/logout", server.UserHandler.Logout)

	//listings
	listingGroup := apiGroup.Group("/listings")
	listingGroup.Use(func(c *gin.Context) {
		//Skip authentication for getting all listings
		if c.Request.URL.Path == "/api/listings/all" || c.Request.URL.Path == "/api/listings/by_query" {
			c.Next()
			return
		}
		server.UserHandler.RequireAuth(c)
	})
	listingGroup.POST("/create", server.ListingHandler.CreateListing)
	listingGroup.PUT("/update/:id", server.ListingHandler.UpdateListing)
	listingGroup.GET("/all", server.ListingHandler.GetAllListings)
	listingGroup.GET("/by_user", server.ListingHandler.GetUsersListings)
	listingGroup.POST("by_query", server.ListingHandler.SearchByQuery)

	//bids
	bidGroup := apiGroup.Group("/bids")
	bidGroup.Use(func(c *gin.Context) {
		//Skip authentication for getting all listings
		if c.Request.URL.Path == "/api/bids/highest_bidder" {
			c.Next()
			return
		}
		server.UserHandler.RequireAuth(c)
	})
	bidGroup.POST("/create", server.BidHandler.CreateBid)
	bidGroup.GET("/highest_bidder/:id", server.BidHandler.GetHighestBidder)

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
