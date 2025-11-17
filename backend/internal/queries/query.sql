-- name: AddSubtitles :one
INSERT INTO SUBTITLES (file_name, content, title, season, episode, media, file_type, deck_id)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING id, file_name, content;

-- name: GetSubtitleNames :many
SELECT id, file_name, title, episode, deck_id FROM subtitles;

-- name: SearchNames :many
SELECT id, file_name, title, deck_id FROM subtitles
WHERE title ILIKE '%' || sqlc.narg(searchTerm) || '%'
LIMIT $1;

-- name: CheckUserExists :one
SELECT EXISTS(SELECT 1 FROM users WHERE username = $1);

-- name: CheckEmailExists :one
SELECT EXISTS(SELECT 1 FROM users WHERE email = $1);

-- name: CreateUser :one
INSERT INTO users (username, email, hashed_password)
VALUES ($1, $2, $3)
RETURNING id, username;

-- name: GetAllEpisodes :many
SELECT id, title, content FROM subtitles
WHERE deck_id = $1
ORDER BY episode;

-- name: GetEpisodeRange :many
SELECT id, title, content FROM subtitles
WHERE deck_id = $1 AND episode BETWEEN $2 AND $3
ORDER BY episode;

-- use many even though its just one because we want slice so each return type is consistent

-- name: GetSingleEpisode :many
SELECT id, title, content FROM subtitles
WHERE deck_id = $1 AND episode = $2;
