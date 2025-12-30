import React from 'react';
import CorporateDashboardLayout from '../../layouts/CorporateDashboardLayout';
import './CorporateSettings.css';

const CorporateSettings: React.FC = () => {
  return (
    <CorporateDashboardLayout>
      <div className="corporate-settings">
        <div className="page-header">
          <h2>Settings</h2>
          <p>Configure your organization settings</p>
        </div>

        <div className="settings-content">
          <div className="settings-section">
            <h3>Organization Settings</h3>
            <div className="settings-grid">
              <div className="setting-item">
                <label>Organization Name</label>
                <input type="text" placeholder="Enter organization name" />
              </div>
              <div className="setting-item">
                <label>Contact Email</label>
                <input type="email" placeholder="Enter contact email" />
              </div>
              <div className="setting-item">
                <label>Phone Number</label>
                <input type="tel" placeholder="Enter phone number" />
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3>User Preferences</h3>
            <div className="settings-grid">
              <div className="setting-item">
                <label>
                  <input type="checkbox" />
                  Email Notifications
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input type="checkbox" />
                  SMS Notifications
                </label>
              </div>
            </div>
          </div>

          <div className="settings-actions">
            <button className="btn-primary">
              <i className="fas fa-save"></i> Save Settings
            </button>
            <button className="btn-secondary">
              <i className="fas fa-undo"></i> Reset
            </button>
          </div>
        </div>
      </div>
    </CorporateDashboardLayout>
  );
};

export default CorporateSettings;