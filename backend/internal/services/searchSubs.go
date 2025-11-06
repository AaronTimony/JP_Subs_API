package services

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/AaronTimony/JP_Subs_API/backend/internal/repository"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
	log "github.com/sirupsen/logrus"
)

func SearchSubs(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		repo := repository.New(pool)

		searchTerm := r.URL.Query().Get("search")
		if searchTerm == "" {
			return
		}

		pgSearchTerm := pgtype.Text{
			String: searchTerm,
			Valid:  true,
		}

		names, err := repo.SearchNames(context.Background(), pgSearchTerm)
		if err != nil {
			log.Error("Could not use function searchNames", err)
			return
		}
		log.Info("names", names)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		err = json.NewEncoder(w).Encode(names)
		if err != nil {
			log.Error("Could not send response", err)
		}
	}
}
