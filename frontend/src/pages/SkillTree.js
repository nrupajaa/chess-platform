import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCourses } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SkillTree = () => {
  const { user, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const skillCategories = [
    { id: 'foundations', name: 'Foundations', icon: '♔', color: '#4caf50', description: 'Essential chess fundamentals' },
    { id: 'openings', name: 'Openings', icon: '♕', color: '#2196f3', description: 'Opening theory and repertoire' },
    { id: 'tactics', name: 'Tactics', icon: '♘', color: '#ff9800', description: 'Tactical patterns and combinations' },
    { id: 'middlegame', name: 'Middlegame', icon: '♗', color: '#9c27b0', description: 'Strategic planning and piece coordination' },
    { id: 'endgames', name: 'Endgames', icon: '♖', color: '#f44336', description: 'Endgame technique and conversion' },
    { id: 'advanced', name: 'Advanced', icon: '♚', color: '#795548', description: 'Advanced concepts and master-level play' }
  ];

  const getCoursesByCategory = (categoryId) => {
    return courses.filter(course => course.category === categoryId);
  };

  const getLevelBadge = (level) => {
    const levelMap = {
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced'
    };
    return levelMap[level] || level;
  };

  const getCategoryProgress = (categoryId) => {
    const categoryCourses = getCoursesByCategory(categoryId);
    if (categoryCourses.length === 0) return 0;
    
    const completedCourses = categoryCourses.filter(course => 
      user?.completedPaths?.some(path => path.pathId === course._id)
    ).length;
    
    return (completedCourses / categoryCourses.length) * 100;
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="skill-tree container" style={{ padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>
          Your Chess Skill Tree
        </h1>
        <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.7)', maxWidth: '600px', margin: '0 auto' }}>
          Follow a structured learning path from foundations to advanced concepts. 
          Complete courses to unlock new skills and track your progress.
        </p>
      </div>

      {/* Skill Categories */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
        {skillCategories.map((category) => {
          const categoryCourses = getCoursesByCategory(category.id);
          const progress = getCategoryProgress(category.id);
          
          return (
            <div key={category.id} className="card" style={{ position: 'relative' }}>
              {/* Category Header */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px',
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: `${category.color}22`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  border: `2px solid ${category.color}44`
                }}>
                  {category.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '24px', marginBottom: '4px' }}>{category.name}</h3>
                  <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
                    {category.description}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                    Progress
                  </span>
                  <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}>
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${progress}%`,
                      background: `linear-gradient(90deg, ${category.color}, ${category.color}dd)`
                    }}
                  ></div>
                </div>
              </div>

              {/* Courses in Category */}
              {categoryCourses.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {categoryCourses.map((course) => {
                    const isCompleted = user?.completedPaths?.some(path => path.pathId === course._id);
                    
                    return (
                      <Link
                        key={course._id}
                        to={`/courses/${course._id}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <div style={{
                          padding: '16px',
                          borderRadius: '8px',
                          background: isCompleted ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                          border: isCompleted ? '1px solid rgba(76, 175, 80, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: isCompleted ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            color: isCompleted ? '#4caf50' : 'rgba(255, 255, 255, 0.6)'
                          }}>
                            {isCompleted ? '✓' : '○'}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                              {course.title}
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <span className={`badge badge-${course.level}`} style={{ fontSize: '10px' }}>
                                {getLevelBadge(course.level)}
                              </span>
                              <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
                                {course.lessons?.length || 0} lessons
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '32px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '14px'
                }}>
                  No courses available in this category yet
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Overall Progress */}
      {isAuthenticated && (
        <div className="card" style={{ marginTop: '40px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '24px' }}>Overall Progress</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            <div>
              <div style={{ fontSize: '36px', fontWeight: '700', color: '#e94560', marginBottom: '8px' }}>
                {user?.stats?.coursesCompleted || 0}
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
                Courses Completed
              </div>
            </div>
            <div>
              <div style={{ fontSize: '36px', fontWeight: '700', color: '#4caf50', marginBottom: '8px' }}>
                {user?.stats?.puzzlesSolved || 0}
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
                Puzzles Solved
              </div>
            </div>
            <div>
              <div style={{ fontSize: '36px', fontWeight: '700', color: '#ff9800', marginBottom: '8px' }}>
                {user?.rating || 1200}
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
                Current Rating
              </div>
            </div>
            <div>
              <div style={{ fontSize: '36px', fontWeight: '700', color: '#2196f3', marginBottom: '8px' }}>
                {user?.level || 'beginner'}
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
                Skill Level
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillTree;
