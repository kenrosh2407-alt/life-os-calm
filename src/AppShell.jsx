import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Splash from './components/Splash';
import BottomNav from './components/BottomNav';
import LoginScreen from './components/LoginScreen';
import Home from './pages/Home';
import Finance from './pages/Finance';
import Health from './pages/Health';
import Profile from './pages/Profile';
import YouPage from './pages/YouPage.jsx';
import useAuthStore from './stores/authStore';

export default function AppShell() {
  const { user, isAuthenticated, isLoading, initialize } = useAuthStore();
  const [showSplash, setShowSplash] = useState(() => {
    // Show splash on new sessions or when user is authenticated
    const lastSeen = sessionStorage.getItem('splash:seen');
    const today = new Date().toDateString();
    return lastSeen !== today;
  });
  const location = useLocation();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (showSplash && isAuthenticated) {
      const today = new Date().toDateString();
      sessionStorage.setItem('splash:seen', today);
    }
  }, [showSplash, isAuthenticated]);

  useEffect(() => {
    document.body.scrollTop = 0; document.documentElement.scrollTop = 0;
  }, [location.pathname]);

  const handleLogin = () => {
    setShowSplash(true); // Show welcome splash after login
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-content">
          <div className="loading-logo">
            <Heart size={24} />
          </div>
          <div className="loading-text">Loading LifeOS...</div>
        </div>
      </div>
    );
  }

  // Not authenticated - show login
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <Splash show={showSplash} onDone={() => setShowSplash(false)} userName={user?.name} />
      <header className="topbar">
        <Link to="/" className="brand">Life‑OS</Link>
        <input className="search" placeholder="Search…" />
      </header>
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/you" element={<YouPage />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/health" element={<Health />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}