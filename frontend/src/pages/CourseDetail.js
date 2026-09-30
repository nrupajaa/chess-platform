import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCourse, enrollInCourse, completeLesson } from '../services/api';

const CourseDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourse(id);
        setCourse(data);
        if (data.lessons && data.lessons.length > 0) {
          setSelectedLesson(data.lessons[0]);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) return;
    
    setEnrolling(true);
    try {
      await enrollInCourse(id);
      setEnrolled(true);
    } catch (error) {
      console.error('Error enrolling:', error);
    } finally {
      setEnrolling(false);
    }
  };

  const handleCompleteLesson = async (lessonId) => {
    try {
      await completeLesson(id, lessonId);
      // Update local state
      setCourse(prev => ({
        ...prev,
        lessons: prev.lessons.map(lesson =>
          lesson._id === lessonId ? { ...lesson, completed: true } : lesson
        )
      }));
    } catch (error) {
      console.error('Error completing lesson:', error);
    }
  };

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

  if (!course) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>Course not found</h2>
        <Link to="/courses" className="btn btn-secondary" style={{ marginTop: '20px' }}>
          Back to Courses
        </Link>
      </div>
    );
  }

  const completedLessons = course.lessons?.filter(l => l.completed).length || 0;
  const progress = course.lessons?.length > 0 ? (completedLessons / course.lessons.length) * 100 : 0;

  return (
    <div className="course-detail container" style={{ padding: '40px 20px' }}>
      {/* Course Header */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px', alignItems: 'start' }}>
          <div style={{ 
            height: '200px', 
            background: `linear-gradient(135deg, ${getCategoryColor(course.category)}22, ${getCategoryColor(course.category)}44)`,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '80px'
          }}>
            {course.category === 'foundations' && '♔'}
            {course.category === 'openings' && '♕'}
            {course.category === 'tactics' && '♘'}
            {course.category === 'middlegame' && '♗'}
            {course.category === 'endgames' && '♖'}
            {course.category === 'advanced' && '♚'}
          </div>
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
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
            <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>
              {course.title}
            </h1>
            <p style={{ color: 'rgba(26, 26, 26, 0.75)', marginBottom: '24px', lineHeight: '1.6' }}>
              {course.description}
            </p>
            <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'rgba(26, 26, 26, 0.65)' }}>Instructor</span>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>{course.instructor}</div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'rgba(26, 26, 26, 0.65)' }}>Duration</span>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>{course.duration}</div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'rgba(26, 26, 26, 0.65)' }}>Lessons</span>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>{course.lessons?.length || 0}</div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'rgba(26, 26, 26, 0.65)' }}>Rating</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#B8860B' }}>★</span>
                  <span style={{ fontSize: '16px', fontWeight: '600' }}>
                    {course.rating?.toFixed(1) || '4.5'}
                  </span>
                </div>
              </div>
            </div>
            {!enrolled ? (
              <button 
                className="btn btn-primary"
                onClick={handleEnroll}
                disabled={!isAuthenticated || enrolling}
              >
                {enrolling ? 'Enrolling...' : isAuthenticated ? 'Enroll Now' : 'Login to Enroll'}
              </button>
            ) : (
              <div className="card" style={{ padding: '16px', background: 'rgba(76, 175, 80, 0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#B8860B', fontSize: '24px' }}>✓</span>
                  <span style={{ color: '#1a1a1a', fontWeight: '600' }}>Enrolled</span>
                </div>
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'rgba(26, 26, 26, 0.65)' }}>
                      Progress
                    </span>
                    <span style={{ fontSize: '12px', color: 'rgba(26, 26, 26, 0.85)' }}>
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        {/* Lessons List */}
        <div className="card">
          <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>Course Content</h3>
          {course.lessons?.map((lesson, index) => (
            <div
              key={index}
              onClick={() => setSelectedLesson(lesson)}
              style={{
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '12px',
                cursor: 'pointer',
                background: selectedLesson === lesson ? 'rgba(212, 169, 79, 0.18)' : 'rgba(212, 169, 79, 0.08)',
                border: selectedLesson === lesson ? '1px solid rgba(212, 169, 79, 0.7)' : '1px solid transparent',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: lesson.completed ? 'rgba(76, 175, 80, 0.2)' : 'rgba(212, 169, 79, 0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  color: lesson.completed ? '#1a1a1a' : 'rgba(26, 26, 26, 0.65)'
                }}>
                  {lesson.completed ? '✓' : index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                    {lesson.title}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(26, 26, 26, 0.55)' }}>
                    {lesson.duration}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lesson Content */}
        <div className="card">
          {selectedLesson ? (
            <>
              <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>
                {selectedLesson.title}
              </h2>
              <div style={{ 
                marginBottom: '24px',
                padding: '16px',
                background: 'rgba(212, 169, 79, 0.08)',
                borderRadius: '8px',
                lineHeight: '1.8',
                color: 'rgba(26, 26, 26, 0.95)'
              }}>
                {selectedLesson.content}
              </div>
              {enrolled && !selectedLesson.completed && (
                <button
                  className="btn btn-primary"
                  onClick={() => handleCompleteLesson(selectedLesson._id)}
                >
                  Mark as Complete
                </button>
              )}
              {selectedLesson.completed && (
                <div className="card" style={{ 
                  padding: '12px',
                  background: 'rgba(76, 175, 80, 0.1)',
                  display: 'inline-block'
                }}>
                  <span style={{ color: '#1a1a1a' }}>✓ Completed</span>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(26, 26, 26, 0.65)' }}>
              Select a lesson to view its content
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
