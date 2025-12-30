import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import Welcome from './components/Welcome'
import Login from './components/Login'
import SuperLogin from './components/SuperLogin'
import SuperAdminDashboard from './components/super_admin/SuperAdminDashboard'
import Organizations from './components/super_admin/Organizations'
import Users from './components/super_admin/Users'
import Settings from './components/super_admin/Settings'
import CorporateLogin from './components/corporate/CorporateLogin'
import CorporateDashboard from './components/corporate/CorporateDashboard'
import CorporateUsers from './components/corporate/CorporateUsers'
import CorporateRoles from './components/corporate/CorporateRoles'
import CorporateSettings from './components/corporate/CorporateSettings'
import AdminDashboard from './components/admin/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/super/login" element={<SuperLogin />} />
          <Route path="/:corporateName/login" element={<CorporateLogin />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/:corporateName/dashboard" 
            element={
              <ProtectedRoute>
                <CorporateDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/:corporateName/users" 
            element={
              <ProtectedRoute>
                <CorporateUsers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/:corporateName/roles" 
            element={
              <ProtectedRoute>
                <CorporateRoles />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/:corporateName/settings" 
            element={
              <ProtectedRoute>
                <CorporateSettings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/super_admin/dashboard" 
            element={
              <ProtectedRoute userType="super_admin">
                <SuperAdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/organizations" 
            element={<Organizations />} 
          />
          <Route 
            path="/organization/:organizationId/users" 
            element={
              <ProtectedRoute userType="super_admin">
                <Users />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
