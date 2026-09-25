import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
      foundations: '#4caf50',
      openings: '#2196f3',
      tactics: '#ff9800',
      middlegame: '#9c27b0',
      endgames: '#f44336',
      advanced: '#795548'
    };
    return colors[category] || '#666';
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
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(233, 69, 96, 0.1) 0%, rgba(15, 52, 96, 0.2) 100%)',
        borderRadius: '0 0 32px 32px',
        marginBottom: '60px'
      }}>
        <div className="container">
          <h1 style={{ 
            fontSize: '48px', 
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #e94560, #ff6b6b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Master Chess with Structured Learning
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px'
          }}>
            Follow guided learning paths, solve puzzles, study openings, and track your progress. 
            Your journey from beginner to master starts here.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/courses" className="btn btn-primary">
              Explore Courses
            </Link>
            <Link to="/skill-tree" className="btn btn-secondary">
              View Skill Tree
            </Link>
          </div>
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
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}>
                        {course.category}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '20px', marginBottom: '8px', color: 'white' }}>
                      {course.title}
                    </h3>
                    <p style={{ 
                      color: 'rgba(255, 255, 255, 0.6)', 
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
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                      {course.lessons?.length || 0} lessons
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ color: '#ffc107' }}>★</span>
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
            Why Choose ChessMaster?
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '32px' 
          }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌳</div>
              <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>Skill Tree Learning</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Follow a structured path from foundations to advanced concepts. Unlock new topics as you progress.
              </p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🧩</div>
              <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>Smart Puzzle Trainer</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Practice with spaced repetition. Failed puzzles appear more often to reinforce learning.
              </p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
              <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>Opening Repertoire</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
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
        background: 'linear-gradient(135deg, rgba(233, 69, 96, 0.2) 0%, rgba(15, 52, 96, 0.3) 100%)',
        borderRadius: '32px',
        marginBottom: '60px'
      }}>
        <div className="container">
          <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>
            Ready to Improve Your Chess?
          </h2>
          <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '32px' }}>
            Join thousands of players learning chess the structured way
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
