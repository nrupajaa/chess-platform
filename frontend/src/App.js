import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Puzzles from './pages/Puzzles';
import PuzzleTrainer from './pages/PuzzleTrainer';
import Play from './pages/Play';
import Repertoire from './pages/Repertoire';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import SkillTree from './pages/SkillTree';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/puzzles" element={<Puzzles />} />
              <Route path="/puzzles/trainer" element={<PuzzleTrainer />} />
              <Route path="/play" element={<Play />} />
              <Route path="/repertoire" element={<Repertoire />} />
              <Route path="/skill-tree" element={<SkillTree />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
