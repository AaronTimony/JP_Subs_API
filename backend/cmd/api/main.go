package main

import (
	"context"
	"fmt"
	"net/http"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/AaronTimony/JP_Subs_API/backend/internal/handlers"
	"github.com/go-chi/chi"
	"github.com/joho/godotenv"
	log "github.com/sirupsen/logrus"
)

func main() {
	err := godotenv.Load("/home/aaron-timony/projects/real_projects/jp_subs_api/.env")
	if err != nil {
		log.Fatal("Error Loading .env File", err)
	}

	dbURL := os.Getenv("DATABASE_URL")

	ctx := context.Background()

	pool, err := pgxpool.New(ctx, dbURL)
	if err != nil {
		log.Fatal("Failed to create db connection", err)
	}
	defer pool.Close()

	err = pool.Ping(ctx)
	if err != nil {
		log.Fatal("Unable to ping db", err)
	}

	log.Info("Successfully Connected to Database")

	fmt.Println("Woohoo!")

	log.SetReportCaller(true)
	var r *chi.Mux = chi.NewRouter()
	handlers.Handler(r, pool)

	http.ListenAndServe("localhost:8000", r)
}
