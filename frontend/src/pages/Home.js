import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Chessboard } from 'react-chessboard';
import { getCourses } from '../services/api';

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const courses = await getCourses();
        setFeaturedCourses(courses.slice(0, 4));
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  const getLevelBadge = (level) => {
    const levelMap = {
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced'
    };
    return levelMap[level] || level;
  };

  const getCategoryColor = (category) => {
    const colors = {
      foundations: '#B8860B',
      openings: '#9C7A1E',
      tactics: '#A67C00',
      middlegame: '#C9A24B',
      endgames: '#8B6914',
      advanced: '#7A5C10'
    };
    return colors[category] || '#B8860B';
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero" style={{ 
        padding: '80px 0', 
        background: 'linear-gradient(135deg, #FFF8E1 0%, #F5E3A8 100%)',
        borderRadius: '0 0 32px 32px',
        marginBottom: '40px'
      }}>
        <div className="container" style={{ 
          display: 'grid', 
          gridTemplateColumns: '1.1fr 0.9fr', 
          gap: '48px', 
          alignItems: 'center' 
        }}>
          {/* Left: text */}
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ 
              fontSize: '48px', 
              fontWeight: '700',
              marginBottom: '20px',
              color: '#1a1a1a'
            }}>
              Master Chess with Structured Learning
            </h1>
            <p style={{ 
              fontSize: '18px', 
              color: 'rgba(26, 26, 26, 0.7)',
              marginBottom: '40px',
              maxWidth: '520px'
            }}>
              Follow guided learning paths, solve puzzles, study openings, and track your progress. 
              Your journey from beginner to master starts here.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Link to="/courses" className="btn btn-primary">
                Explore Courses
              </Link>
              <Link to="/skill-tree" className="btn btn-secondary">
                View Skill Tree
              </Link>
            </div>
          </div>

          {/* Right: clickable mini chessboard -> /play */}
          <Link 
            to="/play" 
            style={{ textDecoration: 'none', justifySelf: 'center' }}
            title="Play chess against yourself"
          >
            <div
              className="mini-board-link"
              style={{
                width: '320px',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 12px 32px rgba(60, 35, 10, 0.35)',
                border: '4px solid #3E2611',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
            >
              <Chessboard
                id="home-preview-board"
                position="start"
                arePiecesDraggable={false}
                boardWidth={312}
                animationDuration={0}
                customBoardStyle={{ borderRadius: '0' }}
                customDarkSquareStyle={{ backgroundColor: '#8B5A2B' }}
                customLightSquareStyle={{ backgroundColor: '#EBCB9B' }}
              />
            </div>
            <p style={{ 
              textAlign: 'center', 
              marginTop: '16px', 
              fontWeight: '600', 
              color: '#B8860B' 
            }}>
              ▸ Play Both Sides
            </p>
          </Link>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="featured-courses" style={{ marginBottom: '80px' }}>
        <div className="container">
          <h2 style={{ fontSize: '36px', marginBottom: '40px', textAlign: 'center' }}>
            Featured Courses
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '24px' 
          }}>
            {featuredCourses.map((course) => (
              <Link key={course._id} to={`/courses/${course._id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ 
                    height: '160px', 
                    background: `linear-gradient(135deg, ${getCategoryColor(course.category)}22, ${getCategoryColor(course.category)}44)`,
                    borderRadius: '12px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px'
                  }}>
                    {course.category === 'foundations' && '♔'}
                    {course.category === 'openings' && '♕'}
                    {course.category === 'tactics' && '♘'}
                    {course.category === 'middlegame' && '♗'}
                    {course.category === 'endgames' && '♖'}
                    {course.category === 'advanced' && '♚'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      <span className={`badge badge-${course.level}`}>
                        {getLevelBadge(course.level)}
                      </span>
                      <span className="badge" style={{ 
                        background: 'rgba(212, 169, 79, 0.18)',
                        color: 'rgba(26, 26, 26, 0.85)',
                        border: '1px solid rgba(212, 169, 79, 0.5)'
                      }}>
                        {course.category}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '20px', marginBottom: '8px', color: '#1a1a1a' }}>
                      {course.title}
                    </h3>
                    <p style={{ 
                      color: 'rgba(26, 26, 26, 0.65)', 
                      fontSize: '14px',
                      marginBottom: '16px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {course.description}
                    </p>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(26, 26, 26, 0.1)'
                  }}>
                    <span style={{ fontSize: '12px', color: 'rgba(26, 26, 26, 0.65)' }}>
                      {course.lessons?.length || 0} lessons
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ color: '#B8860B' }}>★</span>
                      <span style={{ fontSize: '14px', fontWeight: '600' }}>
                        {course.rating?.toFixed(1) || '4.5'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/courses" className="btn btn-secondary">
              View All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" style={{ marginBottom: '80px' }}>
        <div className="container">
          <h2 style={{ fontSize: '36px', marginBottom: '40px', textAlign: 'center' }}>
            Why Choose Boardwise?
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '32px' 
          }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', color: '#B8860B' }}>♙</div>
              <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>Skill Tree Learning</h3>
              <p style={{ color: 'rgba(26, 26, 26, 0.75)' }}>
                Follow a structured path from foundations to advanced concepts. Unlock new topics as you progress.
              </p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', color: '#B8860B' }}>♘</div>
              <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>Smart Puzzle Trainer</h3>
              <p style={{ color: 'rgba(26, 26, 26, 0.75)' }}>
                Practice with spaced repetition. Failed puzzles appear more often to reinforce learning.
              </p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', color: '#B8860B' }}>♗</div>
              <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>Opening Repertoire</h3>
              <p style={{ color: 'rgba(26, 26, 26, 0.75)' }}>
                Build and organize your personal opening repertoire with linked lessons and example games.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta" style={{ 
        padding: '60px 0', 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #FBEFC5 0%, #EBCB7A 100%)',
        borderRadius: '32px',
        marginBottom: '60px'
      }}>
        <div className="container">
          <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>
            Ready to Improve Your Chess?
          </h2>
          <p style={{ fontSize: '18px', color: 'rgba(26, 26, 26, 0.85)', marginBottom: '32px' }}>
            Join players learning chess the structured way
          </p>
          <Link to="/register" className="btn btn-primary">
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
