import { useNavigate } from 'react-router-dom'
import './Welcome.css'

const Welcome = () => {
  const navigate = useNavigate()

  return (
    <div className="welcome-page">
      {/* Section 1: Hero */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-logo">
            <div className="logo-icon">⚡</div>
            <h1>Narad PMS</h1>
          </div>
          <h2>Project Management Reimagined</h2>
          <p>Transform your workflow with intelligent project management</p>
          <button 
            className="cta-primary"
            onClick={() => navigate('/login')}
          >
            Get Started
          </button>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">📊</div>
          <div className="floating-card card-2">👥</div>
          <div className="floating-card card-3">⚡</div>
        </div>
      </section>

      {/* Section 2: About Narad PMS */}
      <section className="about-section">
        <div className="container">
          <h2>About Narad PMS</h2>
          <div className="about-grid">
            <div className="about-text">
              <p>
                Narad PMS is a cutting-edge project management system designed to streamline 
                your team's workflow and boost productivity. Built with modern technologies, 
                it offers real-time collaboration, intelligent task management, and comprehensive 
                project tracking.
              </p>
              <div className="features-list">
                <div className="feature">
                  <span className="feature-icon">🎯</span>
                  <span>Smart Task Management</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">📈</span>
                  <span>Real-time Analytics</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🔄</span>
                  <span>Seamless Integration</span>
                </div>
              </div>
            </div>
            <div className="about-visual">
              <div className="stats-card">
                <div className="stat">
                  <h3>500+</h3>
                  <p>Projects Managed</p>
                </div>
                <div className="stat">
                  <h3>50+</h3>
                  <p>Teams Onboard</p>
                </div>
                <div className="stat">
                  <h3>99%</h3>
                  <p>Uptime</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Coming Soon */}
      <section className="coming-soon-section">
        <div className="container">
          <h2>More Features Coming Soon</h2>
          <p>We're working on exciting new features to enhance your experience</p>
        </div>
      </section>

      {/* Section 4: Coming Soon */}
      <section className="coming-soon-section alt">
        <div className="container">
          <h2>Stay Tuned</h2>
          <p>Amazing updates are on the way</p>
        </div>
      </section>

      {/* Section 5: Footer */}
      <footer className="footer-section">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <div className="logo-icon">⚡</div>
              <span>Narad PMS</span>
            </div>
            <p>&copy; 2026 Narad PMS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Welcome