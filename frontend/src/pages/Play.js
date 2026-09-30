import React, { useState, useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

const Play = () => {
  const [game, setGame] = useState(new Chess());
  const [history, setHistory] = useState([]);

  const status = useMemo(() => {
    if (game.isCheckmate()) {
      return `Checkmate — ${game.turn() === 'w' ? 'Black' : 'White'} wins`;
    }
    if (game.isStalemate()) {
      return 'Stalemate — draw';
    }
    if (game.isDraw()) {
      return 'Draw';
    }
    if (game.isCheck()) {
      return `${game.turn() === 'w' ? 'White' : 'Black'} is in check`;
    }
    return `${game.turn() === 'w' ? 'White' : 'Black'} to move`;
  }, [game]);

  const onDrop = (sourceSquare, targetSquare) => {
    const gameCopy = new Chess(game.fen());
    let move;
    try {
      move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q'
      });
    } catch (e) {
      move = null;
    }

    if (move === null) return false;

    setGame(gameCopy);
    setHistory(gameCopy.history());
    return true;
  };

  const handleReset = () => {
    setGame(new Chess());
    setHistory([]);
  };

  const handleUndo = () => {
    const gameCopy = new Chess(game.fen());
    gameCopy.undo();
    setGame(gameCopy);
    setHistory(gameCopy.history());
  };

  // group moves into pairs for display: [{ no, white, black }]
  const movePairs = [];
  for (let i = 0; i < history.length; i += 2) {
    movePairs.push({
      no: i / 2 + 1,
      white: history[i],
      black: history[i + 1]
    });
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '8px', textAlign: 'center' }}>
        Play Chess
      </h1>
      <p style={{ textAlign: 'center', color: 'rgba(26, 26, 26, 0.7)', marginBottom: '40px' }}>
        Play both sides on the same board — great for reviewing lines or just practicing moves.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
        {/* Board */}
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
              customDarkSquareStyle={{ backgroundColor: '#8B5A2B' }}
              customLightSquareStyle={{ backgroundColor: '#EBCB9B' }}
            />
          </div>
        </div>

        {/* Side panel */}
        <div>
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Status</h3>
            <p style={{ fontSize: '16px', fontWeight: '600', color: '#B8860B' }}>
              {status}
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button className="btn btn-primary" onClick={handleReset}>
                New Game
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleUndo}
                disabled={history.length === 0}
              >
                Undo Move
              </button>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Moves</h3>
            {movePairs.length === 0 ? (
              <p style={{ color: 'rgba(26, 26, 26, 0.6)' }}>
                No moves yet. Drag a piece on the board to start.
              </p>
            ) : (
              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {movePairs.map((pair) => (
                  <div
                    key={pair.no}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '32px 1fr 1fr',
                      gap: '8px',
                      padding: '6px 0',
                      borderBottom: '1px solid rgba(26, 26, 26, 0.08)',
                      fontSize: '14px'
                    }}
                  >
                    <span style={{ color: 'rgba(26, 26, 26, 0.5)' }}>{pair.no}.</span>
                    <span>{pair.white}</span>
                    <span>{pair.black || ''}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Play;
