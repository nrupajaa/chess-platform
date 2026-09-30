import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/courses', label: 'Courses' },
    { path: '/puzzles', label: 'Puzzles' },
    { path: '/skill-tree', label: 'Skill Tree' },
    { path: '/repertoire', label: 'Repertoire' },
  ];

  return (
    <nav>
      <div className="container">
        <Link to="/" className="logo">
          <span style={{ color: '#B8860B' }}>♞</span> Boardwise
        </Link>
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link 
                to={link.path} 
                className={location.pathname === link.path ? 'active' : ''}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
                  Profile
                </Link>
              </li>
              <li>
                <button onClick={logout} className="btn btn-secondary" style={{ padding: '8px 16px' }}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register">
                  <button className="btn btn-primary" style={{ padding: '8px 16px' }}>
                    Sign Up
                  </button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
