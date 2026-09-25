import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPuzzles } from '../services/api';

const Puzzles = () => {
  const [puzzles, setPuzzles] = useState([]);
  const [filteredPuzzles, setFilteredPuzzles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    theme: ''
  });

  useEffect(() => {
    const fetchPuzzles = async () => {
      try {
        const data = await getPuzzles();
        setPuzzles(data);
        setFilteredPuzzles(data);
      } catch (error) {
        console.error('Error fetching puzzles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPuzzles();
  }, []);

  useEffect(() => {
    let filtered = puzzles;

    if (filters.category) {
      filtered = filtered.filter(puzzle => puzzle.category === filters.category);
    }

    if (filters.difficulty) {
      filtered = filtered.filter(puzzle => puzzle.difficulty === parseInt(filters.difficulty));
    }

    if (filters.theme) {
      filtered = filtered.filter(puzzle =>
        puzzle.theme.toLowerCase().includes(filters.theme.toLowerCase())
      );
    }

    setFilteredPuzzles(filtered);
  }, [filters, puzzles]);

  const getDifficultyColor = (difficulty) => {
    const colors = {
      1: '#4caf50',
      2: '#8bc34a',
      3: '#ffc107',
      4: '#ff9800',
      5: '#f44336'
    };
    return colors[difficulty] || '#666';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      tactics: '⚔️',
      endgame: '🏆',
      opening: '📖',
      middlegame: '🎯'
    };
    return icons[category] || '♟️';
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="puzzles-page container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px' }}>Chess Puzzles</h1>
        <Link to="/puzzles/trainer" className="btn btn-primary">
          Start Training
        </Link>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div className="form-group">
            <label>Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              <option value="tactics">Tactics</option>
              <option value="endgame">Endgame</option>
              <option value="opening">Opening</option>
              <option value="middlegame">Middlegame</option>
            </select>
          </div>
          <div className="form-group">
            <label>Difficulty</label>
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
            >
              <option value="">All Difficulties</option>
              <option value="1">Beginner (1)</option>
              <option value="2">Easy (2)</option>
              <option value="3">Medium (3)</option>
              <option value="4">Hard (4)</option>
              <option value="5">Expert (5)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Theme</label>
            <input
              type="text"
              placeholder="Search themes..."
              value={filters.theme}
              onChange={(e) => setFilters({ ...filters, theme: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Puzzle Grid */}
      {filteredPuzzles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.6)' }}>
            No puzzles found matching your filters.
          </p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '24px' 
        }}>
          {filteredPuzzles.map((puzzle) => (
            <Link key={puzzle._id} to="/puzzles/trainer" style={{ textDecoration: 'none' }}>
              <div className="card" style={{ height: '100%' }}>
                <div style={{ 
                  height: '120px', 
                  background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1), rgba(255, 152, 0, 0.2))',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px'
                }}>
                  {getCategoryIcon(puzzle.category)}
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <span className="badge" style={{ 
                    background: `${getDifficultyColor(puzzle.difficulty)}33`,
                    color: getDifficultyColor(puzzle.difficulty),
                    border: `1px solid ${getDifficultyColor(puzzle.difficulty)}55`
                  }}>
                    Difficulty: {puzzle.difficulty}
                  </span>
                  <span className="badge" style={{ 
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    marginLeft: '8px'
                  }}>
                    {puzzle.category}
                  </span>
                </div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'white' }}>
                  {puzzle.theme}
                </h3>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                    Rating: {puzzle.rating}
                  </span>
                  <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                    {puzzle.attempts} attempts
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Puzzles;
