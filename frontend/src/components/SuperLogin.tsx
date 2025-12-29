import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './SuperLogin.css'

const SuperLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:8000/api/v1/super/login', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store token if provided
        if (data.token) {
          localStorage.setItem('super_token', data.token)
        }
        // Redirect to super admin dashboard
        navigate('/super/dashboard')
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="super-login-container">
      <div className="super-login-card">
        <div className="super-login-header">
          <div className="super-logo">
            <div className="logo-icon">⚡</div>
            <h2>Super Admin</h2>
          </div>
          <p>Narad PMS - System Administration</p>
        </div>
        
        <form onSubmit={handleSubmit} className="super-login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="super@admin.com"
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter super admin password"
              required
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className="super-login-button"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In as Super Admin'}
          </button>
        </form>
        
        <div className="super-login-footer">
          <button 
            className="back-button"
            onClick={() => navigate('/')}
            disabled={loading}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default SuperLogin