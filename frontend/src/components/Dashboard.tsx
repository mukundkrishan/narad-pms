import React from 'react';
import { useAuth } from '../auth/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="dashboard-content">
        <div className="dashboard-header-section">
          <h2>Dashboard</h2>
          <p>Welcome to Narad Core Admin Panel</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Organizations</h3>
            <div className="stat-number">12</div>
          </div>
          <div className="stat-card">
            <h3>Users</h3>
            <div className="stat-number">248</div>
          </div>
          <div className="stat-card">
            <h3>Active Modules</h3>
            <div className="stat-number">8</div>
          </div>
          <div className="stat-card">
            <h3>System Health</h3>
            <div className="stat-status online">Online</div>
          </div>
        </div>

        <div className="dashboard-info">
          <div className="info-card">
            <h3>User Information</h3>
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.user_type}</p>
          </div>
          
          <div className="info-card">
            <h3>Quick Actions</h3>
            <div className="quick-actions">
              <button className="action-btn">Add Organization</button>
              <button className="action-btn">Manage Users</button>
              <button className="action-btn">System Settings</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;