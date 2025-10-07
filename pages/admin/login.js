import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const router = useRouter()

  const doLogin = async () => {
    setErr('')
    const r = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password })
    })

    if (r.ok) {
      // Server sets HttpOnly cookie; just redirect to admin panel.
      router.push('/admin')
    } else {
      const j = await r.json().catch(() => ({}))
      setErr(j.error || 'Login failed')
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 420, margin: '0 auto' }}>
      <h2>Admin Login</h2>
      <input
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Enter admin password"
        style={{ padding: 8, width: '100%' }}
      />
      <div style={{ marginTop: 12 }}>
        <button onClick={doLogin}>Login</button>
      </div>
      {err && <div style={{ color: 'red', marginTop: 8 }}>{err}</div>}
      <div style={{ marginTop: 12, fontSize: 13, color: '#666' }}>
        Demo password: <strong>prima-store</strong>
      </div>
    </div>
  )
}
