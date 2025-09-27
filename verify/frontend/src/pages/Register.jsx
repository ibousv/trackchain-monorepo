import React, { useState } from 'react'
import api from '../api/api'

export default function Register(){
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [role,setRole]=useState('AGRICULTEUR')

  const submit = async e => {
    e.preventDefault();
    try{
      const res = await api.post('/auth/register',{ name, email, password, role })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      window.location.href = '/'
    }catch(err){ alert(err.response?.data?.msg || 'Erreur') }
  }

  return (
    <div style={{padding:20}}>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <div><input placeholder="name" value={name} onChange={e=>setName(e.target.value)} /></div>
        <div><input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div><input placeholder="password" value={password} type="password" onChange={e=>setPassword(e.target.value)} /></div>
        <div>
          <select value={role} onChange={e=>setRole(e.target.value)}>
            <option value="AGRICULTEUR">Agriculteur</option>
            <option value="MEDECIN">Médecin</option>
            <option value="FONCIER">Foncier</option>
            <option value="ANAD">ANAD</option>
          </select>
        </div>
        <button>Register</button>
      </form>
    </div>
  )
}
