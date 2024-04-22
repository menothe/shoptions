package database

import (
	"errors"
	"fmt"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func NewDatabase() (*gorm.DB, error) {
	// Get the value of an environment variable
	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		return nil, errors.New("unable to establish database connetion; DB_HOST not set")
	}
	db, err := gorm.Open(postgres.Open(dbHost), &gorm.Config{})

	if err != nil {
		fmt.Println("Failed to initialize database session:", err)
		return nil, err
	}

	return db, nil
}
