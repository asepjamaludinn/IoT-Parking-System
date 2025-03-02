package database

import (
	"context"
	"fmt"
	"log"

	"github.com/redis/go-redis/v9"
)

var RedisClient *redis.Client
var Ctx = context.Background()

// Inisialisasi koneksi ke Redis
func InitRedis() {
	RedisClient = redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})

	// Cek koneksi Redis
	_, err := RedisClient.Ping(Ctx).Result()
	if err != nil {
		log.Fatalf("❌ Gagal terhubung ke Redis: %v", err)
	} else {
		fmt.Println("✅ Redis terhubung!")
	}
}
