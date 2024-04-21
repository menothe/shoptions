package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/menothe/shoptions/server"
)

func main() {
	router := gin.Default()

	server := server.NewServer(router)
	server.RunMigrations()
	server.SetupRoutes()

	fmt.Println("Server listening at port 8080")
}
