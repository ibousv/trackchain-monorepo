import React, { useState } from 'react'
import api from '../api/api'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')

  const submit = async e => {
    e.preventDefault()
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      window.location.href = '/'
    } catch (err) { setErr(err.response?.data?.msg || 'Erreur'); }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email"/></div>
        <div><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password"/></div>
        <button>Login</button>
      </form>
      {err && <div style={{color:'red'}}>{err}</div>}
    </div>
  )
}
