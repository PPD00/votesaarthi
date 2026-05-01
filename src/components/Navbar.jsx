import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Vote, Search, Phone, Calendar, Info, MessageSquare, LogIn, LogOut, User, ArrowRight, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const { currentUser, userData, logout } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/', icon: <Vote size={18} /> },
    { name: 'Voter Journey', path: '/process', icon: <ArrowRight size={18} /> },
    { name: 'Candidates', path: '/data', icon: <Users size={18} /> },
    { name: 'Assistant', path: '/assistant', icon: <MessageSquare size={18} /> },
    { name: 'Guide', path: '/guide', icon: <Info size={18} /> },
    { name: 'Timeline', path: '/timeline', icon: <Calendar size={18} /> },
    { name: 'Booth Finder', path: '/booth-finder', icon: <Search size={18} /> },
    { name: 'Helpline', path: '/helpline', icon: <Phone size={18} /> },
  ];

  return (
    <nav className="navbar" role="navigation" aria-label="Main Navigation">
      <div className="container nav-container">
        <Link to="/" className="nav-logo" aria-label="VoteSaarthi - Home">
          <div className="logo-placeholder" aria-hidden="true">VS</div>
          <div className="logo-text">
            <span className="brand-name">VoteSaarthi</span>
            <span className="tagline">Your Smart Election Guide</span>
          </div>
        </Link>

        <div 
          className={`nav-links ${isOpen ? 'active' : ''}`}
          id="nav-menu"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
              aria-current={location.pathname === link.path ? 'page' : undefined}
            >
              <span className="link-icon" aria-hidden="true">{link.icon}</span>
              <span className="link-text">{link.name}</span>
            </Link>
          ))}
          
          <div className="nav-auth-mobile">
            {currentUser ? (
              <>
                <div className="user-profile-nav" aria-label={`Logged in as ${userData?.state || 'User'}`}>
                  <User size={18} aria-hidden="true" /> <span>{userData?.state || 'Profile'}</span>
                </div>
                <button 
                  onClick={logout} 
                  className="nav-link logout-btn"
                  aria-label="Log out of your account"
                >
                  <LogOut size={18} aria-hidden="true" /> <span>Logout</span>
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="nav-link login-btn-nav" 
                onClick={() => setIsOpen(false)}
                aria-label="Go to login page"
              >
                <LogIn size={18} aria-hidden="true" /> <span>Login</span>
              </Link>
            )}
          </div>
        </div>

        <div className="nav-auth-desktop">
          {currentUser ? (
            <div className="user-menu">
              <span className="user-badge" aria-label={`Welcome, ${userData?.state || 'User'}`}>
                <User size={14} aria-hidden="true" /> {userData?.state || 'User'}
              </span>
              <button 
                onClick={logout} 
                className="logout-btn-desktop" 
                title="Logout"
                aria-label="Logout"
              >
                <LogOut size={18} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="btn btn-primary login-btn-desktop"
              aria-label="Login to VoteSaarthi"
            >
              <LogIn size={18} aria-hidden="true" /> Login
            </Link>
          )}
        </div>

        <button 
          className="mobile-toggle" 
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="nav-menu"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
