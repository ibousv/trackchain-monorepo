import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProductPage from './pages/ProductPage'
import ProtectedRoute from './components/ProtectedRoute'

export default function App(){
  return (
    <div>
      <nav style={{ padding: 10, borderBottom: '1px solid #ddd' }}>
        <Link to="/">Dashboard</Link>{' '}|{' '}
        <Link to="/login">Login</Link>{' '}|{' '}
        <Link to="/register">Register</Link>
      </nav>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/product/:id" element={<ProtectedRoute><ProductPage/></ProtectedRoute>} />
        <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
      </Routes>
    </div>
  )
}
