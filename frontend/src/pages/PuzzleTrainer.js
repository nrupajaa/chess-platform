import React, { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { getPuzzles, solvePuzzle } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PuzzleTrainer = () => {
  const { isAuthenticated } = useAuth();
  const [game, setGame] = useState(new Chess());
  const [puzzles, setPuzzles] = useState([]);
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [moveIndex, setMoveIndex] = useState(0);
  const [userMoves, setUserMoves] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [stats, setStats] = useState({
    puzzlesSolved: 0,
    accuracy: 0,
    currentStreak: 0
  });

  useEffect(() => {
    const fetchPuzzles = async () => {
      try {
        const data = await getPuzzles();
        setPuzzles(data);
        if (data.length > 0) {
          loadPuzzle(data[0]);
        }
      } catch (error) {
        console.error('Error fetching puzzles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPuzzles();
  }, []);

  const loadPuzzle = (puzzle) => {
    const newGame = new Chess(puzzle.fen);
    setGame(newGame);
    setCurrentPuzzle(puzzle);
    setMoveIndex(0);
    setUserMoves([]);
    setFeedback(null);
  };

  const onDrop = async (sourceSquare, targetSquare) => {
    if (!isAuthenticated) {
      setFeedback({ type: 'error', message: 'Please login to solve puzzles' });
      return false;
    }

    if (!currentPuzzle) return false;

    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' // Always promote to queen for simplicity
      });

      if (move === null) return false;

      setUserMoves([...userMoves, move]);

      // Check if the move is correct
      const expectedMove = currentPuzzle.solution[moveIndex];
      if (expectedMove && (move.san === expectedMove.san || move.uci === expectedMove.uci)) {
        setMoveIndex(moveIndex + 1);
        setFeedback({ type: 'success', message: 'Correct move!' });

        // Check if puzzle is solved
        if (moveIndex + 1 >= currentPuzzle.solution.length) {
          const startTime = Date.now();
          const result = await solvePuzzle(currentPuzzle._id, {
            correct: true,
            timeTaken: Date.now() - startTime
          });
          
          setStats(result.stats);
          setFeedback({ type: 'success', message: 'Puzzle solved! 🎉' });

          // Load next puzzle after delay
          setTimeout(() => {
            const currentIndex = puzzles.findIndex(p => p._id === currentPuzzle._id);
            const nextIndex = (currentIndex + 1) % puzzles.length;
            loadPuzzle(puzzles[nextIndex]);
          }, 2000);
        } else {
          // Make opponent's move if there are more moves
          setTimeout(() => {
            const opponentMove = currentPuzzle.moves[moveIndex + 1];
            if (opponentMove) {
              game.move(opponentMove.san);
              setGame(new Chess(game.fen()));
            }
          }, 500);
        }
      } else {
        setFeedback({ type: 'error', message: 'Incorrect move. Try again!' });
        
        // Submit incorrect attempt
        await solvePuzzle(currentPuzzle._id, {
          correct: false,
          timeTaken: 0
        });

        // Reset the puzzle
        setTimeout(() => {
          loadPuzzle(currentPuzzle);
        }, 1500);
      }

      setGame(new Chess(game.fen()));
      return true;
    } catch (error) {
      console.error('Error making move:', error);
      return false;
    }
  };

  const nextPuzzle = () => {
    const currentIndex = puzzles.findIndex(p => p._id === currentPuzzle._id);
    const nextIndex = (currentIndex + 1) % puzzles.length;
    loadPuzzle(puzzles[nextIndex]);
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="puzzle-trainer container" style={{ padding: '40px 20px' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '40px', textAlign: 'center' }}>
        Puzzle Trainer
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
        {/* Chessboard */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <Chessboard
              position={game.fen()}
              onPieceDrop={onDrop}
              boardWidth={400}
              customBoardStyle={{
                borderRadius: '8px',
                boxShadow: '0 8px 32px rgba(120, 90, 20, 0.25)'
              }}
              customDarkSquareStyle={{ backgroundColor: '#769656' }}
              customLightSquareStyle={{ backgroundColor: '#eeeed2' }}
            />
          </div>
        </div>

        {/* Puzzle Info */}
        <div>
          {currentPuzzle && (
            <>
              <div className="card" style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>
                  {currentPuzzle.theme}
                </h3>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <span className="badge" style={{ 
                    background: 'rgba(212, 169, 79, 0.18)',
                    color: 'rgba(26, 26, 26, 0.85)',
                    border: '1px solid rgba(212, 169, 79, 0.5)'
                  }}>
                    {currentPuzzle.category}
                  </span>
                  <span className="badge" style={{ 
                    background: 'rgba(255, 152, 0, 0.2)',
                    color: '#1a1a1a',
                    border: '1px solid rgba(255, 152, 0, 0.3)'
                  }}>
                    Difficulty: {currentPuzzle.difficulty}
                  </span>
                </div>
                <p style={{ color: 'rgba(26, 26, 26, 0.75)', marginBottom: '16px' }}>
                  Find the best move for {game.turn() === 'w' ? 'White' : 'Black'}
                </p>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(26, 26, 26, 0.1)'
                }}>
                  <span style={{ fontSize: '14px', color: 'rgba(26, 26, 26, 0.65)' }}>
                    Move {moveIndex + 1} of {currentPuzzle.solution.length}
                  </span>
                  <span style={{ fontSize: '14px', color: 'rgba(26, 26, 26, 0.65)' }}>
                    Rating: {currentPuzzle.rating}
                  </span>
                </div>
              </div>

              {/* Feedback */}
              {feedback && (
                <div className="card" style={{ 
                  marginBottom: '24px',
                  background: feedback.type === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                  border: feedback.type === 'success' ? '1px solid rgba(76, 175, 80, 0.3)' : '1px solid rgba(244, 67, 54, 0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>
                      {feedback.type === 'success' ? '✓' : '✗'}
                    </span>
                    <span style={{ color: feedback.type === 'success' ? '#2e7d32' : '#1a1a1a' }}>
                      {feedback.message}
                    </span>
                  </div>
                </div>
              )}

              {/* Stats */}
              {isAuthenticated && (
                <div className="card">
                  <h4 style={{ fontSize: '18px', marginBottom: '16px' }}>Your Stats</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>
                        {stats.puzzlesSolved}
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(26, 26, 26, 0.65)' }}>
                        Solved
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>
                        {Math.round(stats.accuracy * 100)}%
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(26, 26, 26, 0.65)' }}>
                        Accuracy
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>
                        {stats.currentStreak}
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(26, 26, 26, 0.65)' }}>
                        Streak
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button 
                className="btn btn-secondary" 
                onClick={nextPuzzle}
                style={{ width: '100%', marginTop: '24px' }}
              >
                Next Puzzle
              </button>
            </>
          )}

          {!currentPuzzle && (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: 'rgba(26, 26, 26, 0.65)' }}>
                No puzzles available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PuzzleTrainer;
