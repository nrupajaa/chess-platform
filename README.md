# Chess Learning Platform

A comprehensive chess learning platform with structured courses, interactive puzzles, skill trees, and opening repertoire management. Built with React, Node.js, Express, and MongoDB.

## 🎯 Features

### Core Platform
- **User Authentication**: Student and Instructor roles with secure JWT authentication
- **Course System**: Structured courses with lessons, progress tracking, and enrollment
- **Search & Filter**: Filter courses by category, level, and search by title/description

### Distinct Chess Features
- **Skill Tree/Learning Paths**: Visual skill tree divided into major areas (Foundations, Openings, Tactics, Middlegame, Endgames, Advanced)
- **Interactive Puzzle Trainer**: Built-in tactics puzzles with spaced repetition system
- **Opening Repertoire Builder**: Create and manage personal opening repertoires with linked lessons and example games

### Additional Features
- **Daily Puzzle Streak**: Track your solving streak
- **Rating System**: Beginner/Intermediate/Advanced levels with estimated ratings
- **Progress Tracking**: Monitor puzzle accuracy, courses completed, and study time
- **Public Profiles**: Share your progress and achievements
- **Leaderboard**: Compete with other players

## 🛠️ Technologies

### Frontend
- React 18
- React Router
- Axios
- React Chessboard
- Chess.js

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## 🚀 Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd chess-platform
```

2. **Install dependencies**
```bash
npm install
```

This will install dependencies for both backend and frontend.

3. **Set up environment variables**

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chess-platform
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

4. **Start MongoDB**

Make sure MongoDB is running locally or update the `MONGODB_URI` with your MongoDB Atlas connection string.

5. **Seed the database**

Run the seed script to populate the database with sample courses and puzzles:
```bash
cd backend
node seed.js
```

6. **Start the development servers**

Run both backend and frontend:
```bash
npm start
```

Or run them separately:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

The backend will run on `http://localhost:5000` and the frontend on `http://localhost:3000`.

## 📁 Project Structure

```
chess-platform/
├── backend/
│   ├── models/          # MongoDB schemas
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Puzzle.js
│   │   └── Repertoire.js
│   ├── routes/          # API routes
│   │   ├── auth.js
│   │   ├── courses.js
│   │   ├── puzzles.js
│   │   ├── users.js
│   │   └── repertoire.js
│   ├── middleware/      # Express middleware
│   │   └── auth.js
│   ├── config/          # Configuration files
│   ├── server.js        # Express server
│   ├── seed.js          # Database seeder
│   └── .env            # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   │   └── Navigation.js
│   │   ├── pages/       # Page components
│   │   │   ├── Home.js
│   │   │   ├── Courses.js
│   │   │   ├── CourseDetail.js
│   │   │   ├── Puzzles.js
│   │   │   ├── PuzzleTrainer.js
│   │   │   ├── Repertoire.js
│   │   │   ├── SkillTree.js
│   │   │   ├── Profile.js
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── context/     # React Context
│   │   │   └── AuthContext.js
│   │   ├── services/    # API services
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── public/
│       └── index.html
└── README.md
```

## 🎨 UI Features

- **Faded Chessboard Background**: Subtle chessboard pattern background for visual appeal
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Theme**: Modern dark theme with gradient accents
- **Card-based Layout**: Clean, organized interface with glassmorphism effects

## 📚 Available Courses

The platform comes with 5 pre-loaded courses:

1. **Chess Fundamentals - From Zero to Hero** (Beginner)
   - Board setup and piece movement
   - Special moves (castling, en passant, promotion)
   - Check, checkmate, and stalemate
   - Basic checkmate patterns
   - Opening principles

2. **Tactical Mastery - Forks, Pins, and Skewers** (Beginner)
   - Introduction to chess tactics
   - The Fork
   - Pins
   - Skewers
   - Discovered attacks and checks

3. **Opening Repertoire - White Systems** (Beginner)
   - Introduction to opening repertoire building
   - The London System
   - Italian Game
   - Queen's Gambit
   - Opening principles and common mistakes

4. **Endgame Essentials - King and Pawn Endings** (Intermediate)
   - Why endgames matter
   - King and pawn vs king
   - The rule of the square
   - Rook and pawn endings
   - Practical endgame calculation

5. **Middlegame Strategy - Planning and Piece Coordination** (Intermediate)
   - Introduction to middlegame planning
   - Pawn structure and long-term plans
   - Piece activity and coordination
   - Prophylaxis
   - Converting advantages

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - Get all courses (with filters)
- `GET /api/courses/:id` - Get single course
- `POST /api/courses/:id/enroll` - Enroll in course
- `POST /api/courses/:id/lessons/:lessonId/complete` - Mark lesson complete
- `POST /api/courses` - Create course (instructor only)

### Puzzles
- `GET /api/puzzles` - Get puzzles (with filters)
- `GET /api/puzzles/:id` - Get single puzzle
- `POST /api/puzzles/:id/solve` - Submit puzzle solution
- `GET /api/puzzles/review/due` - Get puzzles due for review
- `POST /api/puzzles` - Create puzzle (instructor only)

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/leaderboard/top` - Get leaderboard

### Repertoire
- `GET /api/repertoire` - Get user repertoires
- `POST /api/repertoire` - Create repertoire
- `POST /api/repertoire/:id/openings` - Add opening
- `PUT /api/repertoire/:id/openings/:openingId` - Update opening
- `DELETE /api/repertoire/:id/openings/:openingId` - Delete opening

## 🧩 Puzzle Features

- **Spaced Repetition**: Failed puzzles appear more often
- **Category Filtering**: Tactics, Endgame, Opening, Middlegame
- **Difficulty Levels**: 1-5 rating system
- **Progress Tracking**: Accuracy, streak, and total solved
- **Interactive Board**: Real-time chessboard with move validation

## 🎯 Skill Tree System

The skill tree is organized into 6 main categories:
- **Foundations**: Essential chess basics
- **Openings**: Opening theory and repertoire
- **Tactics**: Tactical patterns and combinations
- **Middlegame**: Strategic planning and piece coordination
- **Endgames**: Endgame technique and conversion
- **Advanced**: Advanced concepts and master-level play

Each category shows progress and contains related courses that must be completed to advance.

## 📖 Opening Repertoire

Users can:
- Create multiple repertoires (White, Black, or both)
- Add openings with ECO codes, main moves, and descriptions
- Link example games to openings
- Track mastery level (Beginner → Intermediate → Advanced)
- Organize openings by color and category

## 👥 User Roles

### Student
- Enroll in courses
- Solve puzzles
- Build opening repertoire
- Track progress
- View leaderboard

### Instructor
- All student features
- Create new courses
- Create new puzzles
- Manage course content

## 🔒 Security

- Password hashing with bcryptjs
- JWT token authentication
- Protected routes for sensitive operations
- Input validation with express-validator
- CORS enabled for cross-origin requests

## 🚀 Deployment

### Backend Deployment
1. Set environment variables on your hosting platform
2. Update `MONGODB_URI` with production database
3. Set strong `JWT_SECRET`
4. Deploy backend to platforms like Heroku, Railway, or Render

### Frontend Deployment
1. Build the frontend: `cd frontend && npm run build`
2. Deploy the `build` folder to platforms like Netlify, Vercel, or GitHub Pages
3. Update API base URL in production environment

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🎓 Acknowledgments

- Chess content and course structure inspired by established chess education platforms
- Chessboard visualization powered by react-chessboard
- Chess logic handled by chess.js library

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Built with ❤️ for chess enthusiasts looking to improve their game through structured learning.
