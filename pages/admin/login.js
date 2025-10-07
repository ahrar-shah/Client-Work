import { useState } from 'react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    // check against password from env
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      // set a simple token (no real JWT needed for demo)
      localStorage.setItem('adminToken', 'ok');
      window.location.href = '/admin';
    } else {
      setError('❌ Wrong password');
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 400, margin: '50px auto', border: '1px solid #ddd', borderRadius: 8 }}>
      <h2>Admin Login</h2>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter admin password"
        style={{ display: 'block', marginBottom: 12, padding: 8, width: '100%' }}
      />
      <button onClick={handleLogin} style={{ padding: '8px 16px' }}>Login</button>
      {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
    </div>
  );
}
