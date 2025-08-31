import React, { useState, useEffect } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Auth from './components/auth/Auth';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ListView from './components/ListView';
import ActivityFeed from './components/ActivityFeed';
import { socketService } from './services/socketService';

function AppContent() {
  const { user, token, loading } = useAuth();
  const [selectedListId, setSelectedListId] = useState<number | null>(null);

  useEffect(() => {
    if (token && user) {
      // Connect to socket when user is authenticated
      socketService.connect(token);
    } else {
      // Disconnect socket when user logs out
      socketService.disconnect();
    }

    return () => {
      socketService.disconnect();
    };
  }, [token, user]);

  const handleSelectList = (listId: number) => {
    setSelectedListId(listId);
  };

  const handleBackToDashboard = () => {
    setSelectedListId(null);
  };

  if (loading) {
    return (
      <div className="App">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="App">
        <Auth />
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      
      <div className="app-content">
        {selectedListId ? (
          <div className="main-content">
            <ListView 
              listId={selectedListId} 
              onBack={handleBackToDashboard}
            />
            <ActivityFeed listId={selectedListId} />
          </div>
        ) : (
          <div className="main-content">
            <Dashboard onSelectList={handleSelectList} />
            <ActivityFeed />
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;