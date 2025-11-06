package auth

import (
	"github.com/jackc/pgx/v5/pgxpool"
)

type Handler struct {
	pool *pgxpool.Pool
}

type User struct {
	Username        string `json:"username"`
	Password        string `json:"password"`
	Email           string `json:"email"`
	ConfirmPassword string `json:"confirmPassword"`
}
