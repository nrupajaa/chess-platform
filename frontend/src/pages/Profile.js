import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile, getLeaderboard } from '../services/api';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    avatar: '',
    location: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !user) return;

      try {
        const [profileData, leaderboardData] = await Promise.all([
          getUserProfile(user.id),
          getLeaderboard()
        ]);
        setProfileData(profileData);
        setLeaderboard(leaderboardData);
        setFormData({
          bio: profileData.profile?.bio || '',
          avatar: profileData.profile?.avatar || '',
          location: profileData.profile?.location || ''
        });
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateUserProfile(formData);
      setProfileData(updated);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>User Profile</h2>
        <p style={{ color: 'rgba(26, 26, 26, 0.75)', marginBottom: '32px' }}>
          Please login to view your profile
        </p>
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

  const displayUser = profileData || user;

  return (
    <div className="profile container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        {/* Profile Card */}
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #D4A94F, #F0D080)',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px'
            }}>
              {displayUser.username?.charAt(0).toUpperCase()}
            </div>
            <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>{displayUser.username}</h2>
            <span className={`badge badge-${displayUser.level}`}>
              {displayUser.level}
            </span>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '16px', marginBottom: '12px', color: 'rgba(26, 26, 26, 0.65)' }}>
              Statistics
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div className="card" style={{ padding: '16px', textAlign: 'center', background: 'rgba(212, 169, 79, 0.08)' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' }}>
                  {displayUser.stats?.puzzlesSolved || 0}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(26, 26, 26, 0.65)' }}>
                  Puzzles Solved
                </div>
              </div>
              <div className="card" style={{ padding: '16px', textAlign: 'center', background: 'rgba(212, 169, 79, 0.08)' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' }}>
                  {Math.round((displayUser.stats?.puzzlesAccuracy || 0) * 100)}%
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(26, 26, 26, 0.65)' }}>
                  Accuracy
                </div>
              </div>
              <div className="card" style={{ padding: '16px', textAlign: 'center', background: 'rgba(212, 169, 79, 0.08)' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' }}>
                  {displayUser.stats?.currentStreak || 0}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(26, 26, 26, 0.65)' }}>
                  Current Streak
                </div>
              </div>
              <div className="card" style={{ padding: '16px', textAlign: 'center', background: 'rgba(212, 169, 79, 0.08)' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' }}>
                  {displayUser.stats?.coursesCompleted || 0}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(26, 26, 26, 0.65)' }}>
                  Courses Completed
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '16px', marginBottom: '12px', color: 'rgba(26, 26, 26, 0.65)' }}>
              Rating
            </h4>
            <div className="card" style={{ padding: '20px', textAlign: 'center', background: 'rgba(212, 169, 79, 0.08)' }}>
              <div style={{ fontSize: '48px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>
                {displayUser.rating || 1200}
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(26, 26, 26, 0.65)' }}>
                Current Rating
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details & Leaderboard */}
        <div>
          {/* Profile Details */}
          <div className="card" style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '24px' }}>Profile Details</h3>
              <button 
                className="btn btn-secondary"
                onClick={() => setEditing(!editing)}
                style={{ padding: '8px 16px' }}
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {editing ? (
              <form onSubmit={handleUpdateProfile}>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Avatar URL</label>
                  <input
                    type="text"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="New York, USA"
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '12px', color: 'rgba(26, 26, 26, 0.65)', marginRight: '8px' }}>
                    Email:
                  </span>
                  <span style={{ fontSize: '14px' }}>{displayUser.email}</span>
                </div>
                {displayUser.profile?.bio && (
                  <div style={{ marginBottom: '16px' }}>
                    <span style={{ fontSize: '12px', color: 'rgba(26, 26, 26, 0.65)', marginRight: '8px' }}>
                      Bio:
                    </span>
                    <p style={{ fontSize: '14px', color: 'rgba(26, 26, 26, 0.85)', marginTop: '4px' }}>
                      {displayUser.profile.bio}
                    </p>
                  </div>
                )}
                {displayUser.profile?.location && (
                  <div style={{ marginBottom: '16px' }}>
                    <span style={{ fontSize: '12px', color: 'rgba(26, 26, 26, 0.65)', marginRight: '8px' }}>
                      Location:
                    </span>
                    <span style={{ fontSize: '14px' }}>{displayUser.profile.location}</span>
                  </div>
                )}
                {displayUser.completedPaths && displayUser.completedPaths.length > 0 && (
                  <div>
                    <span style={{ fontSize: '12px', color: 'rgba(26, 26, 26, 0.65)', marginRight: '8px' }}>
                      Completed Courses:
                    </span>
                    <div style={{ marginTop: '8px' }}>
                      {displayUser.completedPaths.map((path, index) => (
                        <span key={index} className="badge" style={{ 
                          background: 'rgba(76, 175, 80, 0.2)',
                          color: '#1a1a1a',
                          border: '1px solid rgba(76, 175, 80, 0.3)',
                          marginRight: '8px',
                          marginBottom: '8px'
                        }}>
                          {path.pathId}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Leaderboard */}
          <div className="card">
            <h3 style={{ fontSize: '24px', marginBottom: '24px' }}>Leaderboard</h3>
            {leaderboard.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {leaderboard.map((player, index) => (
                  <div key={player._id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px',
                    borderRadius: '8px',
                    background: player._id === displayUser._id ? 'rgba(212, 169, 79, 0.18)' : 'rgba(212, 169, 79, 0.08)',
                    border: player._id === displayUser._id ? '1px solid rgba(212, 169, 79, 0.7)' : '1px solid rgba(26, 26, 26, 0.1)'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: index < 3 ? ['#ffd700', '#c0c0c0', '#cd7f32'][index] : 'rgba(212, 169, 79, 0.18)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: index < 3 ? '#000' : 'rgba(26, 26, 26, 0.85)'
                    }}>
                      {index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                        {player.username}
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(26, 26, 26, 0.65)' }}>
                        {player.stats?.puzzlesSolved || 0} puzzles solved
                      </div>
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>
                      {player.rating}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px', color: 'rgba(26, 26, 26, 0.65)' }}>
                No leaderboard data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
