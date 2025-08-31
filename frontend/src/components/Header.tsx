import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      logout();
    }
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title">SharedLists</h1>
          <span className="app-subtitle">Collaborate in real-time</span>
        </div>
        
        <div className="header-right">
          <div className="user-info">
            <span className="user-greeting">Hello, {user?.name}!</span>
            <span className="user-email">{user?.email}</span>
          </div>
          
          <button 
            className="logout-button"
            onClick={handleLogout}
            title="Sign out"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;