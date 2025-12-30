import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './SuperDashboard.css'

const SuperDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState('dashboard')
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('super_token')
    if (!token) {
      navigate('/super/login')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('super_token')
    navigate('/super/login')
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'corporates', label: 'Corporates', icon: '🏢' },
    { id: 'plans', label: 'Plans', icon: '📋' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ]

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="dashboard-content">
            <h2>Super Admin Dashboard</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🏢</div>
                <div className="stat-info">
                  <h3>12</h3>
                  <p>Active Corporates</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>248</h3>
                  <p>Total Users</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-info">
                  <h3>5</h3>
                  <p>Active Plans</p>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="section-content">
            <h2>{menuItems.find(item => item.id === activeSection)?.label}</h2>
            <p>Content for {activeSection} will be added here.</p>
          </div>
        )
    }
  }

  return (
    <div className="super-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <div className="header-logo">
            <div className="logo-icon">⚡</div>
            <span>Narad PMS - Super Admin</span>
          </div>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span>Super Admin</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-body">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => setActiveSection(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {renderContent()}
        </main>
      </div>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>&copy; 2024 Narad PMS. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default SuperDashboard