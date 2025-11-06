package redis

import (
	"os"

	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
	log "github.com/sirupsen/logrus"
)

func RedisClient() *redis.Client {
	err := godotenv.Load("/home/aaron-timony/projects/real_projects/jp_subs_api/.env")
	if err != nil {
		log.Error("Failed to load env", err)
	}

	redis_pass := os.Getenv("REDIS_PASSWORD")
	client := redis.NewClient(&redis.Options{
		Addr:     "localhost:6380",
		Password: redis_pass,
		DB:       0,
		Protocol: 2,
	})

	return client
}
