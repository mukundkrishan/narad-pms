import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Welcome from './components/Welcome'
import Login from './components/Login'
import SuperLogin from './components/SuperLogin'
import SuperDashboard from './components/SuperDashboard'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/super/login" element={<SuperLogin />} />
        <Route path="/super/dashboard" element={<SuperDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
