import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCourses } from '../services/api';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    search: ''
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
        setFilteredCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    let filtered = courses;

    if (filters.category) {
      filtered = filtered.filter(course => course.category === filters.category);
    }

    if (filters.level) {
      filtered = filtered.filter(course => course.level === filters.level);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower)
      );
    }

    setFilteredCourses(filtered);
  }, [filters, courses]);

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
    <div className="courses-page container" style={{ padding: '40px 20px' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '40px', textAlign: 'center' }}>
        Chess Courses
      </h1>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div className="form-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search courses..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              <option value="foundations">Foundations</option>
              <option value="openings">Openings</option>
              <option value="tactics">Tactics</option>
              <option value="middlegame">Middlegame</option>
              <option value="endgames">Endgames</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="form-group">
            <label>Level</label>
            <select
              value={filters.level}
              onChange={(e) => setFilters({ ...filters, level: e.target.value })}
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ fontSize: '18px', color: 'rgba(26, 26, 26, 0.65)' }}>
            No courses found matching your filters.
          </p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '24px' 
        }}>
          {filteredCourses.map((course) => (
            <Link key={course._id} to={`/courses/${course._id}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ 
                  height: '180px', 
                  background: `linear-gradient(135deg, ${getCategoryColor(course.category)}22, ${getCategoryColor(course.category)}44)`,
                  borderRadius: '12px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '64px'
                }}>
                  {course.category === 'foundations' && '♔'}
                  {course.category === 'openings' && '♕'}
                  {course.category === 'tactics' && '♘'}
                  {course.category === 'middlegame' && '♗'}
                  {course.category === 'endgames' && '♖'}
                  {course.category === 'advanced' && '♚'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
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
                  <h3 style={{ fontSize: '22px', marginBottom: '12px', color: '#1a1a1a' }}>
                    {course.title}
                  </h3>
                  <p style={{ 
                    color: 'rgba(26, 26, 26, 0.65)', 
                    fontSize: '14px',
                    marginBottom: '16px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
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
                  <div>
                    <span style={{ fontSize: '12px', color: 'rgba(26, 26, 26, 0.65)', marginRight: '16px' }}>
                      {course.lessons?.length || 0} lessons
                    </span>
                    <span style={{ fontSize: '12px', color: 'rgba(26, 26, 26, 0.65)' }}>
                      {course.duration}
                    </span>
                  </div>
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
      )}
    </div>
  );
};

export default Courses;
