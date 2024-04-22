package main

import (
	"fmt"

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

	server := server.NewServer(router)
	server.RunMigrations()
	server.SetupRoutes()

	fmt.Println("Server listening at port 8080")
}
