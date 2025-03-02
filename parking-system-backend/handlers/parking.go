package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"parking-system-backend/database"
	"time"

	"github.com/gin-gonic/gin"
)

// Struktur JSON untuk request
type ParkingRequest struct {
	Status    string `json:"status"`
	VehicleID string `json:"vehicle_id"`
}

// Struktur JSON untuk response history
type ParkingHistory struct {
	Time      string `json:"time"`
	VehicleID string `json:"vehicle_id"`
	Status    string `json:"status"`
}

// ✅ GET /status → Ambil status parkir terbaru
func GetParkingStatus(c *gin.Context) {
	status, err := database.RedisClient.Get(database.Ctx, "parking_status").Result()
	if err != nil {
		fmt.Println("❌ Error Redis (GetParkingStatus):", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mendapatkan status parkir", "details": err.Error()})
		return
	}

	// Ambil riwayat terakhir dari Redis
	history, err := database.RedisClient.LRange(database.Ctx, "parking_history", 0, 0).Result()
	if err != nil || len(history) == 0 {
		c.JSON(http.StatusOK, gin.H{
			"status":     status,
			"time":       "N/A",
			"vehicle_id": "N/A",
		})
		return
	}

	// Parsing history terakhir
	lastEntry := parseHistoryEntry(history[0])

	// Response JSON
	c.JSON(http.StatusOK, gin.H{
		"status":     status,
		"time":       lastEntry.Time,
		"vehicle_id": lastEntry.VehicleID,
	})
}

// ✅ GET /history → Ambil seluruh riwayat parkir
func GetParkingHistory(c *gin.Context) {
	history, err := database.RedisClient.LRange(database.Ctx, "parking_history", 0, -1).Result()
	if err != nil {
		fmt.Println("❌ Error Redis (GetParkingHistory):", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil riwayat parkir", "details": err.Error()})
		return
	}

	if len(history) == 0 {
		c.JSON(http.StatusOK, gin.H{"message": "Riwayat parkir kosong"})
		return
	}

	// Ubah history ke format JSON
	var formattedHistory []ParkingHistory
	for _, entry := range history {
		formattedHistory = append(formattedHistory, parseHistoryEntry(entry))
	}

	c.JSON(http.StatusOK, gin.H{"history": formattedHistory})
}

// ✅ POST /update → Update status parkir & simpan ke history
func UpdateParkingStatus(c *gin.Context) {
	var requestData ParkingRequest

	if err := c.ShouldBindJSON(&requestData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format JSON salah"})
		return
	}

	// Simpan status terbaru ke Redis
	err := database.RedisClient.Set(database.Ctx, "parking_status", requestData.Status, 0).Err()
	if err != nil {
		fmt.Println("❌ Error Redis (UpdateParkingStatus - Status):", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memperbarui status", "details": err.Error()})
		return
	}

	// Simpan history sebagai JSON di Redis
	historyEntry := ParkingHistory{
		Time:      time.Now().Format("2006-01-02 15:04:05"),
		VehicleID: requestData.VehicleID,
		Status:    requestData.Status,
	}
	historyJSON, _ := json.Marshal(historyEntry)

	// Simpan ke Redis (gunakan LPUSH agar data baru ada di depan)
	err = database.RedisClient.LPush(database.Ctx, "parking_history", historyJSON).Err()
	if err != nil {
		fmt.Println("❌ Error Redis (UpdateParkingStatus - History):", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan riwayat", "details": err.Error()})
		return
	}

	// Response sukses
	c.JSON(http.StatusOK, gin.H{"message": "Status parkir diperbarui!"})
}

// ✅ Fungsi bantu untuk parsing history dari Redis
func parseHistoryEntry(entry string) ParkingHistory {
	var data ParkingHistory
	err := json.Unmarshal([]byte(entry), &data)
	if err != nil {
		fmt.Println("⚠️ Gagal parsing history entry:", err)
		return ParkingHistory{"Unknown", "Unknown", "Unknown"}
	}
	return data
}
