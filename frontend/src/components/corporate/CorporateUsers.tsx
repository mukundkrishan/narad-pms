import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiRequest, API_BASE_URL } from '../../api';
import CorporateDashboardLayout from '../../layouts/CorporateDashboardLayout';
import './CorporateUsers.css';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  role_id: number;
  status: string;
}

const CorporateUsers: React.FC = () => {
  const { corporateName } = useParams();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/dashboard/admin`);
      if (response.success) {
        // This would need a proper users endpoint
        setUsers([]);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CorporateDashboardLayout>
      <div className="corporate-users">
        <div className="page-header">
          <h2>Users Management</h2>
          <p>Manage team members and their access</p>
        </div>

        <div className="users-content">
          <div className="users-actions">
            <button className="btn-primary">
              <i className="fas fa-plus"></i> Add New User
            </button>
          </div>

          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="loading">Loading users...</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="no-data">No users found</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.first_name} {user.last_name}</td>
                      <td>{user.email}</td>
                      <td>{user.mobile}</td>
                      <td>{user.role_id === 2 ? 'Admin' : 'User'}</td>
                      <td>
                        <span className={`status ${user.status}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn-edit" title="Edit">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn-delete" title="Delete">
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </CorporateDashboardLayout>
  );
};

export default CorporateUsers;