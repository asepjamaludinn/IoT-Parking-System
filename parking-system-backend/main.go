package main

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/rs/cors"

	"parking-system-backend/database"
	"parking-system-backend/routes"
)

func main() {
	// Inisialisasi Redis
	database.InitRedis()

	// Router menggunakan Gin
	router := gin.Default()

	// Middleware CORS
	corsHandler := cors.Default()
	router.Use(func(c *gin.Context) {
		corsHandler.HandlerFunc(c.Writer, c.Request)
		c.Next()
	})

	// Inisialisasi rute
	routes.SetupRoutes(router)

	// Jalankan server
	port := "0.0.0.0:8080"
	fmt.Println("🚀 Server berjalan di http://localhost:8080")
	if err := router.Run(port); err != nil {
		log.Fatal("Gagal menjalankan server:", err)
	}
}
