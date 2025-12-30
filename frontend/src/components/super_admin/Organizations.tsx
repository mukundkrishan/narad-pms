import React, { useState, useEffect } from 'react';
import { apiRequest, ORGANIZATION_ENDPOINTS } from '../../api';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import './Organizations.css';

interface Organization {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  organization_code: string;
  user_allowed: number;
  valid_from?: string;
  valid_to?: string;
  status: 'active' | 'inactive';
  last_payment_date?: string;
  last_payment_amount?: number;
  is_active: boolean;
  users_count: number;
  created_at: string;
}

interface OrganizationFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  organization_code: string;
  user_allowed: number;
  valid_from: string;
  valid_to: string;
  last_payment_date: string;
  last_payment_amount: string;
}

const Organizations: React.FC = () => {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<OrganizationFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    organization_code: '',
    user_allowed: 10,
    valid_from: '',
    valid_to: '',
    last_payment_date: '',
    last_payment_amount: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await apiRequest(ORGANIZATION_ENDPOINTS.LIST);
      if (response.success) {
        setOrganizations(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingId 
        ? ORGANIZATION_ENDPOINTS.UPDATE(editingId)
        : ORGANIZATION_ENDPOINTS.CREATE;
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await apiRequest(url, {
        method,
        body: JSON.stringify(formData),
      });

      if (response.success) {
        setShowModal(false);
        resetForm();
        fetchOrganizations();
      }
    } catch (error) {
      console.error('Failed to save organization:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: '', 
      email: '', 
      phone: '', 
      address: '',
      organization_code: '',
      user_allowed: 10,
      valid_from: '',
      valid_to: '',
      last_payment_date: '',
      last_payment_amount: '',
    });
    setEditingId(null);
  };

  const formatDateDisplay = (dateString?: string): string => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // dd/mm/yyyy format
  };

  const formatDateForInput = (dateString?: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleEdit = (org: Organization) => {
    setFormData({
      name: org.name,
      email: org.email,
      phone: org.phone || '',
      address: org.address || '',
      organization_code: org.organization_code,
      user_allowed: org.user_allowed,
      valid_from: formatDateForInput(org.valid_from),
      valid_to: formatDateForInput(org.valid_to),
      last_payment_date: formatDateForInput(org.last_payment_date),
      last_payment_amount: org.last_payment_amount?.toString() || '',
    });
    setEditingId(org.id);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this organization?')) {
      try {
        await apiRequest(ORGANIZATION_ENDPOINTS.DELETE(id), {
          method: 'DELETE',
        });
        fetchOrganizations();
      } catch (error) {
        console.error('Failed to delete organization:', error);
      }
    }
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await apiRequest(ORGANIZATION_ENDPOINTS.UPDATE(id), {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      fetchOrganizations();
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  const handleUsers = (org: Organization) => {
    navigate(`/organization/${org.id}/users`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading">Loading organizations...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="organizations-container">
        <div className="organizations-header">
          <h2>Organizations</h2>
          <button 
            className="add-btn"
            onClick={() => setShowModal(true)}
          >
            + Add Organization
          </button>
        </div>

        <div className="organizations-table">
          <table>
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>Name</th>
                <th>Code</th>
                <th>Email</th>
                <th>Users</th>
                <th>Valid Until</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((org, index) => (
                <tr key={org.id}>
                  <td>{index + 1}</td>
                  <td>{org.name}</td>
                  <td>{org.organization_code}</td>
                  <td>{org.email}</td>
                  <td>{org.users_count}/{org.user_allowed}</td>
                  <td>{formatDateDisplay(org.valid_to)}</td>
                  <td>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={org.status === 'active'}
                        onChange={() => toggleStatus(org.id, org.status)}
                      />
                      <span className="slider"></span>
                    </label>
                  </td>
                  <td>{org.last_payment_amount || '0.00'} {org.last_payment_date && `(${formatDateDisplay(org.last_payment_date)})`}</td>
                  <td>
                    <button className="action-btn edit" onClick={() => handleEdit(org)} title="Edit">
                      ✏️
                    </button>
                    <button className="action-btn users" onClick={() => handleUsers(org)} title="Manage Users">
                      👥
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(org.id)} title="Delete">
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Organization Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>{editingId ? 'Edit Organization' : 'Add New Organization'}</h3>
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
                <div className="form-group">
                  <label>Organization Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Organization Code</label>
                  <input
                    type="text"
                    name="organization_code"
                    value={formData.organization_code}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                
                <div className="form-group">
                  <label>Users Allowed</label>
                  <input
                    type="number"
                    name="user_allowed"
                    value={formData.user_allowed}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Valid From</label>
                    <input
                      type="date"
                      name="valid_from"
                      value={formData.valid_from}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Valid To</label>
                    <input
                      type="date"
                      name="valid_to"
                      value={formData.valid_to}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Last Payment Date</label>
                    <input
                      type="date"
                      name="last_payment_date"
                      value={formData.last_payment_date}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Last Payment Amount</label>
                    <input
                      type="number"
                      name="last_payment_amount"
                      value={formData.last_payment_amount}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                    />
                  </div>
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
                    {submitting ? (editingId ? 'Updating...' : 'Creating...') : (editingId ? 'Update Organization' : 'Create Organization')}
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

export default Organizations;