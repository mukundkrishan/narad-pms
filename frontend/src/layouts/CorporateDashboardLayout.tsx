import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import './CorporateDashboardLayout.css';

interface CorporateDashboardLayoutProps {
  children: React.ReactNode;
}

const CorporateDashboardLayout: React.FC<CorporateDashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { corporateName } = useParams();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: `/${corporateName}/dashboard`, label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { path: `/${corporateName}/users`, label: 'Users', icon: 'fas fa-users' },
    { path: `/${corporateName}/roles`, label: 'Roles & Permissions', icon: 'fas fa-shield-alt' },
    { path: `/${corporateName}/settings`, label: 'Settings', icon: 'fas fa-cog' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="corporate-dashboard-layout">
      <header className="corporate-header">
        <div className="header-left">
          <div className="corporate-logo">
            <span className="logo-icon"><i className="fas fa-bolt"></i></span>
            <span className="logo-text">Narad PMS</span>
          </div>
          <div className="corporate-info">
            <span className="corporate-code">{corporateName}</span>
          </div>
        </div>
        
        <div className="header-right">
          <button className="header-btn" title="Search">
            <i className="fas fa-search"></i>
          </button>
          <button className="header-btn notification-btn" title="Notifications">
            <i className="fas fa-bell"></i>
            <span className="notification-badge">3</span>
          </button>
          <div className="user-menu">
            <div className="user-avatar">
              {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.first_name} {user?.last_name}</span>
              <span className="user-role">{user?.role_id === 2 ? 'Admin' : 'User'}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout} title="Logout">
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </header>

      <div className="corporate-body">
        <aside className="corporate-sidebar">
          <nav className="corporate-sidebar-nav">
            {menuItems.map((item) => (
              <button
                key={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <span className="nav-icon"><i className={item.icon}></i></span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="corporate-main-content">
          {children}
        </main>
      </div>

      <footer className="corporate-footer">
        <div className="footer-content">
          <span>&copy; 2026 Narad PMS. All rights reserved. | Organization: {corporateName} | Version 1.0</span>
        </div>
      </footer>
    </div>
  );
};

export default CorporateDashboardLayout;