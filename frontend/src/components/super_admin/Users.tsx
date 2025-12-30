import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest, API_BASE_URL } from '../../api';
import DashboardLayout from '../../layouts/DashboardLayout';
import './Users.css';

interface User {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile?: string;
  address?: string;
  role: string;
  role_id: number;
  status: 'active' | 'inactive';
  created_at: string;
}

interface UserFormData {
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  address: string;
  role: string;
  password: string;
}

interface FormErrors {
  [key: string]: string[];
}

const Users: React.FC = () => {
  const { organizationId } = useParams<{ organizationId: string }>();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    address: '',
    role: 'user',
    password: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [organizationName, setOrganizationName] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    fetchUsers();
  }, [organizationId]);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users for organization:', organizationId);
      const response = await apiRequest(`${API_BASE_URL}/organization/${organizationId}/users`);
      console.log('API Response:', response);
      if (response.success) {
        setUsers(response.data.users);
        setOrganizationName(response.data.organization_name);
        console.log('Users loaded:', response.data.users.length);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const url = editingId 
        ? `${API_BASE_URL}/organization/${organizationId}/users/${editingId}`
        : `${API_BASE_URL}/organization/${organizationId}/users`;
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await apiRequest(url, {
        method,
        body: JSON.stringify(formData),
      });

      if (response.success) {
        setShowModal(false);
        resetForm();
        fetchUsers();
      }
    } catch (error: any) {
      if (error.response?.status === 422 && error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error('Failed to save user:', error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      mobile: '',
      address: '',
      role: 'user',
      password: '',
    });
    setEditingId(null);
    setErrors({});
  };

  const handleEdit = (user: User) => {
    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email,
      mobile: user.mobile || '',
      address: user.address || '',
      role: user.role,
      password: '',
    });
    setEditingId(user.id);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    const user = users.find(u => u.id === id);
    if (user?.role_id === 2) { // Admin role
      alert('Admin users cannot be deleted');
      return;
    }
    
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await apiRequest(`${API_BASE_URL}/organization/${organizationId}/users/${id}`, {
          method: 'DELETE',
        });
        fetchUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await apiRequest(`${API_BASE_URL}/organization/${organizationId}/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      fetchUsers();
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading">Loading users...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="users-container">
        <div className="users-header">
          <div>
            <button className="back-btn" onClick={() => navigate('/organizations')}>
              ← Back to Organizations
            </button>
            <h2>{organizationName} - Users</h2>
          </div>
          <button 
            className="add-btn"
            onClick={() => setShowModal(true)}
          >
            + Add User
          </button>
        </div>

        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                    No users found for this organization
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={user.status === 'active'}
                          onChange={() => toggleStatus(user.id, user.status)}
                        />
                        <span className="slider"></span>
                      </label>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString('en-GB')}</td>
                    <td>
                      <button className="action-btn edit" onClick={() => handleEdit(user)} title="Edit">
                        ✏️
                      </button>
                      {user.role_id !== 2 && (
                        <button className="action-btn delete" onClick={() => handleDelete(user.id)} title="Delete">
                          🗑️
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>{editingId ? 'Edit User' : 'Add New User'}</h3>
                <button 
                  className="close-btn"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      required
                      className={errors.first_name ? 'error' : ''}
                    />
                    {errors.first_name && <span className="error-message">{errors.first_name[0]}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      required
                      className={errors.last_name ? 'error' : ''}
                    />
                    {errors.last_name && <span className="error-message">{errors.last_name[0]}</span>}
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Email ID</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email[0]}</span>}
                </div>
                
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className={errors.mobile ? 'error' : ''}
                  />
                  {errors.mobile && <span className="error-message">{errors.mobile[0]}</span>}
                </div>
                
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!editingId}
                    placeholder={editingId ? 'Leave blank to keep current password' : ''}
                    className={errors.password ? 'error' : ''}
                  />
                  {errors.password && <span className="error-message">{errors.password[0]}</span>}
                </div>
                
                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className={errors.address ? 'error' : ''}
                  />
                  {errors.address && <span className="error-message">{errors.address[0]}</span>}
                </div>
                
                <div className="form-group">
                  <label>Organization Name</label>
                  <input
                    type="text"
                    value={`${organizationName} [${organizationId}]`}
                    readOnly
                    className="readonly-field"
                  />
                </div>
                
                <div className="form-group">
                  <label>Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className={errors.role ? 'error' : ''}
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                  {errors.role && <span className="error-message">{errors.role[0]}</span>}
                </div>
                
                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={submitting}
                  >
                    {submitting ? (editingId ? 'Updating...' : 'Creating...') : (editingId ? 'Update User' : 'Create User')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Users;