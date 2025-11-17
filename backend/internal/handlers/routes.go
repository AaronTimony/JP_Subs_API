package handlers

import (
	"github.com/AaronTimony/JP_Subs_API/backend/internal/auth"
	"github.com/AaronTimony/JP_Subs_API/backend/internal/services"
	"golang.org/x/time/rate"

	"github.com/go-chi/chi"
	chimiddle "github.com/go-chi/chi/middleware"
	"github.com/jackc/pgx/v5/pgxpool"
)

func Handler(r *chi.Mux, pool *pgxpool.Pool) {
	r.Use(chimiddle.StripSlashes)
	r.Use(CORSMiddleware)
	r.Use(rateLimiterMiddleware(rate.Limit(10), 10))

	r.Route("/subtitles", func(router chi.Router) {
		router.Get("/getSubs", services.RetrieveSubs(pool))
		router.With(validateToken).Post("/upload", services.UploadSub(pool))
		router.Get("/useAPI", services.GetSubsFromQuery(pool))
		router.Get("/searchSubs", services.SearchSubs(pool))
	})

	h := auth.NewHandler(pool)
	r.Route("/auth", func(router chi.Router) {
		router.Post("/Register", h.Register)
		router.Post("/Login", h.LoginUser)
	})
}
