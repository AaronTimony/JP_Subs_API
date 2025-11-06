tmux new -d -s f "cd frontend && npm run dev"
tmux new -d -s b "cd backend && go run cmd/api/main.go"
tmux new -s m

