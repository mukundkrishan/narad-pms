import React from 'react';
import { useAuth } from '../auth/AuthContext';
import './DashboardLayout.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="dashboard-layout">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Narad Core</h1>
        </div>
        <div className="header-right">
          <span className="user-info">Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-body">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <ul>
              <li><a href="/super_admin/dashboard">Dashboard</a></li>
              <li><a href="/organizations">Organizations</a></li>
              <li><a href="/settings">Settings</a></li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>&copy; 2026 Narad PMS. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DashboardLayout;