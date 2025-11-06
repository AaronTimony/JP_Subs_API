package services

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

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

		customName := r.FormValue("name")
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
