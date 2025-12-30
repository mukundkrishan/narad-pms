import React, { useState, useEffect } from 'react';
import { apiRequest, SETTINGS_ENDPOINTS } from '../../api';
import DashboardLayout from '../../layouts/DashboardLayout';
import './Settings.css';

interface SettingsData {
  [key: string]: any;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsData>({
    // General Settings
    app_name: 'Narad PMS',
    app_description: 'Project Management System',
    timezone: 'UTC',
    date_format: 'DD/MM/YYYY',
    
    // Email Settings
    email_notifications: true,
    smtp_host: '',
    smtp_port: '587',
    smtp_username: '',
    smtp_password: '',
    
    // Project Settings
    default_project_status: 'active',
    task_auto_assignment: false,
    project_code_prefix: 'PRJ',
    
    // Security Settings
    session_timeout: '30',
    password_min_length: '6',
    two_factor_auth: false,
    
    // UI Settings
    theme: 'light',
    items_per_page: '10',
    show_welcome_message: true,
    
    // Quick Actions
    quick_actions: [
      { id: 'organizations', label: 'Organizations', url: '/super_admin/organizations', enabled: true },
      { id: 'users', label: 'Users', url: '/super_admin/users', enabled: true },
      { id: 'settings', label: 'Settings', url: '/super_admin/settings', enabled: true },
      { id: 'reports', label: 'Reports', url: '/super_admin/reports', enabled: false },
    ],
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await apiRequest(SETTINGS_ENDPOINTS.LIST);
      if (response.success) {
        setSettings(prev => ({ ...prev, ...response.data }));
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await apiRequest(SETTINGS_ENDPOINTS.STORE, {
        method: 'POST',
        body: JSON.stringify({ settings }),
      });
      
      if (response.success) {
        alert('Settings saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading">Loading settings...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="settings-container">
        <div className="settings-header">
          <h2>Project Settings</h2>
          <button 
            className="save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        <div className="settings-content">
          {/* General Settings */}
          <div className="settings-section">
            <h3>General Settings</h3>
            <div className="settings-grid">
              <div className="setting-item">
                <label>Application Name</label>
                <input
                  type="text"
                  value={settings.app_name}
                  onChange={(e) => handleInputChange('app_name', e.target.value)}
                />
              </div>
              
              <div className="setting-item">
                <label>Application Description</label>
                <input
                  type="text"
                  value={settings.app_description}
                  onChange={(e) => handleInputChange('app_description', e.target.value)}
                />
              </div>
              
              <div className="setting-item">
                <label>Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                >
                  <option value="UTC">UTC</option>
                  <option value="Asia/Kolkata">Asia/Kolkata</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Europe/London">Europe/London</option>
                </select>
              </div>
              
              <div className="setting-item">
                <label>Date Format</label>
                <select
                  value={settings.date_format}
                  onChange={(e) => handleInputChange('date_format', e.target.value)}
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>

          {/* Email Settings */}
          <div className="settings-section">
            <h3>Email Settings</h3>
            <div className="settings-grid">
              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.email_notifications}
                    onChange={(e) => handleInputChange('email_notifications', e.target.checked)}
                  />
                  Enable Email Notifications
                </label>
              </div>
              
              <div className="setting-item">
                <label>SMTP Host</label>
                <input
                  type="text"
                  value={settings.smtp_host}
                  onChange={(e) => handleInputChange('smtp_host', e.target.value)}
                  placeholder="smtp.gmail.com"
                />
              </div>
              
              <div className="setting-item">
                <label>SMTP Port</label>
                <input
                  type="number"
                  value={settings.smtp_port}
                  onChange={(e) => handleInputChange('smtp_port', e.target.value)}
                />
              </div>
              
              <div className="setting-item">
                <label>SMTP Username</label>
                <input
                  type="email"
                  value={settings.smtp_username}
                  onChange={(e) => handleInputChange('smtp_username', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Project Settings */}
          <div className="settings-section">
            <h3>Project Settings</h3>
            <div className="settings-grid">
              <div className="setting-item">
                <label>Default Project Status</label>
                <select
                  value={settings.default_project_status}
                  onChange={(e) => handleInputChange('default_project_status', e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              
              <div className="setting-item">
                <label>Project Code Prefix</label>
                <input
                  type="text"
                  value={settings.project_code_prefix}
                  onChange={(e) => handleInputChange('project_code_prefix', e.target.value)}
                  maxLength={5}
                />
              </div>
              
              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.task_auto_assignment}
                    onChange={(e) => handleInputChange('task_auto_assignment', e.target.checked)}
                  />
                  Enable Task Auto Assignment
                </label>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="settings-section">
            <h3>Security Settings</h3>
            <div className="settings-grid">
              <div className="setting-item">
                <label>Session Timeout (minutes)</label>
                <input
                  type="number"
                  value={settings.session_timeout}
                  onChange={(e) => handleInputChange('session_timeout', e.target.value)}
                  min="5"
                  max="1440"
                />
              </div>
              
              <div className="setting-item">
                <label>Minimum Password Length</label>
                <input
                  type="number"
                  value={settings.password_min_length}
                  onChange={(e) => handleInputChange('password_min_length', e.target.value)}
                  min="4"
                  max="20"
                />
              </div>
              
              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.two_factor_auth}
                    onChange={(e) => handleInputChange('two_factor_auth', e.target.checked)}
                  />
                  Enable Two-Factor Authentication
                </label>
              </div>
            </div>
          </div>

          {/* UI Settings */}
          <div className="settings-section">
            <h3>UI Settings</h3>
            <div className="settings-grid">
              <div className="setting-item">
                <label>Theme</label>
                <select
                  value={settings.theme}
                  onChange={(e) => handleInputChange('theme', e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              
              <div className="setting-item">
                <label>Items Per Page</label>
                <select
                  value={settings.items_per_page}
                  onChange={(e) => handleInputChange('items_per_page', e.target.value)}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
              </div>
              
              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.show_welcome_message}
                    onChange={(e) => handleInputChange('show_welcome_message', e.target.checked)}
                  />
                  Show Welcome Message
                </label>
              </div>
            </div>
          </div>

          {/* Quick Actions Settings */}
          <div className="settings-section">
            <h3>Quick Actions</h3>
            <p className="section-description">Configure which quick actions appear on your dashboard</p>
            <div className="quick-actions-list">
              {settings.quick_actions?.map((action: any, index: number) => (
                <div key={action.id} className="quick-action-item">
                  <div className="action-info">
                    <span className="action-label">{action.label}</span>
                    <span className="action-url">{action.url}</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={action.enabled}
                      onChange={(e) => {
                        const updatedActions = [...settings.quick_actions];
                        updatedActions[index].enabled = e.target.checked;
                        handleInputChange('quick_actions', updatedActions);
                      }}
                    />
                    <span className="toggle-slider">
                      <span className="toggle-text">
                        {action.enabled ? 'ON' : 'OFF'}
                      </span>
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;