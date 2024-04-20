package database

import (
	"database/sql"
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func NewDatabase() (*sql.DB, error) {
	dsn := "host=localhost user=postgres password=shoptions dbname=shoptions port=5432 sslmode=disable TimeZone=America/Los_Angeles"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		fmt.Println("Failed to initialize database session:", err)
		return nil, err
	}

	sqlDB, err := db.DB()

	if err != nil {
		fmt.Println("Failed to connect to database:", err)
		return nil, err
	}
	defer sqlDB.Close()

	return sqlDB, nil
}
