package main

import (
	"fmt"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/menothe/shoptions/server"
)

func main() {
	// Load environment variables from .env file
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file:", err)
		return
	}
	router := gin.Default()
	router.Use(cors.Default())

	ApplicationServer := server.NewServer(router)
	ApplicationServer.RunMigrations()
	ApplicationServer.SetupRoutes()

	fmt.Println("Server listening at port 8080")
}
