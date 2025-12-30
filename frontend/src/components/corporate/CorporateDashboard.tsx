import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { apiRequest, CORPORATE_ENDPOINTS } from '../../api';
import { formatDate } from '../../utils/dateUtils';
import CorporateDashboardLayout from '../../layouts/CorporateDashboardLayout';
import './CorporateDashboard.css';

interface CorporateStats {
  team_members: number;
  organization_info: {
    name: string;
    organization_code: string;
    status: string;
    user_allowed: number;
    valid_from: string;
    valid_to: string;
  };
  recent_activities: Array<{ time: string; text: string }>;
  user_roles: Array<{ user_type: string; count: number }>;
}

const CorporateDashboard: React.FC = () => {
  const { user } = useAuth();
  const { corporateName } = useParams<{ corporateName: string }>();
  const [stats, setStats] = useState<CorporateStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await apiRequest(CORPORATE_ENDPOINTS.DASHBOARD);
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <CorporateDashboardLayout>
        <div className="loading">Loading dashboard...</div>
      </CorporateDashboardLayout>
    );
  }

  return (
    <CorporateDashboardLayout>
      <div className="corporate-dashboard">
        <div className="dashboard-header-section">
          <h2>{stats?.organization_info?.name || corporateName} Dashboard</h2>
          <p>Organization management and team overview</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Team Members</h3>
            <div className="stat-number">{stats?.team_members ?? 0}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card">
            <h3>Organization Status</h3>
            <div className="stat-number">{stats?.organization_info?.status ?? 'N/A'}</div>
            <div className="stat-label">Current Status</div>
          </div>
          <div className="stat-card">
            <h3>User Limit</h3>
            <div className="stat-number">{stats?.organization_info?.user_allowed ?? 0}</div>
            <div className="stat-label">Allowed Users</div>
          </div>
          <div className="stat-card">
            <h3>Validity</h3>
            <div className="stat-number">
              {stats?.organization_info?.valid_to ? 
                (() => {
                  const validTo = new Date(stats.organization_info.valid_to);
                  const today = new Date();
                  const diffTime = validTo.getTime() - today.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return diffDays > 0 ? `${diffDays} days` : 'Expired';
                })() : 'N/A'
              }
            </div>
            <div className="stat-label">
              Valid to: {formatDate(stats?.organization_info?.valid_to)}
            </div>
          </div>
        </div>

        <div className="dashboard-info">
          <div className="info-card">
            <h3>Organization Info</h3>
            <p><strong>Name:</strong> {stats?.organization_info?.name ?? 'N/A'}</p>
            <p><strong>Code:</strong> {stats?.organization_info?.organization_code ?? 'N/A'}</p>
            <p><strong>Status:</strong> {stats?.organization_info?.status ?? 'N/A'}</p>
            <p><strong>Valid From:</strong> {formatDate(stats?.organization_info?.valid_from)}</p>
            <p><strong>Valid To:</strong> {formatDate(stats?.organization_info?.valid_to)}</p>
          </div>
          
          <div className="info-card">
            <h3>User Profile</h3>
            <p><strong>Name:</strong> {user?.first_name} {user?.last_name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role_id === 2 ? 'Admin' : 'User'}</p>
            <p><strong>Mobile:</strong> {user?.mobile ?? 'N/A'}</p>
          </div>
          
          <div className="info-card">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              {stats?.recent_activities?.length ? (
                stats.recent_activities.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <span className="activity-time">{activity.time}</span>
                    <span className="activity-text">{activity.text}</span>
                  </div>
                ))
              ) : (
                <div className="activity-item">
                  <span className="activity-text">No recent activities</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </CorporateDashboardLayout>
  );
};

export default CorporateDashboard;