package handlers

import (
	"encoding/json"
	"fmt"
	"net"
	"net/http"
	"os"
	"sync"

	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	log "github.com/sirupsen/logrus"
	"golang.org/x/time/rate"
)

var secretKey string

func init() {
	if err := godotenv.Load("/home/aaron-timony/projects/real_projects/jp_subs_api/.env"); err != nil {
		log.Fatal("Error loading .env file")
	}

	secretKey = os.Getenv("JWT_SECRET_KEY")
	if secretKey == "" {
		log.Fatal("JWT_SECRET_KEY environment variable is not set")
	}
}

func getIP(r *http.Request) (string, error) {
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		log.Printf("Error Passing in IP: %v", err)
		return "", err
	}
	return host, nil
}

func getUser(r *http.Request) (string, error) {
	cookie, err := r.Cookie("auth_token")
	if err != nil {
		return "", err
	}
	token, err := jwt.Parse(cookie.Value, func(token *jwt.Token) (interface{}, error) {
		return []byte(secretKey), nil
	})

	if err != nil || !token.Valid {
		return "", err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return "", fmt.Errorf("Invalid Claims")
	}

	userID, ok := claims["user_id"].(string)
	if !ok {
		return "", fmt.Errorf("user_id not found in token")
	}

	return userID, nil
}

func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		allowedOrigins := []string{
			"http://localhost:5173",
		}

		origin := r.Header.Get("Origin")
		for _, allowed := range allowedOrigins {
			if origin == allowed {
				w.Header().Set("Access-Control-Allow-Origin", origin)
				break
			}
		}

		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func validateToken(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("auth_token")
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			log.Println("Unable to find cookie")
			return
		}

		token, err := jwt.Parse(cookie.Value, func(token *jwt.Token) (interface{}, error) {
			return []byte(secretKey), nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			log.Error("invalid token")
			return
		}

		next.ServeHTTP(w, r)
	})
}

// Note: This IS a memory leak and will infinitely grow. Unless the application becomes big
// it is not really necessary to implement cleanup. Even if it does get big implementing cleanup is simple
// but for now I'm happy with it just being like this as it is not storing any memory intensive data anyway.

// Further note. For applications of this scale a user and IP based limiting is not really necessary. But I am
// just doing it because I want to.
func rateLimiterMiddleware(limit rate.Limit, burst int) func(http.Handler) http.Handler {
	LimiterMap := make(map[string]*rate.Limiter)

	var mu sync.Mutex

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			key, err := getUser(r)
			if err != nil {
				key, err = getIP(r)
			}

			if err != nil {
				http.Error(w, "Could not retrieve IP", http.StatusBadRequest)
				return
			}

			mu.Lock()
			limiter, exists := LimiterMap[key]
			if !exists {
				limiter = rate.NewLimiter(limit, burst)
				LimiterMap[key] = limiter
			}
			mu.Unlock()

			if !limiter.Allow() {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusTooManyRequests)
				json.NewEncoder(w).Encode(map[string]string{"error": "Too many requests"})
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}
