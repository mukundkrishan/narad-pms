import React from 'react';
import CorporateDashboardLayout from '../../layouts/CorporateDashboardLayout';
import './CorporateRoles.css';

const CorporateRoles: React.FC = () => {
  const roles = [
    { id: 2, name: 'Admin', permissions: ['manage_users', 'view_reports', 'manage_settings'] },
    { id: 3, name: 'User', permissions: ['view_dashboard', 'view_profile'] },
  ];

  return (
    <CorporateDashboardLayout>
      <div className="corporate-roles">
        <div className="page-header">
          <h2>Roles & Permissions</h2>
          <p>Manage user roles and their permissions</p>
        </div>

        <div className="roles-content">
          <div className="roles-grid">
            {roles.map((role) => (
              <div key={role.id} className="role-card">
                <div className="role-header">
                  <h3>{role.name}</h3>
                  <button className="btn-edit" title="Edit Role">
                    <i className="fas fa-edit"></i>
                  </button>
                </div>
                <div className="role-permissions">
                  <h4>Permissions:</h4>
                  <ul>
                    {role.permissions.map((permission) => (
                      <li key={permission}>
                        <span className="permission-badge">{permission}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CorporateDashboardLayout>
  );
};

export default CorporateRoles;