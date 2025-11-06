-- name: AddSubtitles :one
INSERT INTO SUBTITLES (file_name, content)
VALUES ($1, $2)
RETURNING (id, file_name, content);

-- name: GetSubtitleNames :many
SELECT file_name FROM subtitles;

-- name: SearchNames :many
SELECT file_name FROM subtitles
WHERE file_name ILIKE '%' || sqlc.narg(searchTerm) || '%'
LIMIT 100;

-- name: CheckUserExists :one

SELECT EXISTS(SELECT 1 FROM users WHERE username = $1);

-- name: CheckEmailExists :one

SELECT EXISTS(SELECT 1 FROM users WHERE email = $1);

-- name: CreateUser :one
INSERT INTO users (username, email, hashed_password)
VALUES ($1, $2, $3)
RETURNING id, username;
