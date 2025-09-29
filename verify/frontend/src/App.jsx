import React from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import CreateProduct from './pages/CreateProduct'
import Dashboard from './pages/Dashboard'
import EditProduct from './pages/EditProduct'
import Login from './pages/Login'
import ProductPage from './pages/ProductPage'
import Register from './pages/Register'
import TraceEvents from './pages/TraceEvents'
import UserProfile from './pages/UserProfile'

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
        <Route path="/product/create" element={<CreateProduct />} />
        <Route path="/product/edit/:id" element={<EditProduct />} />
        <Route path="/product/:id/traces" element={<TraceEvents />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </div>
  )
}
