import React, { useState, useEffect } from 'react';
import BlogEditor from './components/blogeditor';

import BlogList from './components/Bloglist';
import Login from './components/Login';
import Register from './components/Register';
import Toast from './components/Toast';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('list'); // list, editor, login, register
  const [currentBlog, setCurrentBlog] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Checking for saved user...');
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setCurrentView('list');
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

  const showToast = (message, type = 'success', duration = 3000) => {
    setToast({ message, type, duration });
  };

  const closeToast = () => setToast(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentView('list');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('login');
    setCurrentBlog(null);
  };

  const handleNewBlog = () => {
    setCurrentBlog(null);
    setCurrentView('editor');
  };

  const handleEditBlog = (blog) => {
    setCurrentBlog(blog);
    setCurrentView('editor');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setCurrentBlog(null);
  };

  const handleBlogSaved = (savedBlog) => {
    setCurrentBlog(savedBlog);
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="App">
        {currentView === 'login' ? (
          <Login onLogin={handleLogin} switchToRegister={() => setCurrentView('register')} />
        ) : (
          <Register onLogin={handleLogin} switchToLogin={() => setCurrentView('login')} />
        )}

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={closeToast}
          />
        )}
      </div>
    );
  }

  return (
    <div className="App">
     <header className="app-header">
  <div className="header-content">
    <h1 onClick={handleBackToList} className="app-title">
      📝 Blog Dashboard
    </h1>
    <div className="header-actions">
      <span className="welcome-text">Welcome, {user.username}!</span>
      <button onClick={handleLogout} className="btn-secondary logout-btn">Logout</button>
    </div>
  </div>
</header>


      <main className="app-main">
        {currentView === 'list' ? (
          <BlogList onEditBlog={handleEditBlog} onNewBlog={handleNewBlog} showToast={showToast} />
        ) : (
          <BlogEditor
            blog={currentBlog}
            onBack={handleBackToList}
            showToast={showToast}
            onBlogSaved={handleBlogSaved}
          />
        )}
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={closeToast}
        />
      )}
    </div>
  );
}

export default App;
