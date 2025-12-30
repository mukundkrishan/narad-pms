import React from 'react';
import { useAuth } from '../../auth/AuthContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="admin-dashboard">
        <div className="dashboard-header-section">
          <h2>Admin Dashboard</h2>
          <p>Organization management and administration</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Team Members</h3>
            <div className="stat-number">48</div>
          </div>
          <div className="stat-card">
            <h3>Active Projects</h3>
            <div className="stat-number">12</div>
          </div>
          <div className="stat-card">
            <h3>Pending Tasks</h3>
            <div className="stat-number">156</div>
          </div>
          <div className="stat-card">
            <h3>Organization Status</h3>
            <div className="stat-status active">Active</div>
          </div>
        </div>

        <div className="dashboard-info">
          <div className="info-card">
            <h3>Admin Profile</h3>
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.user_type}</p>
            <p><strong>Organization:</strong> Corporate Admin</p>
          </div>
          
          <div className="info-card">
            <h3>Quick Actions</h3>
            <div className="quick-actions">
              <button className="action-btn primary">Manage Users</button>
              <button className="action-btn">View Projects</button>
              <button className="action-btn">Organization Settings</button>
              <button className="action-btn">Reports</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;