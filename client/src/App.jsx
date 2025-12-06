import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { LayoutDashboard, Settings as SettingsIcon, ShoppingBag } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import StoreManager from './pages/StoreManager';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/*" element={
          <PrivateRoute>
            <div className="app-container">
              {/* Sidebar */}
              <aside className="sidebar">
                <div className="sidebar-header">
                  <h1 className="brand-title">Xeno Insights</h1>
                </div>
                <nav className="nav-menu">
                  <Link to="/" className="nav-link">
                    <LayoutDashboard className="nav-icon" />
                    Dashboard
                  </Link>
                  <Link to="/stores" className="nav-link">
                    <ShoppingBag className="nav-icon" />
                    Stores
                  </Link>
                  <Link to="/settings" className="nav-link">
                    <SettingsIcon className="nav-icon" />
                    Settings
                  </Link>
                  <button onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                  }} className="nav-link" style={{ border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
                    Logout
                  </button>
                </nav>
              </aside>

              {/* Main Content */}
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/stores" element={<StoreManager />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </main>
            </div>
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
