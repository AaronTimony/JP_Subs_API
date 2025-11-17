package services

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/AaronTimony/JP_Subs_API/backend/internal/repository"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
	log "github.com/sirupsen/logrus"
)

func SearchSubs(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		repo := repository.New(pool)
		ctx := context.Background()

		limitStr := r.URL.Query().Get("limit")
		limit := 100 // We hardcode this value to prevent any potential errors with empty strings
		if limitStr != "" {
			var err error
			limit, err = strconv.Atoi(limitStr)
			if err != nil {
				log.Error("Error converting limit:", err)
				http.Error(w, "Invalid limit parameter", http.StatusBadRequest)
				return
			}
		}

		searchTerm := r.URL.Query().Get("search")
		if searchTerm == "" {
			return
		}

		pgSearchTerm := pgtype.Text{
			String: searchTerm,
			Valid:  true,
		}

		names, err := repo.SearchNames(ctx, repository.SearchNamesParams{
			Limit:      int32(limit),
			Searchterm: pgSearchTerm,
		})
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
