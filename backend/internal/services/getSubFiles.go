package services

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/AaronTimony/JP_Subs_API/backend/internal/repository"
	"github.com/jackc/pgx/v5/pgxpool"
	log "github.com/sirupsen/logrus"
)

func RetrieveSubs(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		repo := repository.New(pool)

		log.Info("Got here I think?")
		names, err := repo.GetSubtitleNames(context.Background())
		if err != nil {
			log.Error(err)
			return
		}

		log.Info(names)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		err = json.NewEncoder(w).Encode(names)
		if err != nil {
			log.Error(err)
			return
		}
	}
}
