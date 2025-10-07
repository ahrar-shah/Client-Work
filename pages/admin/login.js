import { useState } from 'react'

export default function Login() {
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  async function handleLogin() {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })

    const data = await res.json()
    if (res.ok) {
      localStorage.setItem('adminToken', data.token) // store JWT
      window.location.href = '/admin'
    } else {
      setMsg(data.error || 'Login failed')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Login</h2>
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <div>{msg}</div>
    </div>
  )
}
