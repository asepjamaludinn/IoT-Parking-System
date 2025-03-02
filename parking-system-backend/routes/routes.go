package routes

import (
	"parking-system-backend/handlers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	// Endpoint utama untuk tes server
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Server Golang Berjalan!"})
	})

	// Endpoint untuk status parkir
	router.GET("/status", handlers.GetParkingStatus)
	router.POST("/update", handlers.UpdateParkingStatus)
	router.GET("/history", handlers.GetParkingHistory)
}
