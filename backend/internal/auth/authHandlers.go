package auth

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"

	"github.com/AaronTimony/JP_Subs_API/backend/internal/repository"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	log "github.com/sirupsen/logrus"
	"golang.org/x/crypto/bcrypt"
)

var (
	secretKey string
	ctx       = context.Background()
)

func init() {
	if err := godotenv.Load("/home/aaron-timony/projects/real_projects/jp_subs_api/.env"); err != nil {
		log.Fatal("Error loading .env file")
	}

	secretKey = os.Getenv("JWT_SECRET_KEY")
	if secretKey == "" {
		log.Fatal("JWT_SECRET_KEY environment variable is not set")
	}
}

func NewHandler(pool *pgxpool.Pool) *Handler {
	return &Handler{pool: pool}
}

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	return string(bytes), err
}

func checkPasswordHash(password string, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func generateJWT(username string) (string, error) {
	claims := jwt.MapClaims{
		"user_id": username,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(secretKey))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func (h *Handler) Register(w http.ResponseWriter, r *http.Request) {
	repo := repository.New(h.pool)
	if r.Method != http.MethodPost {
		err := http.StatusMethodNotAllowed
		http.Error(w, "Invalid Method", err)
		return
	}

	var u User
	err := json.NewDecoder(r.Body).Decode(&u)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body"})
	}

	if len(u.Username) < 8 || len(u.Password) < 8 {
		err := http.StatusNotAcceptable
		http.Error(w, "Username/Password must be at least 8 characters", err)
		return
	}

	if u.Password != u.ConfirmPassword {
		err := http.StatusNotAcceptable
		http.Error(w, "Passwords do not match.", err)
		return
	}

	exists, err := repo.CheckUserExists(context.Background(), u.Username)
	if err != nil || exists != false {
		log.Error("Username already exists", err)
		return
	}

	email_exists, err := repo.CheckEmailExists(ctx, u.Email)
	if err != nil || email_exists != false {
		log.Error("Email already exists", err)
	}

	hashedPassword, err := hashPassword(u.Password)
	if err != nil {
		log.Error("Issue saving password", err)
		return
	}

	_, err = repo.CreateUser(context.Background(), repository.CreateUserParams{
		Username:       u.Username,
		HashedPassword: hashedPassword,
		Email:          u.Email,
	})
	if err != nil {
		log.Error("Could not register user to database", err)
		return
	}

	fmt.Println("User Registered Successfully!")
}

func (h *Handler) LoginUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	repo := repository.New(h.pool)
	if r.Method != http.MethodPost {
		err := http.StatusMethodNotAllowed
		http.Error(w, "invalid request method", err)
		log.Info("Must use a POST request")
		return
	}

	username := r.FormValue("username")
	password := r.FormValue("password")

	_, err := repo.CheckUserExists(context.Background(), username)
	hashedPassword, err := hashPassword(password)

	if err != nil || !checkPasswordHash(password, hashedPassword) {
		er := http.StatusUnauthorized
		http.Error(w, "Invalid Username or Password", er)
		log.Error("Username not found", err)
		return
	}

	tokenString, err := generateJWT(username)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Error("Could not create token", err)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "auth_token",
		Value:    tokenString,
		Path:     "/",
		MaxAge:   24 * 60 * 60,
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteStrictMode,
	})

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Login successful",
		"token":   tokenString,
	})
	return
}
