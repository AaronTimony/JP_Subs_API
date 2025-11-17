package services

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/AaronTimony/JP_Subs_API/backend/internal/repository"
	"github.com/jackc/pgx/v5/pgxpool"
	log "github.com/sirupsen/logrus"
)

func GetSubsFromQuery(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		repo := repository.New(pool)
		ctx := context.Background()

		var results interface{}

		deckID := r.URL.Query().Get("deck_id")
		if deckID == "" {
			log.Error("deckID is not correct")
			http.Error(w, "Please enter a valid integer as deck_id", http.StatusBadRequest)
			return

		}

		intDeckID, err := strconv.Atoi(deckID)
		if err != nil {
			log.Error("Error converting string to integer")
			return
		}

		int32DeckID := int32(intDeckID)

		episodes := r.URL.Query().Get("episodes")
		if episodes == "" {
			results, err = repo.GetAllEpisodes(ctx, int32DeckID)
			if err != nil {
				log.Error("Failed to retrieve results for all episodes")
				return
			}

		} else if strings.Contains(episodes, "-") {

			parts := strings.Split(episodes, "-")

			start, err := strconv.Atoi(parts[0])
			if err != nil {
				log.Error("Could not find start episode in range (Should be a valid number)")
				http.Error(w, "Could not find episodes, please ensure you enter valid episode numbers.", http.StatusBadRequest)
				return
			}

			end, err := strconv.Atoi(parts[1])
			if err != nil {
				log.Error("Could not find end episode in range (Should be a valid number)")
				http.Error(w, "Could not find episodes, please ensure you enter valid episode numbers.", http.StatusBadRequest)
				return
			}

			int32start := int32(start)
			int32end := int32(end)

			results, err = repo.GetEpisodeRange(ctx, repository.GetEpisodeRangeParams{
				DeckID:    int32DeckID,
				Episode:   int32start,
				Episode_2: int32end,
			})
			if err != nil {
				log.Error("Could not find range of episodes (perhaps incorrect values)")
				http.Error(w, "Unable to find episodes. Please ensure you have selected a correct range.", http.StatusBadRequest)
				return
			}

		} else if episodeNum, err := strconv.Atoi(episodes); err == nil {

			results, err = repo.GetSingleEpisode(ctx, repository.GetSingleEpisodeParams{
				DeckID:  int32DeckID,
				Episode: int32(episodeNum),
			})
			if err != nil {
				log.Error("Error finding single episode")
			}

		} else {
			log.Error("Didn't enter URL params correctly")
			http.Error(w, "Please Enter Parameters as seen in the Documentation.", http.StatusBadRequest)
			return
		}

		w.Header().Set("Content-Type", "Application/json")
		w.WriteHeader(http.StatusOK)
		err = json.NewEncoder(w).Encode(results)
		if err != nil {
			log.Error(err)
			return
		}
	}
}
