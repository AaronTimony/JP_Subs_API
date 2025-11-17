package services

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"

	"github.com/AaronTimony/JP_Subs_API/backend/internal/models"
	"github.com/AaronTimony/JP_Subs_API/backend/internal/repository"
	"github.com/jackc/pgx/v5/pgxpool"
	log "github.com/sirupsen/logrus"
)

func UploadSub(pool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := r.ParseMultipartForm(32 << 20)
		if err != nil {
			log.Error("File too big")
			http.Error(w, "File too large", http.StatusBadRequest)
			return
		}

		log.Info("MultipartForm.Value:", r.MultipartForm.Value)
		customName := r.FormValue("name")
		title := r.FormValue("title")
		season := r.FormValue("season")
		episode := r.FormValue("episode")
		media := r.FormValue("media")
		fileType := r.FormValue("fileType")
		deckID := r.FormValue("deckId")

		log.Info("%s", deckID)

		seasonInt, err := strconv.Atoi(season)
		if err != nil {
			log.Error("Invalid season number")
			http.Error(w, "Invalid season number", http.StatusBadRequest)
			return
		}

		episodeInt, err := strconv.Atoi(episode)
		if err != nil {
			log.Error("Invalid episode number")
			http.Error(w, "Invalid episode number", http.StatusBadRequest)
			return
		}

		intDeckId, err := strconv.Atoi(deckID)
		if err != nil {
			log.Error("Invalid Deck Id")
			http.Error(w, "Invalid Deck Id", http.StatusBadRequest)
			return
		}

		file, _, err := r.FormFile("files")
		if err != nil {
			log.Error("Error retrieving", err)
			http.Error(w, "Error retrieving file", http.StatusBadRequest)
			return
		}

		defer file.Close()

		content, err := io.ReadAll(file)
		if err != nil {
			log.Error("Error reading")
			http.Error(w, "Error reading file", http.StatusBadRequest)
			return
		}
		contentStr := string(content)

		repo := repository.New(pool)
		id, err := repo.AddSubtitles(context.Background(), repository.AddSubtitlesParams{
			FileName: customName,
			Content:  contentStr,
			Title:    title,
			Season:   int32(seasonInt),
			Episode:  int32(episodeInt),
			Media:    media,
			FileType: fileType,
			DeckID:   int32(intDeckId),
		})
		if err != nil {
			log.Error(err)
			return
		}

		response := models.UploadSubResponse{
			FileName: customName,
		}

		w.Header().Set("Content-Type", "application/json")
		err = json.NewEncoder(w).Encode(response)
		if err != nil {
			log.Error(err)
			return
		}

		fmt.Println(id)
	}
}
