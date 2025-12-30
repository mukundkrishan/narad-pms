import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { apiRequest, API_BASE_URL } from '../../api';
import './CorporateLogin.css';

interface Corporate {
  name: string;
  organization_code: string;
}

const CorporateLogin: React.FC = () => {
  const { corporateName } = useParams<{ corporateName: string }>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [corporate, setCorporate] = useState<Corporate | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  // corporateName from URL is actually the organization_code
  const organizationCode = corporateName;

  useEffect(() => {
    fetchCorporateInfo();
  }, [organizationCode]);

  const fetchCorporateInfo = async () => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/organization/${organizationCode}`);
      if (response.success) {
        setCorporate(response.data);
      }
    } catch (error: any) {
      if (error.message.includes('No organization exists')) {
        setError('No organization exists');
      } else if (error.message.includes('Please contact admin')) {
        setError('Please contact admin - Organization is inactive');
      } else {
        setError('Failed to load organization');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!corporate) {
      setError('Organization not found');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const response = await apiRequest(`${API_BASE_URL}/${organizationCode}/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('corporate', JSON.stringify(response.data.corporate));
        login(response.data.user, response.data.token);
        navigate(`/${organizationCode}/dashboard`);
      }
    } catch (error: any) {
      setError(error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="corporate-login-container">
      <div className="corporate-login-card">
        <div className="corporate-login-header">
          <h2>{corporate?.name ? `${corporate.name} Login` : 'Corporate Login'}</h2>
          <p>Organization Code: {organizationCode}</p>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
            {error.includes('contact admin') && (
              <p style={{marginTop: '0.5rem', fontSize: '0.9rem'}}>Contact your system administrator for assistance.</p>
            )}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="corporate-login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              required
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className="corporate-login-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="corporate-login-footer">
          <p>Need help? Contact your administrator</p>
        </div>
      </div>
    </div>
  );
};

export default CorporateLogin;