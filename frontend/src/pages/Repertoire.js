import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getRepertoires, createRepertoire, addOpening, updateOpening, deleteOpening } from '../services/api';

const Repertoire = () => {
  const { isAuthenticated } = useAuth();
  const [repertoires, setRepertoires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddRepertoire, setShowAddRepertoire] = useState(false);
  const [showAddOpening, setShowAddOpening] = useState(false);
  const [selectedRepertoire, setSelectedRepertoire] = useState(null);
  const [newRepertoire, setNewRepertoire] = useState({ name: '', color: 'both' });
  const [newOpening, setNewOpening] = useState({
    name: '',
    eco: '',
    moves: '',
    description: '',
    exampleGames: ''
  });

  useEffect(() => {
    const fetchRepertoires = async () => {
      if (!isAuthenticated) return;
      
      try {
        const data = await getRepertoires();
        setRepertoires(data);
      } catch (error) {
        console.error('Error fetching repertoires:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepertoires();
  }, [isAuthenticated]);

  const handleCreateRepertoire = async (e) => {
    e.preventDefault();
    try {
      const created = await createRepertoire(newRepertoire.name, newRepertoire.color);
      setRepertoires([...repertoires, created]);
      setNewRepertoire({ name: '', color: 'both' });
      setShowAddRepertoire(false);
    } catch (error) {
      console.error('Error creating repertoire:', error);
    }
  };

  const handleAddOpening = async (e) => {
    e.preventDefault();
    if (!selectedRepertoire) return;

    try {
      const openingData = {
        ...newOpening,
        moves: newOpening.moves.split(',').map(m => m.trim()),
        exampleGames: newOpening.exampleGames ? [{
          white: 'Example White',
          black: 'Example Black',
          result: '*',
          pgn: newOpening.exampleGames,
          year: new Date().getFullYear()
        }] : []
      };

      const updated = await addOpening(selectedRepertoire._id, openingData);
      setRepertoires(repertoires.map(r => r._id === selectedRepertoire._id ? updated : r));
      setNewOpening({ name: '', eco: '', moves: '', description: '', exampleGames: '' });
      setShowAddOpening(false);
    } catch (error) {
      console.error('Error adding opening:', error);
    }
  };

  const handleUpdateOpening = async (repertoireId, openingId, masteryLevel) => {
    try {
      const updated = await updateOpening(repertoireId, openingId, { masteryLevel });
      setRepertoires(repertoires.map(r => r._id === repertoireId ? updated : r));
    } catch (error) {
      console.error('Error updating opening:', error);
    }
  };

  const handleDeleteOpening = async (repertoireId, openingId) => {
    try {
      const updated = await deleteOpening(repertoireId, openingId);
      setRepertoires(repertoires.map(r => r._id === repertoireId ? updated : r));
    } catch (error) {
      console.error('Error deleting opening:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Opening Repertoire Builder</h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '32px' }}>
          Please login to build your opening repertoire
        </p>
        <button className="btn btn-primary">Login to Continue</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="repertoire container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px' }}>Opening Repertoire</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddRepertoire(true)}
        >
          + New Repertoire
        </button>
      </div>

      {/* Add Repertoire Modal */}
      {showAddRepertoire && (
        <div className="card" style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>Create New Repertoire</h3>
          <form onSubmit={handleCreateRepertoire}>
            <div className="form-group">
              <label>Repertoire Name</label>
              <input
                type="text"
                value={newRepertoire.name}
                onChange={(e) => setNewRepertoire({ ...newRepertoire, name: e.target.value })}
                placeholder="My Opening Repertoire"
                required
              />
            </div>
            <div className="form-group">
              <label>Color</label>
              <select
                value={newRepertoire.color}
                onChange={(e) => setNewRepertoire({ ...newRepertoire, color: e.target.value })}
              >
                <option value="both">Both Colors</option>
                <option value="white">White Only</option>
                <option value="black">Black Only</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn btn-primary">Create</button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowAddRepertoire(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Repertoires List */}
      {repertoires.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
          <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>No Repertoires Yet</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '24px' }}>
            Create your first opening repertoire to start organizing your chess openings
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '32px' }}>
          {repertoires.map((repertoire) => (
            <div key={repertoire._id} className="card">
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div>
                  <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>{repertoire.name}</h3>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span className="badge" style={{ 
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      {repertoire.color}
                    </span>
                    <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
                      {repertoire.openings?.length || 0} openings
                    </span>
                  </div>
                </div>
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedRepertoire(repertoire);
                    setShowAddOpening(true);
                  }}
                >
                  + Add Opening
                </button>
              </div>

              {/* Add Opening Form */}
              {showAddOpening && selectedRepertoire?._id === repertoire._id && (
                <div className="card" style={{ marginBottom: '24px', background: 'rgba(255, 255, 255, 0.03)' }}>
                  <h4 style={{ fontSize: '18px', marginBottom: '16px' }}>Add New Opening</h4>
                  <form onSubmit={handleAddOpening}>
                    <div className="form-group">
                      <label>Opening Name</label>
                      <input
                        type="text"
                        value={newOpening.name}
                        onChange={(e) => setNewOpening({ ...newOpening, name: e.target.value })}
                        placeholder="Sicilian Defense"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>ECO Code (Optional)</label>
                      <input
                        type="text"
                        value={newOpening.eco}
                        onChange={(e) => setNewOpening({ ...newOpening, eco: e.target.value })}
                        placeholder="B20"
                      />
                    </div>
                    <div className="form-group">
                      <label>Main Moves (comma-separated)</label>
                      <input
                        type="text"
                        value={newOpening.moves}
                        onChange={(e) => setNewOpening({ ...newOpening, moves: e.target.value })}
                        placeholder="e4, c5, Nf3, d6"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={newOpening.description}
                        onChange={(e) => setNewOpening({ ...newOpening, description: e.target.value })}
                        placeholder="Key ideas and plans for this opening..."
                        rows="3"
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button type="submit" className="btn btn-primary">Add Opening</button>
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => {
                          setShowAddOpening(false);
                          setSelectedRepertoire(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Openings List */}
              {repertoire.openings?.length > 0 ? (
                <div style={{ display: 'grid', gap: '16px' }}>
                  {repertoire.openings.map((opening, index) => (
                    <div key={index} className="card" style={{ 
                      padding: '20px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <h4 style={{ fontSize: '18px' }}>{opening.name}</h4>
                            {opening.eco && (
                              <span className="badge" style={{ 
                                background: 'rgba(255, 255, 255, 0.1)',
                                color: 'rgba(255, 255, 255, 0.8)',
                                border: '1px solid rgba(255, 255, 255, 0.2)'
                              }}>
                                {opening.eco}
                              </span>
                            )}
                            <span className={`badge badge-${opening.masteryLevel}`}>
                              {opening.masteryLevel}
                            </span>
                          </div>
                          {opening.moves && opening.moves.length > 0 && (
                            <div style={{ marginBottom: '12px' }}>
                              <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', marginRight: '8px' }}>
                                Moves:
                              </span>
                              <span style={{ fontSize: '14px', fontFamily: 'monospace' }}>
                                {opening.moves.join(', ')}
                              </span>
                            </div>
                          )}
                          {opening.description && (
                            <p style={{ 
                              fontSize: '14px', 
                              color: 'rgba(255, 255, 255, 0.7)',
                              marginBottom: '12px'
                            }}>
                              {opening.description}
                            </p>
                          )}
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                              Mastery:
                            </span>
                            <select
                              value={opening.masteryLevel}
                              onChange={(e) => handleUpdateOpening(repertoire._id, opening._id || index, e.target.value)}
                              style={{ 
                                padding: '4px 8px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '4px',
                                color: 'white',
                                fontSize: '12px'
                              }}
                            >
                              <option value="beginner">Beginner</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="advanced">Advanced</option>
                            </select>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteOpening(repertoire._id, opening._id || index)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ffffff',
                            cursor: 'pointer',
                            fontSize: '18px',
                            padding: '8px'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '32px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '14px'
                }}>
                  No openings added yet. Click "Add Opening" to start building your repertoire.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Repertoire;
