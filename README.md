# Boardwise

Boardwise is a chess learning platform with structured courses, interactive puzzles, a skill tree, and opening repertoire management. Built with React, Node.js, Express, and MongoDB.

## Features

- User authentication with student and instructor roles (JWT)
- Structured courses with lessons, enrollment, and progress tracking
- Skill tree covering foundations, openings, tactics, middlegame, endgames, and advanced topics
- Puzzle trainer with spaced repetition, so failed puzzles appear more often
- Opening repertoire builder with ECO codes, notes, and mastery levels
- Play mode to practice moves on a board against yourself
- Profiles, streak tracking, and a leaderboard

## Tech Stack

- **Frontend:** React, React Router, Axios, react-chessboard, chess.js
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs

## Getting Started

1. Clone the repository and install dependencies:

```bash
   git clone https://github.com/nrupajaa/chess-platform.git
   cd chess-platform
   cd backend && npm install
   cd ../frontend && npm install
```

2. Create `backend/.env`:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chess-platform
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```


3. Seed the database and start the backend:

```bash
   cd backend
   node seed.js
   npm run dev
```

4. In a second terminal, start the frontend:

```bash
   cd frontend
   npm start
```

The backend runs on http://localhost:5000 and the frontend on http://localhost:3000.
