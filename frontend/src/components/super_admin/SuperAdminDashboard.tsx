import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { apiRequest, SUPER_ADMIN_ENDPOINTS } from '../../api';
import DashboardLayout from '../../layouts/DashboardLayout';
import './SuperAdminDashboard.css';

interface DashboardStats {
  total_organizations: number;
  active_organizations: number;
  total_users: number;
  active_users: number;
  total_revenue: number;
  monthly_revenue: number;
  recent_activities: Array<{ time: string; text: string }>;
  quick_actions: Array<{ id?: string; label: string; url: string; type: string; enabled?: boolean }>;
}

const SuperAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard data...');
      const response = await apiRequest(SUPER_ADMIN_ENDPOINTS.DASHBOARD);
      console.log('Dashboard response:', response);
      if (response.success) {
        setStats(response.data);
        console.log('Stats set:', response.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading">Loading dashboard...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="super-admin-dashboard">
        <div className="dashboard-header-section">
          <h2>Super Admin Dashboard</h2>
          <p>System-wide administration and management</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Organizations</h3>
            <div className="stat-number">{stats?.total_organizations ?? 0}</div>
            <div className="stat-label">Active: {stats?.active_organizations ?? 0}</div>
          </div>
          <div className="stat-card">
            <h3>Total Users</h3>
            <div className="stat-number">{stats?.total_users ?? 0}</div>
            <div className="stat-label">Active: {stats?.active_users ?? 0}</div>
          </div>
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <div className="stat-number">₹{(stats?.total_revenue ?? 0).toLocaleString()}</div>
            <div className="stat-label">This Month: ₹{(stats?.monthly_revenue ?? 0).toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <h3>System Performance</h3>
            <div className="stat-number">98.5%</div>
            <div className="stat-label">Uptime</div>
          </div>
        </div>

        <div className="dashboard-info">
          <div className="info-card">
            <h3>Super Admin Profile</h3>
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.user_type}</p>
            <p><strong>Access Level:</strong> System Administrator</p>
          </div>
          
          <div className="info-card">
            <h3>Quick Actions</h3>
            <div className="quick-actions">
              {stats?.quick_actions?.map((action, index) => (
                <button 
                  key={index}
                  className={`action-btn ${action.type}`}
                  onClick={() => window.location.href = action.url}
                >
                  {action.label}
                </button>
              )) || (
                <button className="action-btn primary" onClick={() => window.location.href = '/organizations'}>
                  Manage Organizations
                </button>
              )}
            </div>
          </div>
          
          <div className="info-card">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              {stats?.recent_activities?.map((activity, index) => (
                <div key={index} className="activity-item">
                  <span className="activity-time">{activity.time}</span>
                  <span className="activity-text">{activity.text}</span>
                </div>
              )) || (
                <div className="activity-item">
                  <span className="activity-text">No recent activities</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;